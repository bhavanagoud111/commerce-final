const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Initialize SQLite database
const db = new Database('commerce_bank.db');

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    account_number TEXT UNIQUE NOT NULL,
    account_type TEXT NOT NULL,
    balance REAL DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    from_account_id TEXT,
    to_account_id TEXT,
    amount REAL NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  -- Mobile/ATM/Branch check deposits
  CREATE TABLE IF NOT EXISTS deposits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    amount REAL NOT NULL,
    memo TEXT,
    type TEXT NOT NULL, -- mobile | branch | atm
    check_number TEXT,
    deposit_date TEXT,
    status TEXT DEFAULT 'completed', -- processing | completed | failed
    availability_date TEXT,
    reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS account_applications (
    id TEXT PRIMARY KEY,
    application_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    ssn TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    employment_status TEXT NOT NULL,
    employer_name TEXT,
    job_title TEXT,
    annual_income TEXT NOT NULL,
    initial_deposit REAL DEFAULT 0.00,
    account_purpose TEXT,
    has_existing_account INTEGER DEFAULT 0,
    additional_info TEXT,
    agree_to_terms INTEGER NOT NULL DEFAULT 0,
    agree_to_marketing INTEGER DEFAULT 0,
    username TEXT,
    password TEXT,
    credit_limit REAL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewed_by TEXT,
    notes TEXT
  );
  
  CREATE TABLE IF NOT EXISTS scheduled_transfers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    from_account_id TEXT NOT NULL,
    to_account_id TEXT,
    to_description TEXT,
    amount REAL NOT NULL,
    frequency TEXT NOT NULL,
    next_date TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS scheduled_bills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    from_account_id TEXT NOT NULL,
    bill_name TEXT NOT NULL,
    bill_type TEXT NOT NULL,
    amount REAL NOT NULL,
    frequency TEXT NOT NULL,
    next_date TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    description TEXT,
    payee_name TEXT,
    payee_account TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS loan_applications (
    id TEXT PRIMARY KEY,
    loan_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    ssn TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    employment_status TEXT NOT NULL,
    employer_name TEXT,
    job_title TEXT,
    annual_income TEXT NOT NULL,
    work_phone TEXT,
    loan_amount REAL NOT NULL,
    loan_purpose TEXT NOT NULL,
    down_payment REAL DEFAULT 0.00,
    vehicle_year INTEGER,
    vehicle_make TEXT,
    vehicle_model TEXT,
    property_value REAL,
    additional_info TEXT,
    agree_to_terms INTEGER NOT NULL DEFAULT 0,
    agree_to_marketing INTEGER DEFAULT 0,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewed_by TEXT,
    notes TEXT
  );
  
  CREATE TABLE IF NOT EXISTS business_accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    account_type TEXT NOT NULL,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    ein TEXT,
    business_address TEXT NOT NULL,
    business_city TEXT NOT NULL,
    business_state TEXT NOT NULL,
    business_zip TEXT NOT NULL,
    business_phone TEXT NOT NULL,
    business_email TEXT NOT NULL,
    annual_revenue TEXT,
    number_of_employees TEXT,
    years_in_business TEXT,
    primary_contact_name TEXT NOT NULL,
    primary_contact_title TEXT,
    primary_contact_phone TEXT NOT NULL,
    primary_contact_email TEXT NOT NULL,
    account_purpose TEXT,
    expected_monthly_transactions INTEGER,
    expected_monthly_volume REAL,
    initial_deposit REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewed_by TEXT,
    notes TEXT
  );
`);

// Authentication middleware
const authenticateToken = (req, res, next) => {
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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    res.json({
      success: true,
      message: 'Commerce Bank API with SQLite Database is running',
      timestamp: new Date().toISOString(),
      database: 'SQLite',
      users: userCount.count
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
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existingUser) {
      const duplicateField = existingUser.username === username ? 'Username' : 'Email';
      return res.status(409).json({ success: false, message: `${duplicateField} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    const stmt = db.prepare('INSERT INTO users (id, name, email, username, password) VALUES (?, ?, ?, ?, ?)');
    stmt.run(userId, name, email, username, hashedPassword);
    
    console.log('User registered:', { userId, name, email, username });
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

// Login Endpoint
app.post('/login', async (req, res) => {
  console.log('Login request:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username or password' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log('User logged in:', { userId: user.id, username: user.username });
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
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
});

// Get all users (for testing/admin)
app.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, username, created_at FROM users').all();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching users' });
  }
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, username, created_at FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching user' });
  }
});

