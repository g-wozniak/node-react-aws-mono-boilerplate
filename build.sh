#!/bin/bash

# Remove unnecessary directories
npx rimraf \
  dist/server \
  dist/webapp

# Build application server
npx tsc

# Traverse alias paths and replace them
npx tscpaths \
  -p tsconfig.json \
  -s ./src \
  -o ./dist/server

# Remove unnecessary directories
npx rimraf \
  dist/server/webapp


# Build the web application in production
npx webpack \
  --env WEBAPP_ENV=production

# Build SCSS -> CSS styles
npm run webapp:styles:build

# Copy package.json
cp package.json ./dist/package.json
cp package-lock.json ./dist/package-lock.json

# Copy translation files
# cp ./src/*.json ./dist/server

# Remove __tests__ from build directory
npx rimraf \
  dist/server/server/__tests__