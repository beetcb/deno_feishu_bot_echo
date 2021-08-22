import { isVerification, send } from "./utils.ts";
const APP_VERIFICATION_TOKEN = Deno.env.get("APP_VERIFICATION_TOKEN");
const WORKER_URL = Deno.env.get("WORKER_URL");
async function handleRequest(request: Request) {
  // 只接收 POST 请求
  if (request.method.toUpperCase() !== "POST") {
    if (!APP_VERIFICATION_TOKEN) {
      return new Response(
        "请先设置 APP_ID、APP_SECRET、APP_VERIFICATION_TOKEN 环境变量",
        {
          status: 200,
          headers: { "content-type": "text/plain" },
        }
      );
    }

    return send();
  }

  const body = await request.json();

  if (isVerification(body)) {
    // 校验 verification token 是否匹配，token 不匹配说明该回调并非来自开发平台
    if (body.token !== APP_VERIFICATION_TOKEN) {
      console.warn(`verification token not match, token = %s`, body.token);
      return send();
    }
    return send({ challenge: body.challenge });
  }

  // Forwarding Request
  await fetch(WORKER_URL!, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return send();
}

addEventListener("fetch", (event: any) => {
  event.respondWith(handleRequest(event.request));
});
