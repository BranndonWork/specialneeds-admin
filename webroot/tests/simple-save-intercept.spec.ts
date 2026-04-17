import { test } from '@playwright/test';
import * as fs from 'fs';

/**
 * Simple save interception test
 *
 * 1. Logs in
 * 2. Opens edit page
 * 3. YOU manually make changes and click Save
 * 4. Intercepts the request and saves payload to disk
 * 5. Does NOT send to backend
 */

test('intercept save - manual changes', async ({ page }) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  // Login
  await page.goto('http://manage.specialneeds.localhost:5173/login');
  await page.fill('input[name="email"]', username!);
  await page.fill('input[name="password"]', password!);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });

  console.log('\n✓ Logged in\n');

  // Navigate to edit page FIRST
  console.log('Opening edit page...\n');
  await page.goto('http://manage.specialneeds.localhost:5173/directory/edit/cbaa2455-beab-4dd4-94b1-11413361ca36');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // NOW set up interception AFTER page loaded
  let intercepted = false;
  await page.route('**/api/v1/listings/**', async (route) => {
    const request = route.request();

    if (request.method() === 'PUT' && !intercepted) {
      intercepted = true;
      const payload = request.postDataJSON();

      // Save payload
      fs.writeFileSync(
        '/Volumes/Storage/Dropbox/workspace/projects/special-needs/specialneeds-admin/docs/api-examples/save-payload.json',
        JSON.stringify(payload, null, 2)
      );

      console.log('\n✓ INTERCEPTED PUT REQUEST');
      console.log('✓ Saved to: docs/api-examples/save-payload.json');
      console.log('\nPayload keys:');
      console.log('  listing_data:', Object.keys(payload.listing_data || {}).length, 'fields');
      console.log('  category_data:', Object.keys(payload.category_data || {}).length, 'sections');
      console.log('\n✓ Request ABORTED (not sent to backend)\n');

      // Abort - don't send to backend
      await route.abort();
    } else {
      // Let other requests through
      await route.continue();
    }
  });

  console.log('='.repeat(60));
  console.log('PAGE LOADED - CLICKING SAVE WITHOUT ANY CHANGES');
  console.log('='.repeat(60));
  console.log('\nThis will verify ALL fields pass through unchanged...\n');

  // Click Save button automatically
  const saveButton = page.locator('button:has-text("Save")');
  await saveButton.waitFor({ timeout: 5000 });
  await saveButton.click();

  console.log('Clicked Save, waiting for interception...\n');

  // Wait for interception
  const start = Date.now();
  while (!intercepted && (Date.now() - start) < 10000) {
    await page.waitForTimeout(500);
  }

  if (!intercepted) {
    console.log('\n⚠️  Request was not intercepted\n');
  }

  await page.waitForTimeout(1000);
});
