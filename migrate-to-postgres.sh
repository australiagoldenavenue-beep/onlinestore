#!/bin/bash

# Migration Script: SQLite to PostgreSQL
# This script helps you migrate from SQLite to PostgreSQL

echo "🔄 SQLite to PostgreSQL Migration Script"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Backup current database
echo -e "${BLUE}Step 1: Backing up current SQLite database...${NC}"
if [ -f "prisma/dev.db" ]; then
    cp prisma/dev.db "prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✓ Backup created${NC}"
else
    echo -e "${YELLOW}⚠ No SQLite database found (this is okay if starting fresh)${NC}"
fi
echo ""

# Step 2: Check for .env file
echo -e "${BLUE}Step 2: Checking .env configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file found${NC}"
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env; then
        current_db=$(grep "DATABASE_URL=" .env)
        echo -e "Current: ${current_db}"
        
        if echo "$current_db" | grep -q "postgresql://"; then
            echo -e "${GREEN}✓ Already configured for PostgreSQL${NC}"
        else
            echo -e "${YELLOW}⚠ Currently using SQLite${NC}"
            echo -e "${YELLOW}  Please update DATABASE_URL in .env with your PostgreSQL connection string${NC}"
        fi
    else
        echo -e "${RED}✗ DATABASE_URL not found in .env${NC}"
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    echo -e "${YELLOW}  Please create .env file first${NC}"
    exit 1
fi
echo ""

# Step 3: Backup current schema
echo -e "${BLUE}Step 3: Backing up current schema.prisma...${NC}"
cp prisma/schema.prisma "prisma/schema.prisma.backup.$(date +%Y%m%d_%H%M%S)"
echo -e "${GREEN}✓ Schema backup created${NC}"
echo ""

# Step 4: Update schema to PostgreSQL
echo -e "${BLUE}Step 4: Updating schema.prisma for PostgreSQL...${NC}"
if [ -f "prisma/schema.postgres.prisma" ]; then
    cp prisma/schema.postgres.prisma prisma/schema.prisma
    echo -e "${GREEN}✓ Schema updated to PostgreSQL version${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL schema template not found${NC}"
    echo -e "${YELLOW}  Manually update datasource in schema.prisma:${NC}"
    echo -e "  provider = \"postgresql\""
fi
echo ""

# Step 5: Install dependencies
echo -e "${BLUE}Step 5: Installing/Checking dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies checked${NC}"
echo ""

# Step 6: Generate Prisma Client
echo -e "${BLUE}Step 6: Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"
echo ""

# Step 7: Push schema to PostgreSQL
echo -e "${BLUE}Step 7: Pushing schema to PostgreSQL database...${NC}"
echo -e "${YELLOW}⚠ This will create tables in your PostgreSQL database${NC}"
read -p "Continue? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push
    echo -e "${GREEN}✓ Schema pushed to database${NC}"
else
    echo -e "${YELLOW}Skipped database push${NC}"
fi
echo ""

# Step 8: Seed database
echo -e "${BLUE}Step 8: Seeding database with initial data...${NC}"
read -p "Seed database? This will create admin user (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db seed
    echo -e "${GREEN}✓ Database seeded${NC}"
    echo -e "${GREEN}  Admin login: admin@store.com / admin123${NC}"
else
    echo -e "${YELLOW}Skipped seeding${NC}"
fi
echo ""

# Step 9: Clear build cache
echo -e "${BLUE}Step 9: Clearing build cache...${NC}"
rm -rf .next
rm -f tsconfig.tsbuildinfo
echo -e "${GREEN}✓ Build cache cleared${NC}"
echo ""

# Step 10: Final instructions
echo -e "${GREEN}=========================================="
echo -e "✓ Migration steps completed!"
echo -e "==========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Verify your .env has correct PostgreSQL DATABASE_URL"
echo -e "2. Run: ${GREEN}npm run dev${NC}"
echo -e "3. Test login at: ${GREEN}http://localhost:3000/login${NC}"
echo -e "4. Open Prisma Studio: ${GREEN}npx prisma studio${NC}"
echo ""
echo -e "${BLUE}Default Admin Credentials:${NC}"
echo -e "Email: ${GREEN}admin@store.com${NC}"
echo -e "Password: ${GREEN}admin123${NC}"
echo ""
echo -e "${YELLOW}Backups created:${NC}"
echo -e "- prisma/dev.db.backup.*"
echo -e "- prisma/schema.prisma.backup.*"
echo ""

# Check if DATABASE_URL is PostgreSQL
if grep -q "DATABASE_URL=\"postgresql://" .env; then
    echo -e "${GREEN}✓ Ready to start development server!${NC}"
    echo -e "Run: ${GREEN}npm run dev${NC}"
else
    echo -e "${YELLOW}⚠ Warning: DATABASE_URL in .env doesn't look like PostgreSQL${NC}"
    echo -e "${YELLOW}  Please update it before running npm run dev${NC}"
fi
