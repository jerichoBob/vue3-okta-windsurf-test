<template>
  <div class="protected">
    <h2>Protected Route</h2>
    <div v-if="user" class="user-info">
      <div class="info-card">
        <h3>User Information</h3>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>
      
      <div class="info-card">
        <h3>Group Memberships</h3>
        <div v-if="user.groups && user.groups.length > 0">
          <ul class="groups-list">
            <li v-for="group in user.groups" :key="group" class="group-item">
              {{ group }}
            </li>
          </ul>
        </div>
        <p v-else class="no-groups">No groups assigned</p>
      </div>
    </div>
    <div v-else class="loading">
      Loading user information...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { oktaAuth } from '../auth';

const user = ref(null);

onMounted(async () => {
  try {
    user.value = await oktaAuth.getUser();
    console.log('Protected view user info:', user.value);
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
});
</script>

<style scoped>
.protected {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 300px;
}

h3 {
  color: #42b983;
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.groups-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.group-item {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #2c3e50;
  font-weight: 500;
  display: inline-block;
}

.no-groups {
  color: #6c757d;
  font-style: italic;
}

.loading {
  text-align: center;
  color: #6c757d;
  margin-top: 2rem;
}

p {
  margin: 0.5rem 0;
}

strong {
  color: #2c3e50;
}
</style>
