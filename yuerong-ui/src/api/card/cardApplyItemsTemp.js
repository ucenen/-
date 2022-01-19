import request from '@/utils/request'

// 预设开卡项列表
export function applyItemsTempList(data) {
  return request({
    url: '/card/cardApplyItemsTemp/list',
    method: 'post',
    data: data
  })
}

// 新增预设开卡项 
export function addApplyItemsTemp(data) {
  return request({
    url: '/card/cardApplyItemsTemp/insert',
    method: 'post',
    data: data
  })
}


// 修改预设开卡项 
export function updateApplyItemsTemp(data) {
  return request({
    url: '/card/cardApplyItemsTemp/update',
    method: 'put',
    data: data
  })
}

// id查询预设开卡项  {id}
export function getApplyItemsTemp(id) {
  return request({
    url: '/card/cardApplyItemsTemp/' + id,
    method: 'get'
  })
}

// 删除预设开卡项
export function deleteApplyItemsTemp(data) {
  return request({
    url: '/card/cardApplyItemsTemp/delete',
    method: 'delete',
    params: data
  })
}

// 资产配置项接口

// 预设开卡项套餐分页查询
export function listByAssetAndItem(data) {
  return request({
    url: '/card/cardItemsMiddle/listByAssetAndItem',
    method: 'post',
    data: data
  })
}

// 资产配置项新增  
export function insertCardItemsMiddle(data) {
  return request({
    url: '/card/cardItemsMiddle/insert',
    method: 'post',
    data: data
  })
}
// 资产配置项修改 
export function updateCardItemsMiddle(data) {
  return request({
    url: '/card/cardItemsMiddle/update',
    method: 'put',
    data: data
  })
}

// 资产配置项删除 
export function deleteCardItemsMiddle(data) {
  return request({
    url: '/card/cardItemsMiddle/delete',
    method: 'delete',
    params: data
  })
}