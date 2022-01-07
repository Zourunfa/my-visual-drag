<template>
  <div class="app">
    <visual-editor v-model="jsonData" :config="visualConfig"></visual-editor>
    <!-- <test-use-model v-model="value"></test-use-model> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import VisualEditor from './packages/visual-editor';
// import { TestUseModel } from './hooks/useModel';
import { visualConfig } from './packages/visual-editor/visual-config';
export default defineComponent({
  name: 'App',
  components: {
    VisualEditor,
    // TestUseModel,
  },
  setup() {
    const jsonData = reactive({
      container: {
        height: 500,
        width: 800,
      },
      blocks: [
        {
          top: 100,
          left: 100,
        },
        {
          top: 200,
          left: 200,
        },
      ],
    });

    return {
      visualConfig,
      jsonData,
    };
  },
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
</style>
d
