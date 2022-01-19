import request from "@/utils/request";

// 查询门店方案列表
export function planList(query) {
  return request({
    url: "/store/plan/list",
    method: "post",
    params: query,
  });
}

// 查询门店方案列表
export function listReceipt(data) {
  return request({
    url: "/store/base/receipt/list",
    method: "post",
    data,
  });
}

// 获取门店方案详情
export function getPlanInfo(id) {
  return request({
    url: `/store/plan/${id}`,
    method: "get",
  });
}

// 查询门店方案商品列表
export function getPlanGoodsList(query) {
  return request({
    url: "/store/plan/goodsSpec/list",
    method: "post",
    params: query,
  });
}

// 查询门店方案商品分类列表(按部门分组的级联选择框)
export function getPlanGoodsCascadeList() {
  return request({
    url: "/store/base/goods_class/cascaderList",
    method: "get",
  });
}

// 查询门店方案服务列表
export function getPlanServiceList(query) {
  return request({
    url: "/store/plan/service/list",
    method: "post",
    params: query,
  });
}

// 查询门店方案服务分类列表(级联选择框)
export function getPlanServiceCascadeList() {
  return request({
    url: "/store/base/servcie_class/cascaderList",
    method: "get",
  });
}

// 查询门店方案套餐列表
export function getPlanPackList(query) {
  return request({
    url: "/store/plan/pack/list",
    method: "post",
    params: query,
  });
}

// 查询门店方案套餐分类列表(级联选择框)
export function getPlanPackCascadeList() {
  return request({
    url: "/store/base/pack_class/cascaderList",
    method: "get",
  });
}

// 新增门店方案基础配置
export function addBasePlanInfo(data) {
  return request({
    url: "/store/plan",
    method: "post",
    data,
  });
}

// 更新门店方案基础配置
export function updateBasePlanInfo(data) {
  return request({
    url: "/store/plan",
    method: "put",
    data,
  });
}

// 获取门店方案职级列表
export function getPlanPostList(storePlanId) {
  return request({
    url: `/store/plan/post/list/${storePlanId}`,
    method: "get",
  });
}

// 新增门店方案职级
export function addPlanPostInfo(data) {
  return request({
    url: "/store/plan/post",
    method: "post",
    data,
  });
}

// 删除门店方案职级
export function deletePlanPostInfo(planID, postID) {
  return request({
    url: `/store/plan/post/${planID}/${postID}`,
    method: "delete",
  });
}

// 获取门店方案轮牌列表
export function getPlanRoundList(storePlanId) {
  return request({
    url: `/store/plan/round/list/${storePlanId}`,
    method: "get",
  });
}

// 新增门店方案轮牌
export function addPlanRoundInfo(data) {
  return request({
    url: "/store/plan/round",
    method: "post",
    data,
  });
}

// 删除门店方案轮牌
export function deletePlanRoundInfo(planID, roundID) {
  return request({
    url: `/store/plan/round/${planID}/${roundID}`,
    method: "delete",
  });
}

// 获取门店方案门店列表
export function getPlanDeptList(storePlanId) {
  return request({
    url: `/store/plan/dept/treeselect/${storePlanId}`,
    method: "get",
  });
}

// 新增门店
export function addPlanDeptInfo(data) {
  return request({
    url: "/store/plan/dept",
    method: "post",
    data,
  });
}

// 批量添加门店方案服务列表
export function addPlanServiceList(data) {
  return request({
    url: `/store/plan/service`,
    method: "post",
    data,
  });
}

// 批量删除门店方案服务列表
export function deletePlanMultipleService(serviceIds) {
  return request({
    url: `/store/plan/service/${serviceIds}`,
    method: "delete",
  });
}

// 批量添加门店方案商品列表
export function addPlanGoodsList(data) {
  return request({
    url: `/store/plan/goodsSpec`,
    method: "post",
    data,
  });
}

// 批量删除门店方案商品列表
export function deletePlanMultipleGoods(goodsIds) {
  return request({
    url: `/store/plan/goodsSpec/${goodsIds}`,
    method: "delete",
  });
}

// 门店方案支付配置列表
export function getPlanPaymentList(data) {
  return request({
    url: `/store/plan/payment/list`,
    method: "post",
    params: data,
  });
}

// 门店方案支付配置添加
export function addPlanPayment(data) {
  return request({
    url: `/store/plan/payment`,
    method: "post",
    data,
  });
}

// 更新门店方案支付配置
export function updatePlanPayment(data) {
  return request({
    url: `/store/plan/payment`,
    method: "put",
    data,
  });
}

// 批量添加门店方案套餐
export function addPlanPackList(data) {
  return request({
    url: `/store/plan/pack`,
    method: "post",
    data,
  });
}

// 批量删除门店方案套餐
export function deletePlanMultiplePack(packIds) {
  return request({
    url: `/store/plan/pack/${packIds}`,
    method: "delete",
  });
}

// 门店方案奖罚类型列表
export function getPlanRewardPunishList(storePlanId) {
  return request({
    url: `/store/plan/rewardPunish/list/${storePlanId}`,
    method: "get",
  });
}

// 添加门店方案奖罚类型
export function addPlanRewardPunish(data) {
  return request({
    url: `/store/plan/rewardPunish`,
    method: "post",
    data,
  });
}

// 更新门店方案奖罚类型
export function updatePlanRewardPunish(data) {
  return request({
    url: `/store/plan/rewardPunish`,
    method: "put",
    data,
  });
}

// 删除门店方案奖罚类型
export function deletePlanRewardPunish(rewardPunishID) {
  return request({
    url: `/store/plan/rewardPunish/${rewardPunishID}`,
    method: "delete",
  });
}

// 门店方案业绩提成列表
export function getPlanAchievementPunishList(storePlanId) {
  return request({
    url: `/store/plan/performanceCost/list/${storePlanId}`,
    method: "get",
  });
}

// 添加门店方案业绩提成
export function addPlanAchievementPunish(data) {
  return request({
    url: `/store/plan/performanceCost`,
    method: "post",
    data,
  });
}

// 更新门店方案业绩提成
export function updatePlanAchievementPunish(data) {
  return request({
    url: `/store/plan/performanceCost`,
    method: "put",
    data,
  });
}

// 删除门店方案业绩提成
export function deletePlanAchievementPunish(id) {
  return request({
    url: `/store/plan/performanceCost/${id}`,
    method: "delete",
  });
}

// 获取门店方案可以选择所有提成方案列表
export function getCommissionMainListByStorePlanID(storePlanId, params) {
  return request({
    url: `/store/plan/commission/listMain/${storePlanId}`,
    method: "get",
    params,
  });
}

// 门店方案提成
export function getPlanCommissionPunishList(storePlanId) {
  return request({
    url: `/store/plan/commission/list/${storePlanId}`,
    method: "get",
  });
}

// 添加门店方案提成
export function addPlanCommissionPunish(data) {
  return request({
    url: `/store/plan/commission`,
    method: "post",
    data,
  });
}

// 删除门店方案提成
export function deletePlanCommissionPunish(storePlanId, commissionId) {
  return request({
    url: `/store/plan/commission/${storePlanId}/${commissionId}`,
    method: "delete",
  });
}
