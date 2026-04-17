import { test, expect } from '@playwright/test';

/**
 * IMPORTANT: NEVER SAVE LISTINGS/ARTICLES DURING TESTS!
 *
 * These tests run against LIVE PRODUCTION data. Do NOT click the "Save" button
 * or perform any actions that would modify production listings or articles.
 *
 * Tests should only:
 * - Navigate to pages
 * - Interact with form fields (typing, selecting)
 * - Verify UI elements and behavior
 *
 * Tests should NEVER:
 * - Click the "Save" button
 * - Submit forms
 * - Create/update/delete production data
 */

test('should select "Adults" from Age Group dropdown', async ({ page }) => {
  // WARNING: DO NOT CLICK SAVE BUTTON IN THIS TEST!
  // Enable console logging from the browser
  page.on('console', msg => console.log('Browser console:', msg.text()));

  // Get credentials from env
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

  // Wait for navigation away from login page (user reported 5-10 seconds)
  console.log('Waiting for navigation after login (can take 5-10 seconds)...');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });

  console.log('Login complete, redirected to:', page.url());

  // Listen for API responses to debug
  const apiResponses: any[] = [];
  page.on('response', async (response) => {
    if (response.url().includes('/listings/')) {
      try {
        const json = await response.json();
        apiResponses.push({ url: response.url(), data: json });
        console.log('API Response URL:', response.url());
        console.log('API Response has category_data:', !!json.response?.category_data);
        console.log('API Response category_data keys:', json.response?.category_data ? Object.keys(json.response.category_data) : 'none');
      } catch (e) {
        // Ignore non-JSON responses
      }
    }
  });

  // Navigate to edit page to test autocomplete
  console.log('Navigating to directory edit page...');
  await page.goto('http://manage.specialneeds.localhost:5173/directory/edit/cbaa2455-beab-4dd4-94b1-11413361ca36');
  await page.waitForLoadState('networkidle');

  // Wait longer for data to load and take screenshot
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-results/page-loaded.png', fullPage: true });

  // Check if Age Group field exists - wait up to 10 seconds
  const ageGroupWrapper = page.locator('#autocomplete-Age-Group');
  await ageGroupWrapper.waitFor({ timeout: 10000 }).catch(() => {
    console.log('Age Group field not found after 10 seconds');
  });

  // Log current URL
  console.log('Current URL:', page.url());

  // Log all visible text on page
  const bodyText = await page.locator('body').textContent();
  console.log('Page contains Age Group:', bodyText?.includes('Age Group'));

  // Find the input inside the Age Group wrapper
  const input = page.locator('#autocomplete-Age-Group input.rbt-input-main');
  const inputVisible = await input.isVisible().catch(() => false);
  console.log('Input visible:', inputVisible);

  if (!inputVisible) {
    console.log('ERROR: Input not visible. Test cannot proceed.');
    await page.screenshot({ path: 'test-results/input-not-visible.png', fullPage: true });
    throw new Error('Input field not visible');
  }

  // Click on the input to open the dropdown
  console.log('Clicking input to open dropdown...');
  await input.click();
  await page.waitForTimeout(500);

  // Check if dropdown appeared
  const dropdown = page.locator('#tag-input-autocomplete-Age-Group');
  const dropdownVisible = await dropdown.isVisible();
  console.log('Dropdown visible:', dropdownVisible);

  // Log the dropdown items
  const dropdownItems = page.locator('#tag-input-autocomplete-Age-Group .dropdown-item');
  const count = await dropdownItems.count();
  console.log(`Found ${count} dropdown items`);

  for (let i = 0; i < count; i++) {
    const text = await dropdownItems.nth(i).textContent();
    console.log(`Item ${i}: ${text}`);
  }

  if (count === 0) {
    await page.screenshot({ path: 'test-results/no-dropdown-items.png', fullPage: true });
    throw new Error('No dropdown items found');
  }

  // Get the current selected tokens count
  const existingTokens = page.locator('#autocomplete-Age-Group .rbt-token');
  const existingCount = await existingTokens.count();
  console.log(`Existing tokens: ${existingCount}`);

  // Click on "Adults"
  const adultsOption = page.locator('#tag-input-autocomplete-Age-Group .dropdown-item', { hasText: 'Adults' });
  const adultsVisible = await adultsOption.isVisible();
  console.log('Adults option visible:', adultsVisible);

  if (!adultsVisible) {
    await page.screenshot({ path: 'test-results/adults-not-visible.png', fullPage: true });
    throw new Error('Adults option not visible');
  }

  console.log('Clicking on Adults option...');
  await adultsOption.click();

  // Wait for the change to register
  await page.waitForTimeout(1000);

  // Take screenshot after click
  await page.screenshot({ path: 'test-results/after-click.png', fullPage: true });

  // Check the token count increased
  const newCount = await existingTokens.count();
  console.log(`Tokens after click: ${newCount}`);

  // Verify "Adults" token appears in the selected items
  const adultsToken = page.locator('#autocomplete-Age-Group .rbt-token', { hasText: 'Adults' });
  const adultsTokenVisible = await adultsToken.isVisible().catch(() => false);
  console.log('Adults token visible:', adultsTokenVisible);

  if (adultsTokenVisible) {
    console.log('✓ Test passed! Adults was successfully added.');
  } else {
    console.log('✗ Test FAILED! Adults was NOT added.');
    throw new Error('Adults token not visible after click');
  }

  // TEST COMPLETE - DO NOT SAVE!
  // This test verified autocomplete functionality works.
  // The test MUST NOT click the "Save" button as it would modify production data.
  console.log('Test complete. Closing without saving to avoid modifying production data.');
});
