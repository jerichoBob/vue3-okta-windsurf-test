<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link v-if="authenticated" to="/protected">Protected</router-link>
      <button v-if="authenticated" @click="logout">Logout</button>
      <button v-else @click="showLoginDialog">Login</button>
    </nav>
    <router-view></router-view>
    <LoginDialog ref="loginDialog" @login-success="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { oktaAuth } from './auth';
import LoginDialog from './components/LoginDialog.vue';

const authenticated = ref(false);
const loginDialog = ref(null);

function showLoginDialog() {
  loginDialog.value?.openDialog();
}

async function handleLoginSuccess() {
  authenticated.value = true;
}

async function logout() {
  await oktaAuth.signOut();
  authenticated.value = false;
}

onMounted(async () => {
  authenticated.value = await oktaAuth.isAuthenticated();
  oktaAuth.authStateManager.subscribe((state) => {
    authenticated.value = state.isAuthenticated;
  });
});
</script>

<style>
nav {
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}

button {
  margin-left: auto;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:not(.cancel) {
  background-color: #42b983;
  color: white;
  box-shadow: 0 2px 4px rgba(66, 185, 131, 0.2);
}

button:not(.cancel):hover {
  background-color: #3aa876;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

button.cancel {
  background-color: #6c757d;
  color: white;
}

button.cancel:hover {
  background-color: #5a6268;
}
</style>