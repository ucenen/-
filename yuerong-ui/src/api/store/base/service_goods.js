import request from '@/utils/request'

// 查询服务商品消耗列表
export function listServiceGoods(serviceId) {
  return request({
    url: '/store/service/goods/list/' + serviceId,
    method: 'get'
  })
}

// 查询服务商品消耗详细
export function getServiceGoods(id) {
  return request({
    url: '/store/service/goods/' + id,
    method: 'get'
  })
}

// 新增服务商品消耗
export function addServiceGoods(data) {
  return request({
    url: '/store/service/goods',
    method: 'post',
    data: data
  })
}

// 修改服务商品消耗
export function updateServiceGoods(data) {
  return request({
    url: '/store/service/goods',
    method: 'put',
    data: data
  })
}

// 删除服务商品消耗
export function delServiceGoods(id) {
  return request({
    url: '/store/service/goods/' + id,
    method: 'delete'
  })
}
