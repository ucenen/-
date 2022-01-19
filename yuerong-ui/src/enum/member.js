const member_status = new Map()
member_status.set('0', '正常')
member_status.set('1', '未审核')
member_status.set('2', '冻结')
member_status.set('3', '禁用')
member_status.set('4', '注销')

const back_status = {
  no_add: 0,
  add_back: 1,
}

export {
  member_status,
  back_status
}