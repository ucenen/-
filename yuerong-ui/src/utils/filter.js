import Vue from 'vue'
import { currencyFormat } from '@/utils/currency'
import { member_status } from '@/enum//member'

Vue.filter('valToString', function (val) {
  try {
    return val ? val.toString() : val
  } catch (error) {
    console.log(error)
  }
})

Vue.filter('currency', function (val) {
  return currencyFormat(val)
})

Vue.filter('memberStateText', function (val) {
  try {
    return member_status.has(val) ? member_status.get(val) : '未知'
  } catch (error) {
    console.log(error)
  }
})