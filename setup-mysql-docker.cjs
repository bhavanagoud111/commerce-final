

const mysql = require('mysql2/promise');

// MySQL Database Configuration for Docker
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'commerce_user',
  password: 'commerce_password',
  database: 'commerce_bank'
};

const setupMySQLDocker = async () => {
  let connection;
  
  try {
    console.log('🐳 MySQL Docker Setup');
    console.log('======================');
    console.log('🔗 Host: localhost:3306');
    console.log('👤 User: commerce_user');
    console.log('📊 Database: commerce_bank');
    console.log('');

    // Wait a moment for MySQL to be ready
    console.log('⏳ Waiting for MySQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Connect to MySQL server
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

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

    console.log('\n🎉 MySQL Docker setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm start (to start the MySQL backend)');
    console.log('2. Run: npm run db:view (to view the database)');
    console.log('3. Your app will now use MySQL instead of SQLite');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Docker is running');
    console.log('2. Run: docker-compose up -d');
    console.log('3. Wait a few seconds for MySQL to start');
    console.log('4. Then run this setup script again');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed.');
    }
  }
};

setupMySQLDocker();
