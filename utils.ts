import type { Verification } from "./types.ts";

export function isVerification(body: any): body is Verification {
  if (body == null) return false;
  if (typeof body !== "object") return false;
  return body?.type === "url_verification";
}

export function send(body = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}
