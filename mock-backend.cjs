#!/usr/bin/env node

// Mock Commerce Bank Backend Server
// This provides a local backend for testing without AWS

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const users = [];

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Registration endpoint
app.post('/register', async (req, res) => {
    console.log('Registration request:', req.body);
    
    try {
        const { name, email, username, password } = req.body;
        
        // Validate required fields
        if (!name || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, email, username, password) are required'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const userId = uuidv4();
        const user = {
            userId,
            name,
            email,
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        users.push(user);
        
        console.log('User registered:', { userId, name, email, username });
        
        res.status(201).json({
            success: true,
            message: 'Registration successfully completed',
            userId: userId
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    console.log('Login request:', req.body);
    
    try {
        const { username, password } = req.body;
        
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.userId, 
                username: user.username,
                email: user.email 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log('User logged in:', { userId: user.userId, username });
        
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Commerce Bank API is running',
        timestamp: new Date().toISOString(),
        users: users.length
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Commerce Bank Mock Backend Server');
    console.log('=====================================');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log('');
    console.log('🔗 Endpoints:');
    console.log(`   Health: GET  http://localhost:${PORT}/`);
    console.log(`   Register: POST http://localhost:${PORT}/register`);
    console.log(`   Login: POST http://localhost:${PORT}/login`);
    console.log('');
    console.log('🧪 Test with:');
    console.log(`   curl -X POST http://localhost:${PORT}/register -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","username":"testuser","password":"testpassword123"}'`);
    console.log(`   curl -X POST http://localhost:${PORT}/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword123"}'`);
    console.log('');
    console.log('📝 Update your frontend to use: http://localhost:3001');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});
