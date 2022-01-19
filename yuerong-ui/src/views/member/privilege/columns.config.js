const columns = [{
    type: 'selection',
    width: 55,
    prop: '',
    label: '',
    fixed: ''
  },
  {
    type: '',
    width: 150,
    prop: 'date',
    label: '权益名称',
    fixed: ''
  },
  {
    type: 'selection',
    width: 120,
    prop: 'name',
    label: '权益图标',
    fixed: ''
  },
  {
    type: '',
    width: 120,
    prop: 'province',
    label: '权益类型',
    fixed: ''
  },
  {
    type: '',
    prop: 'city',
    label: '是否可购买',
    fixed: ''
  },
  {
    type: '',
    prop: 'address',
    label: '售价',
    fixed: ''
  },
  {
    type: '',
    prop: 'zip',
    label: '领取限制',
    width: 120,
    fixed: ''
  },
  {
    type: '',
    prop: 'state',
    label: '状态',
    fixed: ''
  },
  {
    type: '',
    prop: 'state',
    label: '操作',
    width: 100,
    fixed: 'right',
    slot: 'operation'
  }
]

export default columns;