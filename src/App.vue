<template>
  <div class="app">
    <visual-editor v-model="jsonData"></visual-editor>
    <!-- <test-use-model v-model="value"></test-use-model> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import VisualEditor from './packages/visual-editor';
// import { TestUseModel } from './hooks/useModel';
export default defineComponent({
  name: 'App',
  components: {
    VisualEditor,
    // TestUseModel,
  },
  setup() {
    const jsonData = reactive({
      container: {
        height: 800,
        width: 500,
      },
      blocks: [
        {
          top: 100,
          lefg: 100,
        },
        {
          top: 200,
          lefg: 200,
        },
      ],
    });

    return {
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