// Get accounts for authenticated user
app.get('/accounts', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const accounts = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(userId);
    
    // If no accounts exist, create default accounts
    if (accounts.length === 0) {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      if (user) {
        // Create default checking account
        const checkingId = uuidv4();
        const checkingAccount = {
          id: checkingId,
          account_number: 'CHK' + Date.now().toString().slice(-6),
          account_type: 'checking',
          balance: 1000.00
        };
        db.prepare('INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)')
          .run(checkingId, userId, checkingAccount.account_number, 'checking', 1000.00);
        
        // Create default savings account
        const savingsId = uuidv4();
        const savingsAccount = {
          id: savingsId,
          account_number: 'SAV' + Date.now().toString().slice(-6),
          account_type: 'savings',
          balance: 5000.00
        };
        db.prepare('INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)')
          .run(savingsId, userId, savingsAccount.account_number, 'savings', 5000.00);
        
        return res.json({ 
          success: true, 
          accounts: [checkingAccount, savingsAccount] 
        });
      }
    }
    
    res.json({ success: true, accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching accounts' });
  }
});

// GET /transactions - Get user's transactions
app.get('/transactions', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { limit = 50, offset = 0 } = req.query;
    
    // Get user's account IDs
    const userAccounts = db.prepare('SELECT id FROM accounts WHERE user_id = ?').all(userId);
    
    if (userAccounts.length === 0) {
      return res.json({ success: true, transactions: [] });
    }
    
    // Get account IDs
    const accountIds = userAccounts.map(acc => acc.id);
    
    // Build query to get transactions where user's account is either sender or receiver
    const placeholders = accountIds.map(() => '?').join(',');
    const transactions = db.prepare(`
      SELECT * FROM transactions 
      WHERE from_account_id IN (${placeholders}) OR to_account_id IN (${placeholders})
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...accountIds, ...accountIds, parseInt(limit), parseInt(offset));
    
    // Enhance transactions with account information
    const enhancedTransactions = transactions.map(transaction => {
      const fromAccount = transaction.from_account_id 
        ? db.prepare('SELECT account_number, account_type FROM accounts WHERE id = ?').get(transaction.from_account_id)
        : null;
      const toAccount = transaction.to_account_id 
        ? db.prepare('SELECT account_number, account_type FROM accounts WHERE id = ?').get(transaction.to_account_id)
        : null;
      
      return {
        ...transaction,
        from_account_number: fromAccount?.account_number || null,
        from_account_type: fromAccount?.account_type || null,
        to_account_number: toAccount?.account_number || null,
        to_account_type: toAccount?.account_type || null
      };
    });
    
    res.json({ success: true, transactions: enhancedTransactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching transactions' });
  }
});

// Transfer money between accounts
app.post('/transfer', authenticateToken, (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;
  
  if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid transfer parameters' });
  }

  try {
    const userId = req.user.userId || req.user.id;
    
    // Verify both accounts belong to the user
    const fromAccount = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(fromAccountId, userId);
    const toAccount = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(toAccountId, userId);
    
    if (!fromAccount) {
      return res.status(403).json({ success: false, message: 'Invalid account access - from account not found' });
    }
    
    if (!toAccount) {
      return res.status(403).json({ success: false, message: 'Invalid account access - to account not found' });
    }
    
    // Check sufficient balance
    if (fromAccount.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    
    // Update balances using transactions for atomicity
    const updateFrom = db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?');
    const updateTo = db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?');
    const insertTransaction = db.prepare('INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    
    // Generate transaction ID once
    const transactionId = uuidv4();
    
    const transaction = db.transaction(() => {
      // Deduct from source account
      updateFrom.run(amount, fromAccountId);
      
      // Add to destination account
      updateTo.run(amount, toAccountId);
      
      // Create transaction record
      insertTransaction.run(transactionId, fromAccountId, toAccountId, amount, 'transfer', description || 'Account transfer', 'completed');
    });
    
    transaction();
    
    console.log('Transfer completed:', { transactionId, fromAccountId, toAccountId, amount });
    res.json({ success: true, message: 'Transfer completed successfully', transactionId });
    
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during transfer', error: error.message });
  }
});

// Verify recipient by email
app.post('/verify-recipient', authenticateToken, (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = db.prepare('SELECT id, name, username, email FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.json({ success: false, message: 'No Commerce Bank account found for this email' });
    }
    
    console.log('Recipient verified:', { email, name: user.name });
    res.json({ success: true, user });
    
  } catch (error) {
    console.error('Verify recipient error:', error);
    res.status(500).json({ success: false, message: 'Internal server error verifying recipient' });
  }
});

// Submit account application
app.post('/applications', async (req, res) => {
  console.log('Account application request:', req.body);
  
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
    
    const stmt = db.prepare(`
      INSERT INTO account_applications (
        id, application_type, first_name, last_name, email, phone, date_of_birth, ssn,
        street_address, city, state, zip_code, employment_status, employer_name, job_title,
        annual_income, initial_deposit, account_purpose, has_existing_account,
        additional_info, agree_to_terms, agree_to_marketing, username, password, credit_limit, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      applicationId, applicationType || 'basic_checking', firstName, lastName, email, phone, dateOfBirth, ssn,
      streetAddress, city, state, zipCode, employmentStatus, employerName || null, jobTitle || null,
      annualIncome, parseFloat(initialDeposit) || 0, accountPurpose || null, hasExistingAccount ? 1 : 0,
      additionalInfo || null, agreeToTerms ? 1 : 0, agreeToMarketing ? 1 : 0, username || null, password || null, 
      creditLimit ? parseFloat(creditLimit) : null, 'approved'
    );

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
      message: 'Internal server error during application submission',
      error: error.message 
    });
  }
});

