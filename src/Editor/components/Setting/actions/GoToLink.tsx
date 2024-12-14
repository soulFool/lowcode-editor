import { Input } from 'antd'
import { useComponentsStore } from '../../../stores/components'
import type { ComponentEvent } from '../../../stores/component-config'

export function GoToLink(props: { event: ComponentEvent }) {
  const { event } = props

  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore()

  function urlChange(eventName: string, value: string) {
    if (!curComponentId) return

    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        url: value,
      },
    })
  }

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>链接</div>
        <div>
          <Input
            onChange={(e) => {
              urlChange(event.name, e.target.value)
            }}
            value={curComponent?.props?.[event.name]?.url}
          />
        </div>
      </div>
    </div>
  )
}