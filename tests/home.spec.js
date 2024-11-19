import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the home page correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page.locator('h1')).toHaveText('Vue 3 + Okta Auth Demo');
    
    // Check login button is visible when not authenticated
    await expect(page.locator('button:text("Login")')).toBeVisible();
  });

  test('should open login dialog when clicking login button', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    await page.click('button:text("Login")');
    
    // Check if login dialog is visible
    await expect(page.locator('.login-dialog')).toBeVisible();
    
    // Check if username and password fields are present
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    await page.click('button:text("Login")');
    
    // Fill in invalid credentials
    await page.fill('#username', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');
    
    // Submit form
    await page.click('button:text("Login")', { timeout: 2000 });
    
    // Check for error message
    await expect(page.locator('.error')).toBeVisible();
  });
});

test.describe('Protected Route', () => {
  test('should redirect to home when accessing protected route without auth', async ({ page }) => {
    // Try to access protected route directly
    await page.goto('/protected');
    
    // Should be redirected to home
    await expect(page).toHaveURL('/');
  });
});