// Get all applications
app.get('/applications', (req, res) => {
  try {
    const applications = db.prepare(`
      SELECT id, application_type, status, first_name, last_name, email, 
             submitted_at, reviewed_at, notes
      FROM account_applications 
      ORDER BY submitted_at DESC
    `).all();
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching applications' });
  }
});

// Get application by ID
app.get('/applications/:id', (req, res) => {
  try {
    const application = db.prepare('SELECT * FROM account_applications WHERE id = ?').get(req.params.id);
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching application' });
  }
});

// ==================== SCHEDULED PAYMENTS ENDPOINTS ====================

// Get scheduled transfers for authenticated user
app.get('/scheduled-transfers', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const transfers = db.prepare('SELECT * FROM scheduled_transfers WHERE user_id = ? ORDER BY next_date ASC').all(userId);
    res.json({ success: true, transfers });
  } catch (error) {
    console.error('Get scheduled transfers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching scheduled transfers' });
  }
});

// Create scheduled transfer
app.post('/scheduled-transfers', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { fromAccountId, toAccountId, toDescription, amount, frequency, nextDate, description } = req.body;
    
    if (!fromAccountId || !amount || !frequency || !nextDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Verify account belongs to user
    const account = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(fromAccountId, userId);
    if (!account) {
      return res.status(403).json({ success: false, message: 'Invalid account access' });
    }
    
    const transferId = uuidv4();
    db.prepare(`
      INSERT INTO scheduled_transfers (id, user_id, from_account_id, to_account_id, to_description, amount, frequency, next_date, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(transferId, userId, fromAccountId, toAccountId || null, toDescription || null, amount, frequency, nextDate, 'active', description || null);
    
    console.log('Scheduled transfer created:', { transferId, userId, amount, frequency });
    res.status(201).json({ success: true, message: 'Scheduled transfer created successfully', transferId });
  } catch (error) {
    console.error('Create scheduled transfer error:', error);
    res.status(500).json({ success: false, message: 'Internal server error creating scheduled transfer' });
  }
});

// Update scheduled transfer
app.put('/scheduled-transfers/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const transferId = req.params.id;
    const { amount, frequency, nextDate, status, description } = req.body;
    
    // Verify transfer belongs to user
    const transfer = db.prepare('SELECT * FROM scheduled_transfers WHERE id = ? AND user_id = ?').get(transferId, userId);
    if (!transfer) {
      return res.status(404).json({ success: false, message: 'Scheduled transfer not found' });
    }
    
    const updates = [];
    const values = [];
    
    if (amount !== undefined) { updates.push('amount = ?'); values.push(amount); }
    if (frequency !== undefined) { updates.push('frequency = ?'); values.push(frequency); }
    if (nextDate !== undefined) { updates.push('next_date = ?'); values.push(nextDate); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    values.push(transferId, userId);
    
    db.prepare(`UPDATE scheduled_transfers SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
    
    console.log('Scheduled transfer updated:', { transferId, userId });
    res.json({ success: true, message: 'Scheduled transfer updated successfully' });
  } catch (error) {
    console.error('Update scheduled transfer error:', error);
    res.status(500).json({ success: false, message: 'Internal server error updating scheduled transfer' });
  }
});

