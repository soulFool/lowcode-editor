import { create } from 'zustand'

export interface Component {
  id: number
  name: string
  props: any
  children?: Component[]
  parentId?: number
}

// 使用 children 属性连接起来的树形结构
interface State {
  components: Component[]
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void
  deleteComponent: (componentId: number) => void
  updateComponentProps: (componentId: number, props: any) => void
}

export const useComponentsStore = create<State & Action>((set, get) => ({
  components: [
    {
      id: 1,
      name: 'Page',
      props: {},
      desc: '页面',
    },
  ],
  // 新增传入 parentId，在这个节点下新增
  addComponent(component, parentId) {
    set((state) => {
      if (parentId) {
        // 查找 parentComponent
        const parentComponent = getComponentById(parentId, state.components)

        // 有 parentComponent 就放入 parentComponent 的 children, children 有值就 push，没值就创建一个数组放进去
        if (parentComponent) {
          if (parentComponent.children) {
            parentComponent.children.push(component)
          } else {
            parentComponent.children = [component]
          }
        }

        component.parentId = parentId
        return { components: [...state.components] }
      }
      return { components: [...state.components, component] }
    })
  },
  deleteComponent(componentId) {
    if (!componentId) return

    // 找到需要删除的 component
    const component = getComponentById(componentId, get().components)
    if (component?.parentId) {
      // 找到它的 parentComponent
      const parentComponent = getComponentById(
        component.parentId,
        get().components
      )

      if (parentComponent) {
        // 从 parentComponent 的 children 中移除
        parentComponent.children = parentComponent?.children?.filter(
          (item) => item.id !== +componentId
        )

        set({ components: [...get().components] })
      }
    }
  },
  updateComponentProps(componentId, props) {
    set((state) => {
      // 找到需要更新的 component
      const component = getComponentById(componentId, state.components)
      if (component) {
        component.props = { ...component.props, ...props }

        return { components: [...state.components] }
      }

      return { components: [...state.components] }
    })
  },
}))

// 根据 id 查找 component
export function getComponentById(
  id: number | null,
  components: Component[]
): Component | null {
  if (!id) return null

  for (const component of components) {
    if (component.id == id) return component

    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children)
      if (result !== null) return result
    }
  }

  return null
}
