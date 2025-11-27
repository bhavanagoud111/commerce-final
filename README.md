# Commerce Bank - Digital Banking Application

Complete setup guide for deploying the Commerce Bank digital banking application.

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/)
- **Git** (for cloning)

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and configure all variables:

```env
# Server Ports
PORT=3001
VITE_PORT=8080

# JWT Secret (IMPORTANT: Generate a strong random key!)
# Generate one: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_strong_random_secret_key_here

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=commerce_user
DB_PASSWORD=commerce_password
DB_NAME=commerce_bank

# Gmail SMTP (for OTP emails)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_gmail_app_password_16_characters

# OpenAI API (for chatbot - optional)
VITE_OPENAI_API_KEY=sk-your-openai-api-key
VITE_OPENAI_MODEL=gpt-4o-mini

# Frontend API Endpoint
VITE_API_URL=http://localhost:3001
```

**Important Configuration Steps:**

#### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and paste it as `JWT_SECRET` in `.env`.

#### Set Up Gmail App Password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App passwords**
4. Select **Mail** → **Other (Custom name)** → Type "OTP Service"
5. Copy the 16-character password (remove spaces)
6. Paste it as `SMTP_PASS` in `.env`

### Step 3: Start MySQL Database with Docker

```bash
# Start MySQL container
docker-compose up -d

# Verify it's running
docker ps
```

This creates a MySQL 8.0 database with:
- Database: `commerce_bank`
- User: `commerce_user`
- Password: `commerce_password`
- Port: `3306`

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001

## 📁 Project Structure

```
commerce-updated/
├── src/                    # Frontend React app
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   └── contexts/          # React contexts
├── mysql-backend.cjs      # Backend Express server
├── docker-compose.yml      # MySQL Docker config
├── .env.example           # Environment template
├── .env                   # Your config (create this)
└── package.json           # Dependencies
```

## 🗄️ Database Setup

The database tables are **automatically created** when you start the backend server. No manual setup needed!

The application creates these tables:
- `users` - User accounts
- `accounts` - Bank accounts
- `transactions` - All transactions
- `scheduled_transfers` - Recurring transfers
- `scheduled_bills` - Recurring bills
- `account_applications` - Account applications
- `loan_applications` - Loan applications
- `business_accounts` - Business accounts
- `branches` - Branch/ATM locations

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start frontend dev server
npm start               # Start backend server

# Docker
npm run docker:up       # Start MySQL container
npm run docker:down     # Stop MySQL container

# Production
npm run build          # Build frontend for production
```

## 🧪 Testing the Setup

1. **Create an Account:**
   - Go to http://localhost:8080
   - Click "Create an account"
   - Fill the registration form

2. **Login with OTP:**
   - Enter username and password
   - Check your email for OTP code
   - Enter the 6-digit OTP
   - You'll be logged in

3. **Verify Features:**
   - View accounts
   - Send money
   - Schedule payments
   - Manage cards

## 🚨 Troubleshooting

### Database Connection Error

```bash
# Check if MySQL is running
docker ps

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Port Already in Use

Change ports in `.env`:
- `PORT=3001` (backend)
- `VITE_PORT=8080` (frontend)

### OTP Emails Not Sending

1. Verify Gmail App Password is correct
2. Check 2-Step Verification is enabled
3. Verify `SMTP_USER` and `SMTP_PASS` in `.env`
4. Check backend console for errors

### Frontend Can't Connect to Backend

1. Ensure backend is running on port 3001
2. Check `VITE_API_URL` in `.env` matches backend URL
3. Verify CORS is enabled in backend

## 📦 Production Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MySQL database is accessible
3. Start server: `node mysql-backend.cjs`

### Frontend Deployment

1. Build: `npm run build`
2. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - AWS S3
   - Any static host

3. Update `VITE_API_URL` to your production backend URL

## 🔐 Security Notes

- **Never commit `.env` file** to version control
- Use strong, unique `JWT_SECRET` in production
- Keep Gmail App Password secure
- Use HTTPS in production

## 📞 Support

If you encounter issues:
1. Check backend console logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure Docker MySQL container is running

## ✅ Checklist

Before deploying, ensure:
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] JWT_SECRET generated and set
- [ ] Gmail App Password configured
- [ ] MySQL Docker container running
- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] OTP emails are sending

---

**You're all set!** Start the servers and begin using the application.