// Delete scheduled transfer
app.delete('/scheduled-transfers/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const transferId = req.params.id;
    
    // Verify transfer belongs to user
    const transfer = db.prepare('SELECT * FROM scheduled_transfers WHERE id = ? AND user_id = ?').get(transferId, userId);
    if (!transfer) {
      return res.status(404).json({ success: false, message: 'Scheduled transfer not found' });
    }
    
    db.prepare('DELETE FROM scheduled_transfers WHERE id = ? AND user_id = ?').run(transferId, userId);
    
    console.log('Scheduled transfer deleted:', { transferId, userId });
    res.json({ success: true, message: 'Scheduled transfer deleted successfully' });
  } catch (error) {
    console.error('Delete scheduled transfer error:', error);
    res.status(500).json({ success: false, message: 'Internal server error deleting scheduled transfer' });
  }
});

// Get scheduled bills (autopay) for authenticated user
app.get('/scheduled-bills', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const bills = db.prepare('SELECT * FROM scheduled_bills WHERE user_id = ? ORDER BY next_date ASC').all(userId);
    res.json({ success: true, bills });
  } catch (error) {
    console.error('Get scheduled bills error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching scheduled bills' });
  }
});

// Create scheduled bill (autopay)
app.post('/scheduled-bills', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { fromAccountId, billName, billType, amount, frequency, nextDate, description, payeeName, payeeAccount } = req.body;
    
    if (!fromAccountId || !billName || !billType || !amount || !frequency || !nextDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Verify account belongs to user
    const account = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(fromAccountId, userId);
    if (!account) {
      return res.status(403).json({ success: false, message: 'Invalid account access' });
    }
    
    const billId = uuidv4();
    db.prepare(`
      INSERT INTO scheduled_bills (id, user_id, from_account_id, bill_name, bill_type, amount, frequency, next_date, status, description, payee_name, payee_account)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(billId, userId, fromAccountId, billName, billType, amount, frequency, nextDate, 'active', description || null, payeeName || null, payeeAccount || null);
    
    console.log('Scheduled bill created:', { billId, userId, billName, amount, frequency });
    res.status(201).json({ success: true, message: 'Scheduled bill created successfully', billId });
  } catch (error) {
    console.error('Create scheduled bill error:', error);
    res.status(500).json({ success: false, message: 'Internal server error creating scheduled bill' });
  }
});

// Update scheduled bill
app.put('/scheduled-bills/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const billId = req.params.id;
    const { amount, frequency, nextDate, status, description } = req.body;
    
    // Verify bill belongs to user
    const bill = db.prepare('SELECT * FROM scheduled_bills WHERE id = ? AND user_id = ?').get(billId, userId);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Scheduled bill not found' });
    }
    
    const updates = [];
    const values = [];
    
    if (amount !== undefined) { updates.push('amount = ?'); values.push(amount); }
    if (frequency !== undefined) { updates.push('frequency = ?'); values.push(frequency); }
    if (nextDate !== undefined) { updates.push('next_date = ?'); values.push(nextDate); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    values.push(billId, userId);
    
    db.prepare(`UPDATE scheduled_bills SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
    
    console.log('Scheduled bill updated:', { billId, userId });
    res.json({ success: true, message: 'Scheduled bill updated successfully' });
  } catch (error) {
    console.error('Update scheduled bill error:', error);
    res.status(500).json({ success: false, message: 'Internal server error updating scheduled bill' });
  }
});

// Delete scheduled bill
app.delete('/scheduled-bills/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const billId = req.params.id;
    
    // Verify bill belongs to user
    const bill = db.prepare('SELECT * FROM scheduled_bills WHERE id = ? AND user_id = ?').get(billId, userId);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Scheduled bill not found' });
    }
    
    db.prepare('DELETE FROM scheduled_bills WHERE id = ? AND user_id = ?').run(billId, userId);
    
    console.log('Scheduled bill deleted:', { billId, userId });
    res.json({ success: true, message: 'Scheduled bill deleted successfully' });
  } catch (error) {
    console.error('Delete scheduled bill error:', error);
    res.status(500).json({ success: false, message: 'Internal server error deleting scheduled bill' });
  }
});

