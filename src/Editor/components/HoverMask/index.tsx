import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { getComponentById, useComponentsStore } from '../../stores/components'

interface HoverMaskProps {
  portalWrapperClassName: string
  containerClassName: string
  componentId: number
}

// containerClassName 是画布区的根元素的 className, componentId 是 hover 的组件 id
function HoverMask({
  portalWrapperClassName,
  containerClassName,
  componentId,
}: HoverMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  })

  const { components } = useComponentsStore()

  useEffect(() => {
    updatePosition()
  }, [componentId])

  // 解决 delete 组件后会触发它父组件的 hover，但这时候高亮框的高度是没删除元素的高度，会多出一块的问题
  useEffect(() => {
    updatePosition()
  }, [components])

  function updatePosition() {
    if (!componentId) return

    const container = document.querySelector(`.${containerClassName}`)
    if (!container) return

    const node = document.querySelector(`[data-component-id="${componentId}"]`)
    if (!node) return

    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect()

    let labelTop = top - containerTop + container.scrollTop
    let labelLeft = left - containerLeft + width

    if (labelTop <= 0) {
      labelTop -= -20
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollLeft,
      width,
      height,
      labelTop,
      labelLeft,
    })
  }

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!
  }, [])

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components)
  }, [componentId])

  return createPortal(
    <>
      <div
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          backgroundColor: 'rgba(0, 0, 255, 0.05)',
          border: '1px dashed blue',
          // 除了指示该元素不是鼠标事件的目标之外，值none表示鼠标事件“穿透”该元素并且指定该元素“下面”的任何东西。
          pointerEvents: 'none',
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: '14px',
          zIndex: 13,
          display: !position.width || position.width < 10 ? 'none' : 'inline',
          transform: 'translate(-100%, -100%)',
        }}
      >
        <div
          style={{
            padding: '0 8px',
            backgroundColor: 'blue',
            borderRadius: 4,
            color: '#fff',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {curComponent?.desc}
        </div>
      </div>
    </>,
    el
  )
}

export default HoverMask
