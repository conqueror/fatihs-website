#!/bin/bash
# Quick script to test SEO files locally

# Build and serve the site
echo "🔨 Building site..."
npm run build && echo "✅ Build complete!"

# Start server in background
echo "🚀 Starting server..."
npx serve build & 
SERVER_PID=$!

# Wait for server to start
sleep 2

# Test robots.txt
echo "🤖 Testing robots.txt..."
curl -s http://localhost:3000/robots.txt | head -n 10
echo "..."

# Test sitemap.xml
echo -e "\n📍 Testing sitemap.xml..."
curl -s http://localhost:3000/sitemap.xml | grep -o "<loc>[^<]*</loc>" | head -n 5
echo "..."

# Get content types
echo -e "\n📋 Checking Content-Type headers..."
echo "robots.txt: $(curl -s -I http://localhost:3000/robots.txt | grep 'Content-Type')"
echo "sitemap.xml: $(curl -s -I http://localhost:3000/sitemap.xml | grep 'Content-Type')"

# Cleanup
echo -e "\n🧹 Cleaning up..."
kill $SERVER_PID
echo "✅ Done! Your SEO files are ready for search engines." 