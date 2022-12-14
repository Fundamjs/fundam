import React, { useMemo } from 'react'
import { ReactFC } from '@formily/react'
import { createForm, onFormValuesChange, onFormMount } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { observer } from '@formily/reactive-react'
import {
  ArrayBase,
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTable,
  ArrayTabs, Cascader, Checkbox, DatePicker, Editable,
  Form, FormButtonGroup, FormCollapse, FormGrid,
  FormItem, FormLayout, FormStep, FormTab, Input, NumberPicker, Password, PreviewText, Radio, Reset,
  Select, Space, Submit, Switch, TimePicker, Transfer, TreeSelect, Upload
} from '@formily/antd'

import { dataPool, getWidgetSchema, getWidgetSettingSchema, updateWidgetSchema } from '../../models/dataPool'
import './widgetSetting.less'

export interface WidgetSettingProps {}

const WidgetSetting: ReactFC<WidgetSettingProps> = observer((props) => {
  const { selectWidgetId } = dataPool

  const form = useMemo(() => createForm({
    effects() {
      onFormMount(() => {
        if (!selectWidgetId) return
        const currentSchema = getWidgetSchema(selectWidgetId)
        form.setInitialValues({
          ...currentSchema,
          'x-component-props': {
            ...currentSchema['x-component-props']
          }
        })
      })
      onFormValuesChange((form) => {
        if (!selectWidgetId) return
        updateWidgetSchema(selectWidgetId, form.values)
      })
    }
  }), [selectWidgetId])
  const SchemaField = createSchemaField({
    components: {
      ArrayBase,
      ArrayTable,
      ArrayTabs,
      ArrayCards,
      ArrayCollapse,
      ArrayItems,
      Form,
      FormItem,
      FormLayout,
      FormStep,
      FormGrid,
      FormTab,
      FormCollapse,
      FormButtonGroup,
      Input,
      Password,
      Cascader,
      Space,
      PreviewText,
      Radio,
      Checkbox,
      Select,
      TreeSelect,
      Transfer,
      DatePicker,
      TimePicker,
      NumberPicker,
      Switch,
      Upload,
      Submit,
      Reset,
      Editable,
      // ...widgets
    },
  })
  const settingSchema = {
    type: 'object',
    properties: getWidgetSettingSchema[selectWidgetId]
  }

  return (
    <div className="widget-setting">
      <div className="widget-setting-title">属性</div>
      <Form form={form}>
        <SchemaField schema={settingSchema}/>
      </Form>
    </div>
  )
})

export default WidgetSetting
