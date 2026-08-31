#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Proxy Panel - One Command Setup
# ═══════════════════════════════════════════════════════════════════════════
# Just run: bash setup.sh
# It will:
#   1. Install dependencies
#   2. Login to Cloudflare
#   3. Create D1 database
#   4. Apply schema
#   5. Build frontend
#   6. Deploy everything
# ═══════════════════════════════════════════════════════════════════════════

set -e

echo ""
echo "⚡ Proxy Panel - Automated Setup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1/6: Installing dependencies..."
bun install --frozen-lockfile 2>/dev/null || bun install
echo "✅ Dependencies installed"
echo ""

# Step 2: Login to Cloudflare
echo "🔐 Step 2/6: Login to Cloudflare..."
if [ -f ~/.wrangler/config/default.toml ]; then
  echo "✅ Already logged in"
else
  npx wrangler login
  echo "✅ Logged in"
fi
echo ""

# Step 3: Create D1 database
echo "🗄️  Step 3/6: Creating D1 database..."
EXISTING=$(npx wrangler d1 list 2>/dev/null | grep "proxy-panel" | awk '{print $1}' || true)
if [ -n "$EXISTING" ]; then
  DB_ID="$EXISTING"
  echo "✅ D1 already exists: $DB_ID"
else
  RESULT=$(npx wrangler d1 create proxy-panel 2>&1)
  DB_ID=$(echo "$RESULT" | grep -oP 'database_id = "\K[^"]+')
  echo "✅ D1 created: $DB_ID"
fi
echo ""

# Step 4: Update wrangler.toml
echo "📝 Step 4/6: Updating wrangler.toml..."
sed -i "s/database_id = \"[^\"]*\"/database_id = \"$DB_ID\"/" wrangler.toml
echo "✅ wrangler.toml updated"
echo ""

# Step 5: Apply schema
echo "📊 Step 5/6: Applying database schema..."
npx wrangler d1 execute proxy-panel --file=d1/schema.sql 2>/dev/null || \
npx wrangler d1 execute "$DB_ID" --file=d1/schema.sql
echo "✅ Schema applied"
echo ""

# Step 6: Deploy
echo "🚀 Step 6/6: Deploying..."
npx wrangler deploy
echo ""

# Done!
echo "════════════════════════════════════════════════════════════"
echo "✅ Deployment Complete!"
echo ""
echo "🔗 Your panel: https://proxy-panel.YOUR_SUBDOMAIN.workers.dev"
echo ""
echo "Next time just run: npx wrangler deploy"
echo "════════════════════════════════════════════════════════════"
