# Icon Generation Scripts

Two scripts available depending on your logo:

## Option 1: Standard Logo → White Background Icons

Use `generate-icons.js` if your logo looks good on white background.

```bash
# Install Sharp (one-time)
npm install sharp

# Generate icons
node scripts/generate-icons.js /path/to/your/logo.png
```

**What it does:**

- Resizes logo to fit icon size
- Adds white background
- Generates 192x192 and 512x512 PNG files

---

## Option 2: Transparent Logo → Custom Background

Use `generate-icons-transparent.js` if you want to preserve transparency or add a custom background color.

```bash
# Install Sharp (one-time)
npm install sharp

# White background (default)
node scripts/generate-icons-transparent.js /path/to/your/logo.png

# Brand blue background
node scripts/generate-icons-transparent.js /path/to/your/logo.png "#007bff"

# Keep transparency
node scripts/generate-icons-transparent.js /path/to/your/logo.png transparent

# Any hex color
node scripts/generate-icons-transparent.js /path/to/your/logo.png "#ff6b6b"
```

**What it does:**

- Adds padding around logo (20px for 192, 50px for 512)
- Applies background color of your choice
- Keeps logo crisp and centered
- Generates 192x192 and 512x512 PNG files

---

## Quick Examples

### If logo is in Downloads folder:

```bash
node scripts/generate-icons-transparent.js ~/Downloads/specialneeds-logo.png white
```

### If logo is in parent directory:

```bash
node scripts/generate-icons-transparent.js ../logo-transparent.png "#007bff"
```

### If logo is somewhere else:

```bash
node scripts/generate-icons-transparent.js /full/path/to/logo.png
```

---

## Output

Both scripts generate files in `public/icons/`:

- `icon-192x192.png` - Standard app icon
- `icon-512x512.png` - High-res maskable icon

---

## Tips

### Logo Recommendations

- **Size:** At least 512x512px (larger is better)
- **Format:** PNG with transparency preferred
- **Content:** Logo should be recognizable at small sizes
- **Padding:** Logo should have internal padding/margins (our scripts add more)

### Choosing Background Color

- **White (`white`)**: Clean, professional, works with most logos
- **Transparent (`transparent`)**: Modern, but may not display well on all launchers
- **Brand Color (`#007bff`)**: Matches your theme, creates cohesive look
- **Contrast**: Ensure logo has good contrast with background

### Testing

After generating:

1. Open `public/icons/` folder
2. Preview the icons
3. Check they look good at small size
4. Test in browser: DevTools → Application → Manifest
5. Look for icon warnings (should be gone)

---

## Troubleshooting

### "Cannot find module 'sharp'"

**Solution:** Install Sharp first

```bash
npm install sharp
```

### "Source file not found"

**Solution:** Check the path to your logo

```bash
# Use full path
node scripts/generate-icons-transparent.js /Users/yourname/Downloads/logo.png

# Or relative from webroot directory
node scripts/generate-icons-transparent.js ../logo.png
```

### Icons look blurry

**Solution:** Use a higher resolution source image (at least 512x512, preferably 1024x1024 or larger)

### Logo too small in icon

**Solution:** Use the standard script without padding

```bash
node scripts/generate-icons.js /path/to/logo.png
```

### Logo too large in icon

**Solution:** The transparent script adds padding automatically. If you need more, edit the script's `SIZES` array to increase padding values.
