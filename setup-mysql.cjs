const mysql = require('mysql2/promise');

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'commerce_bank'
};

const setupMySQL = async () => {
  let connection;
  
  try {
    console.log('🔧 MySQL Database Setup');
    console.log('=======================');
    console.log(`🔗 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`👤 User: ${dbConfig.user}`);
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log('');

    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`✅ Database '${dbConfig.database}' created/verified`);

    // Switch to the database
    await connection.execute(`USE ${dbConfig.database}`);
    console.log(`✅ Switched to database '${dbConfig.database}'`);

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    console.log('\n🎉 MySQL setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm start (to start the MySQL backend)');
    console.log('2. Run: npm run db:view (to view the database)');
    console.log('3. Your app will now use MySQL instead of SQLite');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Check your MySQL credentials');
    console.log('3. Try: brew install mysql (on macOS)');
    console.log('4. Try: sudo service mysql start (on Linux)');
    console.log('5. Update the database configuration in mysql-backend.cjs');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed.');
    }
  }
};

setupMySQL();
