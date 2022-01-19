import request from '@/utils/request'

// 关账列表
export function orderCloseConfigList(query) {
  return request({
    url: '/order/orderCloseConfig/list',
    method: 'get',
    params: query,
  })
}

// 新增关账配置
export function addOrderCloseConfig(data) {
  return request({
    url: '/order/orderCloseConfig',
    method: 'post',
    data,
  })
}

// 修改关账配置
export function updateOrderCloseConfig(data) {
  return request({
    url: '/order/orderCloseConfig',
    method: 'put',
    data,
  })
}

// 删除关账配置
export function delOrderCloseConfig(id) {
  return request({
    url: `/order/orderCloseConfig/${id}`,
    method: 'delete',
  })
}
