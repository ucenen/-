import request from '@/utils/request'

// 门店库存列表
export function getCardStoreStockList(query) {
  return request({
    url: '/card/cardStoreStock/list',
    method: 'post',
    data: query,
  })
}

// 更新门店库存
export function updateCardStoreStock(data) {
  return request({
    url: '/card/cardStoreStock/update',
    method: 'put',
    data,
  })
}

// 渠道库存列表
export function getCardChannelStockList(query) {
  return request({
    url: '/card/cardChannelStock/list',
    method: 'post',
    data: query,
  })
}

// 更新渠道库存列表
export function updateCardChannelStock(data) {
  return request({
    url: '/card/cardChannelStock/update',
    method: 'put',
    data,
  })
}
