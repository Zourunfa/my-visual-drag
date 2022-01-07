import { PropType } from 'vue'

interface editorBlockData {
  componentKey: string, //作为映射componentMap中的key
  top: number, //在container里面的位置
  left: number,
  adjustPosition: boolean, //是否需要做位置调整
  focus: boolean
}


interface editorType {
  container: {
    width: number,
    height: number
  },
  blocks?: editorBlockData[]
}

const editorProps = () => ({
  modelValue: {
    type: Object as PropType<editorType>,
    required: true
  },
  config: {
    type: Object as PropType<EditorConfig>,
    required: true
  }
})

interface EditorComponent {
  key: string,
  label: string,
  preview: () => JSX.Element,
  render: () => JSX.Element
}

export function createEditorConfig() {
  // componentList会在左边的组件列表渲染
  const componentList: EditorComponent[] = []
  // componentMap可以 根据key取到对应的组件
  const componentMap: Record<string, EditorComponent> = {}
  // Exclude取差集 左边的类型-右边的类型
  return {
    componentList,
    componentMap,
    registry: (key: string, component: Omit<EditorComponent, 'key'>) => {
      // 注册组件
      let comp = { ...component, key }
      componentList.push(comp)
      componentMap[key] = comp
    }
  }
}
// ReturnType<T> -- 获取函数返回值类型。
type EditorConfig = ReturnType<typeof createEditorConfig>



const EditorBlockType = () => (
  {
    block: {
      type: Object as PropType<editorBlockData>,
      require: true
    },
    config: {
      type: Object as PropType<EditorConfig>,
      require: true
    }
  })

export { editorBlockData, EditorComponent, editorProps, editorType, EditorBlockType }