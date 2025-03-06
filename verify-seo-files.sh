#!/bin/bash
# Script to verify that SEO-critical files are accessible

# Base URL of the website
SITE="https://fatihnayebi.com"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Verifying SEO-critical files for $SITE${NC}"
echo "========================================"

# Test robots.txt
echo -n "Testing robots.txt: "
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/robots.txt")
ROBOTS_SIZE=$(curl -s "$SITE/robots.txt" | wc -c)

if [ "$ROBOTS_STATUS" -eq 200 ]; then
  echo -e "${GREEN}OK (HTTP $ROBOTS_STATUS) - Size: $ROBOTS_SIZE bytes${NC}"
  # Show a snippet of the robots.txt content
  echo "Content snippet:"
  curl -s "$SITE/robots.txt" | head -n 5
  echo "..."
else
  echo -e "${RED}FAILED (HTTP $ROBOTS_STATUS)${NC}"
fi

echo ""

# Test sitemap.xml
echo -n "Testing sitemap.xml: "
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/sitemap.xml")
SITEMAP_SIZE=$(curl -s "$SITE/sitemap.xml" | wc -c)

if [ "$SITEMAP_STATUS" -eq 200 ]; then
  echo -e "${GREEN}OK (HTTP $SITEMAP_STATUS) - Size: $SITEMAP_SIZE bytes${NC}"
  # Check if sitemap is valid XML
  if curl -s "$SITE/sitemap.xml" | grep -q "<?xml"; then
    echo -e "${GREEN}XML validation: OK${NC}"
    # Count URLs in sitemap
    URL_COUNT=$(curl -s "$SITE/sitemap.xml" | grep -c "<loc>")
    echo "Found $URL_COUNT URLs in sitemap"
  else
    echo -e "${RED}XML validation: FAILED (Not valid XML)${NC}"
  fi
else
  echo -e "${RED}FAILED (HTTP $SITEMAP_STATUS)${NC}"
fi

echo ""
echo "Checking headers for both files:"
echo "--------------------------------------"

# Check robots.txt headers
echo "robots.txt headers:"
curl -s -I "$SITE/robots.txt" | grep -E 'Content-Type|Content-Length|Cache-Control'

echo ""

# Check sitemap.xml headers
echo "sitemap.xml headers:"
curl -s -I "$SITE/sitemap.xml" | grep -E 'Content-Type|Content-Length|Cache-Control'

echo ""
echo -e "${YELLOW}Verification complete!${NC}"
echo "Run this script after deploying to ensure SEO files are accessible."
echo "Next steps: Submit your sitemap in Google Search Console" 