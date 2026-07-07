const STORE_KEY = "tff:flight:live";
const DEFAULT_TOKEN = "8318d6e214f2f81cf9b808f102dd75d6c39e98530ed22d04ccc940377ba39a5f";
const LABELS = ["A", "B", "C", "D", "E"];

function readBody(req) {
  return new Promise(function (resolve, reject) {
    var body = "";
    req.on("data", function (chunk) { body += chunk; });
    req.on("end", function () { resolve(body); });
    req.on("error", reject);
  });
}

function isAuthed(req) {
  var token = process.env.TFF_AUTH_TOKEN || DEFAULT_TOKEN;
  var raw = req.headers.cookie || "";
  return raw.split(";").some(function (part) {
    var pair = part.trim().split("=");
    return pair[0] === "tff-auth" && decodeURIComponent(pair.slice(1).join("=")) === token;
  });
}

function redisConfig() {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || null,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || null
  };
}

async function upstash(cmd) {
  var cfg = redisConfig();
  if (!cfg.url || !cfg.token) return null;
  var res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: "Bearer " + cfg.token, "Content-Type": "application/json" },
    body: JSON.stringify(cmd)
  });
  if (!res.ok) return null;
  return res.json();
}

async function loadStore() {
  var up = await upstash(["GET", STORE_KEY]);
  if (up && up.result) {
    try { return JSON.parse(up.result); } catch (e) { return null; }
  }
  try {
    var kv = await import("@vercel/kv");
    var legacy = await kv.kv.get(STORE_KEY);
    if (legacy) return legacy;
  } catch (e2) {}
  return null;
}

