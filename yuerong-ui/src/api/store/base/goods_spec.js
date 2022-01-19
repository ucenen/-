import request from '@/utils/request'

// 查询商品规格列表
export function listSpec(goodsId) {
  return request({
    url: '/store/goods/spec/list/' + goodsId,
    method: 'get'
  })
}

// 查询商品规格详细
export function getSpec(id) {
  return request({
    url: '/store/goods/spec/' + id,
    method: 'get'
  })
}

// 新增商品规格
export function addSpec(data) {
  return request({
    url: '/store/goods/spec',
    method: 'post',
    data: data
  })
}

// 修改商品规格
export function updateSpec(data) {
  return request({
    url: '/store/goods/spec',
    method: 'put',
    data: data
  })
}

//检查规格编号是否唯一
export function chkSpecCode(code, id) {
  return request({
    url: '/store/goods/spec/' + code + '/' + id,
    method: 'get'
  })
}
//检查规格条形码是否唯一
export function chkSpecBarcode(barcode, id) {
  return request({
    url: '/store/goods/spec/bc/' + barcode + '/' + id,
    method: 'get'
  })
}

// 删除商品规格
export function delSpec(id) {
  return request({
    url: '/store/goods/spec/' + id,
    method: 'delete'
  })
}
