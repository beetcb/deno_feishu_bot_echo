import { send, postWithAuthOptions } from "../../utils.ts";
export default async function sendMessage(
  token: string,
  receive_id: string,
  text: string
) {
  const response = await postWithAuthOptions(
    "/im/v1/messages?receive_id_type=chat_id",
    token,
    {
      receive_id,
      msg_type: "text",
      content: JSON.stringify({ text }),
    }
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
