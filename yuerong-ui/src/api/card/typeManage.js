import request from '@/utils/request'

// 会员卡 卡类型 模糊查询下下拉列表
export function listCardName(query) {
  return request({
    url: '/card/cardType/colList',
    method: 'post',  
    params: query
  })
}

// 会员卡所属分类 列表 /card/cardClass/list
export function listCardType(data) {
  return request({
    url: '/card/cardClass/list',
    method: 'post',
    data: data
  })
}

// 会员卡 table /card/cardType/list
export function cardList(data) {
  return request({
    url: '/card/cardType/list',
    method: 'post',
    data: data
  })
}