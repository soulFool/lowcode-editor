import { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { debounce } from 'lodash-es'
import styleToObject from 'style-to-object'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import CssEditor from './CssEditor'
import type { CSSProperties } from 'react'
import type { ComponentSetter } from '../../stores/component-config'

export function ComponentStyle() {
  const [form] = Form.useForm()

  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [css, setCss] = useState<string>(`.comp{\n\n}`)

  useEffect(() => {
    form.resetFields()

    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.styles })

    setCss(toCSSStr(curComponent?.styles!))
  }, [curComponent])

  // 拼接 css 字符串
  function toCSSStr(css: Record<string, any>) {
    let str = `.comp {\n`
    for (const key in css) {
      let value = css[key]
      if (!value) {
        continue
      }
      if (
        ['width', 'height'].includes(key) &&
        !value.toString().endsWith('px')
      ) {
        value += 'px'
      }

      str += `\t${key}: ${value};\n`
    }
    str += '}'
    return str
  }

  if (!curComponentId || !curComponent) return null

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting

    switch (type) {
      case 'select':
        return <Select options={options} />
      case 'input':
        return <Input />
      case 'inputNumber':
        return <InputNumber />
    }
  }

  function valueChange(changeValues: CSSProperties) {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues)
    }
  }

  const handleEditorChange = debounce((value) => {
    setCss(value)

    let css: Record<string, any> = {}

    try {
      const cssStr = value
        .replace(/\/\*.*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉 .comp
        .replace('}', '') // 去掉 }

      styleToObject(cssStr, (name, value) => {
        // 将 - 变成小驼峰
        css[
          name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))
        ] = value
      })

      updateComponentStyles(
        curComponentId,
        { ...form.getFieldsValue(), ...css },
        true
      )
    } catch (e) {}
  }, 500)

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {componentConfig[curComponent.name].stylesSetter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
      <div className="h-[200px] border-[1px] border-[#ccc]">
        <CssEditor value={css} onChange={handleEditorChange} />
      </div>
    </Form>
  )
}
