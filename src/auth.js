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
    autoRenew: true,
    expireEarlySeconds: 30
  },
  devMode: true,
  responseType: ['code'],
  grantType: ['authorization_code'],
  postLogoutRedirectUri: import.meta.env.VITE_APP_BASE_URL
});

// Add an event listener for authentication success
oktaAuth.authStateManager.subscribe(async (authState) => {
  if (authState.isAuthenticated) {
    console.log('Authentication successful');
    try {
      const user = await oktaAuth.getUser();
      console.log('User info:', user);
      console.log('User groups:', user.groups);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }
});

// Add an error listener
oktaAuth.authStateManager.subscribe((authState) => {
  if (authState.error) {
    console.error('Auth error:', authState.error);
  }
});

export { oktaAuth };