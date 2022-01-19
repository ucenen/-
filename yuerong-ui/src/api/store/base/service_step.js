import request from '@/utils/request'

// 查询服务步骤列表
export function listStep(serviceId) {
  return request({
    url: '/store/service/step/list/' + serviceId,
    method: 'get'
  })
}

// 查询服务步骤详细
export function getStep(id) {
  return request({
    url: '/store/service/step/' + id,
    method: 'get'
  })
}

// 新增服务步骤
export function addStep(data) {
  return request({
    url: '/store/service/step',
    method: 'post',
    data: data
  })
}

// 修改服务步骤
export function updateStep(data) {
  return request({
    url: '/store/service/step',
    method: 'put',
    data: data
  })
}

// 删除服务步骤
export function delStep(id) {
  return request({
    url: '/store/service/step/' + id,
    method: 'delete'
  })
}
