import { useDrag } from 'react-dnd'

export interface MaterialItemProps {
  name: string
}

export function MaterialItem(props: MaterialItemProps) {
  const { name } = props

  const [_, drag] = useDrag({
    // type 是当前 drag 的元素的标识，drop 的时候根据这个来决定是否 accept
    type: name,
    item: {
      type: name,
    },
  })

  return (
    <div
      ref={drag}
      className="
        border-dashed
        border-[1px]
        border-[#000]
        py-[8px]
        px-[10px]
        m-[10px]
        cursor-move
        inline-block
        bg-white
        hover:bg-[#ccc]
      "
    >
      {name}
    </div>
  )
}