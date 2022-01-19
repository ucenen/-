import request from '@/utils/request'

// 账单列表
export function posOrderList(query) {
  return request({
    url: '/order/backend/order/searchBillList',
    method: 'post',
    data: query,
  })
}

// 订单详情
export function getOrderDetail(orderId) {
  return request({
    url: '/order/backend/order/searchOrderDetail',
    method: 'post',
    params: {
      orderId,
    },
  })
}

// 商品详情(服务,商品) itemId itemType
export function searchOrderGoodsDetail(params) {
  return request({
    url: '/order/backend/order/searchItemDetail',
    method: 'post',
    params,
  })
}

// 会员卡发卡详情(卖卡) baseCardId
export function searchSellCardDetail(params) {
  return request({
    url: '/order/backend/order/searchSellCardDetail',
    method: 'post',
    params,
  })
}

// 查询部门业绩
export function searchDeptPerform(deptId) {
  return request({
    url: '/order/backend/order/searchDeptPerform',
    method: 'post',
    params: {
      deptId,
    },
  })
}

// 查询部门业绩变更历史
export function searchDeptPerformHistory(deptId) {
  return request({
    url: '/order/backend/order/searchDeptPerformHistory',
    method: 'post',
    params: {
      deptId,
    },
  })
}

// 查询员工业绩
export function searchStaffPerform(staffId) {
  return request({
    url: '/order/backend/order/searchStaffPerform',
    method: 'post',
    params: {
      staffId,
    },
  })
}

// 查询员工业绩变更历史
export function searchStaffPerformHistory(staffId) {
  return request({
    url: '/order/backend/order/searchStaffPerformHistory',
    method: 'post',
    params: {
      staffId,
    },
  })
}
