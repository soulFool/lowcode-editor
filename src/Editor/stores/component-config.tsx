import { create } from 'zustand'
import PageDev from '../materials/Page/dev'
import ContainerDev from '../materials/Container/dev'
import ButtonDev from '../materials/Button/dev'
import PageProd from '../materials/Page/prod'
import ContainerProd from '../materials/Container/prod'
import ButtonProd from '../materials/Button/prod'
import ModalDev from '../materials/Modal/dev'
import ModalProd from '../materials/Modal/prod'

export interface ComponentSetter {
  /** 字段名 */
  name: string
  /** 文案 */
  label: string
  /** 表单类型 */
  type: string
  [key: string]: any
}

export interface ComponentEvent {
  name: string
  label: string
}

export interface ComponentMethod {
  name: string
  label: string
}

export interface ComponentConfig {
  name: string
  defaultProps: Record<string, any>
  desc: string
  setter?: ComponentSetter[]
  stylesSetter?: ComponentSetter[]
  events?: ComponentEvent[]
  methods?: ComponentMethod[]
  dev: any
  prod: any
}

interface State {
  componentConfig: { [key: string]: ComponentConfig }
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  //  compnent 名字和 Component 实例的映射
  componentConfig: {
    Page: {
      name: 'Page',
      defaultProps: {},
      desc: '页面',
      dev: PageDev,
      prod: PageProd,
    },
    Container: {
      name: 'Container',
      defaultProps: {},
      desc: '容器',
      dev: ContainerDev,
      prod: ContainerProd,
    },
    Button: {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      setter: [
        {
          name: 'type',
          label: '按钮类型',
          type: 'select',
          options: [
            { label: '主按钮', value: 'primary' },
            { label: '次按钮', value: 'default' },
          ],
        },
        {
          name: 'text',
          label: '文本',
          type: 'input',
        },
      ],
      stylesSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber',
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber',
        },
      ],
      events: [
        {
          name: 'onClick',
          label: '点击事件',
        },
        {
          name: 'onDoubleClick',
          label: '双击事件',
        },
      ],
      desc: '按钮',
      dev: ButtonDev,
      prod: ButtonProd,
    },
    Modal: {
      name: 'Modal',
      defaultProps: {
        title: '弹窗',
      },
      setter: [
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
      ],
      stylesSetter: [],
      events: [
        {
          name: 'onOk',
          label: '确认事件',
        },
        {
          name: 'onCancel',
          label: '取消事件',
        },
      ],
      methods: [
        {
          name: 'open',
          label: '打开弹窗',
        },
        {
          name: 'close',
          label: '关闭弹窗',
        },
      ],
      desc: '弹窗',
      dev: ModalDev,
      prod: ModalProd,
    },
  },
  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      }
    }),
}))
