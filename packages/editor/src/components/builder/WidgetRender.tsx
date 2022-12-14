import React, { ReactElement, useMemo, useEffect } from 'react'
import { ReactFC } from '@formily/react'
import { observer } from '@formily/reactive-react'
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
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
import { JsonSchema } from '@fundam/shared'

import { dataPool, setWidgetConfigs, initSchema } from '../../models/dataPool'
import { WidgetConfig } from '../../types'
import './widgetRender.less'

export interface WidgetRenderProps {
  widgetConfigs: Array<WidgetConfig>,
  widgets?: Record<string, ReactElement>,
  initialSchema?: JsonSchema
}

const WidgetRender: ReactFC<WidgetRenderProps> = observer((props) => {
  const { schemaUpdateTime, schema: dataPoolSchema } = dataPool
  const {
    widgetConfigs,
    widgets = {},
    initialSchema = {
      type: 'object',
      properties: {
        Page_a24Esq: {
          $id: 'Page_a24Esq',
          $alias: 'page',
          type: 'void',
          'x-component': 'Page',
          'x-component-props': {},
          properties: {}
        }
      }
    }
  } = props
  const form = useMemo(() => createForm(), [schemaUpdateTime])
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
      ...widgets
    }
  })

  useEffect(() => {
    setWidgetConfigs(widgetConfigs)
    initSchema(initialSchema)
    // @ts-ignore
    window.__DATA_POOL__ = dataPool
  }, [])

  return (
    <div className="widget-render">
      <Form form={form}>
        <SchemaField schema={dataPoolSchema || initialSchema} />
      </Form>
    </div>
  )
})

export default WidgetRender
