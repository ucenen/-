import request from '@/utils/request'

// 查询服务分类列表
export function listClass(query) {
  return request({
    url: '/store/base/servcie_class/list',
    method: 'get',
    params: query
  })
}

// 查询服务分类详细
export function getClass(id) {
  return request({
    url: '/store/base/servcie_class/' + id,
    method: 'get'
  })
}

//查询服务分类列表(级联选择框)
export function cascaderList() {
  return request({
    url: '/store/base/servcie_class/cascaderList',
    method: 'get'
  })
}

// 新增服务分类
export function addClass(data) {
  return request({
    url: '/store/base/servcie_class',
    method: 'post',
    data: data
  })
}

// 修改服务分类
export function updateClass(data) {
  return request({
    url: '/store/base/servcie_class',
    method: 'put',
    data: data
  })
}

// 删除服务分类
export function delClass(id) {
  return request({
    url: '/store/base/servcie_class/' + id,
    method: 'delete'
  })
}

// 导出服务分类
export function exportClass(query) {
  return request({
    url: '/store/base/servcie_class/export',
    method: 'get',
    params: query
  })
}