import moment from 'moment'

import { PAGE_REFRESH_QUERY } from './constants'
import { isArray, isObject } from './type'

// 将字符串parse为bool、number等
export const strParse = str => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

// 去掉数组中隐式转换为false的值
export const compact = array => {
  let resIndex = 0
  const result = []

  if (array == null) {
    return result
  }

  for (const value of array) {
    if (value) {
      result[resIndex++] = value
    }
  }
  return result
}

// 获取url query参数
export const getQuery = (parseArray = []): object => {
  const { href } = window.location
  const search = `?${href.split('?')[1]}`
  if (!search) return {}
  const vars = search.substring(1).split('&')
  const query = {}
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=')
    const key = pair[0]
    let value = decodeURIComponent(pair[1])
    // 类型转换
    if (parseArray.includes(key)) {
      value = strParse(value)
    }
    if (typeof query[key] === 'undefined') {
      query[key] = value
    } else if (typeof query[key] === 'string') {
      query[key] = [query[key], value]
    } else {
      query[key].push(value)
    }
  }
  return query
}

// 对象/json 转换为query string
export const json2queryString = (json, refresh = false) => {
  if (refresh) {
    json[PAGE_REFRESH_QUERY] = moment().unix()
  }
  const queryString = compact(
    Object.keys(json).map(key => (json[key] !== 'undefined' && json[key] !== undefined && json[key] !== null && json[key] !== '' ? `${key}=${json[key]}` : '')),
  ).join('&')
  return queryString ? `?${queryString}` : ''
}

// 对象复制
export const copyDeep = origin => {
  let result
  if (isArray(origin)) {
    result = []
    origin.forEach(v => result.push(copyDeep(v)))
  } else if (isObject(origin)) {
    result = {};

    [...Object.keys(origin), ...Object.getOwnPropertySymbols(origin)].forEach(k => {
      result[k] = copyDeep(origin[k])
    })
  } else {
    result = origin
  }
  return result
}

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
export const generateComponentId = (componentName) => componentName + '_' + randomString()