async function saveStore(data) {
  var up = await upstash(["SET", STORE_KEY, JSON.stringify(data)]);
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

function cleanText(value, max) {
  return String(value || "").trim().slice(0, max || 160);
}

function cleanSample(sample) {
  sample = sample || {};
  return {
    liking: Math.max(1, Math.min(5, Number(sample.liking) || 0)),
    freshness: Math.max(1, Math.min(5, Number(sample.freshness) || 0)),
    cooling: Math.max(1, Math.min(5, Number(sample.cooling) || 0)),
    sweetness: cleanText(sample.sweetness, 24),
    aftertaste: cleanText(sample.aftertaste, 24),
    character: Array.isArray(sample.character) ? sample.character.slice(0, 3).map(function (d) { return cleanText(d, 32); }).filter(Boolean) : [],
    reaction: cleanText(sample.reaction, 32),
    daily: cleanText(sample.daily, 16)
  };
}

function buildAggregate(store) {
  var aggregate = {};
  LABELS.forEach(function (label) {
    aggregate[label] = {
      count: 0,
      liking: 0,
      freshness: 0,
      cooling: 0,
      descriptors: {},
      daily: {},
      rankPoints: 0
    };
  });

  Object.keys(store.submissions || {}).forEach(function (id) {
    var sub = store.submissions[id] || {};
    LABELS.forEach(function (label) {
      var s = (sub.samples || {})[label];
      if (!s) return;
      var a = aggregate[label];
      a.count++;
      a.liking += Number(s.liking) || 0;
      a.freshness += Number(s.freshness) || 0;
      a.cooling += Number(s.cooling) || 0;
      (s.character || []).forEach(function (d) { a.descriptors[d] = (a.descriptors[d] || 0) + 1; });
      if (s.daily) a.daily[s.daily] = (a.daily[s.daily] || 0) + 1;
    });
    if (sub.ranking) {
      if (aggregate[sub.ranking.first]) aggregate[sub.ranking.first].rankPoints += 3;
      if (aggregate[sub.ranking.second]) aggregate[sub.ranking.second].rankPoints += 2;
      if (aggregate[sub.ranking.third]) aggregate[sub.ranking.third].rankPoints += 1;
    }
  });

  Object.keys(aggregate).forEach(function (label) {
    var a = aggregate[label];
    if (a.count) {
      a.liking = a.liking / a.count;
      a.freshness = a.freshness / a.count;
      a.cooling = a.cooling / a.count;
    }
    a.topDescriptors = Object.keys(a.descriptors).map(function (d) {
      return { label: d, count: a.descriptors[d] };
    }).sort(function (x, y) { return y.count - x.count || x.label.localeCompare(y.label); });
  });
  return aggregate;
}

function topRanked(aggregate) {
  var hasData = LABELS.some(function (label) {
    return aggregate[label] && (aggregate[label].count || aggregate[label].rankPoints);
  });
  if (!hasData) return "";
  return LABELS.slice().sort(function (a, b) {
    return (aggregate[b].rankPoints - aggregate[a].rankPoints) || (aggregate[b].liking - aggregate[a].liking);
  })[0];
}

function submissionList(store) {
  return Object.keys(store.submissions || {}).map(function (id) {
    var s = store.submissions[id];
    return {
      deviceId: id,
      guest: s.guest,
      samples: s.samples,
      ranking: s.ranking,
      finalComment: s.finalComment,
      conceptVersion: s.conceptVersion,
      conceptLabel: s.conceptLabel,
      updatedAt: s.updatedAt
    };
  }).sort(function (a, b) {
    return (b.updatedAt || "").localeCompare(a.updatedAt || "");
  });
}

async function notifyAdmin(guest) {
  var topic = process.env.TFF_NTFY_TOPIC_SCORE || process.env.TFF_NTFY_TOPIC;
  if (!topic) return;
  try {
    await fetch("https://ntfy.sh/" + encodeURIComponent(topic), {
      method: "POST",
      headers: { Title: "Flavor Flight · " + (guest || "Guest"), Tags: "tada,bar_chart", Priority: "3" },
      body: "New blind tasting response · " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    });
  } catch (e) {}
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    if (!isAuthed(req)) return res.status(401).json({ ok: false, error: "auth_required" });
    var store = (await loadStore()) || emptyStore();
    var aggregate = buildAggregate(store);
    return res.status(200).json({
      ok: true,
      live: true,
      updatedAt: store.updatedAt,
      count: Object.keys(store.submissions || {}).length,
      topRanked: topRanked(aggregate),
      aggregate: aggregate,
      submissions: submissionList(store)
    });
  }

  if (req.method === "POST") {
    try {
      var body = JSON.parse((await readBody(req)) || "{}");
      var deviceId = cleanText(body.deviceId, 64);
      var guest = cleanText(body.guest, 80);
      if (!deviceId) return res.status(400).json({ ok: false, error: "device_id_required" });
      if (!guest) return res.status(400).json({ ok: false, error: "name_required" });

      var samples = {};
      LABELS.forEach(function (label) { samples[label] = cleanSample((body.samples || {})[label]); });
      var ranking = {
        first: LABELS.indexOf(body.ranking && body.ranking.first) >= 0 ? body.ranking.first : "",
        second: LABELS.indexOf(body.ranking && body.ranking.second) >= 0 ? body.ranking.second : "",
        third: LABELS.indexOf(body.ranking && body.ranking.third) >= 0 ? body.ranking.third : ""
      };

      var store = (await loadStore()) || emptyStore();
      if (!store.submissions) store.submissions = {};
      var isNew = !store.submissions[deviceId];
      store.submissions[deviceId] = {
        guest: guest,
        samples: samples,
        ranking: ranking,
        finalComment: cleanText(body.finalComment, 500),
        conceptVersion: Number(body.conceptVersion) || 0,
        conceptLabel: cleanText(body.conceptLabel, 120),
        updatedAt: new Date().toISOString()
      };
      store.updatedAt = new Date().toISOString();

      var saved = await saveStore(store);
      if (!saved) return res.status(503).json({ ok: false, error: "storage_unavailable" });
      if (isNew) await notifyAdmin(guest);
      return res.status(200).json({ ok: true, updatedAt: store.updatedAt });
    } catch (e) {
      return res.status(400).json({ ok: false, error: "bad_request" });
    }
  }

  if (req.method === "DELETE") {
    if (!isAuthed(req)) return res.status(401).json({ ok: false, error: "auth_required" });
    var cleared = await saveStore(emptyStore());
    if (!cleared) return res.status(503).json({ ok: false, error: "storage_unavailable" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "method_not_allowed" });
};
