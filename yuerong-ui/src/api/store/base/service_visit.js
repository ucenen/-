import request from '@/utils/request'

// 查询服务回访列表
export function listVisit(serviceId) {
  return request({
    url: '/store/service/visit/list/' + serviceId,
    method: 'get'
  })
}

// 查询服务回访详细
export function getVisit(id) {
  return request({
    url: '/store/service/visit/' + id,
    method: 'get'
  })
}

// 新增服务回访
export function addVisit(data) {
  return request({
    url: '/store/service/visit',
    method: 'post',
    data: data
  })
}

// 修改服务回访
export function updateVisit(data) {
  return request({
    url: '/store/service/visit',
    method: 'put',
    data: data
  })
}

// 删除服务回访
export function delVisit(id) {
  return request({
    url: '/store/service/visit/' + id,
    method: 'delete'
  })
}
