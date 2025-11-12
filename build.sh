#!/bin/bash

echo "========================================="
echo "Building QuickBook - Frontend + Backend"
echo "========================================="

echo ""
echo "📦 Step 1: Building Frontend..."
cd frontend
npm ci --include=dev
npm run build
cd ..

echo ""
echo "📦 Step 2: Installing Backend Dependencies..."
cd backend
npm install

echo ""
echo "🗄️  Step 3: Setting up Database..."
npx prisma generate
npx prisma migrate deploy

echo ""
echo "========================================="
echo "✅ Build Complete!"
echo "========================================="
