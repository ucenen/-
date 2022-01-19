export const getList = (params) => {
  const arr = []
  for (let key in params) {
    const item = {
      state: params[key]
    }
    arr.push(item)
  }
  return arr
}