import { errorHandler, postWithAuthOptions } from "../helper.ts";

export async function addOneRecord(
  token: string,
  where: {
    appToken: string;
    tableId: string;
  },
  body: {
    recordId?: string;
    filds: any;
  }
): Promise<string> {
  const { recordId, filds } = body;
  const res = await postWithAuthOptions(
    `/bitable/v1/apps/${where.appToken}/tables/${where.tableId}/records`,
    token,
    {
      record_id: recordId,
      filds: filds,
    }
  );

  return await errorHandler(res);
}
