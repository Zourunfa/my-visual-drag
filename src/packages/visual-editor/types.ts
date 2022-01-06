import { PropType } from 'vue'

interface editorBlockData {
  top: number,
  left: number
}

interface editorType {
  container: {
    width: number,
    height: number
  },
  blocks: editorBlockData[]
}

const editorProps = () => ({
  modelValue: {
    type: Object as PropType<editorType>
  }
})

export { editorProps, editorType }