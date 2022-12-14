---
title: 基础事例
nav:
  title: 编辑器
  order: 1
group
  title: 基本使用
  order: 1
---

## 编辑器 - 基本使用

```jsx
import React, { useEffect, useMemo } from 'react'
import Editor from '@fundam/editor'

export default () => {
  const widgetConfigs = [
    {
      title: '卡片',
      name: 'Card',
      defaultSchema: {},
      settingSchema: {}
    }
  ]
  
  return <Editor widgetConfigs={widgetConfigs} />
}
```