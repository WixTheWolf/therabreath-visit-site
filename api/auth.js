const crypto = require("crypto");

const PASSWORD = process.env.TFF_AUTH_PASSWORD || "TFF4321#";
const SECRET = process.env.TFF_AUTH_SECRET || "tff-visit-2026-norco";
const TOKEN = crypto.createHmac("sha256", SECRET).update(PASSWORD).digest("hex");
const COOKIE = `tff-auth=${TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`;

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

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      var raw = await readBody(req);
      var data = JSON.parse(raw || "{}");
      if (data.password === PASSWORD) {
        res.setHeader("Set-Cookie", COOKIE);
        return res.status(200).json({ ok: true });
      }
      return res.status(401).json({ ok: false, error: "invalid_password" });
    } catch (e) {
      return res.status(400).json({ ok: false, error: "bad_request" });
    }
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", "tff-auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "method_not_allowed" });
};