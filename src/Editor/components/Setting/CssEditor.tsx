import { useEffect, useRef } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import type { EditorProps, OnMount } from '@monaco-editor/react'

export interface EditorFile {
  name: string
  value: string
  language: string
}

interface Props {
  value: string
  onChange?: EditorProps['onChange']
  options?: editor.IStandaloneEditorConstructionOptions
}

export default function CssEditor(props: Props) {
  const { value, onChange, options } = props

  // 编辑器加载完的回调
  const handleEditorMount: OnMount = (editor, monaco) => {
    // 添加快捷键的交互（Ctrl + J 进行格式化）
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
  }

  return (
    <MonacoEditor
      height={'100%'}
      path="component.css"
      language="css"
      onMount={handleEditorMount}
      onChange={onChange}
      value={value}
      options={{
        fontSize: 14,
        // 到了最后一行之后是否依然可以滚动一屏
        scrollBeyondLastLine: false,
        // 缩略图
        minimap: {
          enabled: false,
        },
        // 设置横向纵向滚动条宽度
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options,
      }}
    />
  )
}
