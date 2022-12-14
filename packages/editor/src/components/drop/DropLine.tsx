import React from 'react'
import { ReactFC } from '@formily/react'
import { useDrop } from 'react-dnd'

import './dropLine.less'
import { addWidgetByLine, addWidgetBySection, moveWidgetByLine } from '../../models/dataPool'

export interface DropLineProps {
  $id: string // 兄弟组件唯一ID
  position: 'up' | 'down' // 放置的位置：兄弟组件的上方、兄弟组件的下方
  width: number | string,
  style?: React.CSSProperties
}

const hoverStyle = {
  borderBottom: '2px solid red'
}

const DropLine: ReactFC<DropLineProps> = (props) => {
  const { $id, position, width, style = {} } = props
  const [collectProps, dropRef] = useDrop({
    accept: 'Component',
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop()
      // 父层级过滤
      if (didDrop) return
      if (item.$id) {
        // 已有组件（item包含$id） 位置移动
        moveWidgetByLine(item, $id, position)
      } else {
        // 新增组件 添加组件到schema，并重新渲染
        addWidgetByLine(item, $id, position)
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

  const currentStyle: any = {}
  if (position === 'up') {
    currentStyle.top = 0
  } else {
    currentStyle.bottom = 0
  }
  if (collectProps.isOverCurrent) {
    if (position === 'up') {
      currentStyle.borderTop = '4px solid red'
    } else {
      currentStyle.borderBottom = '4px solid red'
    }
  }

  return (
    <div className="drop-line" style={{ width, ...style, ...currentStyle }} ref={dropRef} />
  )
}

export default DropLine
