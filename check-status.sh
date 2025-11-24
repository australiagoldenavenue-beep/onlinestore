#!/bin/bash

echo "🔍 Checking System Status..."
echo "=============================="
echo ""

# Check if server is running
echo "1. Server Status:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ Server is running on http://localhost:3000"
else
    echo "   ❌ Server is NOT running"
    echo "   Run: npm run dev"
    exit 1
fi

echo ""
echo "2. Testing Key Pages:"
echo "   Homepage: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000)"
echo "   Products: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/products)"
echo "   Cart: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/cart)"
echo "   Contact: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/contact)"

echo ""
echo "3. Recent File Changes:"
ls -lt src/components/*.tsx | head -5
echo ""

echo "=============================="
echo ""
echo "📝 If you see errors in browser:"
echo "1. Open DevTools (F12)"
echo "2. Check Console tab for errors"
echo "3. Check Network tab for failed requests"
echo "4. Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)"
echo ""
echo "🔄 To restart server:"
echo "   Ctrl+C to stop, then: npm run dev"
