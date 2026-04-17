# Vercel Edge Config Setup for Featured & Popular Articles

## Overview

Article storage uses a hybrid approach:
- **Local Development**: File-based storage (`data/featured-articles.json`, `data/popular-articles-cache.json`)
- **Production (Vercel)**: Vercel Edge Config (Vercel-native, no third party)

### Storage Keys

| Key | Purpose | Source |
|-----|---------|--------|
| `featured-articles` | Admin-curated featured articles | Manual via admin panel |
| `popular-articles` | Analytics-driven popular articles | Automatic via Plausible API |

## Why Edge Config?

- **Vercel-native** - No third-party signups required
- **Ultra-low latency** - Optimized for config data
- **Free tier** - Included with Vercel accounts
- **Perfect for featured articles** - Small, frequently-read data

## Local Development

No setup needed. The app automatically uses file-based storage when `EDGE_CONFIG` environment variable is not present.

The file `data/featured-articles.json` is gitignored to prevent local changes from being committed.

## Production Setup (Vercel)

### Step 1: Create Edge Config Store

1. Go to Vercel dashboard → **Storage** tab
2. Click **"Create"** next to "Edge Config"
3. Name it (e.g., "specialneeds-client-store")
4. Click **"Create Edge Config"**

### Step 2: Connect to Your Project

You should see a configuration screen with:
- **Connect to**: specialneeds-client
- **Environments**: Check Development, Preview, Production
- **Advanced Options**:
  - Environment Variable: `EDGE_CONFIG`
  - Token Label: `specialneeds-client-token`

Click **"Connect"**

This automatically adds the `EDGE_CONFIG` environment variable to all your environments.

### Step 3: Add Write Credentials (Required for Admin Panel)

The admin panel needs to **write** to Edge Config when you save featured articles. This requires two additional environment variables:

#### Get Edge Config ID

1. In Vercel dashboard → Storage → Click your Edge Config store
2. Look at the URL or settings to find the ID (format: `ecfg_xxxxxxxxxxxxx`)
3. Copy it

#### Create Vercel API Token

