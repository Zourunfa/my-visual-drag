import { useModel } from '@/hooks/useModel';
import { defineComponent } from 'vue';
import './index.scss';
import { editorProps, editorType } from './types';

const props = editorProps();
export default defineComponent({
  name: 'VisualEditor',
  props: props,
  emits: {
    'update:modelValue': (val?: editorType) => true,
  },
  setup(props, { emit }) {
    const dataModel = useModel(
      () => props.modelValue,
      (val) => emit('update:modelValue', val),
    );
    console.log(dataModel);

    return () => {
      return (
        <div class="visual-editor">
          <div class="visual-editor-menu">visual-editor-menu</div>
          <div class="visual-editor-head">visual-editor-head</div>
          <div class="visual-editor-operator">visual-editor-operator</div>
          <div class="visual-editor-body">
            <div class="visual-editor-content">visual-editor-body</div>
          </div>
        </div>
      );
    };
  },
});
