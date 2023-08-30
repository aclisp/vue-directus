<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { ref } from 'vue';

const username = ref('');
const password = ref('');

function onSubmit() {
  console.log(`form submit! username={${username.value}} password={${password.value}}`);
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="main flex flex-column justify-content-center gap-5 mt-5">
    <span class="p-float-label">
      <InputText class="w-full" id="username" v-model.trim="username" />
      <label for="username">Username</label>
    </span>
    <span class="p-float-label">
      <Password
        inputClass="w-full"
        inputId="password"
        toggleMask
        :feedback="false"
        v-model="password"
      />
      <label for="password">Password</label>
    </span>
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
