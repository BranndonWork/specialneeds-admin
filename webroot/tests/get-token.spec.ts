import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('fetch listing data and save to file', async ({ page }) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in .env.test');
  }

  // Go to login page
  await page.goto('http://manage.specialneeds.localhost:5173/login');
  await page.waitForLoadState('networkidle');

  // Fill in login form
  await page.fill('input[name="email"]', username);
  await page.fill('input[name="password"]', password);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation away from login page
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });

  console.log('Logged in, now fetching listing data...');

  // Fetch listing data from API using the browser's auth
  const listingResponse = await page.evaluate(async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('https://api.specialneeds.com/api/v1/listings/?id=cbaa2455-beab-4dd4-94b1-11413361ca36&level=editor', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  });

  // Save to file
  fs.writeFileSync('/tmp/listing-api-response.json', JSON.stringify(listingResponse, null, 2));
  console.log('Listing response saved to /tmp/listing-api-response.json');
  console.log('Categories count:', listingResponse?.response?.categories?.length);
});
