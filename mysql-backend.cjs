const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// JWT Secret - REQUIRED from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is required');
  console.error('Generate one using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}

// Gmail SMTP Configuration - Optional but recommended
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Create nodemailer transporter only if credentials are available
let transporter = null;
if (SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
} else {
  console.warn('WARNING: SMTP credentials not set. OTP emails will not work.');
  console.warn('Set SMTP_USER and SMTP_PASS in .env file to enable OTP authentication.');
}

// OTP storage (in-memory, expires after 5 minutes)
const otpStore = new Map();

// Pending login sessions (username -> user data, expires after 5 minutes)
const pendingLogins = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTP(email, otp) {
  if (!transporter) {
    throw new Error('SMTP transporter not configured. Please set SMTP_USER and SMTP_PASS in .env file.');
  }
  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: "Your Commerce Bank OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Commerce Bank</h2>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            <h3 style="color: #111827; margin-top: 0;">Your OTP Code</h3>
            <p style="color: #4b5563; font-size: 16px;">Your one-time password (OTP) for Commerce Bank is:</p>
            <div style="background: white; border: 2px dashed #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #10b981; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
              This code will expire in <strong>5 minutes</strong>. Do not share this code with anyone.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              If you didn't request this code, please ignore this email or contact support.
            </p>
          </div>
        </div>
      `,
      text: `Your Commerce Bank OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`
    });
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'commerce_user',
  password: process.env.DB_PASSWORD || 'commerce_password',
  database: process.env.DB_NAME || 'commerce_bank',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create tables
const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create accounts table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        account_number VARCHAR(20) UNIQUE NOT NULL,
        account_type ENUM('checking', 'savings', 'credit') DEFAULT 'checking',
        balance DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create transactions table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(36) PRIMARY KEY,
        from_account_id VARCHAR(36),
        to_account_id VARCHAR(36),
        amount DECIMAL(15,2) NOT NULL,
        transaction_type ENUM('deposit', 'withdrawal', 'transfer', 'payment') NOT NULL,
        description TEXT,
        status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
        FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL
      )
    `);
    
    // Create account applications table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS account_applications (
        id VARCHAR(36) PRIMARY KEY,
        application_type ENUM('basic_checking', 'premium_checking', 'student_checking', 'savings', 'credit_card') NOT NULL,
        status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
        
        -- Personal Information
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        date_of_birth DATE NOT NULL,
        ssn VARCHAR(11) NOT NULL,
        
        -- Address Information
        street_address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(2) NOT NULL,
        zip_code VARCHAR(10) NOT NULL,
        
        -- Employment Information
        employment_status ENUM('employed', 'self-employed', 'unemployed', 'retired', 'student', 'other') NOT NULL,
        employer_name VARCHAR(255),
        job_title VARCHAR(255),
        annual_income ENUM('under-25k', '25k-50k', '50k-75k', '75k-100k', '100k-150k', 'over-150k') NOT NULL,
        
        -- Account Preferences
        initial_deposit DECIMAL(15,2) DEFAULT 0.00,
        account_purpose ENUM('daily-expenses', 'bill-payments', 'savings', 'business', 'other'),
        has_existing_account BOOLEAN DEFAULT FALSE,
        
        -- Additional Information
        additional_info TEXT,
        agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
        agree_to_marketing BOOLEAN DEFAULT FALSE,
        
        -- Authentication Information
        username VARCHAR(255),
        password VARCHAR(255),
        
        -- Credit Card Information
        credit_limit DECIMAL(15,2) NULL,
        
        -- Application Metadata
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP NULL,
        reviewed_by VARCHAR(36) NULL,
        notes TEXT NULL
      )
    `);

// Create loan_applications table
await pool.execute(`
  CREATE TABLE IF NOT EXISTS loan_applications (
    id VARCHAR(36) PRIMARY KEY,
    loan_type ENUM('Personal Loan', 'Auto Loan', 'Home Equity Loan') NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
    
    -- Personal Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    
    -- Address Information
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    
    -- Employment Information
    employment_status ENUM('employed', 'self-employed', 'unemployed', 'retired', 'student', 'other') NOT NULL,
    employer_name VARCHAR(255),
    job_title VARCHAR(255),
    annual_income ENUM('under-25k', '25k-50k', '50k-75k', '75k-100k', '100k-150k', 'over-150k') NOT NULL,
    work_phone VARCHAR(20),
    
    -- Loan Information
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_purpose ENUM('debt-consolidation', 'home-improvement', 'major-purchase', 'education', 'medical-expenses', 'business', 'other') NOT NULL,
    down_payment DECIMAL(15,2) DEFAULT 0.00,
    
    -- Auto Loan Specific
    vehicle_year INT,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    
    -- Home Equity Loan Specific
    property_value DECIMAL(15,2),
    
    -- Additional Information
    additional_info TEXT,
    agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
    agree_to_marketing BOOLEAN DEFAULT FALSE,
    
    -- Application Metadata
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(36) NULL,
    notes TEXT NULL
  )
`);

// Create branches table
await pool.execute(`
  CREATE TABLE IF NOT EXISTS branches (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('branch', 'atm') NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20),
    hours JSON,
    services JSON,
    is_24_hours BOOLEAN DEFAULT FALSE,
    has_drive_thru BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    is_accessible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

