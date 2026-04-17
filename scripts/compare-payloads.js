#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../docs/api-examples');
const originalPath = path.join(docsDir, 'listing-editor-response.json');
const savePath = path.join(docsDir, 'save-payload.json');

console.log('\n' + '='.repeat(80));
console.log('COMPARING ORIGINAL GET RESPONSE VS SAVE PUT PAYLOAD');
console.log('='.repeat(80));

// Load files
let original, savePayload;

try {
  const origRaw = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
  original = origRaw.response || origRaw; // Unwrap Django response
} catch (e) {
  console.error('\n❌ Failed to load original response:', e.message);
  process.exit(1);
}

try {
  savePayload = JSON.parse(fs.readFileSync(savePath, 'utf8'));
} catch (e) {
  console.error('\n❌ Failed to load save payload:', e.message);
  console.error('   Run the test first: npx playwright test simple-save-intercept.spec.ts --headed\n');
  process.exit(1);
}

console.log('\n✓ Loaded both files\n');

// Compare top-level structure
console.log('TOP-LEVEL KEYS:');
console.log('  Original:', Object.keys(original).sort().join(', '));
console.log('  Payload: ', Object.keys(savePayload).sort().join(', '));

const origTopKeys = new Set(Object.keys(original));
const payloadTopKeys = new Set(Object.keys(savePayload));

const missingTop = [...origTopKeys].filter(k => !payloadTopKeys.has(k));
const addedTop = [...payloadTopKeys].filter(k => !origTopKeys.has(k));

if (missingTop.length > 0) {
  console.log('\n  ❌ Missing in payload:', missingTop.join(', '));
}
if (addedTop.length > 0) {
  console.log('  ➕ Added in payload:', addedTop.join(', '));
}

// Compare listing_data
console.log('\n' + '-'.repeat(80));
console.log('LISTING_DATA COMPARISON:');
console.log('-'.repeat(80));

const origListing = original.listing_data || {};
const payloadListing = savePayload.listing_data || {};

console.log('\n  Original keys:', Object.keys(origListing).length);
console.log('  Payload keys: ', Object.keys(payloadListing).length);

const origListingKeys = new Set(Object.keys(origListing));
const payloadListingKeys = new Set(Object.keys(payloadListing));

const missingListing = [...origListingKeys].filter(k => !payloadListingKeys.has(k));
const addedListing = [...payloadListingKeys].filter(k => !origListingKeys.has(k));

if (missingListing.length > 0) {
  console.log('\n  ❌ MISSING FIELDS IN PAYLOAD:');
  missingListing.forEach(k => {
    console.log(`     - ${k}`);
  });
} else {
  console.log('\n  ✓ All original fields present in payload');
}

if (addedListing.length > 0) {
  console.log('\n  ➕ NEW FIELDS IN PAYLOAD:');
  addedListing.forEach(k => {
    console.log(`     + ${k}`);
  });
}

// Check specific field changes
console.log('\n' + '-'.repeat(80));
console.log('FIELD CHANGES:');
console.log('-'.repeat(80) + '\n');

const fieldsToCheck = ['title', 'status', 'category', 'content', 'email', 'phone', 'website', 'address', 'lat_long', 'images'];

fieldsToCheck.forEach(field => {
  const origValue = origListing[field];
  const payloadValue = payloadListing[field];

  if (JSON.stringify(origValue) !== JSON.stringify(payloadValue)) {
    console.log(`  ${field}:`);
    if (typeof origValue === 'object' && origValue !== null) {
      const origStr = JSON.stringify(origValue);
      const payloadStr = payloadValue ? JSON.stringify(payloadValue) : 'undefined';
      console.log(`    ORIGINAL: ${origStr.substring(0, 100)}...`);
      console.log(`    PAYLOAD:  ${payloadStr.substring(0, 100)}${payloadStr.length > 100 ? '...' : ''}`);
    } else {
      console.log(`    ORIGINAL: ${origValue}`);
      console.log(`    PAYLOAD:  ${payloadValue}`);
    }
    console.log('');
  }
});

// Compare category_data
console.log('-'.repeat(80));
console.log('CATEGORY_DATA COMPARISON:');
console.log('-'.repeat(80) + '\n');

const origCatData = original.category_data || {};
const payloadCatData = savePayload.category_data || {};

console.log('  Original sections:', Object.keys(origCatData).length);
console.log('  Payload sections: ', Object.keys(payloadCatData).length);

const origCatKeys = new Set(Object.keys(origCatData));
const payloadCatKeys = new Set(Object.keys(payloadCatData));

const missingCat = [...origCatKeys].filter(k => !payloadCatKeys.has(k));
const addedCat = [...payloadCatKeys].filter(k => !origCatKeys.has(k));

if (missingCat.length > 0) {
  console.log('\n  ❌ Missing sections:', missingCat.join(', '));
}
if (addedCat.length > 0) {
  console.log('  ➕ Added sections:', addedCat.join(', '));
}

// Check if category_data is flattened
console.log('\n  Checking category_data structure...');
const firstOrigSection = Object.values(origCatData)[0];
const firstPayloadSection = Object.values(payloadCatData)[0];

if (firstOrigSection && firstOrigSection.fields) {
  console.log('  ✓ Original has nested structure (section.fields.field.attributes.value)');
} else {
  console.log('  ℹ️  Original has flat structure');
}

if (firstPayloadSection && typeof firstPayloadSection === 'object' && !firstPayloadSection.fields) {
  console.log('  ✓ Payload has FLAT structure (section.field = value) - CORRECT!');
} else if (firstPayloadSection && firstPayloadSection.fields) {
  console.log('  ❌ Payload still has NESTED structure - needs flattening!');
}

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80) + '\n');

let allGood = true;

if (missingListing.length > 0) {
  console.log('❌ CRITICAL: Missing fields in listing_data -', missingListing.length, 'fields');
  allGood = false;
} else {
  console.log('✓ All listing_data fields present');
}

if (firstPayloadSection && firstPayloadSection.fields) {
  console.log('❌ CRITICAL: category_data not flattened');
  allGood = false;
} else {
  console.log('✓ category_data properly flattened');
}

if (allGood) {
  console.log('\n✓✓✓ PAYLOAD LOOKS GOOD! ✓✓✓\n');
} else {
  console.log('\n❌❌❌ PAYLOAD HAS ISSUES ❌❌❌\n');
}

console.log('Files compared:');
console.log('  Original:', originalPath);
console.log('  Payload: ', savePath);
console.log('');
