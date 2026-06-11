const STORE_KEY = "tff:score:live";
const DEFAULT_TOKEN = "8318d6e214f2f81cf9b808f102dd75d6c39e98530ed22d04ccc940377ba39a5f";

function readBody(req) {
  return new Promise(function (resolve, reject) {
    var body = "";
    req.on("data", function (chunk) {
      body += chunk;
    });
    req.on("end", function () {
      resolve(body);
    });
    req.on("error", reject);
  });
}

function isAuthed(req) {
  var token = process.env.TFF_AUTH_TOKEN || DEFAULT_TOKEN;
  var raw = req.headers.cookie || "";
  var parts = raw.split(";");
  for (var i = 0; i < parts.length; i++) {
    var pair = parts[i].trim().split("=");
    if (pair[0] === "tff-auth" && decodeURIComponent(pair.slice(1).join("=")) === token) {
      return true;
    }
  }
  return false;
}

function redisConfig() {
  return {
    url:
      process.env.KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      null,
    token:
      process.env.KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      null
  };
}

async function upstash(cmd) {
  var cfg = redisConfig();
  var base = cfg.url;
  var token = cfg.token;
  if (!base || !token) return null;
  var res = await fetch(base, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cmd)
  });
  if (!res.ok) return null;
  return res.json();
}

async function loadStore() {
  var up = await upstash(["GET", STORE_KEY]);
  if (up && up.result) {
    try {
      return JSON.parse(up.result);
    } catch (err) {
      return null;
    }
  }
  try {
    var kv = await import("@vercel/kv");
    var legacy = await kv.kv.get(STORE_KEY);
    if (legacy) return legacy;
  } catch (e) {
    /* optional legacy KV */
  }
  return null;
}

async function saveStore(data) {
  var payload = JSON.stringify(data);
  var up = await upstash(["SET", STORE_KEY, payload]);
  if (up && up.result === "OK") return true;
  try {
    var kv = await import("@vercel/kv");
    await kv.kv.set(STORE_KEY, data);
    return true;
  } catch (e) {
    return false;
  }
}

function emptyStore() {
  return { updatedAt: new Date().toISOString(), submissions: {} };
}

function ratedCount(scores) {
  var n = 0;
  Object.keys(scores || {}).forEach(function (k) {
    var s = scores[k];
    if (s && (s.liking || s.unique || s.intent)) n++;
  });
  return n;
}

function raterAvg(scores) {
  var liking = 0;
  var unique = 0;
  var intent = 0;
  var count = ratedCount(scores);
  if (!count) return { liking: 0, unique: 0, intent: 0, count: 0, composite: 0 };
  Object.keys(scores || {}).forEach(function (k) {
    var s = scores[k] || {};
    liking += s.liking || 0;
    unique += s.unique || 0;
    intent += s.intent || 0;
  });
  var avgL = liking / count;
  var avgU = unique / count;
  var avgI = intent / count;
  return {
    liking: avgL,
    unique: avgU,
    intent: avgI,
    count: count,
    composite: (avgL + avgU + avgI) / 3
  };
}

function buildAggregate(store) {
  var byConcept = {};
  var submissions = store.submissions || {};
  Object.keys(submissions).forEach(function (id) {
    var sub = submissions[id];
    Object.keys(sub.scores || {}).forEach(function (cid) {
      var s = sub.scores[cid];
      if (!s) return;
      if (!byConcept[cid]) {
        byConcept[cid] = { liking: 0, unique: 0, intent: 0, count: 0 };
      }
      byConcept[cid].liking += s.liking || 0;
      byConcept[cid].unique += s.unique || 0;
      byConcept[cid].intent += s.intent || 0;
      byConcept[cid].count++;
    });
  });
  Object.keys(byConcept).forEach(function (cid) {
    var b = byConcept[cid];
    if (b.count) {
      b.liking = b.liking / b.count;
      b.unique = b.unique / b.count;
      b.intent = b.intent / b.count;
      b.composite = (b.liking + b.unique + b.intent) / 3;
    }
  });
  return byConcept;
}