// Create business_accounts table
await pool.execute(`
  CREATE TABLE IF NOT EXISTS business_accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    account_type ENUM('business_checking', 'business_savings', 'merchant_services') NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    ein VARCHAR(20),
    business_address VARCHAR(500) NOT NULL,
    business_city VARCHAR(100) NOT NULL,
    business_state VARCHAR(50) NOT NULL,
    business_zip VARCHAR(20) NOT NULL,
    business_phone VARCHAR(20) NOT NULL,
    business_email VARCHAR(255) NOT NULL,
    annual_revenue DECIMAL(15,2),
    number_of_employees INT,
    years_in_business INT,
    primary_contact_name VARCHAR(255) NOT NULL,
    primary_contact_title VARCHAR(100),
    primary_contact_phone VARCHAR(20) NOT NULL,
    primary_contact_email VARCHAR(255) NOT NULL,
    account_purpose TEXT,
    expected_monthly_transactions INT,
    expected_monthly_volume DECIMAL(15,2),
    initial_deposit DECIMAL(15,2),
    status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(36),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);
    
    // Create user accounts for existing users
    const [users] = await pool.execute('SELECT id FROM users');
    for (const user of users) {
      // Check if user already has accounts
      const [existingAccounts] = await pool.execute(
        'SELECT COUNT(*) as count FROM accounts WHERE user_id = ?',
        [user.id]
      );
      
      if (existingAccounts[0].count === 0) {
        // Create default accounts for user
        const checkingAccountId = uuidv4();
        const savingsAccountId = uuidv4();
        const creditAccountId = uuidv4();
        
        await pool.execute(
          'INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)',
          [checkingAccountId, user.id, `CHK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 'checking', 1000.00]
        );
        
        await pool.execute(
          'INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)',
          [savingsAccountId, user.id, `SAV${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 'savings', 5000.00]
        );
        
        await pool.execute(
          'INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)',
          [creditAccountId, user.id, `CC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 'credit', 0.00]
        );
      }
    }
    
    console.log('✅ Enhanced database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Health Check
app.get('/', async (req, res) => {
  try {
    const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [accountRows] = await pool.execute('SELECT COUNT(*) as count FROM accounts');
    const [transactionRows] = await pool.execute('SELECT COUNT(*) as count FROM transactions');
    
    res.json({
      success: true,
      message: 'Commerce Bank Enhanced API with MySQL Database is running',
      timestamp: new Date().toISOString(),
      database: 'MySQL',
      stats: {
        users: userRows[0].count,
        accounts: accountRows[0].count,
        transactions: transactionRows[0].count
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'API is running, but database connection failed',
      error: error.message
    });
  }
});

// Registration Endpoint
app.post('/register', async (req, res) => {
  console.log('Registration request:', req.body);
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Check for duplicate username or email
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      const duplicateField = existingUsers[0].username === username ? 'Username' : 'Email';
      return res.status(409).json({ success: false, message: `${duplicateField} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    await pool.execute(
      'INSERT INTO users (id, name, email, username, password) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, username, hashedPassword]
    );
    
    // Create default accounts for new user
    const checkingAccountId = uuidv4();
    const savingsAccountId = uuidv4();
    const creditAccountId = uuidv4();
    
    await pool.execute(
      'INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)',
      [checkingAccountId, userId, `CHK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 'checking', 1000.00]
    );
    
    await pool.execute(
      'INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)',
      [savingsAccountId, userId, `SAV${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 'savings', 5000.00]
    );
    
    await pool.execute(
      'INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)',
      [creditAccountId, userId, `CC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 'credit', 0.00]
    );
    
    console.log('User registered with accounts:', { userId, name, email, username });
    res.status(200).json({ 
      success: true, 
      message: 'Registration successfully completed', 
      user: { id: userId, name, email, username } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
});

// Login Endpoint - Step 1: Verify credentials and send OTP
app.post('/login', async (req, res) => {
  console.log('Login request:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username or password' });
  }

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Credentials are valid - send OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(user.email, {
      otp,
      expiresAt,
      attempts: 0
    });

    // Store pending login session
    pendingLogins.set(user.email, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username
      },
      expiresAt
    });

    // Send OTP email
    try {
      await sendOTP(user.email, otp);
      console.log(`OTP sent to ${user.email} for login`);
      
      res.status(200).json({ 
        success: true, 
        message: 'OTP sent to your email. Please verify to complete login.',
        requiresOTP: true,
        email: user.email // Send masked email for display
      });
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      // Clear stored data on email failure
      otpStore.delete(user.email);
      pendingLogins.delete(user.email);
      
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
});

// Login Endpoint - Step 2: Verify OTP and complete login
app.post('/verify-login-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);
    const pendingLogin = pendingLogins.get(email);

    if (!storedData || !pendingLogin) {
      return res.status(400).json({ success: false, message: 'No pending login found. Please login again.' });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      pendingLogins.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please login again.' });
    }

    // Check attempts (max 5 attempts)
    if (storedData.attempts >= 5) {
      otpStore.delete(email);
      pendingLogins.delete(email);
      return res.status(400).json({ success: false, message: 'Too many failed attempts. Please login again.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      otpStore.set(email, storedData);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.',
        remainingAttempts: 5 - storedData.attempts
      });
    }

    // OTP verified - complete login
    const user = pendingLogin.user;
    const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Clean up
    otpStore.delete(email);
    pendingLogins.delete(email);

    console.log('User logged in with OTP:', { userId: user.id, username: user.username });
    
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      user: { 
        userId: user.id, 
        name: user.name, 
        email: user.email, 
        username: user.username 
      } 
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP. Please try again.' 
    });
  }
});

