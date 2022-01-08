import { editorBlockData, editorType } from '../visual-editor/types';
import { createComander } from './command';

export function useVisualCommnad({
  focusData,
  methods,
  dataModel,
}: {
  focusData: {
    value: { focus: editorBlockData[]; unfocus: editorBlockData[] };
  };
  methods: {
    updateBlocks: (blocks: editorBlockData[]) => void;
  };
  dataModel: { value: editorType | undefined };
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
          console.log('撤回删除');

          console.log('data.before', data.before);

          methods.updateBlocks(data.before);
        },
        redo: () => {
          console.log('重做执行删除命令');

          methods.updateBlocks(data.after);
        },
      };
    },
  });

  return {
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    delete: () => commander.state.commands.delete(),
  };
}
