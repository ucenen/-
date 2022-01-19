import request from "@/utils/request";

// 查询提成方案主档列表
export function getCommissionMainList(query) {
  return request({
    url: "/store/commissionMain/list",
    method: "get",
    params: query,
  });
}
