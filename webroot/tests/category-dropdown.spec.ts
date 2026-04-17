import { test, expect } from '@playwright/test';

/**
 * IMPORTANT: NEVER SAVE LISTINGS/ARTICLES DURING TESTS!
 *
 * These tests run against LIVE PRODUCTION data. Do NOT click the "Save" button
 * or perform any actions that would modify production listings or articles.
 */

test('should show all categories and have current category selected', async ({ page }) => {
  // WARNING: DO NOT CLICK SAVE BUTTON IN THIS TEST!
  page.on('console', msg => console.log('Browser console:', msg.text()));

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
  console.log('Clicking submit button...');
  await page.click('button[type="submit"]');

  // Wait for navigation away from login page
  console.log('Waiting for navigation after login (can take 5-10 seconds)...');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });

  console.log('Login complete, redirected to:', page.url());

  // Listen for API responses to capture the listing data
  let listingData: any = null;
  page.on('response', async (response) => {
    if (response.url().includes('/listings/') && response.url().includes('level=editor')) {
      try {
        const json = await response.json();
        listingData = json.response || json;
        console.log('API Response captured');
        console.log('Current category:', listingData?.listing_data?.category);
        console.log('Available categories count:', listingData?.categories?.length);
      } catch (e) {
        // Ignore non-JSON responses
      }
    }
  });

  // Navigate to edit page
  console.log('Navigating to directory edit page...');
  await page.goto('http://manage.specialneeds.localhost:5173/directory/edit/cbaa2455-beab-4dd4-94b1-11413361ca36');
  await page.waitForLoadState('networkidle');

  // Wait for data to load
  await page.waitForTimeout(3000);

  // Take screenshot for debugging
  await page.screenshot({ path: 'test-results/category-dropdown-loaded.png', fullPage: true });

  // Find the category dropdown
  const categorySelect = page.locator('select#category');
  await categorySelect.waitFor({ timeout: 10000 });

  console.log('Category dropdown found');

  // Get all options in the dropdown
  const options = await categorySelect.locator('option').all();
  const optionTexts = await Promise.all(options.map(opt => opt.textContent()));
  const optionValues = await Promise.all(options.map(opt => opt.getAttribute('value')));

  console.log(`Found ${options.length} options in dropdown`);
  console.log('Option values:', optionValues);
  console.log('Option texts:', optionTexts);

  // Get the selected value
  const selectedValue = await categorySelect.inputValue();
  console.log('Selected value:', selectedValue);

  // Verify API data was captured
  if (!listingData) {
    console.log('ERROR: API response was not captured');
    throw new Error('Failed to capture API response');
  }

  const currentCategorySlug = listingData.listing_data?.category?.slug;
  const availableCategories = listingData.categories || [];

  console.log('Current category slug from API:', currentCategorySlug);
  console.log('Available categories from API:', availableCategories.length);

  // TEST 1: Verify dropdown has options (excluding placeholder)
  const nonPlaceholderOptions = optionValues.filter(v => v && v !== '');
  console.log(`Non-placeholder options: ${nonPlaceholderOptions.length}`);

  if (nonPlaceholderOptions.length === 0) {
    console.log('ERROR: No categories in dropdown!');
    throw new Error('Category dropdown has no options');
  }

  // TEST 2: Verify all categories from API are in the dropdown
  const missingCategories = availableCategories.filter((cat: any) =>
    !optionValues.includes(cat.slug)
  );

  if (missingCategories.length > 0) {
    console.log('ERROR: Missing categories:', missingCategories.map((c: any) => c.slug));
    throw new Error(`${missingCategories.length} categories missing from dropdown`);
  }

  console.log(`✓ All ${availableCategories.length} categories are in dropdown`);

  // TEST 3: Verify current category is selected
  if (selectedValue !== currentCategorySlug) {
    console.log(`ERROR: Selected value "${selectedValue}" does not match current category "${currentCategorySlug}"`);
    await page.screenshot({ path: 'test-results/category-mismatch.png', fullPage: true });
    throw new Error(`Current category not selected. Expected: ${currentCategorySlug}, Got: ${selectedValue}`);
  }

  console.log(`✓ Current category "${currentCategorySlug}" is selected`);

  // Find the selected option's text
  const selectedOptionText = optionTexts[optionValues.indexOf(selectedValue)];
  console.log(`Selected option text: "${selectedOptionText}"`);

  console.log('✓ All tests passed!');
  console.log('Test complete. Closing without saving to avoid modifying production data.');
});
