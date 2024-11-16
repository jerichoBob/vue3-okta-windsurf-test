import { createRouter, createWebHistory } from 'vue-router';
import { oktaAuth } from '../auth';
import { navigationGuard } from '@okta/okta-vue';
import LoginCallback from '../components/LoginCallback.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login/callback',
      component: LoginCallback
    },
    {
      path: '/protected',
      name: 'protected',
      component: () => import('../views/ProtectedView.vue'),
      meta: {
        requiresAuth: true,
        requiredGroups: [] // Add specific group names here that should have access
      }
    }
  ]
});

router.beforeEach(navigationGuard);

// Custom navigation guard for group-based authorization
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authenticated = await oktaAuth.isAuthenticated();
    if (!authenticated) {
      oktaAuth.signInWithRedirect();
      return;
    }

    const user = await oktaAuth.getUser();
    const userGroups = user.groups || [];

    // Example of group-based authorization
    if (to.meta.requiredGroups && to.meta.requiredGroups.length > 0) {
      const hasRequiredGroup = to.meta.requiredGroups.some(group => 
        userGroups.includes(group)
      );
      if (!hasRequiredGroup) {
        // Redirect to home if user doesn't have required group
        next({ path: '/' });
        return;
      }
    }
  }
  next();
});

export default router;