import { computed, defineComponent } from 'vue';
import { EditorBlockType } from './types';

const props = EditorBlockType();
export default defineComponent({
  name: 'VisualEditorBlock',
  props: props,
  setup(props, { emit }) {
    const styles = computed(() => {
      return {
        top: `${props.block!.top}px`,
        left: `${props.block!.left}px`,
      };
    });

    console.log('props block.componentkey', props.block?.componentKey);

    const component = props.config?.componentMap[props.block!.componentKey];

    return () => {
      return (
        <div class="visual-editor-block" style={styles.value}>
          {component?.render()}
        </div>
      );
    };
  },
});
