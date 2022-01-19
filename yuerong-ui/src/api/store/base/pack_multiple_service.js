import request from '@/utils/request'

// 查询套餐服务多选组列表
export function listPackMultiple(packId) {
  return request({
    url: '/store/pack/multiple_service/list/' + packId,
    method: 'get'
  })
}

// 查询套餐服务多选组详细
export function getPackMultiple(id) {
  return request({
    url: '/store/pack/multiple_service/' + id,
    method: 'get'
  })
}

// 新增套餐服务多选组
export function addPackMultiple(data) {
  return request({
    url: '/store/pack/multiple_service',
    method: 'post',
    data: data
  })
}

// 修改套餐服务多选组
export function updatePackMultiple(data) {
  return request({
    url: '/store/pack/multiple_service',
    method: 'put',
    data: data
  })
}

// 删除套餐服务多选组
export function delPackMultiple(id) {
  return request({
    url: '/store/pack/multiple_service/' + id,
    method: 'delete'
  })
}
