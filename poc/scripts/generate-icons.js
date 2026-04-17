#!/usr/bin/env node

/**
 * Generate PWA icons from a source logo
 *
 * Usage:
 *   node scripts/generate-icons.js path/to/logo.png
 *
 * Requirements:
 *   npm install sharp
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Icon sizes to generate
const SIZES = [
  { size: 192, filename: "icon-192x192.png" },
  { size: 512, filename: "icon-512x512.png" },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, "../public/icons");

async function generateIcons(sourcePath) {
  // Validate source file exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${OUTPUT_DIR}`);
  }

  console.log(`\n🎨 Generating PWA icons from: ${sourcePath}\n`);

  try {
    // Get source image metadata
    const metadata = await sharp(sourcePath).metadata();
    console.log(`Source image: ${metadata.width}x${metadata.height} (${metadata.format})`);

    // Check if image has transparency
    const hasAlpha = metadata.hasAlpha;
    console.log(`Transparency: ${hasAlpha ? "✓" : "✗"}\n`);

    // Generate each icon size
    for (const { size, filename } of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, filename);

      await sharp(sourcePath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated: ${filename} (${size}x${size})`);
    }

    console.log(`\n✨ Success! Icons saved to: ${OUTPUT_DIR}`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Check the generated icons in public/icons/`);
    console.log(`   2. Test the PWA: npm run dev`);
    console.log(`   3. Verify manifest: DevTools → Application → Manifest\n`);
  } catch (error) {
    console.error(`\n❌ Error generating icons:`, error.message);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🎨 PWA Icon Generator

Usage:
  node scripts/generate-icons.js <path-to-logo>

Examples:
  node scripts/generate-icons.js ../logo.png
  node scripts/generate-icons.js ~/Downloads/specialneeds-logo.png

Requirements:
  npm install sharp

This will generate:
  - icon-192x192.png (standard icon)
  - icon-512x512.png (high-res maskable icon)

Output directory: public/icons/
  `);
  process.exit(0);
}

const sourcePath = path.resolve(args[0]);
generateIcons(sourcePath);