// Get user accounts with application matching
app.get('/accounts', authenticateToken, async (req, res) => {
  try {
    // Get user's email from the token
    const [users] = await pool.execute('SELECT email FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userEmail = users[0].email;
    console.log('Checking accounts for user email:', userEmail);
    
    // Check if user has any approved applications
    const [applications] = await pool.execute(
      'SELECT *, credit_limit FROM account_applications WHERE email = ? AND status = "approved"',
      [userEmail]
    );
    
    let accounts = [];
    
    if (applications.length > 0) {
      // User has approved applications - create accounts for each
      console.log('Found matching applications:', applications.length);
      
      applications.forEach(application => {
        const accountType = application.application_type;
        const accountId = accountType + '-' + application.id;
        const accountNumber = accountType.toUpperCase().substring(0, 2) + application.id.substring(0, 8).toUpperCase();
        
        const accountData = {
          id: accountId,
          account_number: accountNumber,
          account_type: accountType,
          balance: parseFloat(application.initial_deposit) || 0,
          created_at: application.submitted_at,
          application_id: application.id
        };
        
        // Add credit limit for credit card applications
        console.log('Processing account:', accountType, 'Credit limit:', application.credit_limit);
        if ((accountType === 'credit' || 
             accountType === 'cash_back_card' || 
             accountType === 'travel_rewards_card' || 
             accountType === 'student_credit_card') && 
            application.credit_limit) {
          accountData.credit_limit = parseFloat(application.credit_limit);
          console.log('Added credit limit:', accountData.credit_limit);
        }
        
        accounts.push(accountData);
      });
      
      // Only return accounts that the user has actually applied for and been approved
      // No need to add placeholder accounts for types they haven't applied for
    } else {
      // No matching applications - return empty array (no accounts to show)
      accounts = [];
    }
    
    console.log('Returning accounts:', accounts);
    res.json({ success: true, accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching accounts' });
  }
});

// Get user transactions
app.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Get user's email for application-based accounts
    const [users] = await pool.execute('SELECT email FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0) {
      return res.json({ success: true, transactions: [] });
    }
    const userEmail = users[0].email;
    
    // Get user's application-based account IDs only
    const [applications] = await pool.execute(
      'SELECT id, application_type, email FROM account_applications WHERE email = ? AND status = "approved"',
      [userEmail]
    );
    
    // Create account ID list for application-based accounts only
    const appAccountIds = applications.map(app => app.application_type + '-' + app.id);
    const allAccountIds = appAccountIds;
    
    if (allAccountIds.length === 0) {
      return res.json({ success: true, transactions: [] });
    }
    
    // Get all transactions (we'll enhance with user info manually for application-based accounts)
    const [allTransactions] = await pool.execute(
      `SELECT * FROM transactions ORDER BY created_at DESC`
    );
    
    // Filter transactions that belong to this user
    const userTransactions = allTransactions.filter(transaction => {
      return allAccountIds.includes(transaction.from_account_id) || 
             allAccountIds.includes(transaction.to_account_id);
    });
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const endIndex = startIndex + (parseInt(limit) || 50);
    const paginatedTransactions = userTransactions.slice(startIndex, endIndex);
    
    // Enhance transaction data with account and user information
    console.log('Enhancing transactions, applications available:', applications.length);
    console.log('Sample applications:', applications.slice(0, 2));
    console.log('User email for lookup:', userEmail);
    console.log('First transaction:', paginatedTransactions[0]);
    const enhancedTransactions = await Promise.all(paginatedTransactions.map(async (transaction) => {
      let fromAccountInfo = null;
      let toAccountInfo = null;
      let fromUserInfo = null;
      let toUserInfo = null;
      
      // Handle from account
      if (transaction.from_account_id) {
        if (transaction.from_account_id.includes('-') && !transaction.from_account_id.includes('no-account')) {
          // Application-based account - look up the application directly
          const parts = transaction.from_account_id.split('-');
          if (parts.length >= 2) {
            const appType = parts[0];
            const appId = parts.slice(1).join('-');
            
            // Look up the application directly from database
            const [fromApps] = await pool.execute(
              'SELECT id, application_type, email FROM account_applications WHERE id = ? AND application_type = ? AND status = "approved"',
              [appId, appType]
            );
            
            if (fromApps.length > 0) {
              const fromApp = fromApps[0];
              fromAccountInfo = {
                account_number: `${appType.toUpperCase().substring(0, 2)}${appId.substring(0, 8).toUpperCase()}`,
                account_type: appType
              };
              
              // Get user info for application-based account
              if (fromApp.email) {
                console.log('Looking up from user for email:', fromApp.email);
                const [appUsers] = await pool.execute(
                  'SELECT name, username FROM users WHERE email = ?',
                  [fromApp.email]
                );
                console.log('Found from users:', appUsers);
                if (appUsers.length > 0) {
                  fromUserInfo = {
                    name: appUsers[0].name,
                    username: appUsers[0].username
                  };
                  console.log('Set fromUserInfo:', fromUserInfo);
                }
              }
            }
          }
        } else {
          // Regular account - get user info
          if (transaction.from_account_id) {
            const [regularUsers] = await pool.execute(
              'SELECT u.name, u.username FROM users u JOIN accounts a ON u.id = a.user_id WHERE a.id = ?',
              [transaction.from_account_id]
            );
            if (regularUsers.length > 0) {
              fromUserInfo = {
                name: regularUsers[0].name,
                username: regularUsers[0].username
              };
            }
          }
          if (transaction.from_account_number) {
            fromAccountInfo = {
              account_number: transaction.from_account_number,
              account_type: transaction.from_account_type
            };
          }
        }
      }
      
      // Handle to account
      if (transaction.to_account_id) {
        if (transaction.to_account_id.includes('-') && !transaction.to_account_id.includes('no-account')) {
          // Application-based account - look up the application directly
          const parts = transaction.to_account_id.split('-');
          if (parts.length >= 2) {
            const appType = parts[0];
            const appId = parts.slice(1).join('-');
            
            // Look up the application directly from database
            const [toApps] = await pool.execute(
              'SELECT id, application_type, email FROM account_applications WHERE id = ? AND application_type = ? AND status = "approved"',
              [appId, appType]
            );
            
            if (toApps.length > 0) {
              const toApp = toApps[0];
              toAccountInfo = {
                account_number: `${appType.toUpperCase().substring(0, 2)}${appId.substring(0, 8).toUpperCase()}`,
                account_type: appType
              };
              
              // Get user info for application-based account
              if (toApp.email) {
                console.log('Looking up to user for email:', toApp.email);
                const [appUsers] = await pool.execute(
                  'SELECT name, username FROM users WHERE email = ?',
                  [toApp.email]
                );
                console.log('Found to users:', appUsers);
                if (appUsers.length > 0) {
                  toUserInfo = {
                    name: appUsers[0].name,
                    username: appUsers[0].username
                  };
                  console.log('Set toUserInfo:', toUserInfo);
                }
              }
            }
          }
        } else {
          // Regular account - get user info
          if (transaction.to_account_id) {
            const [regularUsers] = await pool.execute(
              'SELECT u.name, u.username FROM users u JOIN accounts a ON u.id = a.user_id WHERE a.id = ?',
              [transaction.to_account_id]
            );
            if (regularUsers.length > 0) {
              toUserInfo = {
                name: regularUsers[0].name,
                username: regularUsers[0].username
              };
            }
          }
          if (transaction.to_account_number) {
            toAccountInfo = {
              account_number: transaction.to_account_number,
              account_type: transaction.to_account_type
            };
          }
        }
      }
      
      return {
        ...transaction,
        from_account_number: fromAccountInfo?.account_number || transaction.from_account_number,
        from_account_type: fromAccountInfo?.account_type || transaction.from_account_type,
        to_account_number: toAccountInfo?.account_number || transaction.to_account_number,
        to_account_type: toAccountInfo?.account_type || transaction.to_account_type,
        from_user_name: fromUserInfo?.name,
        from_username: fromUserInfo?.username,
        to_user_name: toUserInfo?.name,
        to_username: toUserInfo?.username
      };
    }));
    
    res.json({ success: true, transactions: enhancedTransactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error fetching transactions', error: error.message });
  }
});

// Transfer money between accounts
app.post('/transfer', authenticateToken, async (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;
  
  if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid transfer parameters' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Get user email for application-based accounts
    const [users] = await connection.execute('SELECT email FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userEmail = users[0].email;
    
    // Check if accounts are application-based or regular accounts
    const isFromAppAccount = fromAccountId.includes('-') && !fromAccountId.includes('no-account');
    const isToAppAccount = toAccountId.includes('-') && !toAccountId.includes('no-account');
    
    let fromAccount, toAccount;
    
    // Get applications once if needed
    let applications = [];
    if (isFromAppAccount || isToAppAccount) {
      const [apps] = await connection.execute(
        'SELECT * FROM account_applications WHERE email = ? AND status = "approved"',
        [userEmail]
      );
      applications = apps;
    }
    
    if (isFromAppAccount) {
      // Handle application-based account
      console.log('Looking for fromAccountId:', fromAccountId);
      console.log('Available applications:', applications.map(app => app.application_type + '-' + app.id));
      
      const matchingApp = applications.find(app => 
        app.application_type + '-' + app.id === fromAccountId
      );
      
      if (!matchingApp) {
        await connection.rollback();
        return res.status(403).json({ success: false, message: 'Invalid account access - from account not found' });
      }
      
      fromAccount = { balance: parseFloat(matchingApp.initial_deposit) || 0 };
    } else {
      // Handle regular account
      const [userAccounts] = await connection.execute(
        'SELECT balance FROM accounts WHERE user_id = ? AND id = ?',
        [req.user.userId, fromAccountId]
      );
      
      if (userAccounts.length === 0) {
        await connection.rollback();
        return res.status(403).json({ success: false, message: 'Invalid account access' });
      }
      
      fromAccount = userAccounts[0];
    }
    
    if (isToAppAccount) {
      // Handle application-based account
      console.log('Looking for toAccountId:', toAccountId);
      console.log('Available applications for to:', applications.map(app => app.application_type + '-' + app.id));
      
      const matchingApp = applications.find(app => 
        app.application_type + '-' + app.id === toAccountId
      );
      
      if (!matchingApp) {
        await connection.rollback();
        return res.status(403).json({ success: false, message: 'Invalid account access - to account not found' });
      }
      
      toAccount = { balance: parseFloat(matchingApp.initial_deposit) || 0 };
    } else {
      // Handle regular account
      const [userAccounts] = await connection.execute(
        'SELECT balance FROM accounts WHERE user_id = ? AND id = ?',
        [req.user.userId, toAccountId]
      );
      
      if (userAccounts.length === 0) {
        await connection.rollback();
        return res.status(403).json({ success: false, message: 'Invalid account access' });
      }
      
      toAccount = userAccounts[0];
    }
    
    // Check sufficient balance
    if (fromAccount.balance < amount) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    
    // Update balances
    if (isFromAppAccount) {
      // Update application-based account balance
      const matchingApp = applications.find(app => 
        app.application_type + '-' + app.id === fromAccountId
      );
      
      const newBalance = parseFloat(matchingApp.initial_deposit) - amount;
      await connection.execute(
        'UPDATE account_applications SET initial_deposit = ? WHERE id = ?',
        [newBalance, matchingApp.id]
      );
    } else {
      // Update regular account balance
      await connection.execute(
        'UPDATE accounts SET balance = balance - ? WHERE id = ?',
        [amount, fromAccountId]
      );
    }
    
    if (isToAppAccount) {
      // Update application-based account balance
      const matchingApp = applications.find(app => 
        app.application_type + '-' + app.id === toAccountId
      );
      
      const newBalance = parseFloat(matchingApp.initial_deposit) + amount;
      await connection.execute(
        'UPDATE account_applications SET initial_deposit = ? WHERE id = ?',
        [newBalance, matchingApp.id]
      );
    } else {
      // Update regular account balance
      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE id = ?',
        [amount, toAccountId]
      );
    }
    
    // Create transaction record
    const transactionId = uuidv4();
    await connection.execute(
      'INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?)',
      [transactionId, fromAccountId, toAccountId, amount, 'transfer', description || 'Account transfer']
    );
    
    await connection.commit();
    
    console.log('Transfer completed:', { fromAccountId, toAccountId, amount });
    
    // Create notification for transfer
    const notificationId = crypto.randomUUID();
    await connection.execute(
      'INSERT INTO notifications (id, user_id, type, title, message, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [notificationId, fromUserId, 'transaction', 'Transfer Completed', `Your transfer of $${amount} has been processed successfully.`, 'medium']
    );
    
    res.json({ success: true, message: 'Transfer completed successfully', transactionId });
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Transfer error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ success: false, message: 'Internal server error during transfer', error: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Verify recipient by email
app.post('/verify-recipient', authenticateToken, async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Check if user exists with this email
    const [users] = await pool.execute(
      'SELECT id, name, username, email FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.json({ success: false, message: 'No Commerce Bank account found for this email' });
    }
    
    const user = users[0];
    console.log('Recipient verified:', { email, name: user.name });
    res.json({ success: true, user });
    
  } catch (error) {
    console.error('Verify recipient error:', error);
    res.status(500).json({ success: false, message: 'Internal server error verifying recipient' });
  }
});

// Send money to another user
app.post('/send-money', authenticateToken, async (req, res) => {
  const { fromAccountId, toEmail, amount, description } = req.body;
  
  if (!fromAccountId || !toEmail || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid send parameters' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Get recipient user
    const [recipientUsers] = await connection.execute(
      'SELECT id, email FROM users WHERE email = ?',
      [toEmail]
    );
    
    if (recipientUsers.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }
    
    const recipientUserId = recipientUsers[0].id;
    const recipientEmail = recipientUsers[0].email;
    
    // Get recipient's checking account (prioritize application-based accounts)
    let toAccountId = null;
    let toAccountType = 'application';
    
    // First check application-based accounts (since we only show these now)
    const [applications] = await connection.execute(
      'SELECT id, application_type FROM account_applications WHERE email = ? AND status = "approved" AND application_type IN ("basic_checking", "premium_checking", "student_checking") LIMIT 1',
      [recipientEmail]
    );
    
    if (applications.length > 0) {
      toAccountId = applications[0].application_type + '-' + applications[0].id;
    } else {
      // Fallback to regular accounts (for backward compatibility)
      const [recipientAccounts] = await connection.execute(
        'SELECT id FROM accounts WHERE user_id = ? AND account_type IN ("checking", "Basic Checking", "Premium Checking", "Student Checking") LIMIT 1',
        [recipientUserId]
      );
      
      if (recipientAccounts.length > 0) {
        toAccountId = recipientAccounts[0].id;
        toAccountType = 'regular';
      }
    }
    
    if (!toAccountId) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Recipient checking account not found' });
    }
    
    // Verify sender account belongs to user and check balance
    let senderBalance = 0;
    let senderAccountType = 'regular';
    
    // Check if sender account is application-based
    const isFromAppAccount = fromAccountId.includes('-') && !fromAccountId.includes('no-account');
    
    if (isFromAppAccount) {
      // Handle application-based sender account
      const [users] = await connection.execute('SELECT email FROM users WHERE id = ?', [req.user.userId]);
      if (users.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const userEmail = users[0].email;
      
      const [applications] = await connection.execute(
        'SELECT initial_deposit FROM account_applications WHERE email = ? AND status = "approved" AND id = ?',
        [userEmail, fromAccountId.split('-').slice(1).join('-')]
      );
      
      if (applications.length === 0) {
        await connection.rollback();
        return res.status(403).json({ success: false, message: 'Invalid account access' });
      }
      
      senderBalance = parseFloat(applications[0].initial_deposit) || 0;
      senderAccountType = 'application';
    } else {
      // Handle regular sender account
      const [senderAccounts] = await connection.execute(
        'SELECT balance FROM accounts WHERE id = ? AND user_id = ?',
        [fromAccountId, req.user.userId]
      );
      
      if (senderAccounts.length === 0) {
        await connection.rollback();
        return res.status(403).json({ success: false, message: 'Invalid account access' });
      }
      
      senderBalance = senderAccounts[0].balance;
    }
    
    if (senderBalance < amount) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    
    // Update sender balance
    if (senderAccountType === 'application') {
      const newSenderBalance = senderBalance - amount;
      await connection.execute(
        'UPDATE account_applications SET initial_deposit = ? WHERE email = ? AND id = ?',
        [newSenderBalance, (await connection.execute('SELECT email FROM users WHERE id = ?', [req.user.userId]))[0][0].email, fromAccountId.split('-').slice(1).join('-')]
      );
    } else {
      await connection.execute(
        'UPDATE accounts SET balance = balance - ? WHERE id = ?',
        [amount, fromAccountId]
      );
    }
    
    // Update recipient balance
    if (toAccountType === 'application') {
      // For application-based accounts, extract the application ID from the toAccountId
      const applicationId = toAccountId.split('-').slice(1).join('-');
      console.log('Updating recipient application balance:', { toAccountId, applicationId, amount });
      
      const [recipientApplications] = await connection.execute(
        'SELECT initial_deposit FROM account_applications WHERE email = ? AND id = ?',
        [recipientEmail, applicationId]
      );
      
      if (recipientApplications.length > 0) {
        const currentBalance = parseFloat(recipientApplications[0].initial_deposit) || 0;
        const newRecipientBalance = currentBalance + amount;
        console.log('Recipient balance update:', { currentBalance, amount, newRecipientBalance });
        
        await connection.execute(
          'UPDATE account_applications SET initial_deposit = ? WHERE email = ? AND id = ?',
          [newRecipientBalance, recipientEmail, applicationId]
        );
        
        console.log('Recipient application balance updated successfully');
      } else {
        console.log('Recipient application not found for update');
      }
    } else {
      console.log('Updating recipient regular account balance:', { toAccountId, amount });
      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE id = ?',
        [amount, toAccountId]
      );
      console.log('Recipient regular account balance updated successfully');
    }
    
    // Create transaction record
    const transactionId = uuidv4();
    await connection.execute(
      'INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?)',
      [transactionId, fromAccountId, toAccountId, amount, 'transfer', description || `Payment to ${toEmail}`]
    );
    
    await connection.commit();
    
    console.log('Money sent:', { fromAccountId, toEmail, amount });
    res.json({ success: true, message: `Money sent successfully to ${toEmail}`, transactionId });
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Send money error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during send' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Get all users (for sending money)
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, username, email FROM users WHERE id != ? ORDER BY name',
      [req.user.userId]
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching users' });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, name, email, username, created_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching user' });
  }
});

