export const stringInput = (title: string, defaultValue?: string, mergeSchema?: Record<string, any>, mergeProps?: Record<string, any>) => ({
  title,
  type: 'string',
  default: defaultValue,
  'x-component': 'Input',
  'x-decorator': 'FormItem',
  'x-component-props': {
    placeholder: '请输入',
    ...mergeProps
  },
  ...mergeSchema,
})

export const numberInput = (title: string, defaultValue?: string, mergeSchema?: Record<string, any>, mergeProps?: Record<string, any>) => ({
  title,
  type: 'number',
  default: defaultValue,
  'x-decorator': 'FormItem',
  'x-component': 'NumberPicker',
  'x-component-props': {
    placeholder: '请输入',
    ...mergeProps
  },
  ...mergeSchema
})

export const booleanSwitch = (title: string, defaultValue?: boolean, mergeSchema?: Record<string, any>, mergeProps?: Record<string, any>) => ({
  title,
  type: 'boolean',
  default: defaultValue,
  'x-decorator': 'FormItem',
  'x-component': 'Switch',
  'x-component-props': {
    placeholder: '请输入',
    ...mergeProps
  },
  ...mergeSchema
})

export const defaultInputVarious = (title: string = '默认值') => ({
  title,
  type: 'string',
  'x-component': 'InputVarious',
  'x-decorator': 'FormItem',
  'x-component-props': {
    placeholder: '请输入'
  }
})

export const stringSelect = (title: string, defaultValue?: string, mergeSchema?: Record<string, any>, mergeProps?: Record<string, any>) => ({
  title,
  type: 'string',
  default: defaultValue,
  'x-component': 'Select',
  'x-decorator': 'FormItem',
  'x-component-props': {
    placeholder: '请输入',
    ...mergeProps
  },
  ...mergeSchema
})
