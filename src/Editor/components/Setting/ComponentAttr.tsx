import { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import type {
  ComponentConfig,
  ComponentSetter,
} from '../../stores/component-config'

export function ComponentAttr() {
  const [form] = Form.useForm()

  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  useEffect(() => {
    form.resetFields()

    // curComponent 变化的时候，把 props 设置到表单用于回显数据
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.props })
  }, [curComponent])

  // 没有选中组件的时候，返回 null
  if (!curComponentId || !curComponent) return null

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting

    switch (type) {
      case 'select':
        return <Select options={options} />
      case 'input':
        return <Input />
    }
  }

  function valueChange(changeValues: ComponentConfig) {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues)
    }
  }

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {componentConfig[curComponent.name].setter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
    </Form>
  )
}
