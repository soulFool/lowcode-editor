import { useMaterialDrop } from '../../hooks/useMaterialDrop'
import type { CommonComponentProps } from '../../interface'

function Page({ id, children, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(
    ['Button', 'Container', 'Modal'],
    id
  )

  return (
    <div
      data-component-id={id}
      ref={drop}
      className="p-[20px] h-[100%] box-border"
      style={{ ...styles, border: canDrop ? '2px solid blue' : 'none' }}
    >
      {children}
    </div>
  )
}

export default Page
