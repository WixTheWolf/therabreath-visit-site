/** Server-side gate — same password as /gate (TFF4321#). */
const PROTECTED = new Set([
  "/toolkit",
  "/kickoff",
  "/host",
  "/questions",
  "/answers",
  "/hospitality",
  "/followup",
  "/lakewood-reply",
  "/lakewood-tracker",
  "/intensity-tiers",
  "/chlorite-flavor-playbook",
  "/labels",
  "/tour",
  "/worksheet",
  "/pocket",
  "/partnership",
  "/therabreath",
  "/search-index.json",
  "/score",
  "/qr",
  "/packet",
  "/speaker-packet",
  "/booklet/documents/global-supplier-quality-manual-norco-june-2026.docx"
]);

// Matches api/auth.js default HMAC for password TFF4321#
const DEFAULT_TOKEN = "8318d6e214f2f81cf9b808f102dd75d6c39e98530ed22d04ccc940377ba39a5f";

function getCookie(request, name) {
  var raw = request.headers.get("cookie") || "";
  var parts = raw.split(";");
  for (var i = 0; i < parts.length; i++) {
    var pair = parts[i].trim().split("=");
    if (pair[0] === name) return decodeURIComponent(pair.slice(1).join("="));
  }
  return null;
}

export default function middleware(request) {
  var url = new URL(request.url);
  var path = url.pathname.replace(/\/$/, "") || "/";

  if (!PROTECTED.has(path)) {
    return;
  }

  var token = process.env.TFF_AUTH_TOKEN || DEFAULT_TOKEN;
  var cookie = getCookie(request, "tff-auth");

  if (!cookie || cookie !== token) {
    var gate = new URL("/gate", request.url);
    gate.searchParams.set("return", path);
    return Response.redirect(gate);
  }
}

export const config = {
  matcher: [
    "/toolkit",
    "/kickoff",
    "/host",
    "/questions",
    "/answers",
    "/hospitality",
    "/followup",
    "/lakewood-reply",
    "/lakewood-tracker",
    "/intensity-tiers",
    "/chlorite-flavor-playbook",
    "/labels",
    "/tour",
    "/worksheet",
    "/pocket",
    "/partnership",
    "/therabreath",
    "/search-index.json",
    "/score",
    "/qr",
    "/packet",
    "/speaker-packet",
    "/booklet/documents/global-supplier-quality-manual-norco-june-2026.docx"
  ]
};
