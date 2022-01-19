import request from '@/utils/request'

// 查询套餐服务列表
export function listPackService(packId) {
  return request({
    url: '/store/pack/service/list/' + packId,
    method: 'get'
  })
}

// 查询套餐服务详细
export function getPackService(id) {
  return request({
    url: '/store/pack/service/' + id,
    method: 'get'
  })
}

// 新增套餐服务
export function addPackService(data) {
  return request({
    url: '/store/pack/service',
    method: 'post',
    data: data
  })
}

// 修改套餐服务
export function updatePackService(data) {
  return request({
    url: '/store/pack/service',
    method: 'put',
    data: data
  })
}

// 删除套餐服务
export function delPackService(id) {
  return request({
    url: '/store/pack/service/' + id,
    method: 'delete'
  })
}
