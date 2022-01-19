import request from '@/utils/request'

// 会员卡 table /card/cardType/list
export function cardArgumentList(data) {
  return request({
    url: '/card/cardAgreementTemp/list',
    method: 'post',
    data: data
  })
}

// 新增协议 
export function addArgument(data) {
  return request({
    url: '/card/cardAgreementTemp/insert',
    method: 'post',
    data: data
  })
}


// 修改协议 
export function updateArgument(data) {
  return request({
    url: '/card/cardAgreementTemp/update',
    method: 'put',
    data: data
  })
}

// id查询协议  {id}
export function getAgreement(id) {
  return request({
    url: '/card/cardAgreementTemp/' + id,
    method: 'get'
  })
}

// 删除协议 
export function deleteAgreement(data) {
  return request({
    url: '/card/cardAgreementTemp/delete',
    method: 'delete',
    params: data
  })
}