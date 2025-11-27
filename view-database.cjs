const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database('commerce_bank.db');

console.log('🗄️  Commerce Bank Database Viewer');
console.log('==================================');

try {
  // Get all users
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  
  console.log(`\n📊 Total Users: ${users.length}`);
  console.log('=====================================');
  
  if (users.length === 0) {
    console.log('No users found in database.');
  } else {
    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Created: ${user.created_at}`);
    });
  }
  
  // Get database info
  const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`\n📋 Tables in database: ${tableInfo.map(t => t.name).join(', ')}`);
  
} catch (error) {
  console.error('❌ Error reading database:', error.message);
} finally {
  db.close();
  console.log('\n✅ Database connection closed.');
}
