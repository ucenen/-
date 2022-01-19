import request from '@/utils/request'

// 查询项目不可用日期配置详细
export function getUnavail(id) {
  return request({
    url: '/store/item/unavail/' + id,
    method: 'get'
  })
}

export function getUnavailByPackId(packId) {
  return request({
    url: '/store/item/unavail/pack/' + packId,
    method: 'get'
  })
}

export function getUnavailByPackIdAndServiceId(packId, serviceId) {
  return request({
    url: '/store/item/unavail/pack/' + packId + '/service/' + serviceId,
    method: 'get'
  })
}

export function getUnavailByPackIdAndGoodsId(packId, goodsId) {
  return request({
    url: '/store/item/unavail/pack/' + packId + '/goods/' + goodsId,
    method: 'get'
  })
}

// 新增项目不可用日期配置
export function addUnavail(data) {
  return request({
    url: '/store/item/unavail',
    method: 'post',
    data: data
  })
}

// 修改项目不可用日期配置
export function updateUnavail(data) {
  return request({
    url: '/store/item/unavail',
    method: 'put',
    data: data
  })
}

// 删除项目不可用日期配置
export function delUnavail(id) {
  return request({
    url: '/store/item/unavail/' + id,
    method: 'delete'
  })
}

export function delUnavailByPackId(packId) {
  return request({
    url: '/store/item/unavail/pack/' + packId,
    method: 'delete'
  })
}

export function delUnavailByPackIdAndServiceId(packId,serviceId) {
  return request({
    url: '/store/item/unavail/pack/' + packId + '/service/' + serviceId,
    method: 'delete'
  })
}

export function delUnavailByPackIdAndGoodsId(packId,goodsId) {
  return request({
    url: '/store/item/unavail/pack/' + packId + '/goods/' + goodsId,
    method: 'delete'
  })
}

export function delUnavailByStoreplanId(storeplanId) {
  return request({
    url: '/store/item/unavail/storeplan/' + storeplanId,
    method: 'delete'
  })
}
