<script setup lang="ts">
import { assetsUrl } from '@/common/transport';
import Avatar from 'primevue/avatar';

interface Props {
  image: string | undefined;
  token: string;
}
const props = defineProps<Props>();
</script>

<template>
  <Avatar v-if="props.image" :image="assetsUrl(props.image, props.token)" />
</template>
