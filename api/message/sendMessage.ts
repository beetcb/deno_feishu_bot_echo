import { postWithAuthOptions } from "../helper.ts";
import { errorHandler } from "../helper.ts";
export default async function sendTextMessage(
  token: string,
  receive_id: string,
  text: string,
) {
  const response = await postWithAuthOptions(
    "/im/v1/messages?receive_id_type=chat_id",
    token,
    {
      receive_id,
      msg_type: "text",
      content: JSON.stringify({ text }),
    },
  );

  errorHandler(response);
}
