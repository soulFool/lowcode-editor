import { useDrop } from 'react-dnd'
import { useComponentsStore } from '../stores/components'
import { useComponentConfigStore } from '../stores/component-config'

export function useMaterialDrop(accept: string[], id: number) {
  const { addComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [{ canDrop }, drop] = useDrop(() => ({
    // 指定接收的 type
    accept,
    drop: (item: { type: string }, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }

      const props = componentConfig[item.type].defaultProps

      addComponent(
        {
          id: new Date().getTime(),
          name: item.type,
          props,
        },
        id
      )
    },
    collect: (monitor) => ({
      // border 的高亮状态
      canDrop: monitor.canDrop(),
    }),
  }))

  return { canDrop, drop }
}