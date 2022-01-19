import request from '@/utils/request'

// 查询证书配置列表
export function listCert(query) {
  return request({
    url: '/store/base/cert/list',
    method: 'get',
    params: query
  })
}

//查询证书列表(按部门分组的级联选择框)
export function cascaderList() {
  return request({
    url: '/store/base/cert/cascaderList',
    method: 'get'
  })
}

// 查询证书配置详细
export function getCert(certId) {
  return request({
    url: '/store/base/cert/' + certId,
    method: 'get'
  })
}

// 新增证书配置
export function addCert(data) {
  return request({
    url: '/store/base/cert',
    method: 'post',
    data: data
  })
}

// 修改证书配置
export function updateCert(data) {
  return request({
    url: '/store/base/cert',
    method: 'put',
    data: data
  })
}

// 删除证书配置
export function delCert(certId) {
  return request({
    url: '/store/base/cert/' + certId,
    method: 'delete'
  })
}
