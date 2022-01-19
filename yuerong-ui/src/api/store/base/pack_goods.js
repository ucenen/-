import request from '@/utils/request'

// 查询套餐商品列表
export function listPackGoods(packId) {
  return request({
    url: '/store/pack/goods/list/' + packId,
    method: 'get'
  })
}

// 查询套餐商品详细
export function getPackGoods(id) {
  return request({
    url: '/store/pack/goods/' + id,
    method: 'get'
  })
}

// 新增套餐商品
export function addPackGoods(data) {
  return request({
    url: '/store/pack/goods',
    method: 'post',
    data: data
  })
}

// 修改套餐商品
export function updatePackGoods(data) {
  return request({
    url: '/store/pack/goods',
    method: 'put',
    data: data
  })
}

// 删除套餐商品
export function delPackGoods(id) {
  return request({
    url: '/store/pack/goods/' + id,
    method: 'delete'
  })
}