1. Go to https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: "Edge Config Write Access"
4. Scope: Select your account/team
5. Expiration: Never (or your preference)
6. Click **"Create"**
7. Copy the token (you won't see it again!)

#### Add Environment Variables

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add variable:
   - **Key**: `VERCEL_EDGE_CONFIG_ID`
   - **Value**: Your Edge Config ID (e.g., `ecfg_xxxxxxxxxxxxx`)
   - **Environments**: Production, Preview, Development
3. Add variable:
   - **Key**: `VERCEL_API_TOKEN`
   - **Value**: Your API token
   - **Environments**: Production, Preview, Development
4. Click **"Save"**

### Step 4: Deploy

Redeploy your project for environment variables to take effect.

## How It Works

The storage abstraction layer (`utils/featuredArticlesStorage.js`) automatically detects the environment:

### Detection Logic
```javascript
const useEdgeConfig = () => {
  return !!process.env.EDGE_CONFIG;
};
```

- **If `EDGE_CONFIG` exists**: Uses Vercel Edge Config
- **If `EDGE_CONFIG` missing**: Falls back to file-based storage

### Reading (Fast)
```javascript
import { get } from '@vercel/edge-config';
const data = await get('featured-articles');
```

### Writing (Requires API Token)
```javascript
// Uses Vercel API to update Edge Config
await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${vercelToken}` },
  body: JSON.stringify({ items: [{ operation: 'upsert', key: 'featured-articles', value: data }] })
});
```

## Data Structure

Both storage methods use the same JSON structure:

```json
{
  "articleIds": [123, 456, 789, 234, 567],
  "lastUpdated": "2025-01-15T10:30:00Z",
  "updatedBy": 42
}
```

## Testing

### Local Development
1. Visit http://localhost:3000/admin/featured-articles
2. Select 5 featured articles
3. Save
4. Data persists in `data/featured-articles.json`

### Production (Vercel)
1. Deploy to Vercel
2. Visit https://your-domain.com/admin/featured-articles
3. Login with admin credentials
4. Select 5 featured articles
5. Save
6. Data persists in Edge Config

## Verifying Storage Type

Add this to any API endpoint to check which storage is being used:

```javascript
import { getStorageType } from '@utils/featuredArticlesStorage';
console.log('Storage type:', getStorageType());
// Returns: 'edge-config' or 'file'
```

## Troubleshooting

### Local dev shows empty featured articles
- Check that `data/featured-articles.json` exists (copy from `.example` if needed)
- Verify the file is valid JSON

### Production shows empty featured articles after deploying
- Verify `EDGE_CONFIG` environment variable is set in Vercel
- Check Vercel deployment logs for errors
- Visit Edge Config in Vercel dashboard - is data there?

### Admin panel can't save (production)
- Check that `VERCEL_EDGE_CONFIG_ID` environment variable is set
- Check that `VERCEL_API_TOKEN` environment variable is set
- Verify API token has write permissions
- Check deployment logs for error messages

### 403 Forbidden when saving
- Verify `VERCEL_API_TOKEN` is valid and not expired
- Check that the token has permissions for your account/team
- Make sure you're logged in as an admin user

## Environment Variables Summary

### Automatically Added (by connecting Edge Config):
- `EDGE_CONFIG` - Connection string (read access)

### Manually Add (for write access):
- `VERCEL_EDGE_CONFIG_ID` - Your Edge Config ID (format: `ecfg_xxxxxxxxxxxxx`)
- `VERCEL_API_TOKEN` - Your Vercel API token (for write operations)

### Plausible Analytics (for popular articles):
- `PLAUSIBLE_API_KEY` - API key from https://plausible.io/settings (API Keys section)
- `PLAUSIBLE_SITE_ID` - Site ID (defaults to `specialneeds.com`)
- `ANALYTICS_ADMIN_KEY` - Admin key for manual cache refresh endpoint

**Legacy names also supported:** `EDGE_CONFIG_ID`, `VERCEL_TOKEN`

## Files

### Featured Articles (Admin-curated)
- **Storage abstraction**: `webroot/utils/featuredArticlesStorage.js`
- **Local data file**: `webroot/data/featured-articles.json` (gitignored)
- **Example file**: `webroot/data/featured-articles.json.example`
- **API endpoints**:
  - Public: `webroot/pages/api/featured-articles.js`
  - Admin: `webroot/pages/api/admin/featured-articles.js`
  - Homepage fetcher: `webroot/pages/api/v1/search/getFeatured.js`

### Popular Articles (Analytics-driven)
- **Plausible client**: `webroot/utils/analytics/plausibleClient.js`
- **Storage abstraction**: `webroot/utils/analytics/popularArticlesStorage.js`
- **Local data file**: `webroot/data/popular-articles-cache.json` (gitignored)
- **Example file**: `webroot/data/popular-articles-cache.json.example`
- **API endpoints**:
  - Public: `webroot/pages/api/v1/analytics/popular-articles.js`
  - Admin refresh: `webroot/pages/api/v1/analytics/refresh.js`

## Popular Articles API Usage

### Public Endpoint

```bash
# Get popular articles (uses cache, never hits Plausible directly)
curl https://your-domain.com/api/v1/analytics/popular-articles
```

Response includes cache headers and status:
- `X-Cache-Status`: HIT, MISS, or STALE
- `X-Cache-Age`: Time since last Plausible fetch

### Admin Refresh Endpoint

```bash
# Force cache refresh (requires admin key)
curl -X POST https://your-domain.com/api/v1/analytics/refresh \
  -H "X-Admin-Key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"period": "7d", "limit": 20}'
```

### Cache Behavior

- 6-hour TTL with automatic refresh on cache miss
- ~4 Plausible API calls per day in normal operation
- Stale cache served if Plausible API fails
