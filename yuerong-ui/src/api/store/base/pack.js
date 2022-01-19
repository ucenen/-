import request from '@/utils/request'

// 查询套餐列表
export function listPack(query) {
  return request({
    url: '/store/pack/list',
    method: 'get',
    params: query
  })
}

// 查询套餐详细
export function getPack(id) {
  return request({
    url: '/store/pack/' + id,
    method: 'get'
  })
}

// 新增套餐
export function addPack(data) {
  return request({
    url: '/store/pack',
    method: 'post',
    data: data
  })
}

// 修改套餐
export function updatePack(data) {
  return request({
    url: '/store/pack',
    method: 'put',
    data: data
  })
}

// 删除套餐
export function delPack(id) {
  return request({
    url: '/store/pack/' + id,
    method: 'delete'
  })
}

//检查套餐编号是否唯一
export function chkPackCode(code, id) {
  return request({
    url: '/store/pack/chkcode/' + code + '/' + id,
    method: 'get'
  })
}