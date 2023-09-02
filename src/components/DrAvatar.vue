<script setup lang="ts">
import { assetsUrl } from '@/common/transport';
import Avatar from 'primevue/avatar';

interface Props {
  image: string | undefined;
  token: string;
}
defineProps<Props>();
</script>

<template>
  <Avatar v-if="image" :image="assetsUrl(image, token)" />
</template>
