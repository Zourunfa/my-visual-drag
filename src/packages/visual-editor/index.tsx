import { useModel } from '@/hooks/useModel';
import { computed, defineComponent } from 'vue';
import './index.scss';
import { editorProps, editorType } from './types';
import VisualEditorBlock from './visual-editor-block';

const props = editorProps();
export default defineComponent({
  name: 'VisualEditor',
  components: {
    VisualEditorBlock,
  },
  props: props,
  emits: {
    'update:modelValue': (val?: editorType) => true,
  },
  setup(props, { emit }) {
    const dataModel = useModel(
      () => props.modelValue,
      (val) => emit('update:modelValue', val),
    );

    console.log(props.config);

    const renderMenuList = () => {
      return props.config?.componentList.map((component) => {
        return (
          <div class="visual-editor-menu-item">
            <span class="visual-editor-menu-item-label">{component.label}</span>

            {component.preview()}
          </div>
        );
      });
    };

    const renderBlock = () => {
      return (
        !!dataModel.value &&
        !!dataModel.value.blocks &&
        dataModel.value.blocks.map((block, index) => {
          // console.log(block);

          return (
            <visual-editor-block
              block={block}
              key={index}
            ></visual-editor-block>
          );
        })
      );
    };

    const containerStyle = computed(() => {
      return {
        width: `${dataModel.value?.container.width}px`,
        height: `${dataModel.value?.container.height}px`,
      };
    });

    return () => {
      return (
        <div class="visual-editor">
          <div class="visual-editor-menu">{renderMenuList()}</div>
          <div class="visual-editor-head">visual-editor-head</div>
          <div class="visual-editor-operator">visual-editor-operator</div>
          <div class="visual-editor-body">
            <div class="visual-editor-content">
              <div class="visual-editor-container" style={containerStyle.value}>
                {renderBlock()}
              </div>
            </div>
          </div>
        </div>
      );
    };
  },
});
