# PWA Icons

## Required Icons

Generate the following icon sizes for PWA support:

- `icon-192x192.png` - Standard app icon
- `icon-512x512.png` - High-res app icon (maskable)

## How to Generate

### Option 1: Online Tool (Recommended)

Use [RealFaviconGenerator](https://realfavicongenerator.net/):

1. Upload your logo/favicon
2. Select "I want to create iOS, Android, and all other icons from scratch"
3. Download the generated icons
4. Copy `icon-192x192.png` and `icon-512x512.png` to this directory

### Option 2: PWA Asset Generator

```bash
npx pwa-asset-generator your-logo.svg ./icons --icon-only
```

### Option 3: ImageMagick (if you have it installed)

```bash
# From your source logo/icon
convert source-logo.png -resize 192x192 icon-192x192.png
convert source-logo.png -resize 512x512 icon-512x512.png
```

## Current Favicon Source

The site currently uses: `https://imagedelivery.net/iQbJNjrNARW2nbQ489hjzg/favicon/public`

Download this and use it as the source for generating PWA icons.

## Temporary Solution

Until proper icons are generated, the manifest will fail to validate. This won't break functionality but will prevent installation prompts.

You can temporarily use the favicon URL directly in manifest.json, but it's not recommended for production.
