// 随机字符串
export const randomString = (length = 6) => {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let _str = ''
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * str.length)
    _str += str[rand]
  }
  return _str
}

// 生成组件ID
export const generateWidgetId = (widgetName) => widgetName + '_' + randomString()
