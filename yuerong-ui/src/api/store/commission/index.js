import request from "@/utils/request";

// 查询提成列表
export function getCommissionMainList(query) {
  return request({
    url: "/store/commissionMain/list",
    method: "get",
    params: query,
  });
}

// 查询提成主档详细信息
export function getCommissionMainInfo(id) {
  return request({
    url: `/store/commissionMain/${id}`,
    method: "get",
  });
}

// 添加常规提成主档信息
export function addCommissionMainInfo(data) {
  return request({
    url: "/store/commissionMain/save",
    method: "post",
    data,
  });
}

// 添加常规提成服务信息
export function addCommissionServiceInfo(data) {
  return request({
    url: "/store/commissionService/saveOrUpdate",
    method: "post",
    data,
  });
}

// 查询常规提成分类下信息
export function getCommissionNormalList(query) {
  return request({
    url: "/store/commissionMain/listNormal",
    method: "get",
    params: query,
  });
}

// 查询服务列表
export function getCommissionServiceList(query) {
  return request({
    url: "/store/commissionService/list",
    method: "post",
    data: query,
  });
}

// 批量添加服务数据
export function addMultipleCommissionService(data) {
  return request({
    url: "/store/commissionService/batchSave",
    method: "post",
    data,
  });
}

export function deleteCommissionNormalService(id) {
  return request({
    url: `/store/commissionService/remove/${id}`,
    method: "delete",
  });
}

export function deleteCommissionNormalSale(id) {
  return request({
    url: `/store/commissionSale//remove/${id}`,
    method: "delete",
  });
}

// 添加常规提成销售信息
export function addCommissionSaleInfo(data) {
  return request({
    url: "/store/commissionSale/saveOrUpdate",
    method: "post",
    data,
  });
}

// 批量添加销售数据
export function addMultipleCommissionSaleInfo(data) {
  return request({
    url: "/store/commissionSale/batchSave",
    method: "post",
    data,
  });
}

// 获取销售数据列表
export function getCommissionSaleList(data) {
  return request({
    url: "/store/commissionSale/list",
    method: "post",
    data,
  });
}
