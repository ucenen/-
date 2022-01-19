import request from '@/utils/request'

// 查询进行中的套餐促销满减活动列表（用于套餐搭配）
export function listProm4Pack() {
  return request({
    url: '/prom/promEvents/list',
    method: 'post',
    params: {
    	'type': 2,
    	'status': 0,
    	'beginTime': new Date(),
    	'endTime': new Date()
    }
  })
}