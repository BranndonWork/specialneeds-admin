// PASTE THIS IN THE BROWSER CONSOLE WHEN ON THE EDIT PAGE

console.log('=== AUTOCOMPLETE DIAGNOSTIC ===');

// Find the Age Group autocomplete
const wrapper = document.querySelector('#autocomplete-Age-Group');
console.log('Wrapper found:', !!wrapper);

if (!wrapper) {
  console.error('ERROR: Autocomplete wrapper not found!');
} else {
  // Find the input
  const input = wrapper.querySelector('input.rbt-input-main');
  console.log('Input found:', !!input);

  // Find current tokens
  const tokens = wrapper.querySelectorAll('.rbt-token');
  console.log(`Current tokens: ${tokens.length}`);
  tokens.forEach((token, i) => {
    console.log(`  Token ${i}: ${token.textContent}`);
  });

  // Click the input to open dropdown
  console.log('\nClicking input to open dropdown...');
  input.click();

  setTimeout(() => {
    // Check dropdown
    const dropdown = document.querySelector('#tag-input-autocomplete-Age-Group');
    console.log('Dropdown found:', !!dropdown);
    console.log('Dropdown visible:', dropdown?.classList.contains('show'));

    const items = document.querySelectorAll('#tag-input-autocomplete-Age-Group .dropdown-item');
    console.log(`\nDropdown items: ${items.length}`);
    items.forEach((item, i) => {
      console.log(`  Item ${i}: ${item.textContent}`);
    });

    // Try to click "Adults"
    const adultsItem = Array.from(items).find(item => item.textContent === 'Adults');
    if (adultsItem) {
      console.log('\nFound "Adults" item. Attaching click listener...');

      // Listen for mousedown, click, mouseup
      ['mousedown', 'click', 'mouseup'].forEach(eventType => {
        adultsItem.addEventListener(eventType, (e) => {
          console.log(`${eventType} event fired on Adults:`, e);
        });
      });

      console.log('Click "Adults" manually and watch the console...');
    } else {
      console.error('ERROR: "Adults" option not found!');
    }
  }, 500);
}
