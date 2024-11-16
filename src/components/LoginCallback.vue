<template>
  <div class="callback-container">
    <p>Handling login callback...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { oktaAuth } from '../auth';

const router = useRouter();

onMounted(async () => {
  try {
    await oktaAuth.handleLoginRedirect();
    router.push('/protected');
  } catch (error) {
    console.error('Error handling login callback:', error);
    router.push('/');
  }
});
</script>

<style scoped>
.callback-container {
  padding: 20px;
  text-align: center;
  color: #2c3e50;
}
</style>