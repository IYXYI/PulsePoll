#!/usr/bin/env bash
set -e
echo "Installing frontend and worker dependencies..."
cd frontend
npm install
cd ../wrangler
npm install
echo "Bootstrap complete. Run 'npm run dev' in frontend and 'npx wrangler dev' in wrangler to develop."
