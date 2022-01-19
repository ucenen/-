import request from "@/utils/request";

// 查询小票模板列表
export function listReceipt(query) {
  return request({
    url: "/store/base/receipt/list",
    method: "post",
    params: query,
  });
}
