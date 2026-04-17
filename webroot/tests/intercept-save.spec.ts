import { test, expect } from '@playwright/test';
import * as fs from 'fs';

/**
 * IMPORTANT: This test intercepts save operations to debug payload differences
 * It DOES NOT actually save to the backend - it captures the request for analysis
 */

test('intercept save request and compare original vs save payload', async ({ page }) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in .env.test');
  }

  console.log(`Logging in as: ${username}`);

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

  console.log('Login complete');

  // Set up intercept BEFORE navigating
  let capturedPayload: any = null;
  await page.route('https://api.specialneeds.com/api/v1/listings/**', async (route, request) => {
    const method = request.method();

    if (method === 'PUT' || method === 'POST') {
      console.log(`✓ Intercepted ${method} request to save`);

      // Capture the payload
      capturedPayload = request.postDataJSON();

      console.log('✓ Captured save payload');

      // Save payload to file
      fs.writeFileSync(
        '/Volumes/Storage/Dropbox/workspace/projects/special-needs/specialneeds-admin/docs/api-examples/intercepted-save-payload.json',
        JSON.stringify(capturedPayload, null, 2)
      );
      console.log('✓ Saved payload to docs/api-examples/intercepted-save-payload.json');

      // DO NOT send to backend - abort the request
      await route.abort('aborted');
      console.log('✓ Aborted request (did not send to backend)');
    } else {
      // Let other requests through (including GET for loading the page)
      await route.continue();
    }
  });

  // Navigate to edit page
  console.log('Navigating to directory edit page...');
  await page.goto('http://manage.specialneeds.localhost:5173/directory/edit/cbaa2455-beab-4dd4-94b1-11413361ca36');
  await page.waitForLoadState('networkidle');

  // Wait for data to load
  await page.waitForTimeout(3000);

  // Load the original response that was already saved
  const originalResponse = JSON.parse(fs.readFileSync(
    '/Volumes/Storage/Dropbox/workspace/projects/special-needs/specialneeds-admin/docs/api-examples/original-get-response.json',
    'utf8'
  ));
  console.log('✓ Loaded original GET response from file');

  // Click save button directly (form will save even without changes)
  console.log('Clicking save button...');
  // The save button text might be "Save" or similar
  const saveButton = page.locator('button:has-text("Save")').first();
  await saveButton.waitFor({ timeout: 5000 });
  await saveButton.click();

  // Wait for the intercepted request
  await page.waitForTimeout(3000);

  if (!capturedPayload) {
    throw new Error('Failed to capture save payload');
  }

  // Log comparison summary
  console.log('\n=== COMPARISON SUMMARY ===');
  console.log('Original GET response keys:', Object.keys(originalResponse).sort());
  console.log('Save payload keys:', Object.keys(capturedPayload).sort());

  // Check for key differences
  const originalKeys = new Set(Object.keys(originalResponse));
  const payloadKeys = new Set(Object.keys(capturedPayload));

  const missingInPayload = [...originalKeys].filter(k => !payloadKeys.has(k));
  const addedInPayload = [...payloadKeys].filter(k => !originalKeys.has(k));

  if (missingInPayload.length > 0) {
    console.log('Keys in original but NOT in payload:', missingInPayload);
  }

  if (addedInPayload.length > 0) {
    console.log('Keys in payload but NOT in original:', addedInPayload);
  }

  console.log('\n✓ Test complete!');
  console.log('Files saved:');
  console.log('  - docs/api-examples/original-get-response.json');
  console.log('  - docs/api-examples/intercepted-save-payload.json');
  console.log('\nCompare these files to identify exact differences.');
});
