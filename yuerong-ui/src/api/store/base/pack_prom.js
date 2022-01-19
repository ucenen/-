import request from '@/utils/request'

// 查询套餐促销活动详细
export function getPackProm(packId) {
  return request({
    url: '/store/pack/prom/' + packId,
    method: 'get'
  })
}

// 新增套餐促销活动
export function addPackProm(data) {
  return request({
    url: '/store/pack/prom',
    method: 'post',
    data: data
  })
}

// 修改套餐促销活动
export function updatePackProm(data) {
  return request({
    url: '/store/pack/prom',
    method: 'put',
    data: data
  })
}

// 删除套餐促销活动
export function delPackProm(packId) {
  return request({
    url: '/store/pack/prom/' + packId,
    method: 'delete'
  })
}
