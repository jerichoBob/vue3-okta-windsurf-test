import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaVue from '@okta/okta-vue';
import { oktaAuth } from './auth';
import './style.css';

const app = createApp(App);

app.use(router);
app.use(OktaVue, { oktaAuth });

app.mount('#app');
