import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

setup('authenticate', async ({ page }) => {
  // Go to the app
  await page.goto('/');
  
  // Click login button
  await page.click('button:text("Login")');
  
  // Fill in real test credentials
  await page.fill('#username', process.env.OKTA_TEST_USERNAME);
  await page.fill('#password', process.env.OKTA_TEST_PASSWORD);
  
  // Submit form
  await page.click('button:text("Login")');
  
  // Wait for authentication to complete
  await expect(page).toHaveURL('/protected');
  
  // Save signed-in state
  await page.context().storageState({ path: './tests/integration/auth.json' });
});
