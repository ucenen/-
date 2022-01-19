import request from '@/utils/request'

// 查询服务列表
export function listService(query) {
  return request({
    url: '/store/service/list',
    method: 'get',
    params: query
  })
}

//根据服务分类>获取服务列表(级联选择框)
export function cascaderList() {
  return request({
    url: '/store/service/cascaderList',
    method: 'get'
  })
}

// 查询服务详细
export function getService(id) {
  return request({
    url: '/store/service/' + id,
    method: 'get'
  })
}

// 新增服务
export function addService(data) {
  return request({
    url: '/store/service',
    method: 'post',
    data: data
  })
}

// 修改服务
export function updateService(data) {
  return request({
    url: '/store/service',
    method: 'put',
    data: data
  })
}

// 删除服务
export function delService(id) {
  return request({
    url: '/store/service/' + id,
    method: 'delete'
  })
}

//检查服务编号是否唯一
export function chkServiceCode(code, id) {
  return request({
    url: '/store/service/chkcode/' + code + '/' + id,
    method: 'get'
  })
}