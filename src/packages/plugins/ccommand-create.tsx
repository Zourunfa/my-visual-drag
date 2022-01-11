import { editorBlockData, editorType } from '../visual-editor/types';
import { createComander } from './command';
import deepcopy from 'deepcopy';
export function useVisualCommnad({
  focusData,
  methods,
  dataModel,
  dragstart,
  dragend,
}: {
  focusData: {
    value: { focus: editorBlockData[]; unfocus: editorBlockData[] };
  };
  methods: {
    updateBlocks: (blocks: editorBlockData[]) => void;
  };
  dataModel: { value: editorType | undefined };
  dragstart: { on: (cb: () => void) => void; off: (cb: () => void) => void };
  dragend: { on: (cb: () => void) => void; off: (cb: () => void) => void };
}) {
  const commander = createComander();

  commander.registry({
    name: 'delete',
    keyboard: ['backspace', 'delete', 'ctrl+d'],
    execute: () => {
      console.log('执行删除命令');
      let data = {
        before: dataModel.value?.blocks || [],
        after: focusData.value.unfocus,
      };

      return {
        undo: () => {
          methods.updateBlocks(data.before);
        },
        redo: () => {
          methods.updateBlocks(data.after);
        },
      };
    },
  });

  commander.registry({
    name: 'drag',
    init() {
      console.log('drag-init');

      this.data = { before: null as null | editorBlockData[] };
      const handler = {
        dragstart: () =>
          (this.data.before = deepcopy(dataModel.value!.blocks || [])),
        dragend: () => commander.state.commands.drag(),
      };
      dragstart.on(handler.dragstart);
      dragend.on(handler.dragend);
      return () => {
        dragstart.off(handler.dragstart);
        dragend.off(handler.dragend);
      };
    },
    execute() {
      console.log('data.before', this.data.before);
      console.log('data.after', this.data.after);

      let before = this.data.before;
      let after = deepcopy(dataModel.value!.blocks || []);
      return {
        redo: () => {
          methods.updateBlocks(deepcopy(after));
        },
        undo: () => {
          methods.updateBlocks(deepcopy(before));
        },
      };
    },
  });

  commander.init();
  return {
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    delete: () => commander.state.commands.delete(),
    // drag: () => commander.state.commands.drag(),
  };
}
