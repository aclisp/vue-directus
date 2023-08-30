<!-- 表单控件 -->
<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { useField } from 'vee-validate';

defineOptions({
  inheritAttrs: false,
});

// -- 定义属性 --
interface Props {
  id: string;
  label: string;
}

const props = defineProps<Props>();
const { value, errorMessage } = useField<string>(() => props.id, validate, { initialValue: '' });

function validate(value: string) {
  if (!value) {
    return `${props.label} is required.`;
  }

  return true;
}
</script>

<template>
  <div>
    <span class="p-float-label">
      <InputText
        class="w-full"
        :class="{ 'p-invalid': errorMessage }"
        :id="props.id"
        v-model.trim="value"
        v-bind="$attrs"
      />
      <label :for="props.id">{{ props.label }}</label>
    </span>
    <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>
