const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
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
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:8081", "http://localhost:8083", "http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

  // Trim whitespace from username and email
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();

  try {
    // Check for duplicate username or email
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [trimmedUsername, trimmedEmail]
    );
    
    if (existingUsers.length > 0) {
      const duplicateField = existingUsers[0].username === trimmedUsername ? 'Username' : 'Email';
      return res.status(409).json({ success: false, message: `${duplicateField} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    await pool.execute(
      'INSERT INTO users (id, name, email, username, password) VALUES (?, ?, ?, ?, ?)',
      [userId, name, trimmedEmail, trimmedUsername, hashedPassword]
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

// Login Endpoint
app.post('/login', async (req, res) => {
  console.log('Login request:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username or password' });
  }

  // Trim whitespace from username
  const trimmedUsername = username.trim();

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [trimmedUsername]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = users[0];
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

// Get user accounts
app.get('/accounts', authenticateToken, async (req, res) => {
  try {
    const [accounts] = await pool.execute(
      'SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at',
      [req.user.userId]
    );
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
    
    // Get user's account IDs
    const [userAccounts] = await pool.execute(
      'SELECT id FROM accounts WHERE user_id = ?',
      [req.user.userId]
    );
    
    if (userAccounts.length === 0) {
      return res.json({ success: true, transactions: [] });
    }
    
    // Get transactions for user's accounts - SIMPLE APPROACH
    const accountIds = userAccounts.map(acc => acc.id);
    
    // Use a much simpler query that actually works
    let transactions = [];
    
    // Get transactions for each account individually
    for (const accountId of accountIds) {
      const [accountTransactions] = await pool.execute(
        'SELECT * FROM transactions WHERE from_account_id = ? OR to_account_id = ? ORDER BY created_at DESC',
        [accountId, accountId]
      );
      transactions = transactions.concat(accountTransactions);
    }
    
    // Remove duplicates and sort
    const uniqueTransactions = transactions.filter((transaction, index, self) => 
      index === self.findIndex(t => t.id === transaction.id)
    );
    
    // Sort by date and apply limit/offset
    uniqueTransactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const paginatedTransactions = uniqueTransactions.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({ success: true, transactions: paginatedTransactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching transactions' });
  }
});

// Simple transfer without transactions (for now)
app.post('/transfer', authenticateToken, async (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;
  
  if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid transfer parameters' });
  }

  try {
    // Verify accounts belong to user
    const [userAccounts] = await pool.execute(
      'SELECT id FROM accounts WHERE user_id = ? AND id IN (?, ?)',
      [req.user.userId, fromAccountId, toAccountId]
    );
    
    if (userAccounts.length < 2) {
      return res.status(403).json({ success: false, message: 'Invalid account access' });
    }
    
    // Check sufficient balance
    const [fromAccount] = await pool.execute(
      'SELECT balance FROM accounts WHERE id = ?',
      [fromAccountId]
    );
    
    if (fromAccount[0].balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    
    // Update balances
    await pool.execute(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromAccountId]
    );
    
    await pool.execute(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toAccountId]
    );
    
    // Create transaction record
    const transactionId = uuidv4();
    await pool.execute(
      'INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?)',
      [transactionId, fromAccountId, toAccountId, amount, 'transfer', description || 'Account transfer']
    );
    
    console.log('Transfer completed:', { fromAccountId, toAccountId, amount });
    res.json({ success: true, message: 'Transfer completed successfully', transactionId });
    
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during transfer' });
  }
});

// Simple send money without transactions (for now)
app.post('/send-money', authenticateToken, async (req, res) => {
  const { fromAccountId, toUsername, amount, description } = req.body;
  
  if (!fromAccountId || !toUsername || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid send parameters' });
  }

  try {
    // Get recipient user
    const [recipientUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [toUsername]
    );
    
    if (recipientUsers.length === 0) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }
    
    const recipientUserId = recipientUsers[0].id;
    
    // Get recipient's checking account
    const [recipientAccounts] = await pool.execute(
      'SELECT id FROM accounts WHERE user_id = ? AND account_type = "checking" LIMIT 1',
      [recipientUserId]
    );
    
    if (recipientAccounts.length === 0) {
      return res.status(404).json({ success: false, message: 'Recipient account not found' });
    }
    
    const toAccountId = recipientAccounts[0].id;
    
    // Verify sender account belongs to user
    const [senderAccounts] = await pool.execute(
      'SELECT balance FROM accounts WHERE id = ? AND user_id = ?',
      [fromAccountId, req.user.userId]
    );
    
    if (senderAccounts.length === 0) {
      return res.status(403).json({ success: false, message: 'Invalid account access' });
    }
    
    if (senderAccounts[0].balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
    
    // Update balances
    await pool.execute(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromAccountId]
    );
    
    await pool.execute(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toAccountId]
    );
    
    // Create transaction record
    const transactionId = uuidv4();
    await pool.execute(
      'INSERT INTO transactions (id, from_account_id, to_account_id, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?)',
      [transactionId, fromAccountId, toAccountId, amount, 'transfer', description || `Payment to ${toUsername}`]
    );
    
    console.log('Money sent:', { fromAccountId, toUsername, amount });
    res.json({ success: true, message: `Money sent successfully to ${toUsername}`, transactionId });
    
  } catch (error) {
    console.error('Send money error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during send' });
  }
});

// Get all users (for sending money)
// Get current user information
app.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, username, email, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching current user' });
  }
});

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

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Commerce Bank Fixed MySQL Backend Server`);
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
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await pool.end();
  process.exit(0);
});

startServer();
