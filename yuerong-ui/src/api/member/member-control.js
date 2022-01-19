import request from '@/utils/request';

// 查询会员列表
export function getMemberlist(query) {
  return request({
    url: '/member/member/list',
    method: 'get',
    params: query
  })
}

// 查询会员状态统计
export function getMemberStatusTotal(query) {
  return request({
    url: '/member/member/getMemberStatusTotal',
    method: 'post',
    data: query
  })
}

// 注册渠道
export function getDictType(dictType) {
  return request({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get'
  })
}