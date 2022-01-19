import request from "@/utils/request";

// 查询提成列表
export function getCommissionSpecList(query) {
  return request({
    url: "/store/commissionSpecial/listSpecial",
    method: "get",
    params: query,
  });
}

// 查询提成详细信息
export function getCommissionSpecInfo(id) {
  return request({
    url: `/store/commissionSpecial/getInfo/${id}`,
    method: "get",
  });
}

// 新增特殊提成规则
export function addCommissionSpecInfo(data) {
  return request({
    url: "/store/commissionSpecial/saveOrUpdate",
    method: "post",
    data,
  });
}

// 删除特殊提成规则
export function deleteCommissionSpecInfo(id) {
  return request({
    url: `/store/commissionSpecial/remove/${id}`,
    method: "post",
  });
}