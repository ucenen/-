import request from '@/utils/request'

// 查询支付方式列表
export function listPayment(query) {
  return request({
    url: '/store/base/payment/list',
    method: 'get',
    params: query
  })
}

//查询支付方式列表(级联选择框)
export function cascaderList() {
  return request({
    url: '/store/base/payment/cascaderList',
    method: 'get'
  })
}

// 查询支付方式详细
export function getPayment(id) {
  return request({
    url: '/store/base/payment/' + id,
    method: 'get'
  })
}

// 新增支付方式
export function addPayment(data) {
  return request({
    url: '/store/base/payment',
    method: 'post',
    data: data
  })
}

// 检查代码是否存在
export function chkCode(code, id) {
  return request({
    url: '/store/base/payment/chkcode/' + code + '/' + id,
    method: 'get'
  })
}

// 修改支付方式
export function updatePayment(data) {
  return request({
    url: '/store/base/payment',
    method: 'put',
    data: data
  })
}

// 删除支付方式
export function delPayment(id) {
  return request({
    url: '/store/base/payment/' + id,
    method: 'delete'
  })
}

// 导出支付方式
export function exportPayment(query) {
  return request({
    url: '/store/base/payment/export',
    method: 'get',
    params: query
  })
}