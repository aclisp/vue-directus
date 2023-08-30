<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useField, useForm } from 'vee-validate';

const { handleSubmit } = useForm();
const { value: username, errorMessage: usernameInvalid } = useField<string>(
  'username',
  validateUsername,
  { initialValue: '' },
);
const { value: password, errorMessage: passwordInvalid } = useField<string>(
  'password',
  validatePassword,
  { initialValue: '' },
);

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});

function validateUsername(value: string) {
  if (!value) {
    return 'Username is required.';
  }

  return true;
}

function validatePassword(value: string) {
  if (!value) {
    return 'Password is required.';
  }

  return true;
}
</script>

<template>
  <form @submit="onSubmit" class="main flex flex-column justify-content-center gap-3 mt-5">
    <div>
      <span class="p-float-label">
        <InputText
          class="w-full"
          :class="{ 'p-invalid': usernameInvalid }"
          id="username"
          v-model.trim="username"
        />
        <label for="username">Username</label>
      </span>
      <small class="p-error">{{ usernameInvalid || '&nbsp;' }}</small>
    </div>

    <div>
      <span class="p-float-label">
        <Password
          inputClass="w-full"
          :class="{ 'p-invalid': passwordInvalid }"
          inputId="password"
          toggleMask
          :feedback="false"
          v-model="password"
        />
        <label for="password">Password</label>
      </span>
      <small class="p-error">{{ passwordInvalid || '&nbsp;' }}</small>
    </div>

    <Button class="w-full" type="submit" label="Login" />
  </form>
</template>

<style scoped>
.main {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}

.p-inputwrapper {
  width: 100%;
}
</style>
