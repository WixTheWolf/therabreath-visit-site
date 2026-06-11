const STORE_KEY = "tff:mystery:live";
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

function scoreOf(guesses) {
  var n = 0;
  var total = 0;
  Object.keys(guesses || {}).forEach(function (k) {
    if (guesses[k] && guesses[k].revealed) {
      total++;
      if (guesses[k].correct) n++;
    }
  });
  return { correct: n, total: total };
}

async function notifyAdmin(player, correct, total) {
  var topic = process.env.TFF_NTFY_TOPIC;
  if (!topic) return;
  var title = "Blind Flavor Mapping · " + (player || "Guest");
  var body = correct + "/" + total + " correct · " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  try {
    await fetch("https://ntfy.sh/" + encodeURIComponent(topic), {
      method: "POST",
      headers: {
        Title: title,
        Tags: "question,white_check_mark",
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
    if (!isAuthed(req)) {
      return res.status(401).json({ ok: false, error: "auth_required" });
    }
    var store = (await loadStore()) || emptyStore();
    var list = Object.keys(store.submissions || {})
      .map(function (id) {
        var s = store.submissions[id];
        var sc = scoreOf(s.guesses);
        return {
          deviceId: id,
          player: s.player,
          guesses: s.guesses,
          conceptVersion: s.conceptVersion,
          conceptLabel: s.conceptLabel,
          correct: sc.correct,
          total: sc.total,
          updatedAt: s.updatedAt
        };
      })
      .sort(function (a, b) {
        return (b.correct - a.correct) || (b.total - a.total) || (b.updatedAt || "").localeCompare(a.updatedAt || "");
      });
    return res.status(200).json({
      ok: true,
      live: true,
      updatedAt: store.updatedAt,
      count: list.length,
      submissions: list
    });
  }

  if (req.method === "POST") {
    try {
      var raw = await readBody(req);
      var body = JSON.parse(raw || "{}");
      var deviceId = (body.deviceId || "").trim();
      var player = (body.player || "").trim();
      if (!deviceId || deviceId.length > 64) {
        return res.status(400).json({ ok: false, error: "device_id_required" });
      }
      if (!player || player.length > 80) {
        return res.status(400).json({ ok: false, error: "name_required" });
      }

      var store = (await loadStore()) || emptyStore();
      if (!store.submissions) store.submissions = {};

      var guesses = body.guesses || {};
      var sc = scoreOf(guesses);
      var prev = store.submissions[deviceId];
      var isNew = !prev;

      store.submissions[deviceId] = {
        player: player,
        guesses: guesses,
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

      if (isNew || (prev && prev.player !== player) || sc.total > scoreOf(prev.guesses || {}).total) {
        await notifyAdmin(player, sc.correct, sc.total);
      }

      return res.status(200).json({
        ok: true,
        correct: sc.correct,
        total: sc.total,
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