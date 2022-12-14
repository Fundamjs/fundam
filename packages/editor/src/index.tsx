import React, { useMemo, useEffect, ReactElement } from 'react'
import { ReactFC } from '@formily/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { JsonSchema } from '@fundam/shared'

import './index.less'
import { WidgetConfig } from './types'
import WidgetList from './components/builder/WidgetList'
import WidgetRender from './components/builder/WidgetRender'
import WidgetSetting from './components/builder/WidgetSetting'

export interface EditorProps {
  widgetConfigs: Array<WidgetConfig>
  widgets?: Record<string, ReactElement>
  initialSchema?: JsonSchema
  style?: React.CSSProperties
}

const Editor: ReactFC<EditorProps> = props => {
  const {
    widgetConfigs,
    widgets,
    initialSchema,
    style = {}
  } = props

  return (
    <div className="fundam-editor" style={style}>
      <DndProvider backend={HTML5Backend}>
        <WidgetList widgetConfigs={widgetConfigs} />
        <WidgetRender widgets={widgets} widgetConfigs={widgetConfigs} initialSchema={initialSchema} />
        <WidgetSetting />
      </DndProvider>
    </div>
  )
}

export default Editor
