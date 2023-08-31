<script setup lang="ts">
import Button from 'primevue/button';
import FormInputText from '@/components/form/float-label/FormInputText.vue';
import FormPassword from '@/components/form/float-label/FormPassword.vue';
import { useForm } from 'vee-validate';

const { handleSubmit } = useForm();

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
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
