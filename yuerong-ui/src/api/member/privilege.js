import request from '@/utils/request';

// 查询已有方案列表
export function getSchemeLevellist(id) {
  return request({
    url: '/member/schemeLevel/list',
    params: {schemeRuleId: id},
    method: 'get'
  })
}

// 新增等级
export function addSchemeLevel(query) {
  return request({
    url: `/member/schemeLevel/add`,
    method: 'post',
    data: query
  })
}