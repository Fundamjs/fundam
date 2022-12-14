import { model } from '@formily/reactive'
import _, { cloneDeep } from 'lodash'

export const dataPool = model({
  schema: null, // 当前实时搭建的schema
  schemaUpdateTime: null, // schema最后更新时间
  selectWidgetId: null, // 当前选中的widget id，如：Page_a24Esq
  widgetConfigs: {},  // 基础信息，如：{ Button: { title, name, defaultSchema, settingSchema } }
})

// 设置组件基础信息
export const setWidgetConfigs = (widgetConfigs) => dataPool.widgetConfigs = cloneDeep(widgetConfigs)

// 初始化schema
export const initSchema = schema => {
  dataPool.schema = schema
}

// 根据组件id、name获取组件名称
export const getWidgetName = (idOrName: string) => idOrName.split('_')[0]

// 用于重新render
const forceUpdate = () => dataPool.schemaUpdateTime = new Date().getTime()

// 根据ID获取该组件的schema
export const getWidgetSchema = ($id) => {
  const { currentPath } = getRenderSchemaPathById($id)
  return _.get(dataPool.schema, currentPath)
}

// 根据ID查询当前path
export const getRenderSchemaPathById = (componentId) => {
  const [path] = findPathsToKey({
    obj: dataPool.schema,
    key: '$id',
    value: componentId,
  })
  return path
}

// 更新widget schema
export const updateWidgetSchema = _.debounce(($id, newSchema) => {
  const { parentPath } = getRenderSchemaPathById($id)
  _.update(dataPool.schema, parentPath, widgetParentSchema => {
    widgetParentSchema[$id] = {
      ...widgetParentSchema[$id],
      ...newSchema,
      'x-component-props': {
        ...widgetParentSchema[$id]['x-component-props'],
        ...newSchema['x-component-props']
      }
    }
    return widgetParentSchema
  })

  forceUpdate()
}, 500)

// 根据widget id / name查询当前设置schema
export const getWidgetSettingSchema = (idOrName) => {
  const name = getWidgetName(idOrName)
  return dataPool.widgetConfigs[name].settingSchema
}


// schema深度路径查找
export function findPathsToKey(options) {
  let results = []

  ;(function findKey({ obj, key, value, pathToKey }) {
    const oldPath = `${pathToKey ? pathToKey + '.' : ''}`
    if (obj && obj.hasOwnProperty(key) && obj[key] === value) {
      results.push(`${oldPath}${key}`)
      return
    }

    if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const k in obj) {
        // 跳过
        if (['$add'].includes(k)) {
          return
        }

        if (obj.hasOwnProperty(k)) {
          if (Array.isArray(obj[k])) {
            for (let j = 0; j < obj[k].length; j++) {
              findKey({
                obj: obj[k][j],
                key,
                value,
                pathToKey: `${oldPath}${k}[${j}]`,
              })
            }
          }

          if (obj[k] !== null && typeof obj[k] === 'object') {
            findKey({ obj: obj[k], key, value, pathToKey: `${oldPath}${k}` })
          }
        }
      }
    }
  })(options)

  return results.map(path => {
    const pathArray = path.split('.')
    pathArray.pop()
    const currentPath = pathArray.join('.')
    const currentKey = pathArray.pop()
    const parentPath = pathArray.join('.')
    pathArray.pop()
    if (pathArray[pathArray.length - 1] === '$slot') pathArray.pop()
    const parentFieldPath = pathArray.join('.')
    const pathArrayLen = pathArray.length
    const parentKey = pathArray[pathArrayLen - 1]
    const parentComponent = parentKey ? parentKey.split('_')[0] : ''
    return {
      currentKey,
      currentPath,
      parentPath,
      parentFieldPath,
      parentKey,
      parentComponent,
    }
  })
}