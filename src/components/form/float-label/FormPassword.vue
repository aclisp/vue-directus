<!-- 表单控件 -->
<script setup lang="ts">
import Password from 'primevue/password';
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
      <Password
        inputClass="w-full"
        :class="{ 'p-invalid': errorMessage }"
        :inputId="id"
        toggleMask
        :feedback="false"
        v-model="value"
        v-bind="$attrs"
      />
      <label :for="id">{{ label }}</label>
    </span>
    <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>

<style scoped>
.p-inputwrapper {
  width: 100%;
}
</style>
