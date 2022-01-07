import { computed, defineComponent, onMounted, ref } from 'vue';
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
    const el = ref({} as HTMLDivElement);

    const classes = computed(() => [
      'visual-editor-block',
      {
        'visual-editor-block-focus': props.block?.focus,
      },
    ]);

    onMounted(() => {
      // 调整鼠标最后拖拽放置时的位置
      const block = props.block;
      if (block?.adjustPosition == true) {
        const { offsetWidth, offsetHeight } = el.value;
        block.left = block.left - offsetWidth / 2;
        block.top = block.top - offsetHeight / 2;
        block.adjustPosition = false;
      }
    });

    return () => {
      const component = props.config?.componentMap[props.block!.componentKey];
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {component?.render()}
        </div>
      );
    };
  },
});
