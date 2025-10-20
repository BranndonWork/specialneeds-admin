#!/bin/bash

# Exit on error
set -e

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 20
nvm use 20.19.0

# Navigate to webroot
cd webroot

# Remove manually created files if they exist
rm -f tailwind.config.js postcss.config.js

# Uninstall Tailwind v4 and install v3
npm uninstall tailwindcss
npm install -D tailwindcss@3 postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Add Tailwind directives to CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "✅ Tailwind CSS v3 configured successfully!"
echo ""
echo "To start the dev server:"
echo "  cd webroot"
echo "  npm run dev"
