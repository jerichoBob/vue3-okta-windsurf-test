<template>
  <div class="home">
    <h1>Welcome to Vue 3 + Okta Auth Demo</h1>
    <p>This is a demonstration of Vue 3 with Okta authentication and group-based authorization.</p>
    <p v-if="!authenticated">Please log in to access protected routes.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { oktaAuth } from '../auth';

const authenticated = ref(false);

onMounted(async () => {
  authenticated.value = await oktaAuth.isAuthenticated();
  oktaAuth.authStateManager.subscribe((state) => {
    authenticated.value = state.isAuthenticated;
  });
});
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #2c3e50;
}
</style>
