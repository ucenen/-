import request from '@/utils/request'

// 会员卡分类列表
export function listCardClass(data) {
  return request({
    url: '/card/cardClass/list',
    method: 'post',  
    data: data
  })
}

// 新增卡分类
export function addClass(data) {
  return request({
    url: '/card/cardClass/insert',
    method: 'post',  
    data: data
  })
}

// 修改卡分类
export function updateClass(data) {
  return request({
    url: '/card/cardClass/update',
    method: 'put',  
    data: data
  })
}
// 删除卡分类
export function deleteClass(data) {
  return request({
    url: '/card/cardClass/delete',
    method: 'delete',
    params: data
  })
}
// id查询卡分类  
export function getClassone(id) {
  return request({
    url: '/card/cardClass/' + id,
    method: 'get'
  })
}