<script setup lang="ts">
import Button from 'primevue/button';
import FormInputText from '@/components/form/float-label/FormInputText.vue';
import FormPassword from '@/components/form/float-label/FormPassword.vue';
import { useForm } from 'vee-validate';
import { login, logout } from '@/common/auth';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted } from 'vue';
import { getAccessToken } from '@/common/transport';
import { fetchUserInfo } from '@/common/user';

const { handleSubmit } = useForm();
const toast = useToast();
const loading = ref(false);
const accessToken = ref('');
const userInfo: Record<string, any> = ref({});

async function init() {
  try {
    accessToken.value = await getAccessToken();
    userInfo.value = await fetchUserInfo();
  } catch (err) {
    accessToken.value = '';
  }
}

onMounted(init);

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await login(values.username, values.password);
    await init();
  } catch (err) {
    toast.add({ severity: 'error', detail: String(err) });
  } finally {
    loading.value = false;
  }
});

async function onLogout() {
  loading.value = true;
  await logout();
  loading.value = false;
  accessToken.value = '';
}
</script>

<template>
  <form
    v-if="!accessToken"
    @submit="onSubmit"
    class="main flex flex-column justify-content-center gap-3 mt-5"
  >
    <FormInputText id="username" label="Username" />
    <FormPassword id="password" label="Password" />
    <Button class="w-full" type="submit" label="Login" :loading="loading" />
  </form>

  <div v-else class="main mt-5">
    <p>You have been logged in.</p>
    <p>Hello {{ userInfo.first_name }} {{ userInfo.last_name }} !</p>
    <Button class="w-full mt-8" label="Logout" @click="onLogout" />
  </div>
</template>

<style scoped>
.main {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}
</style>
