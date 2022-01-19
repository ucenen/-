import currency from 'currency.js'

const CNY = (value) =>
  currency(value, { symbol: '¥', precision: 2, separator: ',' })

function currencyYuanToPenny(value) {
  // return CNY(value).multiply(100).value
  return CNY(value).value
}
function currencyPennyToYuan(value) {
  return CNY(value).toString()
}
function currencyFormat(value) {
  return CNY(value).format()
}
export { currencyFormat, currencyYuanToPenny, currencyPennyToYuan }
export default CNY
