import { send } from "../../utils.ts";
export default async function sendMessage(
  token: string,
  receive_id: string,
  text: string,
) {
  const response = await fetch(
    "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id",
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + token,
      },
      method: "POST",
      body: JSON.stringify({
        receive_id,
        msg_type: "text",
        content: JSON.stringify({ text }),
      }),
    },
  );

  if (!response.ok) {
    return send();
  }

  const body = await response.json();

  if (body.code !== 0) {
    console.log("send message error, code = %d, msg = %s", body.code, body.msg);
    return "";
  }
}
