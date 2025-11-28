import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateSetup() {
  console.log('🔍 Validating Supabase connection...\n');
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    const userCount = await prisma.user.count();
    console.log(`✅ User table accessible (${userCount} users found)`);
    
    const productCount = await prisma.product.count();
    console.log(`✅ Product table accessible (${productCount} products found)`);
    
    const orderCount = await prisma.order.count();
    console.log(`✅ Order table accessible (${orderCount} orders found)`);
    
    console.log('\n🎉 All database checks passed! Your system is ready.');
    
  } catch (error) {
    console.error('\n❌ Setup validation failed:');
    console.error(error);
    console.log('\n💡 Make sure you have:');
    console.log('   1. Replaced [YOUR-PASSWORD] in .env file with your actual Supabase password');
    console.log('   2. Run: npx prisma migrate deploy');
    console.log('   3. Run: npx prisma db seed (optional)');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateSetup();
