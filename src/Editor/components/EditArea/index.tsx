import React, { useState } from 'react'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import HoverMask from '../HoverMask'
import SelectedMask from '../SelectedMask'
import type { Component } from '../../stores/components'
import type { MouseEventHandler } from 'react'

export function EditArea() {
  const { components, curComponentId, setCurComponentId } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig[component.name]

      if (!(config && config.component)) {
        return null
      }

      return React.createElement(
        config.component,
        {
          id: component.id,
          key: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      )
    })
  }

  const [hoverComponentId, setHoverComponentId] = useState<number>()

  // mouseover 和 click 分别使用了 for 循环、closest，但是都是为了获取父节点的 componentId
  const handleMouseOver: MouseEventHandler = (e) => {
    const node = e.target as HTMLElement
    // Element.closest() 方法用来获取：匹配特定选择器且离当前元素最近的祖先元素（也可以是当前元素本身）。如果匹配不到，则返回 null。
    const target = node.closest('[data-component-id]') as HTMLElement
    if (target) {
      // const componentId = target.getAttribute('data-component-id')
      const componentId = target.dataset.componentId
      if (componentId) {
        setHoverComponentId(+componentId)
      }
    }
  }

  const handleClick: MouseEventHandler = (e) => {
    /**
     * 在React的事件对象中，nativeEvent 是一个指向原生DOM事件的引用。这个原生事件对象包含了浏览器提供的所有事件属性和方法
     * composedPath 是一个返回事件触发链（也称为“事件路径”）的方法。它返回一个数组，包含了从事件的目标节点开始，一直到文档的根节点（document 或 shadow root）的所有节点
     */
    const path = e.nativeEvent.composedPath()
    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement
      const componentId = ele.dataset.componentId
      if (componentId) {
        setCurComponentId(+componentId)
        return
      }
    }
  }

  return (
    <div
      className="edit-area h-[100%]"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoverComponentId(undefined)}
      onClick={handleClick}
    >
      {renderComponents(components)}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={hoverComponentId}
        />
      )}
      {curComponentId && (
        <SelectedMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={curComponentId}
        />
      )}
      <div className="portal-wrapper"></div>
    </div>
  )
}