// Submit account application
app.post('/applications', async (req, res) => {
  console.log('Account application request:', req.body);
  console.log('Credit limit received:', req.body.creditLimit);
  console.log('Application type:', req.body.applicationType);
  
  const {
    applicationType,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    ssn,
    streetAddress,
    city,
    state,
    zipCode,
    employmentStatus,
    employerName,
    jobTitle,
    annualIncome,
    initialDeposit,
    accountPurpose,
    hasExistingAccount,
    additionalInfo,
    agreeToTerms,
    agreeToMarketing,
    username,
    password,
    creditLimit
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !dateOfBirth || !ssn || 
      !streetAddress || !city || !state || !zipCode || !employmentStatus || 
      !annualIncome || !agreeToTerms) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }

  try {
    const applicationId = uuidv4();
    
    await pool.execute(`
      INSERT INTO account_applications (
        id, application_type, first_name, last_name, email, phone, date_of_birth, ssn,
        street_address, city, state, zip_code, employment_status, employer_name, job_title,
        annual_income, initial_deposit, account_purpose, has_existing_account,
        additional_info, agree_to_terms, agree_to_marketing, username, password, credit_limit, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      applicationId, applicationType, firstName, lastName, email, phone, dateOfBirth, ssn,
      streetAddress, city, state, zipCode, employmentStatus, employerName || null, jobTitle || null,
      annualIncome, parseFloat(initialDeposit) || 0, accountPurpose || null, hasExistingAccount || false,
      additionalInfo || null, agreeToTerms, agreeToMarketing || false, username || null, password || null, 
      creditLimit || null, 'approved'
    ]);

    console.log('Account application submitted and approved:', { applicationId, email, applicationType });
    res.status(201).json({ 
      success: true, 
      message: 'Application submitted and approved successfully',
      applicationId 
    });
    
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during application submission' 
    });
  }
});

// Get all applications (admin endpoint)
app.get('/applications', async (req, res) => {
  try {
    const [applications] = await pool.execute(`
      SELECT id, application_type, status, first_name, last_name, email, 
             submitted_at, reviewed_at, notes
      FROM account_applications 
      ORDER BY submitted_at DESC
    `);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching applications' });
  }
});

// Get application by ID
app.get('/applications/:id', async (req, res) => {
  try {
    const [applications] = await pool.execute(
      'SELECT * FROM account_applications WHERE id = ?', 
      [req.params.id]
    );
    
    if (applications.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, application: applications[0] });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching application' });
  }
});

// Update application status (admin endpoint)
app.put('/applications/:id/status', async (req, res) => {
  const { status, notes } = req.body;
  
  if (!status || !['pending', 'approved', 'rejected', 'under_review'].includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid status. Must be one of: pending, approved, rejected, under_review' 
    });
  }

  try {
    await pool.execute(
      'UPDATE account_applications SET status = ?, notes = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, notes || null, req.params.id]
    );
    
    console.log('Application status updated:', { id: req.params.id, status });
    res.json({ success: true, message: 'Application status updated successfully' });
    
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error updating application status' });
  }
});

// Submit loan application
app.post('/loan-applications', async (req, res) => {
  console.log('Loan application request:', req.body);
  
  const {
    loanType,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    ssn,
    streetAddress,
    city,
    state,
    zipCode,
    employmentStatus,
    employerName,
    jobTitle,
    annualIncome,
    workPhone,
    loanAmount,
    loanPurpose,
    downPayment,
    vehicleYear,
    vehicleMake,
    vehicleModel,
    propertyValue,
    additionalInfo,
    agreeToTerms,
    agreeToMarketing
  } = req.body;

  // Validate required fields
  if (!loanType || !firstName || !lastName || !email || !phone || !dateOfBirth || !ssn || 
      !streetAddress || !city || !state || !zipCode || !employmentStatus || 
      !annualIncome || !loanAmount || !loanPurpose || !agreeToTerms) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields' 
    });
  }

  try {
    const applicationId = uuidv4();
    
    await pool.execute(`
      INSERT INTO loan_applications (
        id, loan_type, first_name, last_name, email, phone, date_of_birth, ssn,
        street_address, city, state, zip_code, employment_status, employer_name, job_title,
        annual_income, work_phone, loan_amount, loan_purpose, down_payment,
        vehicle_year, vehicle_make, vehicle_model, property_value,
        additional_info, agree_to_terms, agree_to_marketing, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      applicationId, loanType, firstName, lastName, email, phone, dateOfBirth, ssn,
      streetAddress, city, state, zipCode, employmentStatus, employerName || null, jobTitle || null,
      annualIncome, workPhone || null, parseFloat(loanAmount), loanPurpose, parseFloat(downPayment) || 0,
      vehicleYear || null, vehicleMake || null, vehicleModel || null, propertyValue || null,
      additionalInfo || null, agreeToTerms, agreeToMarketing || false, 'pending'
    ]);

    console.log('Loan application submitted successfully:', applicationId);
    res.status(201).json({ 
      success: true, 
      message: 'Loan application submitted successfully',
      applicationId 
    });
    
  } catch (error) {
    console.error('Loan application submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during loan application submission' 
    });
  }
});

