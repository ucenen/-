import request from '@/utils/request'

// 查询套餐回访列表
export function listVisit(packId) {
  return request({
    url: '/store/pack/visit/list/' + packId,
    method: 'get'
  })
}

// 查询套餐回访详细
export function getVisit(id) {
  return request({
    url: '/store/pack/visit/' + id,
    method: 'get'
  })
}

// 新增套餐回访
export function addVisit(data) {
  return request({
    url: '/store/pack/visit',
    method: 'post',
    data: data
  })
}

// 修改套餐回访
export function updateVisit(data) {
  return request({
    url: '/store/pack/visit',
    method: 'put',
    data: data
  })
}

// 删除套餐回访
export function delVisit(id) {
  return request({
    url: '/store/pack/visit/' + id,
    method: 'delete'
  })
}
