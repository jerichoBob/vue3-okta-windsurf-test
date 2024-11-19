import { test, expect } from '@playwright/test';

// Mock Okta authentication for testing
async function mockOktaAuth(page) {
  await page.route('**/oauth2/default/**', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionToken: 'mock-session-token',
          status: 'SUCCESS'
        })
      });
    }
  });

  // Mock user info
  await page.route('**/oauth2/default/v1/userinfo', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sub: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        groups: ['TestGroup', 'AdminGroup']
      })
    });
  });
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockOktaAuth(page);
  });

  test('should display user info after successful login', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    await page.click('button:text("Login")');
    
    // Fill in credentials
    await page.fill('#username', 'test@example.com');
    await page.fill('#password', 'password');
    
    // Submit form
    await page.click('button:text("Login")');
    
    // Should be redirected to protected route
    await expect(page).toHaveURL('/protected');
    
    // Check if user info is displayed
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
  });

  test('should display user groups in protected view', async ({ page }) => {
    await page.goto('/');
    
    // Click login button and login
    await page.click('button:text("Login")');
    await page.fill('#username', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button:text("Login")');
    
    // Wait for protected page to load
    await expect(page).toHaveURL('/protected');
    
    // Check if groups are displayed
    await expect(page.locator('text=TestGroup')).toBeVisible();
    await expect(page.locator('text=AdminGroup')).toBeVisible();
  });

  test('should handle logout correctly', async ({ page }) => {
    await page.goto('/');
    
    // Login first
    await page.click('button:text("Login")');
    await page.fill('#username', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button:text("Login")');
    
    // Wait for protected page
    await expect(page).toHaveURL('/protected');
    
    // Click logout
    await page.click('button:text("Logout")');
    
    // Should be redirected to home
    await expect(page).toHaveURL('/');
    
    // Login button should be visible again
    await expect(page.locator('button:text("Login")')).toBeVisible();
  });
});
