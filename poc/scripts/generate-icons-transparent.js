#!/usr/bin/env node

/**
 * Generate PWA icons from a transparent logo
 * This version KEEPS the transparency and adds padding
 *
 * Usage:
 *   node scripts/generate-icons-transparent.js path/to/logo.png
 *
 * Requirements:
 *   npm install sharp
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Icon sizes to generate
const SIZES = [
  { size: 192, filename: "icon-192x192.png", padding: 20 },
  { size: 512, filename: "icon-512x512.png", padding: 50 },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, "../public/icons");

async function generateIcons(sourcePath, backgroundColor) {
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

  console.log(`\n🎨 Generating PWA icons from: ${sourcePath}`);
  console.log(`Background color: ${backgroundColor}\n`);

  try {
    // Get source image metadata
    const metadata = await sharp(sourcePath).metadata();
    console.log(`Source image: ${metadata.width}x${metadata.height} (${metadata.format})`);
    console.log(`Transparency: ${metadata.hasAlpha ? "✓" : "✗"}\n`);

    // Parse background color (supports hex, rgb, named colors)
    let bgColor;
    if (backgroundColor === "transparent") {
      bgColor = { r: 0, g: 0, b: 0, alpha: 0 };
    } else if (backgroundColor.startsWith("#")) {
      // Hex color
      const hex = backgroundColor.replace("#", "");
      bgColor = {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16),
        alpha: 1,
      };
    } else if (backgroundColor === "white") {
      bgColor = { r: 255, g: 255, b: 255, alpha: 1 };
    } else {
      // Default to brand blue
      bgColor = { r: 0, g: 123, b: 255, alpha: 1 }; // #007bff
    }

    // Generate each icon size
    for (const { size, filename, padding } of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, filename);
      const logoSize = size - padding * 2;

      await sharp(sourcePath)
        .resize(logoSize, logoSize, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent during resize
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: bgColor,
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated: ${filename} (${size}x${size}, ${padding}px padding)`);
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
🎨 PWA Icon Generator (Transparent Logo Version)

Usage:
  node scripts/generate-icons-transparent.js <path-to-logo> [background-color]

Examples:
  node scripts/generate-icons-transparent.js ../logo.png
  node scripts/generate-icons-transparent.js ../logo.png white
  node scripts/generate-icons-transparent.js ../logo.png "#007bff"
  node scripts/generate-icons-transparent.js ../logo.png transparent

Background color options:
  - "white" (default)
  - "transparent" (keeps transparency)
  - "#007bff" (hex color)
  - Any valid hex color

This will generate:
  - icon-192x192.png (with 20px padding)
  - icon-512x512.png (with 50px padding)

Output directory: public/icons/
  `);
  process.exit(0);
}

const sourcePath = path.resolve(args[0]);
const backgroundColor = args[1] || "white";
generateIcons(sourcePath, backgroundColor);
