import { OktaAuth } from '@okta/okta-auth-js';

const oktaAuth = new OktaAuth({
  issuer: import.meta.env.VITE_OKTA_ISSUER,
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
  redirectUri: `${import.meta.env.VITE_APP_BASE_URL}/login/callback`,
  scopes: ['openid', 'profile', 'email', 'groups'],
  pkce: true,
  cookies: {
    secure: false,
    sameSite: 'lax'
  },
  tokenManager: {
    storage: 'sessionStorage',
    autoRenew: true
  },
  devMode: true, // Enable additional logging
  responseType: ['token', 'id_token'],
  grantType: ['authorization_code', 'implicit'],
});

// Add an event listener for authentication success
oktaAuth.authStateManager.subscribe((authState) => {
  if (authState.isAuthenticated) {
    console.log('Authentication successful');
  }
});

// Add an error listener
oktaAuth.authStateManager.subscribe((authState) => {
  if (authState.error) {
    console.error('Auth error:', authState.error);
  }
});

export { oktaAuth };