import React from 'react'
import { message } from 'antd'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import type { Component } from '../../stores/components'

export function Preview() {
  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  function handleEvent(component: Component) {
    const props: Record<string, any> = {}

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name]

      if (eventConfig) {
        const { type } = eventConfig

        props[event.name] = () => {
          if (type === 'goToLink' && eventConfig.url) {
            window.location.href = eventConfig.url
          } else if (type === 'showMessage' && eventConfig.config) {
            if (eventConfig.config.type === 'success') {
              message.success(eventConfig.config.text)
            } else if (eventConfig.config.type === 'error') {
              message.error(eventConfig.config.text)
            }
          }
        }
      }
    })

    return props
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component) => {
      const config = componentConfig[component.name]

      if (!config.prod) {
        return null
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      )
    })
  }

  return <div>{renderComponents(components)}</div>
}
