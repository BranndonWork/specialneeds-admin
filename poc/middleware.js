// ./pages/middleware.js

import { NextResponse } from "next/server";
import { isHoneypotPath } from "./lib/bot-guard";

const ALLOWED_COUNTRIES = ["US", "CA", "GB", "AU", "NZ"];

const handleServiceToken = (req) => {
  if (req.headers.get("x-sn-service-token") === process.env.SN_SERVICE_TOKEN)
    return NextResponse.next();
  return null;
};

const handleGeoBlock = (req) => {
  const country = req.headers.get("x-vercel-ip-country");
  // No header means local dev — allow through
  if (!country) return null;
  if (!ALLOWED_COUNTRIES.includes(country)) return new NextResponse(null, { status: 403 });
  return null;
};

const BAN_API_PATH = "/api/internal/bot-ban/";

const getIp = (req) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
  req.headers.get("x-real-ip") ||
  (process.env.NODE_ENV === "development" ? "127.0.0.1" : null);

const callBanApi = (req, body) =>
  fetch(`${req.nextUrl.origin}${BAN_API_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_BAN_SECRET,
    },
    body: JSON.stringify(body),
  }).catch((err) => console.error("[BotGuard] Ban API error:", err.message));

const blockedResponse = () =>
  new NextResponse(null, { status: 403 });

const handleBotGuard = async (req) => {
  const ip = getIp(req);
  const pathname = req.nextUrl.pathname;

  // Skip if IP is undetectable — never block an unidentifiable user
  if (!ip) return null;

  // Never run bot guard on the internal API itself — would cause infinite loop
  if (pathname.startsWith(BAN_API_PATH)) return null;

  if (isHoneypotPath(pathname)) {
    callBanApi(req, { action: "ban", ip, path: pathname });
    return blockedResponse();
  }

  // TODO: Per-request ban check disabled — was causing 4.4K+ serverless invocations per day.
  // Proper fix: migrate to Upstash Redis (@upstash/redis) so the check runs directly in
  // Edge Middleware without an HTTP round-trip to a serverless function.
  // const checkRes = await callBanApi(req, { action: "check", ip });
  // if (checkRes?.ok) {
  //   const { banned } = await checkRes.json();
  //   if (banned) return blockedResponse();
  // }

  return null;
};


export const middleware = async (req) => {
  let response;
  response = handleServiceToken(req);
  if (response) return response;

  response = handleGeoBlock(req);
  if (response) return response;

  if (process.env.NODE_ENV !== "development") {
    response = await handleBotGuard(req);
    if (response) return response;
  }

  return NextResponse.next();
};
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

// const userAgentCheck = (req) => {
//   const userAgent = req.headers.get("user-agent");
//   const isMobile = /mobile/i.test(userAgent);
//   const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
//   const isDesktop = !isMobile && !isBot;
//   return { isMobile, isBot, isDesktop, userAgent };
// };

// const debugRequest = (req) => {
//   const userAgent = req.headers.get("user-agent");
//   const isMobile = /mobile/i.test(userAgent);
//   const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
//   const isDesktop = !isMobile && !isBot;
//   const cookies = req.cookies;
//   const headers = req.headers;
//   const nextUrl = req.nextUrl;
//   const url = req.url;
//   const method = req.method;
//   const body = req.body;
//   const query = req.query;
//   const params = req.params;
//   return {
//     isMobile,
//     isBot,
//     isDesktop,
//     userAgent,
//     cookies,r
//     headers,
//     nextUrl,
//     url,
//     method,
//     body,
//     query,
//     params,
//   };
// };