// Get loan applications
app.get('/loan-applications', authenticateToken, async (req, res) => {
  try {
    // Get user's email from the token
    const [users] = await pool.execute('SELECT email FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userEmail = users[0].email;
    console.log('Checking loan applications for user email:', userEmail);
    
    const [applications] = await pool.execute(`
      SELECT id, loan_type, status, first_name, last_name, email, loan_amount,
             submitted_at, reviewed_at, notes
      FROM loan_applications 
      WHERE email = ?
      ORDER BY submitted_at DESC
    `, [userEmail]);
    
    console.log('Found loan applications for user:', applications.length);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Get loan applications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching loan applications' });
  }
});

// Get loan application by ID
app.get('/loan-applications/:id', async (req, res) => {
  try {
    const [applications] = await pool.execute(
      'SELECT * FROM loan_applications WHERE id = ?', 
      [req.params.id]
    );
    
    if (applications.length === 0) {
      return res.status(404).json({ success: false, message: 'Loan application not found' });
    }
    
    res.json({ success: true, application: applications[0] });
  } catch (error) {
    console.error('Get loan application error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching loan application' });
  }
});

// Update loan application status (admin endpoint)
app.put('/loan-applications/:id/status', async (req, res) => {
  const { status, notes } = req.body;
  
  if (!status || !['pending', 'approved', 'rejected', 'under_review'].includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid status. Must be one of: pending, approved, rejected, under_review' 
    });
  }

  try {
    await pool.execute(
      'UPDATE loan_applications SET status = ?, notes = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, notes || null, req.params.id]
    );
    
    console.log('Loan application status updated:', { id: req.params.id, status });
    res.json({ success: true, message: 'Loan application status updated successfully' });
    
  } catch (error) {
    console.error('Update loan application status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error updating loan application status' });
  }
});

