import { useModel } from '@/hooks/useModel';
import { buttonNativeType } from 'element-plus';
import { computed, defineComponent, ref } from 'vue';
import { useVisualCommnad } from '../plugins/ccommand-create';
import { createEvent } from '../plugins/event';
import './index.scss';
import {
  editorBlockData,
  EditorComponent,
  editorProps,
  editorType,
} from './types';
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
    // 双向绑定至，容器中的组件数据
    const dataModel = useModel(
      () => props.modelValue,
      (val) => emit('update:modelValue', val),
    );
    // containerRef监听移动过程变化
    const containerRef = ref({} as HTMLDivElement);

    // 一些用于container中拖拽的细节方法
    const methods = {
      clearFocus: (block?: editorBlockData) => {
        let blocks = dataModel.value!.blocks || [];
        if (blocks.length == 0) {
          return;
        }

        if (block) {
          blocks = blocks.filter((item) => item !== block);
        }
        blocks?.forEach((block) => (block.focus = false));
      },
      updateBlocks: (blocks: editorBlockData[]) => {
        return (dataModel.value = {
          container: dataModel.value!.container,
          blocks,
        });
      },
    };

    const dragstart = createEvent();
    const dragend = createEvent();

    // dragstart.on(() => {
    //   console.log('listen dragStart');
    // });
    // dragend.on(() => {
    //   console.log('listen dragend');
    // });

    // 菜单组件拖拽到container容器的功能
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

          dragstart.emit();
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
            adjustPosition: true,
            focus: false,
          });

          // dataModel.value = {
          //   ...dataModel.value,
          //   blocks,
          // } as editorType;

          methods.updateBlocks(blocks);
          dragend.emit();
        },
      };

      return blockHandler;
    })();

    // 计算选中和未选中的 block数据
    const focusData = computed(() => {
      let focus: editorBlockData[] = [];

      let unfocus: editorBlockData[] = [];

      (dataModel.value?.blocks || []).forEach((block) => {
        (block.focus ? focus : unfocus).push(block);
      });
      return {
        focus, //选中的数据
        unfocus,
      };
    });

    // 在容器中选中block组件的细节处理
    const focusHandler = (() => {
      return {
        container: {
          onMousedown: (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            // 点击空白处清空所有block
            methods.clearFocus();
          },
        },
        block: {
          onMousedown: (e: MouseEvent, block: editorBlockData) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.shiftKey) {
              // 支持按住shift可以多选
              if (focusData.value.focus.length <= 1) {
                block.focus = true;
              } else {
                //多选
                block.focus = !block.focus;
              }
            } else {
              if (!block.focus) {
                // 当block未被选中时，没有按住shift
                block.focus = true;
                methods.clearFocus(block);
              }
            }
            blockGragger.mousedown(e);
          },
        },
      };
    })();

    const blockGragger = (() => {
      let dragState = {
        startX: 0,
        startY: 0,
        startPos: [] as { left: number; top: number }[],
        dragging: false,
      };

      const mousedown = (e: MouseEvent) => {
        dragState = {
          startX: e.clientX,
          startY: e.clientY,
          startPos: focusData.value.focus.map(({ top, left }) => ({
            top,
            left,
          })),
          dragging: false,
        };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
      };

      const mousemove = (e: MouseEvent) => {
        const durX = e.clientX - dragState.startX;
        const durY = e.clientY - dragState.startY;
        console.log('mousemovue');

        if (!dragState.dragging) {
          // 当在move鼠标的时候，说明在拖拽，触发拖拽事件
          dragState.dragging = true;
          console.log('mousemove-draging');

          dragstart.emit();
        }
        focusData.value.focus.forEach((block, index) => {
          block.left = dragState.startPos[index].left + durX;
          block.top = dragState.startPos[index].top + durY;
        });
      };
      const mouseup = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        console.log('mouseup');

        if (dragState.dragging) {
          console.log('mouseup-dragging');

          dragend.emit();
        }
      };

      return { mousedown };
    })();

    const commander = useVisualCommnad({
      focusData,
      methods,
      dataModel,
      dragstart,
      dragend,
    });

    const buttons = [
      {
        label: '撤销',
        icon: 'icon-back',
        handler: commander.undo,
        tip: 'ctrl+z',
      },
      {
        label: '重做',
        icon: 'icon-forward',
        handler: commander.redo,
        tip: 'ctrl+y, ctrl+shift+z',
      },
      {
        label: '删除',
        icon: 'icon-delete',
        handler: () => commander.delete(),
        tip: 'ctrl+d, backspace, delete',
      },
    ];

    return () => {
      // 根据父级传过来的modelValue控制container的宽高
      const containerStyle = computed(() => {
        return {
          width: `${dataModel.value?.container.width}px`,
          height: `${dataModel.value?.container.height}px`,
        };
      });
      const renderMenuList = () => {
        return props.config?.componentList.map((component) => {
          return (
            <div
              class="visual-editor-menu-item"
              draggable
              onDragend={menuDragger.dragend}
              onDragstart={(e) => menuDragger.dragstart(e, component)}
            >
              <span class="visual-editor-menu-item-label">
                {component.label}
              </span>

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
                {...{
                  onMousedown: (e: MouseEvent) =>
                    focusHandler.block.onMousedown(e, block),
                }}
                block={block}
                key={index}
                config={props.config}
              ></visual-editor-block>
            );
          })
        );
      };

      const renderHead = () => {
        return buttons.map((btn, index) => {
          return (
            <div
              key={index}
              class="visual-editor-head-button"
              onClick={btn.handler}
            >
              <i class={`iconfont ${btn.icon}`}></i>
              <span>{btn.label}</span>
            </div>
          );
        });
      };

      return (
        <div class="visual-editor">
          <div class="visual-editor-menu">{renderMenuList()}</div>
          <div class="visual-editor-head">{renderHead()}</div>
          <div class="visual-editor-operator">visual-editor-operator</div>
          <div class="visual-editor-body">
            <div class="visual-editor-content">
              <div
                class="visual-editor-container"
                {...focusHandler.container}
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
