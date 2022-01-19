import request from '@/utils/request'

// 查询轮牌规则列表
export function listRound(query) {
  return request({
    url: '/store/roundrule/list',
    method: 'get',
    params: query
  })
}

// 查询轮牌规则详细
export function getRound(id) {
  return request({
    url: '/store/roundrule/' + id,
    method: 'get'
  })
}

// 新增轮牌规则
export function addRound(data) {
  return request({
    url: '/store/roundrule',
    method: 'post',
    data: data
  })
}

// 修改轮牌规则
export function updateRound(data) {
  return request({
    url: '/store/roundrule',
    method: 'put',
    data: data
  })
}

// 删除轮牌规则
export function delRound(id) {
  return request({
    url: '/store/roundrule/' + id,
    method: 'delete'
  })
}
