import { model } from '@formily/reactive'
import { isObject } from '@fundam/shared'
import _, { cloneDeep } from 'lodash'
import { generateWidgetId } from '../utils'

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
export const getRenderSchemaPathById = (widgetId) => {
  const [path] = findPathsToKey({
    obj: dataPool.schema,
    key: '$id',
    value: widgetId,
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
      'x-widget-props': {
        ...widgetParentSchema[$id]['x-widget-props'],
        ...newSchema['x-widget-props']
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

//
export const recursiveSearch = (parentId) => {
  let cacheParent // 缓存父级：用于处理多层嵌套的子级，如：Card_io9ZlN.$slot.extra.Button_2qyuA1
  const recursive = (schema) => {
    if (schema.$id) {
      // 组件schema描述的第一层
      cacheParent = schema
    }

    // 组件schema描述非第一层，如：Widget.properties，Widget.$slot.extra
    if (schema[parentId]) return {
      parent: cacheParent,
      current: schema[parentId]
    }

    // 遍历每一个属性
    for (const key in schema) {
      if (!isObject(schema[key])) continue

      const res = recursive(schema[key])
      if (!res) continue
      return res
    }

    // 用于上面for循环判断
    return
  }

  return recursive(dataPool.schema)
}

export const getSlotKeyByPath = (currentPath) => {
  const pathArray = currentPath.split('.')
  const pathArrayLen = pathArray.length
  if (pathArray[pathArrayLen - 3] === '$slot') {
    return pathArray[pathArrayLen - 2]
  }
  return '' // 非slot
}

// 获取操作的父级schema - properties、$slot.xx 等
export const getOperateSchema = (parentSchema, $slotKey = '') => {
  if ($slotKey) {
    // 加入到$slot里面
    return parentSchema.$slot[$slotKey]
  }
  // 默认加入到 properties
  return parentSchema.properties
}

// schema操作 - 添加
export const schemaOperateAdd = (schema, siblingId, addSchema, position: 'up' | 'down') => {
  const newSchema = {}
  // properties / $slot.xxx 里面一级key都是 $id （组件ID）
  Object.keys(schema).forEach(id => {
    if (siblingId !== id) {
      newSchema[id] = schema[id]
      return
    }
    // 定位到放置的组件，区分放置位置
    if (position === 'up') {
      // 允许一次性添加多个组件
      Object.keys(addSchema).forEach(addSchemaId => {
        newSchema[addSchemaId] = addSchema[addSchemaId]
      })
      newSchema[id] = schema[id]
    } else {
      newSchema[id] = schema[id]
      Object.keys(addSchema).forEach(addSchemaId => {
        newSchema[addSchemaId] = addSchema[addSchemaId]
      })
    }
  })

  return newSchema
}

// 添加组件通过边缘线
export const addWidgetByLine = (widget, siblingId, position: 'up' | 'down') => {
  const { name, title, defaultSchema, settingSchema } = cloneDeep(widget)
  const { parent } = recursiveSearch(siblingId)
  const { currentPath } = getRenderSchemaPathById(siblingId)

  const $slotKey = getSlotKeyByPath(currentPath)
  const $id = generateWidgetId(name)
  const operateSchema = getOperateSchema(parent, $slotKey)
  const newSchemaPart = schemaOperateAdd(operateSchema, siblingId, {
    [$id]: {
      ...defaultSchema,
      $id,
    }
  }, position)

  if ($slotKey) {
    parent.$slot[$slotKey] = newSchemaPart
  } else {
    parent.properties = newSchemaPart
  }

  forceUpdate()
}

// 通过边缘线上下移动widget
export const moveWidgetByLine = (widget, siblingId, position: 'up' | 'down') => {
  const { $id, name, title, defaultSchema, settingSchema } = cloneDeep(widget)
  // 放到自己上
  if ($id === siblingId) return
  const { parentPath } = getRenderSchemaPathById($id)
  let widgetSchema
  // 删除原有组件
  _.update(dataPool.schema, parentPath, widgetParentSchema => {
    widgetSchema = { ...widgetParentSchema[$id] }
    delete widgetParentSchema[$id]
    return widgetParentSchema
  })

  const { parent } = recursiveSearch(siblingId)
  const { currentPath } = getRenderSchemaPathById(siblingId)

  const $slotKey = getSlotKeyByPath(currentPath)
  const operateSchema = getOperateSchema(parent, $slotKey)
  const newSchemaPart = schemaOperateAdd(operateSchema, siblingId, {
    [$id]: widgetSchema
  }, position)

  if ($slotKey) {
    parent.$slot[$slotKey] = newSchemaPart
  } else {
    parent.properties = newSchemaPart
  }

  forceUpdate()
}

// 添加组件
export const addWidgetBySection = (widget, parentId, $slotKey = '') => {
  const { name, title, defaultSchema, settingSchema } = cloneDeep(widget)
  const { parent, current } = recursiveSearch(parentId)
  const $id = generateWidgetId(name)
  if ($slotKey) {
    current.$slot[$slotKey] = {
      ...current.$slot[$slotKey],
      [$id]: {
        ...defaultSchema,
        $id
      }
    }
  } else {
    current.properties = {
      ...current.properties,
      [$id]: {
        ...defaultSchema,
        $id
      }
    }
  }

  forceUpdate()
}

// 移动组件
export const moveWidgetBySection = (widget, parentId, $slotKey = '') => {
  const { $id, name, title, defaultSchema, settingSchema } = cloneDeep(widget)
  // 放到自己上
  if ($id === parentId) return
  const { parentPath } = getRenderSchemaPathById($id)
  let widgetSchema
  // 删除原有组件
  _.update(dataPool.schema, parentPath, widgetParentSchema => {
    widgetSchema = { ...widgetParentSchema[$id] }
    delete widgetParentSchema[$id]
    return widgetParentSchema
  })

  const { current } = recursiveSearch(parentId)

  if ($slotKey) {
    current.$slot[$slotKey] = {
      ...current.$slot[$slotKey],
      [$id]: widgetSchema
    }
  } else {
    current.properties = {
      ...current.properties,
      [$id]: widgetSchema
    }
  }

  forceUpdate()
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
    const parentWidget = parentKey ? parentKey.split('_')[0] : ''
    return {
      currentKey,
      currentPath,
      parentPath,
      parentFieldPath,
      parentKey,
      parentWidget,
    }
  })
}
