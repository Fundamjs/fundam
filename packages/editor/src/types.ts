import { JsonSchema } from '@fundam/shared'

export type WidgetConfig = {
  title: string, // 组件中文名称，如：输入框
  name: string, // 组件英文名，如：Input
  defaultSchema: JsonSchema // 渲染组件的默认Schema
  settingSchema: JsonSchema // 设置该组件的表单schema
}
