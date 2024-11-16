<template>
  <div class="login-dialog" v-if="showDialog">
    <div class="login-content">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            autocomplete="username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            autocomplete="current-password"
          />
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <div class="buttons">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
          <button type="button" @click="closeDialog" class="cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { oktaAuth } from '../auth';

const router = useRouter();
const showDialog = ref(false);
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const emit = defineEmits(['login-success', 'close']);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  
  try {
    const transaction = await oktaAuth.signIn({
      username: username.value,
      password: password.value
    });

    if (transaction.status === 'SUCCESS') {
      // Exchange the session token for an authorization code
      await oktaAuth.token.getWithRedirect({
        sessionToken: transaction.sessionToken,
        responseType: ['code'],
        scopes: ['openid', 'email', 'profile', 'groups']
      });
      
      emit('login-success');
      closeDialog();
    } else {
      console.error('Login status:', transaction.status);
      error.value = 'Unexpected login status. Please try again.';
    }
  } catch (e) {
    console.error('Login error:', e);
    error.value = e.errorSummary || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
}

function openDialog() {
  showDialog.value = true;
  username.value = '';
  password.value = '';
  error.value = '';
}

function closeDialog() {
  showDialog.value = false;
  emit('close');
}

// Expose methods to parent component
defineExpose({
  openDialog,
  closeDialog
});
</script>

<style scoped>
.login-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-top: 0;
  color: #2c3e50;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

.error {
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button[type="submit"] {
  background-color: #42b983;
  color: white;
}

button[type="submit"]:hover {
  background-color: #3aa876;
}

button[type="submit"]:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.cancel {
  background-color: #6c757d;
  color: white;
}

.cancel:hover {
  background-color: #5a6268;
}
</style>
