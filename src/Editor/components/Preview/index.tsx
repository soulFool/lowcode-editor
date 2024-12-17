import React from 'react'
import { message } from 'antd'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import type { Component } from '../../stores/components'
import type { GoToLinkConfig } from '../Setting/actions/GoToLink'
import type { ShowMessageConfig } from '../Setting/actions/ShowMessage'

export function Preview() {
  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  function handleEvent(component: Component) {
    const props: Record<string, any> = {}

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name]

      if (eventConfig) {
        props[event.name] = () => {
          eventConfig?.actions.forEach(
            (action: GoToLinkConfig | ShowMessageConfig) => {
              if (action.type === 'goToLink' && action.url) {
                window.location.href = action.url
              } else if (action.type === 'showMessage' && action.config) {
                if (action.config.type === 'success') {
                  message.success(action.config.text)
                } else if (action.config.type === 'error') {
                  message.error(action.config.text)
                }
              }
            }
          )
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
