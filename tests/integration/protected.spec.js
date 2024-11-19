import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

test.describe('Protected Features', () => {
  test('should access protected route directly when authenticated', async ({ page }) => {
    await page.goto('/protected');
    
    // Should stay on protected route
    await expect(page).toHaveURL('/protected');
    
    // Should show the test user's email
    await expect(page.locator(`text=${process.env.OKTA_TEST_USERNAME}`)).toBeVisible();
  });

  test('should display correct user groups', async ({ page }) => {
    await page.goto('/protected');
    
    // Should display the test user's group
    if (process.env.OKTA_TEST_USER_GROUP) {
      await expect(page.locator(`text=${process.env.OKTA_TEST_USER_GROUP}`)).toBeVisible();
    }
  });

  test('should handle logout and redirect properly', async ({ page }) => {
    await page.goto('/protected');
    
    // Click logout
    await page.click('button:text("Logout")');
    
    // Should be redirected to home
    await expect(page).toHaveURL('/');
    
    // Should show login button
    await expect(page.locator('button:text("Login")')).toBeVisible();
    
    // Should not be able to access protected route anymore
    await page.goto('/protected');
    await expect(page).toHaveURL('/');
  });
});
