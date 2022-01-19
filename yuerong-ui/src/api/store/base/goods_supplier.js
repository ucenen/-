import request from '@/utils/request'

// 查询商品供应商列表
export function listSupplier(query) {
  return request({
    url: '/store/base/goods_supplier/list',
    method: 'get',
    params: query
  })
}

//查询商品供应商列表(级联选择框)
export function cascaderList() {
  return request({
    url: '/store/base/goods_supplier/cascaderList',
    method: 'get'
  })
}

// 查询商品供应商详细
export function getSupplier(id) {
  return request({
    url: '/store/base/goods_supplier/' + id,
    method: 'get'
  })
}

// 新增商品供应商
export function addSupplier(data) {
  return request({
    url: '/store/base/goods_supplier',
    method: 'post',
    data: data
  })
}

// 修改商品供应商
export function updateSupplier(data) {
  return request({
    url: '/store/base/goods_supplier',
    method: 'put',
    data: data
  })
}

// 删除商品供应商
export function delSupplier(ids) {
  return request({
    url: '/store/base/goods_supplier/' + ids,
    method: 'delete'
  })
}