// ==================== CHECK DEPOSITS ====================
// Create a deposit (mobile / branch / atm)
app.post('/deposits', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { accountId, amount, memo, type, checkNumber, depositDate, notifications } = req.body || {};
    
    if (!accountId || !amount || amount <= 0 || !type) {
      return res.status(400).json({ success: false, message: 'Missing or invalid fields' });
    }
    
    const validTypes = new Set(['mobile', 'branch', 'atm']);
    if (!validTypes.has(String(type))) {
      return res.status(400).json({ success: false, message: 'Invalid deposit type' });
    }
    
    // Verify account belongs to user
    const account = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(accountId, userId);
    if (!account) {
      return res.status(403).json({ success: false, message: 'Invalid account access' });
    }
    
    // Compute availability date
    const now = new Date(depositDate || Date.now());
    const daysToClear = type === 'mobile' ? 2 : 1;
    const availability = new Date(now.getTime() + daysToClear * 24 * 60 * 60 * 1000);
    const reference = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    const depositId = uuidv4();
    
    // Insert deposit record (mark as completed for demo simplicity)
    db.prepare(`
      INSERT INTO deposits (id, user_id, account_id, amount, memo, type, check_number, deposit_date, status, availability_date, reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(depositId, userId, accountId, amount, memo || null, type, checkNumber || null, now.toISOString(), 'completed', availability.toISOString(), reference);
    
    // Update balance immediately (demo). In a real system, might be held until availability_date
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(amount, accountId);
    
    // Return minimal payload used by the UI
    res.status(201).json({
      success: true,
      message: 'Deposit recorded successfully',
      deposit: {
        id: depositId,
        availabilityDate: availability.toISOString(),
        reference
      }
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ success: false, message: 'Internal server error creating deposit' });
  }
});

// List deposits for the authenticated user
app.get('/deposits', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const rows = db.prepare(`
      SELECT d.*, a.account_number, a.account_type
      FROM deposits d
      JOIN accounts a ON a.id = d.account_id
      WHERE d.user_id = ?
      ORDER BY d.created_at DESC
    `).all(userId);
    res.json({ success: true, deposits: rows });
  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching deposits' });
  }
});

// Send money to another user
app.post('/send-money', authenticateToken, (req, res) => {
  const { fromAccountId, toEmail, amount, description } = req.body;
  
  if (!fromAccountId || !toEmail || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid send parameters' });
  }

  try {
    const userId = req.user.userId || req.user.id;
    
    // Get recipient user
    const recipientUser = db.prepare('SELECT id, email FROM users WHERE email = ?').get(toEmail);
    
    if (!recipientUser) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }
    
    const recipientUserId = recipientUser.id;
    
    // Get recipient's checking account
    let recipientAccount = db.prepare(
      'SELECT * FROM accounts WHERE user_id = ? AND (account_type = ? OR account_type = ? OR account_type = ? OR account_type = ?) LIMIT 1'
    ).get(recipientUserId, 'checking', 'basic_checking', 'premium_checking', 'student_checking');
    
    // If recipient has no checking account, create one
    if (!recipientAccount) {
      // Create a default checking account for recipient
      const newAccountId = uuidv4();
      const accountNumber = 'CHK' + Date.now().toString().slice(-6);
      db.prepare('INSERT INTO accounts (id, user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?, ?)')
        .run(newAccountId, recipientUserId, accountNumber, 'checking', 0);
      
      recipientAccount = db.prepare('SELECT * FROM accounts WHERE id = ?').get(newAccountId);
      console.log('Created default checking account for recipient:', { accountNumber, recipientEmail: toEmail });
    }
    
    // Verify sender account belongs to user and check balance
    const senderAccount = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(fromAccountId, userId);
    
    if (!senderAccount) {
      return res.status(403).json({ success: false, message: 'Invalid account access' });
    }
    
    if (senderAccount.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    
    // Generate transaction ID once
    const transactionId = uuidv4();
    
    // Update balances using transaction
    const updateSender = db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?');
    const updateRecipient = db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?');
    const insertSendTransaction = db.prepare('INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    
    const sendTransaction = db.transaction(() => {
      // Deduct from sender account
      updateSender.run(amount, fromAccountId);
      
      // Add to recipient account
      updateRecipient.run(amount, recipientAccount.id);
      
      // Create transaction record
      insertSendTransaction.run(transactionId, fromAccountId, recipientAccount.id, amount, 'transfer', description || `Payment to ${recipientUser.email}`, 'completed');
    });
    
    sendTransaction();
    
    console.log('Send money completed:', { transactionId, fromAccountId, toEmail, recipientAccountId: recipientAccount.id, amount });
    res.json({ success: true, message: `Money sent successfully to ${toEmail}`, transactionId });
    
  } catch (error) {
    console.error('Send money error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during send money', error: error.message });
  }
});

// POST /process-scheduled-transfers - Process due scheduled transfers
app.post('/process-scheduled-transfers', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const today = new Date().toISOString().split('T')[0];
    
    // Get all active scheduled transfers that are due today or earlier
    const dueTransfers = db.prepare(`
      SELECT * FROM scheduled_transfers 
      WHERE user_id = ? AND status = 'active' AND next_date <= ?
      ORDER BY next_date ASC
    `).all(userId, today);
    
    const results = [];
    
    for (const transfer of dueTransfers) {
      try {
        // Verify account belongs to user and check balance
        const account = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(transfer.from_account_id, userId);
        
        if (!account) {
          results.push({ transferId: transfer.id, success: false, message: 'Source account not found' });
          continue;
        }
        
        if (account.balance < transfer.amount) {
          // Update next_date based on frequency for retry
          const nextDate = calculateNextDate(transfer.next_date, transfer.frequency);
          db.prepare('UPDATE scheduled_transfers SET next_date = ? WHERE id = ?').run(nextDate, transfer.id);
          
          results.push({ transferId: transfer.id, success: false, message: 'Insufficient funds' });
          continue;
        }
        
        // Process the transfer
        const transactionId = uuidv4();
        const updateFrom = db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?');
        const updateTo = transfer.to_account_id 
          ? db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')
          : null;
        const insertTransaction = db.prepare('INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
        
        const processTransfer = db.transaction(() => {
          updateFrom.run(transfer.amount, transfer.from_account_id);
          if (updateTo && transfer.to_account_id) {
            updateTo.run(transfer.amount, transfer.to_account_id);
          }
          insertTransaction.run(transactionId, transfer.from_account_id, transfer.to_account_id || null, transfer.amount, 'transfer', transfer.description || 'Scheduled transfer', 'completed');
        });
        
        processTransfer();
        
        // Calculate next date based on frequency
        const nextDate = calculateNextDate(transfer.next_date, transfer.frequency);
        db.prepare('UPDATE scheduled_transfers SET next_date = ? WHERE id = ?').run(nextDate, transfer.id);
        
        results.push({ transferId: transfer.id, success: true, transactionId, nextDate, amount: transfer.amount, description: transfer.description || 'Scheduled transfer' });
      } catch (error) {
        console.error(`Error processing transfer ${transfer.id}:`, error);
        results.push({ transferId: transfer.id, success: false, message: error.message });
      }
    }
    
    res.json({ success: true, processed: results.length, results });
  } catch (error) {
    console.error('Process scheduled transfers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error processing scheduled transfers', error: error.message });
  }
});

// POST /process-scheduled-bills - Process due scheduled bills (autopay)
app.post('/process-scheduled-bills', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const today = new Date().toISOString().split('T')[0];
    
    // Get all active scheduled bills that are due today or earlier
    const dueBills = db.prepare(`
      SELECT * FROM scheduled_bills 
      WHERE user_id = ? AND status = 'active' AND next_date <= ?
      ORDER BY next_date ASC
    `).all(userId, today);
    
    const results = [];
    
    for (const bill of dueBills) {
      try {
        // Verify account belongs to user and check balance
        const account = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(bill.from_account_id, userId);
        
        if (!account) {
          results.push({ billId: bill.id, success: false, message: 'Source account not found' });
          continue;
        }
        
        if (account.balance < bill.amount) {
          // Update next_date based on frequency for retry
          const nextDate = calculateNextDate(bill.next_date, bill.frequency);
          db.prepare('UPDATE scheduled_bills SET next_date = ? WHERE id = ?').run(nextDate, bill.id);
          
          results.push({ billId: bill.id, success: false, message: 'Insufficient funds' });
          continue;
        }
        
        // Process the bill payment
        const transactionId = uuidv4();
        const updateAccount = db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?');
        const insertTransaction = db.prepare('INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
        
        const processBill = db.transaction(() => {
          updateAccount.run(bill.amount, bill.from_account_id);
          insertTransaction.run(transactionId, bill.from_account_id, null, -bill.amount, 'payment', bill.description || `Scheduled bill payment - ${bill.bill_name}`, 'completed');
        });
        
        processBill();
        
        // Calculate next date based on frequency
        const nextDate = calculateNextDate(bill.next_date, bill.frequency);
        db.prepare('UPDATE scheduled_bills SET next_date = ? WHERE id = ?').run(nextDate, bill.id);
        
        results.push({ billId: bill.id, success: true, transactionId, nextDate, amount: bill.amount, billName: bill.bill_name });
      } catch (error) {
        console.error(`Error processing bill ${bill.id}:`, error);
        results.push({ billId: bill.id, success: false, message: error.message });
      }
    }
    
    res.json({ success: true, processed: results.length, results });
  } catch (error) {
    console.error('Process scheduled bills error:', error);
    res.status(500).json({ success: false, message: 'Internal server error processing scheduled bills', error: error.message });
  }
});

// Helper function to calculate next date based on frequency
function calculateNextDate(currentDate, frequency) {
  const date = new Date(currentDate);
  switch (frequency.toLowerCase()) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1); // Default to monthly
  }
  return date.toISOString().split('T')[0];
}

// POST /bill-payment - Process bill payment
app.post('/bill-payment', authenticateToken, (req, res) => {
  const { fromAccountId, amount, billType, description } = req.body;
  
  if (!fromAccountId || !amount || amount <= 0 || !billType) {
    return res.status(400).json({ success: false, message: 'Invalid bill payment parameters' });
  }

  try {
    const userId = req.user.userId || req.user.id;
    
    // Verify account belongs to user and check balance
    const account = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(fromAccountId, userId);
    
    if (!account) {
      return res.status(403).json({ success: false, message: 'Invalid account access' });
    }
    
    if (account.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    
    // Generate transaction ID
    const transactionId = uuidv4();
    
    // Update balance and create transaction
    const updateAccount = db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?');
    const insertTransaction = db.prepare('INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    
    const billPayment = db.transaction(() => {
      // Deduct from account
      updateAccount.run(amount, fromAccountId);
      
      // Create transaction record (to_account_id is null for bill payments)
      insertTransaction.run(transactionId, fromAccountId, null, -amount, 'payment', description || `Bill payment - ${billType}`, 'completed');
    });
    
    billPayment();
    
    console.log('Bill payment completed:', { transactionId, fromAccountId, amount, billType });
    res.json({ success: true, message: `Bill payment processed successfully`, transactionId });
    
  } catch (error) {
    console.error('Bill payment error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during bill payment', error: error.message });
  }
});

// POST /loan-applications - Submit loan application
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
    
    db.prepare(`
      INSERT INTO loan_applications (
        id, loan_type, first_name, last_name, email, phone, date_of_birth, ssn,
        street_address, city, state, zip_code, employment_status, employer_name, job_title,
        annual_income, work_phone, loan_amount, loan_purpose, down_payment,
        vehicle_year, vehicle_make, vehicle_model, property_value,
        additional_info, agree_to_terms, agree_to_marketing, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      applicationId, loanType, firstName, lastName, email, phone, dateOfBirth, ssn,
      streetAddress, city, state, zipCode, employmentStatus, employerName || null, jobTitle || null,
      annualIncome, workPhone || null, parseFloat(loanAmount), loanPurpose, parseFloat(downPayment) || 0,
      vehicleYear || null, vehicleMake || null, vehicleModel || null, propertyValue || null,
      additionalInfo || null, agreeToTerms ? 1 : 0, agreeToMarketing ? 1 : 0, 'pending'
    );

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

// GET /loan-applications - Get loan applications for authenticated user
app.get('/loan-applications', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userEmail = user.email;
    console.log('Checking loan applications for user email:', userEmail);
    
    const applications = db.prepare(`
      SELECT id, loan_type, status, first_name, last_name, email, loan_amount,
             submitted_at, reviewed_at, notes
      FROM loan_applications 
      WHERE email = ?
      ORDER BY submitted_at DESC
    `).all(userEmail);
    
    console.log('Found loan applications for user:', applications.length);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Get loan applications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching loan applications' });
  }
});

