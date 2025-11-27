const mysql = require('mysql2/promise');

// MySQL Database Configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'commerce_user',
  password: 'commerce_password',
  database: 'commerce_bank'
};

const viewApplications = async () => {
  let connection;
  
  try {
    console.log('📋 Account Applications Database Viewer');
    console.log('=====================================');
    console.log('🔗 Host: localhost:3306');
    console.log('👤 User: commerce_user');
    console.log('📊 Database: commerce_bank');
    console.log('');

    // Connect to MySQL server
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Get applications count
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM account_applications');
    console.log(`📊 Total Applications: ${countResult[0].count}`);
    console.log('');

    if (countResult[0].count > 0) {
      // Get all applications
      const [applications] = await connection.execute(`
        SELECT 
          id, application_type, status, first_name, last_name, email, 
          phone, city, state, employment_status, annual_income,
          initial_deposit, submitted_at, reviewed_at
        FROM account_applications 
        ORDER BY submitted_at DESC
      `);

      console.log('📋 Recent Applications:');
      console.log('======================');
      
      applications.forEach((app, index) => {
        console.log(`\n${index + 1}. Application ID: ${app.id}`);
        console.log(`   Type: ${app.application_type}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Name: ${app.first_name} ${app.last_name}`);
        console.log(`   Email: ${app.email}`);
        console.log(`   Phone: ${app.phone}`);
        console.log(`   Location: ${app.city}, ${app.state}`);
        console.log(`   Employment: ${app.employment_status}`);
        console.log(`   Income: ${app.annual_income}`);
        console.log(`   Initial Deposit: $${app.initial_deposit}`);
        console.log(`   Submitted: ${app.submitted_at}`);
        if (app.reviewed_at) {
          console.log(`   Reviewed: ${app.reviewed_at}`);
        }
      });
    } else {
      console.log('📝 No applications found in the database.');
      console.log('   Submit a form to see applications here!');
    }

    console.log('\n🎉 Database viewer completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Docker is running');
    console.log('2. Run: docker-compose up -d');
    console.log('3. Make sure the backend server is running');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed.');
    }
  }
};

viewApplications();
