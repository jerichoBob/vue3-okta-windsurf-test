<template>
  <div class="protected">
    <h2>Protected Route</h2>
    <div v-if="user">
      <p>Welcome, {{ user.name }}!</p>
      <p>Your groups: {{ user.groups?.join(', ') || 'No groups' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { oktaAuth } from '../auth';

const user = ref(null);

onMounted(async () => {
  user.value = await oktaAuth.getUser();
});
</script>

<style scoped>
.protected {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
}
</style>
