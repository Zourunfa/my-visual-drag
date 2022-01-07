import { ElButton, ElInput } from 'element-plus';
import { createEditorConfig } from './types';

const visualConfig = createEditorConfig();

visualConfig.registry('text', {
  label: '文本',
  preview: () => <>预览文本</>,
  render: () => <>渲染文本</>,
});

visualConfig.registry('button', {
  label: '按钮',
  preview: () => <ElButton>按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>,
});

visualConfig.registry('input', {
  label: '输入框',
  preview: () => <ElInput></ElInput>,
  render: () => <ElInput></ElInput>,
});

export { visualConfig };
