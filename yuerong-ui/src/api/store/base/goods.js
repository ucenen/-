import request from '@/utils/request'

// 查询商品列表
export function listGoods(query) {
  return request({
    url: '/store/goods/list',
    method: 'get',
    params: query
  })
}

// 根据所属部门>商品分类>获取商品列表(级联选择框)
export function cascaderList() {
  return request({
    url: '/store/goods/cascaderList',
    method: 'get'
  })
}

// 查询商品详细
export function getGoods(id) {
  return request({
    url: '/store/goods/' + id,
    method: 'get'
  })
}

// 新增商品
export function addGoods(data) {
  return request({
    url: '/store/goods',
    method: 'post',
    data: data
  })
}

// 修改商品
export function updateGoods(data) {
  return request({
    url: '/store/goods',
    method: 'put',
    data: data
  })
}

//检查商品编码是否唯一
export function chkGoodsCode(code, id) {
  return request({
    url: '/store/goods/' + code + '/' + id,
    method: 'get'
  })
}

// 删除商品
export function delGoods(id) {
  return request({
    url: '/store/goods/' + id,
    method: 'delete'
  })
}
