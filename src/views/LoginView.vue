<script setup lang="ts">
import Button from 'primevue/button';
import FormInputText from '@/components/form/float-label/FormInputText.vue';
import FormPassword from '@/components/form/float-label/FormPassword.vue';
import { useForm } from 'vee-validate';
import { login } from '@/common/auth';
import { useToast } from 'primevue/usetoast';

const { handleSubmit } = useForm();
const toast = useToast();

const onSubmit = handleSubmit(async (values) => {
  try {
    await login(values.username, values.password);
  } catch (err) {
    toast.add({ severity: 'error', detail: String(err) });
  }
});
</script>

<template>
  <form @submit="onSubmit" class="main flex flex-column justify-content-center gap-3 mt-5">
    <FormInputText id="username" label="Username" />
    <FormPassword id="password" label="Password" />
    <Button class="w-full" type="submit" label="Login" />
  </form>
</template>

<style scoped>
.main {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}
</style>
