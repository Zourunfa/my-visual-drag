import { computed, defineComponent, ref, watch } from 'vue';

export function useModel<T>(getter: () => T, emitter: (val: T) => void) {
  const state = ref(getter()) as { value: T };

  watch(getter, (val) => {
    if (val !== state.value) {
      state.value = val;
    }
  });

  return computed({
    get: () => state.value,
    set: (val: T) => {
      if (state.value !== val) {
        // state.value = val;
        emitter(val);
      }
    },
  });
}

export const TestUseModel = defineComponent({
  name: 'TestUseModel',
  props: {
    modelValue: {
      type: String,
    },
  },
  emit: 'update:modelValue',

  setup(props, ctx) {
    const model = useModel(
      () => props.modelValue,
      (val) => ctx.emit('update:modelValue', val),
    );

    return () => {
      return (
        <div>
          自定义输入框
          <input type="text" v-model={model.value} />
        </div>
      );
    };
  },
});
