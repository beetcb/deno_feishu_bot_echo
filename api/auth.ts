const APP_ID = Deno.env.get("APP_ID");
const APP_SECRET = Deno.env.get("APP_SECRET");

export default async function getTenantAccessToken() {
  const response = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        app_id: APP_ID,
        app_secret: APP_SECRET,
      }),
    },
  );

  const body = await response.json();

  if (body.code !== 0) {
    console.log("get tenant_access_token error, code = %d", body.code);
    return "";
  }

  return body.tenant_access_token ?? "";
}