// GET /branches - Get all branches and ATMs
app.get('/branches', async (req, res) => {
  try {
    const { type, city, state, lat, lng, radius = 10 } = req.query;
    
    let query = 'SELECT * FROM branches WHERE 1=1';
    const params = [];
    
    // Filter by type (branch or atm)
    if (type && ['branch', 'atm'].includes(type)) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    // Filter by city
    if (city) {
      query += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }
    
    // Filter by state
    if (state) {
      query += ' AND state = ?';
      params.push(state.toUpperCase());
    }
    
    // Filter by radius (if lat/lng provided)
    if (lat && lng) {
      query += ` AND (
        6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(latitude))
        )
      ) <= ?`;
      params.push(parseFloat(lat), parseFloat(lng), parseFloat(lat), parseFloat(radius));
    }
    
    query += ' ORDER BY name';
    
    const [branches] = await pool.execute(query, params);
    
    res.json({ 
      success: true, 
      branches,
      count: branches.length 
    });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error fetching branches' 
    });
  }
});

// GET /branches/:id - Get specific branch/ATM
app.get('/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [branches] = await pool.execute(
      'SELECT * FROM branches WHERE id = ?',
      [id]
    );
    
    if (branches.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Branch/ATM not found' 
      });
    }
    
    res.json({ 
      success: true, 
      branch: branches[0] 
    });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error fetching branch' 
    });
  }
});

