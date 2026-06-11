import { next } from "@vercel/functions";

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
  "/chlorite-flavor",
  "/labels",
  "/tour",
  "/worksheet",
  "/pocket"
]);

async function authToken() {
  if (process.env.TFF_AUTH_TOKEN) return process.env.TFF_AUTH_TOKEN;
  const password = process.env.TFF_AUTH_PASSWORD || "TFF4321#";
  const secret = process.env.TFF_AUTH_SECRET || "tff-visit-2026-norco";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(password));
  return Array.from(new Uint8Array(sig))
    .map(function (b) {
      return b.toString(16).padStart(2, "0");
    })
    .join("");
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if (!PROTECTED.has(path)) {
    return next();
  }

  const cookie = request.cookies.get("tff-auth");
  const token = await authToken();

  if (!cookie || cookie.value !== token) {
    const gate = new URL("/gate", request.url);
    gate.searchParams.set("return", path);
    return Response.redirect(gate);
  }

  return next();
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
    "/chlorite-flavor",
    "/labels",
    "/tour",
    "/worksheet",
    "/pocket"
  ]
};