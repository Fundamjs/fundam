import React from 'react'
import { ReactFC } from '@formily/react'
import { useDrag } from 'react-dnd'

import { WidgetConfig } from '../../types'
import './widgetList.less'

export interface WidgetListProps {
  widgetConfigs: Array<WidgetConfig>
}

const WidgetItem = (props) => {
  const { title, name, defaultSchema, settingSchema } = props.config
  const [{ isDragging }, dragRef] = useDrag({
    type: 'Widget',
    item: props.config,
    end: (item, monitor) => {

    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  return (
    <div className="widget-list-item" style={{ opacity: isDragging ? 0.4 : 1 }} ref={dragRef}>{title}</div>
  )
}

const WidgetList: ReactFC<WidgetListProps> = (props) => {
  const { widgetConfigs } = props
  const widgetConfigValues = Object.values(widgetConfigs)

  return (
    <div className="widget-list">
      <div className="title">组件列表</div>
      <div className="list">
        {
          widgetConfigValues.map(item => <WidgetItem config={item} key={item.name} />)
        }
      </div>
    </div>
  )
}

export default WidgetList
