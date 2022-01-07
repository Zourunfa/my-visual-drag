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

    return () => {
      return (
        <div class="visual-editor-block" style={styles.value}>
          这个是一个block
        </div>
      );
    };
  },
});
