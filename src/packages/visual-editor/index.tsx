import { useModel } from '@/hooks/useModel';
import { computed, defineComponent, ref } from 'vue';
import './index.scss';
import { EditorComponent, editorProps, editorType } from './types';
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
    // containerRef监听移动过程变化
    const containerRef = ref({} as HTMLDivElement);
    const menuDragger = (() => {
      let component = null as null | EditorComponent;

      const blockHandler = {
        dragstart: (e: DragEvent, current: EditorComponent) => {
          // 处理菜单组件拖拽进入容器的时候设置鼠标的可放置状态
          containerRef.value.addEventListener(
            'dragenter',
            containerHanlder.dragenter,
          );
          containerRef.value.addEventListener(
            'dragover',
            containerHanlder.dragover,
          );
          containerRef.value.addEventListener(
            'dragleave',
            containerHanlder.dragleave,
          );
          containerRef.value.addEventListener('drop', containerHanlder.drop);
          component = current;
        },
        dragend: (e: DragEvent) => {
          // 拖拽结束后移除监听事件，减少内存使用
          containerRef.value.removeEventListener(
            'dragenter',
            containerHanlder.dragenter,
          );
          containerRef.value.removeEventListener(
            'dragover',
            containerHanlder.dragover,
          );
          containerRef.value.removeEventListener(
            'dragleave',
            containerHanlder.dragleave,
          );
          containerRef.value.removeEventListener('drop', containerHanlder.drop);
          component = null;
        },
      };

      let containerHanlder = {
        dragenter: (e: DragEvent) => {
          // 当菜单组件将要进入container时，设置鼠标为可放置状态
          e.dataTransfer!.dropEffect = 'move';
        },
        dragover: (e: DragEvent) => {
          // 当菜单组件在container里面移动时，禁用默认事件，如果不禁用事件，没发触发drop事件
          e.preventDefault();
        },

        dragleave: (e: DragEvent) => {
          // 如果离开container 那么设置其不可放置在外面
          e.dataTransfer!.dropEffect = 'none';
        },

        drop: (e: DragEvent) => {
          // 放置在容器之后，处理相关组件的放置信息
          console.log(component);

          const blocks = dataModel.value?.blocks || [];
          blocks.push({
            componentKey: component!.key,
            top: e.offsetY,
            left: e.offsetX,
          });

          dataModel.value = {
            ...dataModel.value,
            blocks,
          } as editorType;
        },
      };

      return blockHandler;
    })();

    const renderMenuList = () => {
      return props.config?.componentList.map((component) => {
        return (
          <div
            class="visual-editor-menu-item"
            draggable
            onDragend={menuDragger.dragend}
            onDragstart={(e) => menuDragger.dragstart(e, component)}
          >
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
              config={props.config}
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
              <div
                class="visual-editor-container"
                ref={containerRef}
                style={containerStyle.value}
              >
                {renderBlock()}
              </div>
            </div>
          </div>
        </div>
      );
    };
  },
});
