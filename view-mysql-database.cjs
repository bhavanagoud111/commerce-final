const mysql = require('mysql2/promise');

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'commerce_user',
  password: process.env.DB_PASSWORD || 'commerce_password',
  database: process.env.DB_NAME || 'commerce_bank'
};

const viewDatabase = async () => {
  let connection;
  
  try {
    console.log('🗄️  Commerce Bank MySQL Database Viewer');
    console.log('=======================================');
    console.log(`🔗 Connecting to: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log('');

    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');

    // Get all users
    const [users] = await connection.execute('SELECT * FROM users ORDER BY created_at DESC');
    
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
        console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
        console.log(`   Created: ${user.created_at}`);
      });
    }
    
    // Get database info
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(`\n📋 Tables in database: ${tables.map(t => Object.values(t)[0]).join(', ')}`);
    
    // Get table structure
    const [columns] = await connection.execute("DESCRIBE users");
    console.log('\n🏗️  Users table structure:');
    columns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error reading database:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials');
    console.log('3. Create a MySQL database named "commerce_bank"');
    console.log('4. Update the database configuration in this file');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed.');
    }
  }
};

viewDatabase();