// POST /branches - Add new branch/ATM (admin)
app.post('/branches', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      type,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      phone,
      hours,
      services,
      is_24_hours,
      has_drive_thru,
      has_parking,
      is_accessible
    } = req.body;

    if (!name || !type || !address || !city || !state || !zip_code || !latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields: name, type, address, city, state, zip_code, latitude, longitude' 
      });
    }

    if (!['branch', 'atm'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type must be either "branch" or "atm"' 
      });
    }

    const id = crypto.randomUUID();
    
    await pool.execute(`
      INSERT INTO branches (
        id, name, type, address, city, state, zip_code, latitude, longitude,
        phone, hours, services, is_24_hours, has_drive_thru, has_parking, is_accessible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, name, type, address, city, state, zip_code, latitude, longitude,
      phone, JSON.stringify(hours), JSON.stringify(services), 
      is_24_hours || false, has_drive_thru || false, has_parking || false, is_accessible || false
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Branch/ATM added successfully',
      branch: { id, name, type, address, city, state, zip_code }
    });
  } catch (error) {
    console.error('Add branch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error adding branch' 
    });
  }
});

// PUT /change-password - Change user password
app.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 8 characters long' 
      });
    }

    // Get user's current password hash
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, userId]
    );

    console.log('Password changed successfully for user:', userId);

    // Create notification for password change
    const notificationId = crypto.randomUUID();
    await pool.execute(
      'INSERT INTO notifications (id, user_id, type, title, message, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [notificationId, userId, 'password_change', 'Password Updated', 'Your password was successfully changed. If this wasn\'t you, please contact support immediately.', 'high']
    );

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error changing password' 
    });
  }
});

// GET /notifications - Get user notifications
app.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [notifications] = await pool.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      notifications: notifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error fetching notifications' 
    });
  }
});

// PUT /notifications/:id/read - Mark notification as read
app.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    const [result] = await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Notification marked as read' 
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error marking notification as read' 
    });
  }
});

// PUT /notifications/mark-all-read - Mark all notifications as read
app.put('/notifications/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({ 
      success: true, 
      message: 'All notifications marked as read' 
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error marking all notifications as read' 
    });
  }
});

// POST /notifications - Create notification (internal use)
app.post('/notifications', authenticateToken, async (req, res) => {
  try {
    const { userId, type, title, message, priority = 'medium' } = req.body;
    const notificationId = crypto.randomUUID();

    await pool.execute(
      'INSERT INTO notifications (id, user_id, type, title, message, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [notificationId, userId, type, title, message, priority]
    );

    res.json({ 
      success: true, 
      message: 'Notification created',
      notificationId: notificationId
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error creating notification' 
    });
  }
});

// POST /business-applications - Submit business account application (no auth required)
app.post('/business-applications', async (req, res) => {
  try {
    const {
      accountType,
      businessName,
      businessType,
      ein,
      businessAddress,
      businessCity,
      businessState,
      businessZip,
      businessPhone,
      businessEmail,
      annualRevenue,
      numberOfEmployees,
      yearsInBusiness,
      primaryContactName,
      primaryContactTitle,
      primaryContactPhone,
      primaryContactEmail,
      accountPurpose,
      expectedMonthlyTransactions,
      expectedMonthlyVolume,
      initialDeposit
    } = req.body;

    // Validate required fields
    if (!accountType || !businessName || !businessType || !businessAddress || !businessCity || 
        !businessState || !businessZip || !businessPhone || !businessEmail || !primaryContactName || 
        !primaryContactPhone || !primaryContactEmail) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const applicationId = crypto.randomUUID();
    
    await pool.execute(
      `INSERT INTO business_accounts (
        id, user_id, account_type, business_name, business_type, ein, business_address, 
        business_city, business_state, business_zip, business_phone, business_email,
        annual_revenue, number_of_employees, years_in_business, primary_contact_name,
        primary_contact_title, primary_contact_phone, primary_contact_email, account_purpose,
        expected_monthly_transactions, expected_monthly_volume, initial_deposit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationId, null, accountType, businessName, businessType, ein, businessAddress,
        businessCity, businessState, businessZip, businessPhone, businessEmail,
        annualRevenue, numberOfEmployees, yearsInBusiness, primaryContactName,
        primaryContactTitle, primaryContactPhone, primaryContactEmail, accountPurpose,
        expectedMonthlyTransactions, expectedMonthlyVolume, initialDeposit
      ]
    );

    // Business application submitted successfully (no notification since no user_id)

    res.json({
      success: true,
      message: 'Business account application submitted successfully',
      applicationId: applicationId
    });

  } catch (error) {
    console.error('Business application error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error submitting business application'
    });
  }
});

