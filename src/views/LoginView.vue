<script setup lang="ts">
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import FormInputText from '@/components/form/float-label/FormInputText.vue';
import FormPassword from '@/components/form/float-label/FormPassword.vue';
import { useForm } from 'vee-validate';
import { login, logout } from '@/common/auth';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, shallowRef, type Ref } from 'vue';
import { getAccessToken, assetsUrl } from '@/common/transport';
import { fetchUserInfo } from '@/common/user';

const { handleSubmit } = useForm(); // 用于Form校验
const toast = useToast(); // 用于Toast通知
const loading = ref(false); // 是否正在加载数据
const accessToken = ref(''); // accessToken为非空字符串，则已经登录
const userInfo: Ref<Record<string, any>> = shallowRef({}); // 用户信息

// 初始化。看是否登录，并获取用户信息；有必要还会刷新Token
async function init() {
  try {
    accessToken.value = await getAccessToken();
    userInfo.value = await fetchUserInfo();
  } catch (err) {
    accessToken.value = '';
  }
}

// 组件初始化
onMounted(init);

// 表单提交逻辑处理
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

// 退出登录逻辑处理
async function onLogout() {
  loading.value = true;
  await logout();
  loading.value = false;
  accessToken.value = '';
}
</script>

<template>
  <!-- 没有登录则展示登录表单 -->
  <form
    v-if="!accessToken"
    @submit="onSubmit"
    class="main flex flex-column justify-content-center gap-3 mt-5"
  >
    <FormInputText id="username" label="Username" />
    <FormPassword id="password" label="Password" />
    <Button class="w-full" type="submit" label="Login" :loading="loading" />
  </form>
  <!-- 登录了展示欢迎信息和登出按钮 -->
  <div v-else class="main mt-5">
    <p>You have been logged in.</p>
    <p>Hello {{ userInfo.first_name }} {{ userInfo.last_name }} !</p>
    <Avatar :image="assetsUrl(userInfo.avatar, accessToken)" size="xlarge" />
    <p>{{ userInfo.email }}</p>
    <Button class="w-full mt-5" label="Logout" @click="onLogout" />
  </div>
</template>

<style scoped>
.main {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 576px) {
  .main {
    width: 60%;
  }
}
</style>