function buildList(store) {
  return Object.keys(store.submissions || {})
    .map(function (id) {
      var s = store.submissions[id];
      var avg = raterAvg(s.scores);
      return {
        deviceId: id,
        rater: s.rater,
        scores: s.scores,
        rated: avg.count,
        avgLiking: avg.liking,
        avgComposite: avg.composite,
        conceptVersion: s.conceptVersion,
        conceptLabel: s.conceptLabel,
        updatedAt: s.updatedAt
      };
    })
    .sort(function (a, b) {
      return (b.avgLiking - a.avgLiking) || (b.rated - a.rated) || (b.updatedAt || "").localeCompare(a.updatedAt || "");
    });
}

async function notifyAdmin(rater, rated, totalConcepts) {
  var topic = process.env.TFF_NTFY_TOPIC_SCORE || process.env.TFF_NTFY_TOPIC;
  if (!topic) return;
  var title = "Score · " + (rater || "Guest");
  var body =
    rated +
    "/" +
    (totalConcepts || 10) +
    " concepts rated · " +
    new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  try {
    await fetch("https://ntfy.sh/" + encodeURIComponent(topic), {
      method: "POST",
      headers: {
        Title: title,
        Tags: "bar_chart,white_check_mark",
        Priority: "3"
      },
      body: body
    });
  } catch (e) {
    /* optional */
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    var store = (await loadStore()) || emptyStore();
    var aggregate = buildAggregate(store);
    var list = buildList(store);

    if (!isAuthed(req)) {
      return res.status(200).json({
        ok: true,
        public: true,
        live: true,
        updatedAt: store.updatedAt,
        count: list.length,
        aggregate: aggregate
      });
    }

    return res.status(200).json({
      ok: true,
      live: true,
      updatedAt: store.updatedAt,
      count: list.length,
      aggregate: aggregate,
      submissions: list
    });
  }

  if (req.method === "POST") {
    try {
      var raw = await readBody(req);
      var body = JSON.parse(raw || "{}");
      var deviceId = (body.deviceId || "").trim();
      var rater = (body.rater || "").trim();
      if (!deviceId || deviceId.length > 64) {
        return res.status(400).json({ ok: false, error: "device_id_required" });
      }
      if (!rater || rater.length > 80) {
        return res.status(400).json({ ok: false, error: "name_required" });
      }

      var store = (await loadStore()) || emptyStore();
      if (!store.submissions) store.submissions = {};

      var scores = body.scores || {};
      var prev = store.submissions[deviceId];
      var isNew = !prev;
      var prevRated = prev ? ratedCount(prev.scores || {}) : 0;
      var nextRated = ratedCount(scores);

      store.submissions[deviceId] = {
        rater: rater,
        scores: scores,
        conceptVersion: body.conceptVersion || 0,
        conceptLabel: body.conceptLabel || "",
        updatedAt: new Date().toISOString()
      };
      store.updatedAt = new Date().toISOString();

      var saved = await saveStore(store);
      if (!saved) {
        return res.status(503).json({
          ok: false,
          error: "storage_unavailable",
          message: "Connect Vercel KV or Upstash Redis in project settings for live sync."
        });
      }

      if (isNew || (prev && prev.rater !== rater) || nextRated > prevRated) {
        await notifyAdmin(rater, nextRated, body.totalConcepts || 10);
      }

      return res.status(200).json({
        ok: true,
        rated: nextRated,
        updatedAt: store.updatedAt
      });
    } catch (e) {
      return res.status(400).json({ ok: false, error: "bad_request" });
    }
  }

  if (req.method === "DELETE") {
    if (!isAuthed(req)) {
      return res.status(401).json({ ok: false, error: "auth_required" });
    }
    var cleared = await saveStore(emptyStore());
    if (!cleared) {
      return res.status(503).json({ ok: false, error: "storage_unavailable" });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "method_not_allowed" });
};