// POST /business-applications - Submit business account application
app.post('/business-applications', async (req, res) => {
  console.log('Business application request:', req.body);
  
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

    const applicationId = uuidv4();
    
    db.prepare(`
      INSERT INTO business_accounts (
        id, user_id, account_type, business_name, business_type, ein, business_address, 
        business_city, business_state, business_zip, business_phone, business_email,
        annual_revenue, number_of_employees, years_in_business, primary_contact_name,
        primary_contact_title, primary_contact_phone, primary_contact_email, account_purpose,
        expected_monthly_transactions, expected_monthly_volume, initial_deposit, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      applicationId, null, accountType, businessName, businessType, ein || null, businessAddress,
      businessCity, businessState, businessZip, businessPhone, businessEmail,
      annualRevenue || null, numberOfEmployees || null, yearsInBusiness || null, primaryContactName,
      primaryContactTitle || null, primaryContactPhone, primaryContactEmail, accountPurpose || null,
      expectedMonthlyTransactions || null, expectedMonthlyVolume || null, initialDeposit || null, 'pending'
    );

    console.log('Business application submitted successfully:', applicationId);
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
app.get('/business-applications', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userEmail = user.email;
    console.log('Checking business applications for user email:', userEmail);
    
    const applications = db.prepare(`
      SELECT * FROM business_accounts 
      WHERE user_id = ? OR business_email = ?
      ORDER BY created_at DESC
    `).all(userId, userEmail);
    
    console.log('Found business applications for user:', applications.length);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Get business applications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching business applications' });
  }
});

// PUT /change-password - Change user password
app.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId || req.user.id;

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
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedNewPassword, userId);

    console.log('Password changed successfully for user:', userId);

    res.json({ 
      success: true, 
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error changing password',
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Commerce Bank SQLite Backend Server`);
  console.log(`========================================`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🗄️  Database: SQLite (commerce_bank.db)`);
  console.log(`🔗 Endpoints:`);
  console.log(`   Health: GET  http://localhost:${PORT}/`);
  console.log(`   Register: POST http://localhost:${PORT}/register`);
  console.log(`   Login: POST http://localhost:${PORT}/login`);
  console.log(`   Users: GET http://localhost:${PORT}/users`);
  console.log(`   User: GET http://localhost:${PORT}/users/:id`);
  console.log(`   Accounts: GET http://localhost:${PORT}/accounts`);
  console.log(`   Transactions: GET http://localhost:${PORT}/transactions`);
  console.log(`   Transfer: POST http://localhost:${PORT}/transfer`);
  console.log(`   Verify Recipient: POST http://localhost:${PORT}/verify-recipient`);
  console.log(`   Send Money: POST http://localhost:${PORT}/send-money`);
  console.log(`   Change Password: PUT http://localhost:${PORT}/change-password`);
  console.log(`   Applications: POST http://localhost:${PORT}/applications`);
  console.log(`   Loan Applications: POST http://localhost:${PORT}/loan-applications`);
  console.log(`   Loan Applications: GET http://localhost:${PORT}/loan-applications`);
  console.log(`   Business Applications: POST http://localhost:${PORT}/business-applications`);
  console.log(`   Business Applications: GET http://localhost:${PORT}/business-applications`);
  console.log(`   Scheduled Transfers: GET http://localhost:${PORT}/scheduled-transfers`);
  console.log(`   Scheduled Transfers: POST http://localhost:${PORT}/scheduled-transfers`);
  console.log(`   Scheduled Transfers: PUT http://localhost:${PORT}/scheduled-transfers/:id`);
  console.log(`   Scheduled Transfers: DELETE http://localhost:${PORT}/scheduled-transfers/:id`);
  console.log(`   Scheduled Bills: GET http://localhost:${PORT}/scheduled-bills`);
  console.log(`   Scheduled Bills: POST http://localhost:${PORT}/scheduled-bills`);
  console.log(`   Scheduled Bills: PUT http://localhost:${PORT}/scheduled-bills/:id`);
  console.log(`   Scheduled Bills: DELETE http://localhost:${PORT}/scheduled-bills/:id`);
  console.log(`   Bill Payment: POST http://localhost:${PORT}/bill-payment`);
  console.log(`   Process Scheduled Transfers: POST http://localhost:${PORT}/process-scheduled-transfers`);
  console.log(`   Process Scheduled Bills: POST http://localhost:${PORT}/process-scheduled-bills`);
  console.log(`🧪 Test with:`);
  console.log(`   curl -X POST http://localhost:${PORT}/register -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","username":"testuser","password":"testpassword123"}'`);
  console.log(`   curl -X POST http://localhost:${PORT}/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword123"}'`);
  console.log(`   curl http://localhost:${PORT}/users`);
  console.log(`📝 Database file: commerce_bank.db`);
  console.log(`Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});
