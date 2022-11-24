export type DataType = 'string' | 'boolean' | 'array' | 'object' | 'number' | 'bigint' | 'symbol' | 'undefined' | 'function'

export const isUndef = (v: any): boolean => v === undefined || v === null

export const isDef = (v: any): boolean => v !== undefined && v !== null

export const isNumber = (v: any): boolean => !isNaN(v) && isFinite(v)

export const isInt = (v: any): boolean => !isNaN(v) && parseInt(v) === v

export const isTrue = (v: any): boolean => v === true

export const isFalse = (v: any): boolean => v === false

export const isPrimitive = (v: any): boolean => typeof v === 'string' || typeof(v) === 'number'

export const isObject = (v: any): boolean => v !== null && !Array.isArray(v) && typeof v === 'object'

const _toString = Object.prototype.toString

export const isPlainObject = (v: any): boolean => _toString.call(v) === '[object Object]'

export const isRegExp = (v: any): boolean => _toString.call(v) === '[object RegExp]'

export const isArray = (v: any): boolean => Array.isArray(v)

export const isFunction = (v: any): boolean => v && typeof v === 'function'

export const toString = (v: any): string => isUndef(v) ? '' : typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)

// Schema 相关
export type SchemaTypes = 'string' | 'object' | 'array' | 'number' | 'boolean' | 'void' | 'date' | 'datetime' | (string & {})

export interface JsonSchemaProperties {
  [key: string]: JsonSchema
}

export type Lifecycle = {
  onMount?: () => void;
  onWillMount?: () => void;
  onDestroy?: () => void;
}

export interface JsonSchema {
  parent?: JsonSchema
  root?: JsonSchema
  name?: string
  title?: string
  description?: string
  default?: any
  readOnly?: boolean
  writeOnly?: boolean
  type?: SchemaTypes
  enum?: {
    label: string
    value: any
    [key: string]: any
  }[]
  const?: any
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string | RegExp
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  required?: string[] | boolean | string
  format?: string
  properties?: JsonSchemaProperties
  ['x-index']?: number
  ['x-pattern']?: any
  ['x-display']?: any
  ['x-validator']?: any
  ['x-decorator']?: string | null
  ['x-decorator-props']?: any
  ['x-component']?: string | (string & {}) | ((...args: any[]) => any)
  ['x-component-props']?: {
    [key: string]: any,
  }
  ['x-reactions']?: any
  ['x-content']?: any
  ['x-visible']?: boolean
  ['x-hidden']?: boolean
  ['x-disabled']?: boolean
  ['x-editable']?: boolean
  ['x-read-only']?: boolean
  ['x-read-pretty']?: boolean

  // 增强formily2的schema
  $id?: string // 组件唯一ID
  $key?: string // 与后端关联的字段（默认为 $id 值）
  $alias?: string // 组件唯一别名
  // 插槽支持（如：Card右上角的extra）
  $slot?: {
    [key: string]: JsonSchemaProperties
  }
  // 生命周期
  ['x-component-lifecycle']?: Lifecycle

  // workspace相关属性
  // 用于workspace定位组件
  $viewComponent?: string
  // editor 专用字段、dropSection不允许drop
  $static?: boolean
  // editor 专用字段、不能拖拽
  $draggable?: boolean
}