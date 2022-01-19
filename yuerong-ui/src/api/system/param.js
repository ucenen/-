import request from '@/utils/request'

// 查询角色细节参数列表
export function listParam(query) {
  return request({
    url: '/system/param/list',
    method: 'get',
    params: query
  })
}

//查询角色细节参数关联列表（角色页面）
export function listParam4Role(roleId) {
  return request({
    url: '/system/param/list4Role/' + roleId,
    method: 'get'
  })
}
//保存角色细节参数关联
export function addRoleParam(roleId, data) {
  return request({
    url: '/system/param/saveRoleParam/' + roleId,
    method: 'post',
    data: data
  })
}

// 查询角色细节参数详细
export function getParam(id) {
  return request({
    url: '/system/param/' + id,
    method: 'get'
  })
}

// 新增角色细节参数
export function addParam(data) {
  return request({
    url: '/system/param',
    method: 'post',
    data: data
  })
}

// 修改角色细节参数
export function updateParam(data) {
  return request({
    url: '/system/param',
    method: 'put',
    data: data
  })
}

// 删除角色细节参数
export function delParam(id) {
  return request({
    url: '/system/param/' + id,
    method: 'delete'
  })
}

// 导出角色细节参数
export function exportParam(query) {
  return request({
    url: '/system/param/export',
    method: 'get',
    params: query
  })
}