// GET /business-applications - Get user's business applications
app.get('/business-applications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user email for matching
    const [userResult] = await pool.execute(
      'SELECT email FROM users WHERE id = ?',
      [userId]
    );
    
    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userEmail = userResult[0].email;
    
    // Get business applications by user_id OR by matching email
    const [applications] = await pool.execute(
      'SELECT * FROM business_accounts WHERE user_id = ? OR business_email = ? ORDER BY created_at DESC',
      [userId, userEmail]
    );

    res.json({
      success: true,
      applications: applications
    });

  } catch (error) {
    console.error('Get business applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching business applications'
    });
  }
});

// GET /business-applications/:id - Get specific business application
app.get('/business-applications/:id', authenticateToken, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user.userId;
    
    const [applications] = await pool.execute(
      'SELECT * FROM business_accounts WHERE id = ? AND user_id = ?',
      [applicationId, userId]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business application not found'
      });
    }

    res.json({
      success: true,
      application: applications[0]
    });

  } catch (error) {
    console.error('Get business application error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching business application'
    });
  }
});

// PUT /business-applications/:id/status - Update business application status (admin)
app.put('/business-applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status, notes } = req.body;
    const reviewerId = req.user.userId;

    if (!status || !['pending', 'approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const [result] = await pool.execute(
      'UPDATE business_accounts SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?, notes = ? WHERE id = ?',
      [status, reviewerId, notes, applicationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business application not found'
      });
    }

    res.json({
      success: true,
      message: 'Business application status updated successfully'
    });

  } catch (error) {
    console.error('Update business application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error updating business application status'
    });
  }
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Commerce Bank Enhanced MySQL Backend Server`);
      console.log(`===============================================`);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🗄️  Database: MySQL (${dbConfig.host}:${dbConfig.port})`);
      console.log(`📊 Database: ${dbConfig.database}`);
      console.log(`🔗 Endpoints:`);
      console.log(`   Health: GET  http://localhost:${PORT}/`);
      console.log(`   Register: POST http://localhost:${PORT}/register`);
      console.log(`   Login: POST http://localhost:${PORT}/login`);
      console.log(`   Accounts: GET http://localhost:${PORT}/accounts`);
      console.log(`   Transactions: GET http://localhost:${PORT}/transactions`);
      console.log(`   Transfer: POST http://localhost:${PORT}/transfer`);
      console.log(`   Send Money: POST http://localhost:${PORT}/send-money`);
      console.log(`   Users: GET http://localhost:${PORT}/users`);
      console.log(`Press Ctrl+C to stop the server`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
// POST /send-otp - Send OTP to email
app.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Store OTP
    otpStore.set(email, {
      otp,
      expiresAt,
      attempts: 0
    });

    // Send OTP email
    await sendOTP(email, otp);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully to your email',
      expiresIn: 300 // 5 minutes in seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again later.' 
    });
  }
});

// POST /verify-otp - Verify OTP
app.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ success: false, message: 'No OTP found for this email. Please request a new one.' });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts (max 5 attempts)
    if (storedData.attempts >= 5) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      otpStore.set(email, storedData);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.',
        remainingAttempts: 5 - storedData.attempts
      });
    }

    // OTP verified successfully - remove from store
    otpStore.delete(email);

    res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP. Please try again.' 
    });
  }
});

// Clean up expired OTPs and pending logins every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
      pendingLogins.delete(email);
      console.log(`Cleaned up expired OTP and pending login for ${email}`);
    }
  }
  // Also clean up expired pending logins
  for (const [email, data] of pendingLogins.entries()) {
    if (now > data.expiresAt) {
      pendingLogins.delete(email);
      console.log(`Cleaned up expired pending login for ${email}`);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await pool.end();
  process.exit(0);
});

startServer();
