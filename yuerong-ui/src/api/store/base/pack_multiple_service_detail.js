import request from '@/utils/request'

// 查询套餐服务多选组明细列表
export function listPackMultipleDetail(multipleId) {
  return request({
    url: '/store/pack/multiple_service/detail/list/' + multipleId,
    method: 'get'
  })
}

// 查询套餐服务多选组明细详细
export function getPackMultipleDetail(id) {
  return request({
    url: '/store/pack/multiple_service/detail/' + id,
    method: 'get'
  })
}

// 新增套餐服务多选组明细
export function addPackMultipleDetail(data) {
  return request({
    url: '/store/pack/multiple_service/detail',
    method: 'post',
    data: data
  })
}

// 修改套餐服务多选组明细
export function updatePackMultipleDetail(data) {
  return request({
    url: '/store/pack/multiple_service/detail',
    method: 'put',
    data: data
  })
}

// 删除套餐服务多选组明细
export function delPackMultipleDetail(id) {
  return request({
    url: '/store/pack/multiple_service/detail/' + id,
    method: 'delete'
  })
}
