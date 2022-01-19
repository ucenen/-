import request from '@/utils/request';

// 查询已有方案列表
export function geSchemelist() {
  return request({
    url: '/member/schemeRule/list',
    method: 'get'
  })
}

// 查询适用渠道
export function geSchemeChannelist() {
  return request({
    url: '/member/schemeRule/getCommChannel',
    method: 'get'
  })
}

// 查询组织架构
export function geSchemeOrganizationlist(query) {
  return request({
    url: '/member/schemeRule/getOrganization',
    method: 'get',
    params: query
  })
}

// 查询方案类型
export function geSchemeTypeList() {
  return request({
    url: '/member/schemeRule/getSchemeType',
    method: 'get'
  })
}

// 查询方案状态枚举
export function geSchemeStatus() {
  return request({
    url: '/member/schemeRule/getSchemeStatus',
    method: 'get'
  })
}

// 查询方案详情
export function geSchemeDetail(id) {
  return request({
    url: `/member/schemeRule/${id}`,
    method: 'get'
  })
}

// 编辑方案
export function schemeEdit(query) {
  return request({
    url: `/member/schemeRule/edit`,
    method: 'post',
    data: query
  })
}

// 保存方案
export function addSchemeRule(query) {
  return request({
    url: '/member/schemeRule/add',
    method: 'post',
    data: query
  })
}