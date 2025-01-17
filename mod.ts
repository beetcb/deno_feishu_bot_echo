import { isMessageReceive, isVerification, send } from "./utils.ts";
import { sendTextMessage } from "./api/message/sendMessage.ts";
import getTenantAccessToken from "./api/auth.ts";
import { tweeAddRecord } from "./needs_wrapper.ts";

const APP_ID = Deno.env.get("APP_ID");
const APP_SECRET = Deno.env.get("APP_SECRET");
const APP_VERIFICATION_TOKEN = Deno.env.get("APP_VERIFICATION_TOKEN");
const WORKER_URL = Deno.env.get("WORKER_URL");

async function handleRequest(request: Request) {
  // 只接收 POST 请求
  if (request.method.toUpperCase() !== "POST") {
    if (!APP_ID || !APP_SECRET || !APP_VERIFICATION_TOKEN || !WORKER_URL) {
      return new Response(
        "请先设置 APP_ID、APP_SECRET、APP_VERIFICATION_TOKEN、WORKER_URL 环境变量",
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

  if (body.isForwarded) {
    console.log(body)
    await msgHandler(body);
  } else {
    console.warn(body);
    body.isForwarded = true;
    await fetch(WORKER_URL!, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  return send();
}

async function msgHandler(body: any) {
  if (isMessageReceive(body)) {
    // 此处只处理 text 类型消息，其他类型消息忽略
    if (body.event.message.message_type !== "text") {
      return send();
    }

    // 在群聊中，只有被@了才回复
    if (
      body.event.message.chat_type === "group" &&
      !body.event.message.mentions?.length
    ) {
      return send();
    }

    const accessToken = await getTenantAccessToken();
    if (accessToken === "") {
      console.warn(`verification token not match, token = %s`, accessToken);
      return send();
    }
    const mentions = body.event.message.mentions;
    let { text } = JSON.parse(body.event.message.content);

    if (mentions != null) {
      text = text.replace(/@_user_\d/g, (key: string) => {
        const user = mentions.find((x) => x.key === key);
        if (user === undefined) return key;
        return `<at user_id="${user.id.open_id}">${user.name}</at>`;
      });
    }

    await sendTextMessage(accessToken, {
      receiver: body.event.message.chat_id,
      text: await tweeAddRecord(accessToken, {
        fields: {
          推文任务描述: "test",
          落实组别: "信息化办公室",
          预计截止日期: new Date().getTime() + 1000 * 60 * 60 * 6,
        },
      }),
    });
    return send();
  }

  return send();
}

addEventListener("fetch", (event: any) => {
  event.respondWith(handleRequest(event.request));
});
