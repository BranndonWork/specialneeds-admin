import { test, expect } from '@playwright/test';
import * as fs from 'fs';

/**
 * FINAL TEST: Compare original GET response vs final PUT payload
 *
 * This test:
 * 1. Loads the edit page and saves original GET response
 * 2. Waits for you to manually make changes (status, category, category_data)
 * 3. When you click Save, intercepts the PUT request
 * 4. Saves the payload to disk WITHOUT sending to backend
 * 5. Shows you the comparison
 *
 * CRITICAL: This test requires MANUAL INTERACTION
 * - Make changes to status, category, or category_data fields
 * - Click Save button when ready
 * - Test will capture and compare
 */

test('manual save test - compare original vs final payload', async ({ page }) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in .env.test');
  }

  console.log('\n=== STARTING MANUAL SAVE TEST ===\n');
  console.log(`Logging in as: ${username}`);

  // Go to login page
  await page.goto('http://manage.specialneeds.localhost:5173/login');
  await page.waitForLoadState('networkidle');

  // Fill in login form
  await page.fill('input[name="email"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });
  console.log('✓ Login complete');

  // Navigate to edit page FIRST, then set up interception
  console.log('\nNavigating to edit page...');
  await page.goto('http://manage.specialneeds.localhost:5173/directory/edit/cbaa2455-beab-4dd4-94b1-11413361ca36');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Give extra time for form to load

  // Load the previously saved original response
  let originalResponse: any;
  try {
    const rawResponse = JSON.parse(fs.readFileSync(
      '/Volumes/Storage/Dropbox/workspace/projects/special-needs/specialneeds-admin/docs/api-examples/listing-editor-response.json',
      'utf8'
    ));
    // Extract the actual response from Django wrapper
    originalResponse = rawResponse.response || rawResponse;
    console.log('✓ Loaded original response from: docs/api-examples/listing-editor-response.json');

    // Also save a copy for this test
    fs.writeFileSync(
      '/Volumes/Storage/Dropbox/workspace/projects/special-needs/specialneeds-admin/docs/api-examples/test-original-response.json',
      JSON.stringify(originalResponse, null, 2)
    );
  } catch (e) {
    throw new Error('Failed to load original response. Run get-token test first to generate listing-editor-response.json');
  }

  console.log('\n=== PAGE LOADED ===');
  console.log('\nOriginal data:');
  console.log('  Title:', originalResponse.listing_data?.title);
  console.log('  Status:', originalResponse.listing_data?.status);
  console.log('  Category:', originalResponse.listing_data?.category?.slug || originalResponse.listing_data?.category);
  console.log('  Category Data sections:', Object.keys(originalResponse.category_data || {}).length);

  // NOW set up request interception for PUT/POST (after page loaded)
  let capturedPayload: any = null;
  let requestIntercepted = false;

  await page.route('**/**/api/v1/listings/**', async (route, request) => {
    const method = request.method();

    if ((method === 'PUT' || method === 'POST') && !requestIntercepted) {
      requestIntercepted = true;
      console.log(`\n✓ Intercepted ${method} request!`);

      // Capture the payload
      capturedPayload = request.postDataJSON();

      // Save payload
      fs.writeFileSync(
        '/Volumes/Storage/Dropbox/workspace/projects/special-needs/specialneeds-admin/docs/api-examples/test-save-payload.json',
        JSON.stringify(capturedPayload, null, 2)
      );
      console.log('✓ Saved to: docs/api-examples/test-save-payload.json');

      // Show what changed
      console.log('\n=== PAYLOAD COMPARISON ===');
      console.log('\nOriginal listing_data keys:', Object.keys(originalResponse.listing_data || {}).length);
      console.log('Payload listing_data keys:', Object.keys(capturedPayload.listing_data || {}).length);

      const origKeys = new Set(Object.keys(originalResponse.listing_data || {}));
      const payloadKeys = new Set(Object.keys(capturedPayload.listing_data || {}));

      const missing = [...origKeys].filter(k => !payloadKeys.has(k));
      const added = [...payloadKeys].filter(k => !origKeys.has(k));

      if (missing.length > 0) {
        console.log('\n❌ Missing keys in payload:', missing);
      } else {
        console.log('\n✓ All original keys present in payload');
      }

      if (added.length > 0) {
        console.log('➕ New keys in payload:', added);
      }

      // Check specific fields
      console.log('\n=== FIELD CHANGES ===');
      const origTitle = originalResponse.listing_data?.title;
      const payloadTitle = capturedPayload.listing_data?.title;
      if (origTitle !== payloadTitle) {
        console.log(`Title: "${origTitle}" → "${payloadTitle}"`);
      }

      const origStatus = originalResponse.listing_data?.status;
      const payloadStatus = capturedPayload.listing_data?.status;
      if (origStatus !== payloadStatus) {
        console.log(`Status: "${origStatus}" → "${payloadStatus}"`);
      }

      const origCat = originalResponse.listing_data?.category?.slug || originalResponse.listing_data?.category;
      const payloadCat = capturedPayload.listing_data?.category;
      if (origCat !== payloadCat) {
        console.log(`Category: "${origCat}" → "${payloadCat}"`);
      }

      const origCatDataKeys = Object.keys(originalResponse.category_data || {});
      const payloadCatDataKeys = Object.keys(capturedPayload.category_data || {});
      if (JSON.stringify(origCatDataKeys) !== JSON.stringify(payloadCatDataKeys)) {
        console.log(`Category Data sections: ${origCatDataKeys.length} → ${payloadCatDataKeys.length}`);
      }

      console.log('\n✓ Test complete! Check the saved JSON files for full comparison.');
      console.log('  - docs/api-examples/test-original-response.json');
      console.log('  - docs/api-examples/test-save-payload.json');

      // Abort the request (don't send to backend)
      await route.abort('aborted');
      console.log('✓ Request aborted (not sent to backend)\n');
    } else {
      // Let GET requests through
      await route.continue();
    }
  });

  console.log('\n=== MAKING AUTOMATED CHANGES ===');

  // Change status from "published" to "draft"
  console.log('\n1. Changing status to "draft"...');
  const statusSelect = page.locator('select#status');
  await statusSelect.selectOption('draft');
  console.log('   ✓ Status changed');

  // Change category (if there are multiple options)
  console.log('\n2. Checking category options...');
  const categorySelect = page.locator('select#category');
  const categoryOptions = await categorySelect.locator('option').all();
  if (categoryOptions.length > 2) { // More than just placeholder and current
    const secondOption = await categoryOptions[2].getAttribute('value');
    if (secondOption) {
      await categorySelect.selectOption(secondOption);
      console.log(`   ✓ Category changed to: ${secondOption}`);
      // Wait for category change to complete
      await page.waitForTimeout(2000);
    }
  } else {
    console.log('   - Only one category available, skipping');
  }

  // Try to change a category_data field (Age Group autocomplete)
  console.log('\n3. Looking for category_data fields to modify...');
  const ageGroupInput = page.locator('#autocomplete-Age-Group input.rbt-input-main');
  const ageGroupExists = await ageGroupInput.isVisible().catch(() => false);

  if (ageGroupExists) {
    console.log('   ✓ Found Age Group field, adding "Adults"...');
    await ageGroupInput.click();
    await page.waitForTimeout(500);

    const adultsOption = page.locator('#tag-input-autocomplete-Age-Group .dropdown-item', { hasText: 'Adults' });
    const adultsVisible = await adultsOption.isVisible().catch(() => false);

    if (adultsVisible) {
      await adultsOption.click();
      console.log('   ✓ Added "Adults" to Age Group');
      await page.waitForTimeout(500);
    }
  } else {
    console.log('   - Age Group field not found');
  }

  console.log('\n=== CHANGES COMPLETE, CLICKING SAVE ===\n');

  // Click the Save button
  const saveButton = page.locator('button:has-text("Save")').first();
  await saveButton.click();
  console.log('✓ Save button clicked, waiting for interception...\n');

  // Wait for the request to be intercepted (timeout after 10 seconds)
  const startTime = Date.now();
  while (!requestIntercepted && (Date.now() - startTime) < 10000) {
    await page.waitForTimeout(500);
  }

  if (!requestIntercepted) {
    throw new Error('Timeout: Request was not intercepted within 10 seconds');
  }

  // Give time to see the console output
  await page.waitForTimeout(2000);
});
