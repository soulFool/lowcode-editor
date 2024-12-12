import React from 'react'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import type { Component } from '../../stores/components'

export function EditArea() {
  const { components } = useComponentsStore()
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
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      )
    })
  }

  return <div className="h-[100%]">{renderComponents(components)}</div>
}
