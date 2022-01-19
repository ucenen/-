import request from '@/utils/request'

// 查询商品分类列表
export function listClass(query) {
  return request({
    url: '/store/base/goods_class/list',
    method: 'get',
    params: query
  })
}

//查询商品分类列表(按部门分组的级联选择框)
export function cascaderList() {
  return request({
    url: '/store/base/goods_class/cascaderList',
    method: 'get'
  })
}

// 查询商品分类详细
export function getClass(id) {
  return request({
    url: '/store/base/goods_class/' + id,
    method: 'get'
  })
}

// 新增商品分类
export function addClass(data) {
  return request({
    url: '/store/base/goods_class',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateClass(data) {
  return request({
    url: '/store/base/goods_class',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delClass(ids) {
  return request({
    url: '/store/base/goods_class/' + ids,
    method: 'delete'
  })
}
