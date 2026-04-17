import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * CRITICAL WARNING: Tests run against LIVE PRODUCTION data!
 *
 * DO NOT click "Save" buttons or submit forms in tests.
 * Tests should ONLY verify UI behavior and interactions.
 * Any saves will modify REAL production listings/articles.
 */

// Load test environment variables
dotenv.config({ path: '.env.test' });

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://manage.specialneeds.localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://manage.specialneeds.localhost:5173',
    reuseExistingServer: true,
  },
});
