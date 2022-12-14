import React from 'react'
import { ReactFC } from '@formily/react'
import { useDrop } from 'react-dnd'

import './index.less'
import { addWidgetBySection, moveWidgetBySection } from '../../models/dataPool'

export interface DropSectionProps {
  $id: string // 组件唯一ID
  $slot?: string,
  style?: React.CSSProperties
}

const hoverStyle = {
  backgroundColor: 'rgba(24, 144, 255, 0.4)'
}

const DropSection: ReactFC<DropSectionProps> = (props) => {
  const { $id, $slot, style } = props

  const [collectProps, dropRef] = useDrop({
    accept: 'Component',
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop()
      // 父层级过滤
      if (didDrop) return
      if (item.$id) {
        // 已有组件（item中包含 $id） 位置移动
        moveWidgetBySection(item, $id, $slot)
      } else {
        // 新增组件
        addWidgetBySection(item, $id, $slot)
      }

      return {
        item,
        monitor
      }
    },
    hover: (item, monitor) => {},
    // 返回值 给 collectProps
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(), // 不区分层级
      isOverCurrent: monitor.isOver({ shallow: true }), // 区分层级
    })
  })

  const currentStyle = collectProps.isOverCurrent ? hoverStyle : {}

  return (
    <div className="drop-section" style={{ ...style, ...currentStyle }} ref={dropRef}>
      {props.children}
    </div>
  )
}

export default DropSection
