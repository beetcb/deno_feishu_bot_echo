import type { ImMessageReceiveV1Event, Verification } from "./types.ts";

const API_ORIGIN = "https://open.feishu.cn/open-apis";

export function isVerification(body: any): body is Verification {
  if (body == null) return false;
  if (typeof body !== "object") return false;
  return body?.type === "url_verification";
}

export function isMessageReceive(body: any): body is ImMessageReceiveV1Event {
  if (body == null) return false;
  if (typeof body !== "object") return false;
  return body?.header?.event_type === "im.message.receive_v1";
}

export function send(body = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}

export function getWithAuthOptions(apiEndpointPath: string, token: string) {
  return fetch(`${API_ORIGIN}${apiEndpointPath}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + token,
    },
  });
}

export function postWithAuthOptions(
  apiEndpointPath: string,
  token: string,
  body: any = {}
) {
  return fetch(`${API_ORIGIN}${apiEndpointPath}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + token,
    },
    method: "POST",
    body: JSON.stringify(body),
  });
}
