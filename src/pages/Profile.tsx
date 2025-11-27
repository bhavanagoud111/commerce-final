import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge as UIBadge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import QuickAccess from "@/components/QuickAccess";
import { toast } from "@/components/ui/use-toast";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Bell, 
  Shield, 
  Eye,
  EyeOff,
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Loader2,
  LogOut,
  Home,
  CreditCard,
  Hash,
  FileText,
  Download,
  Receipt,
  MessageCircle,
  HelpCircle,
  Gift,
  Star,
  Search,
  Send,
  Building2,
  DollarSign,
  Clock,
  Smartphone
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { addNotification } = useNotifications();
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    username: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false,
    security: true
  });

  // Quick Access state
  const [showCardManager, setShowCardManager] = useState(false);
  const [showSupportHelp, setShowSupportHelp] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [statements, setStatements] = useState<any[]>([]);
  const [supportSearchQuery, setSupportSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [accounts] = useState([
    { id: 1, account_number: 'CHK1234', account_type: 'checking', balance: 1000, created_at: '2024-01-01' },
    { id: 2, account_number: 'SAV5678', account_type: 'savings', balance: 5000, created_at: '2024-01-01' }
  ]);

  // FAQ data for Help Center
  const faqs = [
    {
      id: 1,
      question: "How do I transfer money between accounts?",
      answer: "You can transfer money between your accounts by going to the Payments section and selecting 'Internal Transfer'. Choose your source and destination accounts, enter the amount, and confirm the transfer.",
      category: "Transfers"
    },
    {
      id: 2,
      question: "How do I send money to another user?",
      answer: "To send money to another user, go to Payments > Send to Others, enter their username or email, specify the amount, and confirm the transaction.",
      category: "Transfers"
    },
    {
      id: 3,
      question: "How do I change my password?",
      answer: "Go to Profile > Security > Change Password. Enter your current password and create a new secure password.",
      category: "Security"
    },
    {
      id: 4,
      question: "How do I download my account statement?",
      answer: "Navigate to Dashboard > Statements tab, select the statement period you want, and click the Download button to get your statement in PDF or CSV format.",
      category: "Statements"
    },
    {
      id: 5,
      question: "How do I set up automatic bill payments?",
      answer: "Go to Payments > Bill Payments > Auto-Pay Setup. Select your bill type, enter the payment details, and set up the recurring schedule.",
      category: "Bills"
    },
    {
      id: 6,
      question: "What is the daily transfer limit?",
      answer: "The daily transfer limit is $10,000 for standard accounts. Premium accounts have higher limits up to $50,000 per day.",
      category: "Transfers"
    },
    {
      id: 7,
      question: "How do I enable two-factor authentication?",
      answer: "Go to Profile > Security > Two-Factor Authentication. Follow the setup instructions to link your mobile device for enhanced security.",
      category: "Security"
    },
    {
      id: 8,
      question: "How do I view my transaction history?",
      answer: "Navigate to Dashboard > Transactions tab to view your complete transaction history. You can filter by date range, amount, or transaction type.",
      category: "Statements"
    },
    {
      id: 9,
      question: "How do I dispute a transaction?",
      answer: "Contact customer support immediately if you notice an unauthorized transaction. You can also use the 'Report Fraud' feature in the Support section.",
      category: "Security"
    },
    {
      id: 10,
      question: "How do I update my contact information?",
      answer: "Go to Profile > Personal Information to update your address, phone number, or email address. Changes may require verification.",
      category: "Account"
    }
  ];

  // Offers data
  const offers = [
    {
      id: 1,
      title: "New Account Bonus",
      description: "Get $200 when you open a new checking account",
      validUntil: "2024-03-31",
      status: "active"
    },
    {
      id: 2,
      title: "High-Yield Savings",
      description: "Earn 4.5% APY on your savings account",
      validUntil: "2024-06-30",
      status: "active"
    },
    {
      id: 3,
      title: "Credit Card Rewards",
      description: "Earn 2% cashback on all purchases",
      validUntil: "2024-12-31",
      status: "active"
    }
  ];

  // Quick Access handler functions
  const handleChatSubmit = () => {
    if (chatMessage.trim()) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessage("");
        toast({
          title: "Message sent",
          description: "Our support team will respond within 24 hours.",
        });
      }, 2000);
    }
  };

  const handleApplyNow = () => {
    setShowOfferForm(true);
  };

  // Card Profiles
  const cardProfiles = accounts
    .filter((account) => ['checking', 'credit'].includes(account.account_type))
    .map((account, index) => {
      const isCredit = account.account_type === 'credit';
      const rawAccountDigits = (account.account_number || '').replace(/\D/g, '') || `${index + 1}`.repeat(4);
      const fallbackCardNumber = (rawAccountDigits + '1234567890123456').slice(-16);
      const cardNumberMasked = fallbackCardNumber.replace(/\d(?=\d{4})/g, '•').replace(/(.{4})/g, '$1 ').trim();
      const routingMasked = `0210000${(index * 7 + 3) % 90}`.replace(/\d(?=\d{3})/g, '•');
      const openedDate = new Date(account.created_at);
      const expiryDate = `${String((openedDate.getMonth() + 1) % 12 + 1).padStart(2, '0')}/${String(openedDate.getFullYear() + 4).slice(-2)}`;
      const network = isCredit ? ['Visa Signature', 'World Mastercard'][index % 2] : ['Visa Debit', 'Mastercard Debit'][index % 2];
      const monthYearFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

      return {
        id: `card-${account.id}`,
        title: account.account_type.replace(/_/g, ' '),
        typeLabel: isCredit ? 'Credit Card' : 'Debit Card',
        cardNumberMasked,
        routingMasked,
        network,
        creditLimit: isCredit ? 5000 + index * 1500 : null,
        available: isCredit ? 5000 - Math.abs(account.balance) : null,
        cardHolder: authUser?.name || user.name || 'Commerce Bank Client',
        expiry: expiryDate,
        openedLabel: monthYearFormatter.format(openedDate),
        linkedAccount: account.account_number,
        cvvMasked: '•••',
        status: 'Active',
        gradientClass: isCredit
          ? 'from-purple-500 via-indigo-500 to-slate-900'
          : 'from-emerald-400 via-teal-500 to-sky-500',
        borderClass: isCredit ? 'border-indigo-200/70' : 'border-emerald-200/70'
      };
    });

  // Generate statements from transactions
  const generateStatements = (transactions: any[]) => {
    if (transactions.length === 0) return [];

    // Group transactions by month
    const groupedTransactions = transactions.reduce((groups: any, transaction) => {
      const date = new Date(transaction.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(transaction);
      return groups;
    }, {});

    // Convert to statement format
    const statements = Object.keys(groupedTransactions).map(monthKey => {
      const monthTransactions = groupedTransactions[monthKey];
      const firstDate = new Date(Math.min(...monthTransactions.map((t: any) => new Date(t.created_at).getTime())));
      const lastDate = new Date(Math.max(...monthTransactions.map((t: any) => new Date(t.created_at).getTime())));
      
      const totalAmount = monthTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
      
      return {
        id: monthKey,
        month: firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        startDate: firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        transactions: monthTransactions.length,
        balance: totalAmount,
        transactionData: monthTransactions
      };
    });

    // Sort by date (newest first)
    return statements.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
  };

  // Generate CSV for a single statement
  const generateStatementCSV = (statement: any) => {
    const csvHeaders = ['Date', 'Description', 'Type', 'Amount', 'From Account', 'To Account', 'Status'];
    const csvData = statement.transactionData.map((transaction: any) => {
      let fromAccountInfo = 'N/A';
      let toAccountInfo = 'N/A';
      
      if (transaction.from_account_number && transaction.from_account_type) {
        fromAccountInfo = `${transaction.from_account_number} (${transaction.from_account_type})`;
      }
      
      if (transaction.to_account_number && transaction.to_account_type) {
        toAccountInfo = `${transaction.to_account_number} (${transaction.to_account_type})`;
      }
      
      return [
        new Date(transaction.created_at).toLocaleDateString(),
        transaction.description || 'N/A',
        transaction.transaction_type,
        `$${parseFloat(transaction.amount).toFixed(2)}`,
        fromAccountInfo,
        toAccountInfo,
        transaction.status || 'completed'
      ];
    });

    return [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
  };

  // Generate PDF content for a single statement
  const generateStatementPDF = (statement: any) => {
    const totalAmount = statement.transactionData.reduce((sum: number, t: any) => sum + Math.abs(parseFloat(t.amount)), 0);
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Commerce Bank - ${statement.month} Statement</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            @page {
              margin: 0.5in;
              size: letter;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              color: #1f2937;
              background-color: #ffffff;
              line-height: 1.6;
              font-size: 12px;
            }
            .container {
              max-width: 100%;
              margin: 0 auto;
            }
            .header {
              background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
              color: white;
              padding: 30px 40px;
              border-radius: 8px;
              margin-bottom: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header-top {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;
            }
            .bank-logo {
              font-size: 32px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            .statement-title {
              text-align: right;
            }
            .statement-title h2 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            .statement-title p {
              font-size: 14px;
              opacity: 0.95;
            }
            .header-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid rgba(255, 255, 255, 0.3);
            }
            .info-item {
              display: flex;
              flex-direction: column;
            }
            .info-label {
              font-size: 11px;
              opacity: 0.9;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 14px;
              font-weight: 600;
            }
            .statement-section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #10b981;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              background-color: white;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              border-radius: 6px;
              overflow: hidden;
            }
            thead {
              background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
              color: white;
            }
            th {
              padding: 14px 12px;
              text-align: left;
              font-weight: 600;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #10b981;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 12px;
            }
            tbody tr {
              transition: background-color 0.2s;
            }
            tbody tr:hover {
              background-color: #f9fafb;
            }
            tbody tr:last-child td {
              border-bottom: none;
            }
            .transaction-type {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 600;
              text-transform: capitalize;
            }
            .type-deposit {
              background-color: #d1fae5;
              color: #065f46;
            }
            .type-withdrawal {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .type-payment {
              background-color: #dbeafe;
              color: #1e40af;
            }
            .type-transfer {
              background-color: #f3e8ff;
              color: #6b21a8;
            }
            .amount-positive {
              color: #059669;
              font-weight: 600;
            }
            .amount-negative {
              color: #dc2626;
              font-weight: 600;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .status-completed {
              background-color: #d1fae5;
              color: #065f46;
            }
            .status-pending {
              background-color: #fef3c7;
              color: #92400e;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-top: 25px;
            }
            .summary-card {
              background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .summary-card-title {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            .summary-card-value {
              font-size: 24px;
              font-weight: 700;
              color: #059669;
            }
            .summary-card-label {
              font-size: 10px;
              color: #9ca3af;
              margin-top: 4px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 10px;
            }
            .footer-links {
              margin: 10px 0;
              display: flex;
              justify-content: center;
              gap: 20px;
              flex-wrap: wrap;
            }
            .footer-link {
              color: #10b981;
              text-decoration: none;
            }
            .footer-link:hover {
              text-decoration: underline;
            }
            .disclaimer {
              margin-top: 15px;
              padding: 15px;
              background-color: #f9fafb;
              border-left: 4px solid #10b981;
              border-radius: 4px;
              font-size: 10px;
              color: #4b5563;
            }
            .account-info {
              font-size: 11px;
              color: #6b7280;
              word-break: break-word;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-top">
                <div class="bank-logo">Commerce Bank</div>
                <div class="statement-title">
                  <h2>Account Statement</h2>
                  <p>${statement.month}</p>
                </div>
              </div>
              <div class="header-info">
                <div class="info-item">
                  <span class="info-label">Statement Period</span>
                  <span class="info-value">${statement.startDate} - ${statement.endDate}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Account Holder</span>
                  <span class="info-value">${user.name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Generated On</span>
                  <span class="info-value">${currentDate}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Total Transactions</span>
                  <span class="info-value">${statement.transactions}</span>
                </div>
              </div>
            </div>

            <div class="statement-section">
              <h3 class="section-title">Transaction History</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Account</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${statement.transactionData.map((transaction: any) => {
                    let fromAccountInfo = 'N/A';
                    let toAccountInfo = 'N/A';
                    
                    if (transaction.from_account_number && transaction.from_account_type) {
                      fromAccountInfo = `${transaction.from_account_number} (${transaction.from_account_type.replace(/_/g, ' ')})`;
                    }
                    
                    if (transaction.to_account_number && transaction.to_account_type) {
                      toAccountInfo = `${transaction.to_account_number} (${transaction.to_account_type.replace(/_/g, ' ')})`;
                    }
                    
                    const accountInfo = transaction.transaction_type === 'transfer' 
                      ? `${fromAccountInfo} → ${toAccountInfo}`
                      : fromAccountInfo;
                    
                    const transactionType = transaction.transaction_type || 'payment';
                    const typeClass = transactionType.includes('deposit') ? 'type-deposit' : 
                                     transactionType.includes('withdrawal') ? 'type-withdrawal' :
                                     transactionType.includes('transfer') ? 'type-transfer' : 'type-payment';
                    const statusClass = (transaction.status || 'completed').toLowerCase() === 'completed' ? 'status-completed' : 'status-pending';
                    const amountClass = parseFloat(transaction.amount) >= 0 ? 'amount-positive' : 'amount-negative';
                    const amountSign = parseFloat(transaction.amount) >= 0 ? '+' : '';
                    
                    return `
                      <tr>
                        <td>${new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td><strong>${transaction.description || 'N/A'}</strong></td>
                        <td><span class="transaction-type ${typeClass}">${transactionType}</span></td>
                        <td class="${amountClass}">${amountSign}$${Math.abs(parseFloat(transaction.amount)).toFixed(2)}</td>
                        <td class="account-info">${accountInfo}</td>
                        <td><span class="status-badge ${statusClass}">${transaction.status || 'completed'}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-card-title">Total Transactions</div>
                <div class="summary-card-value">${statement.transactions}</div>
                <div class="summary-card-label">This Period</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-title">Amount Processed</div>
                <div class="summary-card-value">$${totalAmount.toFixed(2)}</div>
                <div class="summary-card-label">Total Value</div>
              </div>
              <div class="summary-card">
                <div class="summary-card-title">Net Balance</div>
                <div class="summary-card-value ${statement.balance >= 0 ? 'amount-positive' : 'amount-negative'}">
                  ${statement.balance >= 0 ? '+' : ''}$${Math.abs(statement.balance).toFixed(2)}
                </div>
                <div class="summary-card-label">Balance Change</div>
              </div>
            </div>

            <div class="footer">
              <p><strong>Commerce Bank - Digital Banking System</strong></p>
              <div class="footer-links">
                <a href="#" class="footer-link">www.commercebank.com</a>
                <span>•</span>
                <span>support@commercebank.com</span>
                <span>•</span>
                <span>1-800-COMMERCE</span>
              </div>
              <div class="disclaimer">
                <p><strong>Important Information:</strong> This statement was generated electronically. All transactions are subject to verification. 
                Please review this statement carefully and report any discrepancies within 60 days. This document is valid for record-keeping purposes.</p>
                <p style="margin-top: 8px;">FDIC Insured • Equal Housing Lender • Member FDIC</p>
              </div>
              <p style="margin-top: 15px; font-size: 9px; color: #9ca3af;">
                Statement ID: ${statement.id} | Generated: ${currentDate} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // Download individual statement CSV
  const downloadStatementCSV = (statement: any) => {
    const csvContent = generateStatementCSV(statement);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `commerce_bank_statement_${statement.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Statement downloaded",
      description: `${statement.month} statement downloaded as CSV.`,
    });
    addNotification({
      type: 'csv_downloaded',
      title: 'Statement Downloaded',
      message: `Successfully downloaded ${statement.month} statement as CSV.`,
      priority: 'low'
    });
  };

  // Download individual statement PDF
  const downloadStatementPDF = (statement: any) => {
    const htmlContent = generateStatementPDF(statement);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
        }, 500);
      };
      addNotification({
        type: 'pdf_downloaded',
        title: 'Statement Downloaded',
        message: `Successfully downloaded ${statement.month} statement as PDF.`,
        priority: 'low'
      });
    } else {
      toast({
        variant: "destructive",
        title: "Pop-up blocked",
        description: "Enable pop-ups to view and print the PDF statement.",
      });
    }
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };

  // Download all statements
  const downloadAllStatements = async () => {
    if (statements.length === 0) {
      toast({
        variant: "destructive",
        title: "No statements available",
        description: "Generate account activity to access downloadable statements.",
      });
      return;
    }

    try {
      // Download each statement individually with a delay
      statements.forEach((statement, index) => {
        setTimeout(() => {
          downloadStatementCSV(statement);
        }, index * 500); // Stagger downloads
      });

      toast({
        title: "Downloading statements",
        description: `Preparing ${statements.length} statements for download...`,
      });
    } catch (error) {
      console.error('Error downloading statements:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "We couldn't prepare your statements. Please try again shortly.",
      });
    }
  };

  // Fetch transactions and generate statements
  const fetchTransactionsAndGenerateStatements = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fallback demo transactions for demonstration
      const fallbackTransactions = [
        { 
          id: '1', 
          amount: '500.00', 
          transaction_type: 'deposit', 
          description: 'Salary deposit', 
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        },
        { 
          id: '2', 
          amount: '-150.00', 
          transaction_type: 'withdrawal', 
          description: 'ATM withdrawal', 
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        },
        { 
          id: '3', 
          amount: '-75.50', 
          transaction_type: 'payment', 
          description: 'Grocery store purchase', 
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        },
        { 
          id: '4', 
          amount: '-45.00', 
          transaction_type: 'payment', 
          description: 'Coffee shop', 
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        },
        { 
          id: '5', 
          amount: '-120.00', 
          transaction_type: 'payment', 
          description: 'Restaurant bill', 
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        }
      ];

      if (!token) {
        // Generate statements from fallback data if no token
        const generatedStatements = generateStatements(fallbackTransactions);
        setStatements(generatedStatements);
        return;
      }

      const transactionsResponse = await fetch('http://localhost:3001/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        const transactionList = transactionsData.transactions || [];
        
        // If no transactions from API, use fallback
        if (transactionList.length === 0) {
          const generatedStatements = generateStatements(fallbackTransactions);
          setStatements(generatedStatements);
        } else {
          // Generate statements from API transactions
          const generatedStatements = generateStatements(transactionList);
          setStatements(generatedStatements);
        }
      } else {
        console.error('Failed to fetch transactions:', transactionsResponse.status);
        // Use fallback data on error
        const generatedStatements = generateStatements(fallbackTransactions);
        setStatements(generatedStatements);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Use fallback data on error
      const fallbackTransactions = [
        { 
          id: '1', 
          amount: '500.00', 
          transaction_type: 'deposit', 
          description: 'Salary deposit', 
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        },
        { 
          id: '2', 
          amount: '-150.00', 
          transaction_type: 'withdrawal', 
          description: 'ATM withdrawal', 
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        },
        { 
          id: '3', 
          amount: '-75.50', 
          transaction_type: 'payment', 
          description: 'Grocery store purchase', 
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          from_account_number: 'CHK1234',
          from_account_type: 'checking'
        }
      ];
      const generatedStatements = generateStatements(fallbackTransactions);
      setStatements(generatedStatements);
    }
  };

  // Login History data
  const loginHistory = [
    {
      id: 1,
      date: new Date().toISOString(),
      time: "2:30 PM",
      location: "New York, NY, United States",
      ipAddress: "192.168.1.105",
      device: "Chrome on Windows",
      status: "success",
      browser: "Chrome 120.0",
      os: "Windows 10"
    },
    {
      id: 2,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      time: "10:15 AM",
      location: "New York, NY, United States",
      ipAddress: "192.168.1.105",
      device: "Chrome on Windows",
      status: "success",
      browser: "Chrome 120.0",
      os: "Windows 10"
    },
    {
      id: 3,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: "3:45 PM",
      location: "New York, NY, United States",
      ipAddress: "192.168.1.105",
      device: "Chrome on Windows",
      status: "success",
      browser: "Chrome 120.0",
      os: "Windows 10"
    },
    {
      id: 4,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      time: "9:20 AM",
      location: "New York, NY, United States",
      ipAddress: "192.168.1.105",
      device: "Chrome on Windows",
      status: "success",
      browser: "Chrome 119.0",
      os: "Windows 10"
    },
    {
      id: 5,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: "11:30 AM",
      location: "New York, NY, United States",
      ipAddress: "192.168.1.105",
      device: "Safari on iPhone",
      status: "success",
      browser: "Safari 17.0",
      os: "iOS 17.0"
    },
    {
      id: 6,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: "4:12 PM",
      location: "New York, NY, United States",
      ipAddress: "192.168.1.105",
      device: "Chrome on Windows",
      status: "success",
      browser: "Chrome 119.0",
      os: "Windows 10"
    },
    {
      id: 7,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      time: "1:55 PM",
      location: "New York, NY, United States",
      ipAddress: "192.168.1.105",
      device: "Chrome on Windows",
      status: "success",
      browser: "Chrome 119.0",
      os: "Windows 10"
    },
    {
      id: 8,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      time: "8:40 AM",
      location: "Boston, MA, United States",
      ipAddress: "172.16.0.42",
      device: "Chrome on Mac",
      status: "success",
      browser: "Chrome 119.0",
      os: "macOS 14.0"
    }
  ];

  useEffect(() => {
    fetchUserData();
    fetchTransactionsAndGenerateStatements();
  }, []);

  // Fetch statements when statements sheet opens
  useEffect(() => {
    if (showStatements) {
      fetchTransactionsAndGenerateStatements();
    }
  }, [showStatements]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser({
          name: userData.name || "User",
          email: userData.email || "",
          username: userData.username || "",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States"
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  const handleSave = () => {
    // Implement save logic
    console.log('Saving user data:', user);
    setIsEditing(false);
    // Show success message
    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
    });
  };

  const handlePasswordChange = () => {
    setShowChangePasswordModal(true);
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      const token = localStorage.getItem('token');
      
      // Save to localStorage for persistence
      localStorage.setItem('notification_preferences', JSON.stringify(notifications));
      
      // Optionally save to backend if endpoint exists
      // For now, we'll save to localStorage and show success
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated successfully.",
      });
      
      addNotification({
        type: 'info',
        title: 'Notification Preferences Updated',
        message: 'Your notification preferences have been saved. You will receive notifications based on your selections.',
        priority: 'low'
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "Error saving preferences",
        description: "Unable to save your preferences. Please try again.",
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleEnable2FA = () => {
    setShow2FAModal(true);
  };

  // Load notification preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('notification_preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setNotifications(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Show logout message
    toast({
      title: "Logged out",
      description: "You have been signed out securely.",
    });
    
    // Redirect to home page
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <QuickAccess 
          className="mb-6"
          onOpenCardManager={() => setShowCardManager(true)}
          onOpenSupportHelp={() => setShowSupportHelp(true)}
          onOpenStatements={() => setShowStatements(true)}
        />
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-xl border border-slate-200/70 bg-white/80 p-1 shadow-sm backdrop-blur">
            <TabsTrigger 
              value="profile"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Profile Information
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.3)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsla(195,92%,56%,0.12)] via-transparent to-[hsla(150,60%,35%,0.08)] pointer-events-none" />
              <CardHeader className="relative z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-slate-800">Personal Information</CardTitle>
                    <CardDescription className="mt-1">
                      Manage your personal details and contact information
                    </CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white hover:opacity-90" : ""}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                      <Input 
                        id="name" 
                        value={user.name} 
                        onChange={(e) => setUser({...user, name: e.target.value})}
                        disabled={!isEditing}
                        className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user.email} 
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        disabled={!isEditing}
                        className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</Label>
                      <Input 
                        id="username" 
                        value={user.username} 
                        onChange={(e) => setUser({...user, username: e.target.value})}
                        disabled={!isEditing}
                        className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={user.phone} 
                        onChange={(e) => setUser({...user, phone: e.target.value})}
                        disabled={!isEditing}
                        className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-sm font-semibold text-slate-700">Address</Label>
                      <Textarea 
                        id="address" 
                        value={user.address} 
                        onChange={(e) => setUser({...user, address: e.target.value})}
                        disabled={!isEditing}
                        rows={2}
                        className="mt-2 rounded-xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-semibold text-slate-700">City</Label>
                        <Input 
                          id="city" 
                          value={user.city} 
                          onChange={(e) => setUser({...user, city: e.target.value})}
                          disabled={!isEditing}
                          className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-semibold text-slate-700">State</Label>
                        <Input 
                          id="state" 
                          value={user.state} 
                          onChange={(e) => setUser({...user, state: e.target.value})}
                          disabled={!isEditing}
                          className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode" className="text-sm font-semibold text-slate-700">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          value={user.zipCode} 
                          onChange={(e) => setUser({...user, zipCode: e.target.value})}
                          disabled={!isEditing}
                          className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-sm font-semibold text-slate-700">Country</Label>
                        <Input 
                          id="country" 
                          value={user.country} 
                          onChange={(e) => setUser({...user, country: e.target.value})}
                          disabled={!isEditing}
                          className="mt-2 h-12 rounded-xl border border-slate-200/70 bg-white/90 px-4 text-sm shadow-inner transition-all focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-2 mt-6 pt-6 border-t border-slate-200/70">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="rounded-full bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white hover:opacity-90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.3)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsla(150,60%,35%,0.12)] via-transparent to-[hsla(195,92%,56%,0.08)] pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <Shield className="h-6 w-6 mr-3 text-[hsl(var(--commerce-green))]" />
                  Security Settings
                </CardTitle>
                <CardDescription className="mt-1">
                  Manage your account security and authentication preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all hover:border-[hsl(var(--commerce-teal))]/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] flex items-center justify-center">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Change Password</h3>
                        <p className="text-sm text-slate-600">Update your account password</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handlePasswordChange} className="rounded-full border-[hsl(var(--commerce-teal))]/30 hover:bg-[hsl(var(--commerce-teal))]/10">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all hover:border-[hsl(var(--commerce-teal))]/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleEnable2FA}
                      disabled={twoFactorEnabled}
                      className="rounded-full border-blue-300/30 hover:bg-blue-50"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {twoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all hover:border-[hsl(var(--commerce-teal))]/40">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Login History</h3>
                        <p className="text-sm text-slate-600">View your recent login activity</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setShowLoginHistory(true)} className="rounded-full border-purple-300/30 hover:bg-purple-50">
                      <Eye className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.3)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsla(195,92%,56%,0.12)] via-transparent to-[hsla(150,60%,35%,0.08)] pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <Bell className="h-6 w-6 mr-3 text-[hsl(var(--commerce-teal))]" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="mt-1">
                  Choose how you want to be notified about your account activity
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Email Notifications</h3>
                        <p className="text-sm text-slate-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">SMS Notifications</h3>
                        <p className="text-sm text-slate-600">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Push Notifications</h3>
                        <p className="text-sm text-slate-600">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Marketing Communications</h3>
                        <p className="text-sm text-slate-600">Receive promotional offers and updates</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200/70 bg-white/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Security Alerts</h3>
                        <p className="text-sm text-slate-600">Important security notifications</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.security}
                      onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 pt-6 border-t border-slate-200/70">
                  <Button 
                    onClick={handleSavePreferences}
                    disabled={isSavingPreferences}
                    className="rounded-full bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white hover:opacity-90"
                  >
                    {isSavingPreferences ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      {/* Card Management Sheet */}
      <Sheet open={showCardManager} onOpenChange={setShowCardManager}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Card Management</SheetTitle>
            <SheetDescription>
              View and manage debit and credit cards linked to your accounts. Card data is masked for your security.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {cardProfiles.length === 0 ? (
              <Card className="border-dashed border-slate-200/70 bg-white/70 backdrop-blur">
                <CardContent className="py-12 text-center text-slate-500">
                  <CreditCard className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p>No cards available. Apply for a card to see it listed here.</p>
                </CardContent>
              </Card>
            ) : (
              cardProfiles.map((profile) => (
                <Card
                  key={profile.id}
                  className={`relative overflow-hidden border ${profile.borderClass} bg-white/80 shadow-[0_25px_60px_-40px_rgba(12,74,110,0.45)] backdrop-blur`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${profile.gradientClass} opacity-20`} />
                  <CardContent className="relative z-10 space-y-5 p-6">
                    <div className={`relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br ${profile.gradientClass} p-6 text-white shadow-lg`}>
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/70">
                        <span>{profile.network}</span>
                        <span>{profile.typeLabel}</span>
                      </div>
                      <div className="mt-6 text-2xl font-mono tracking-widest">
                        {profile.cardNumberMasked}
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="uppercase text-white/60">Card Holder</p>
                          <p className="mt-1 text-sm font-semibold text-white">{profile.cardHolder}</p>
                        </div>
                        <div>
                          <p className="uppercase text-white/60">Expires</p>
                          <p className="mt-1 text-sm font-semibold text-white">{profile.expiry}</p>
                        </div>
                        <div>
                          <p className="uppercase text-white/60">Opened</p>
                          <p className="mt-1 text-sm font-semibold text-white/90">{profile.openedLabel}</p>
                        </div>
                        <div className="text-right">
                          <p className="uppercase text-white/60">Security</p>
                          <p className="mt-1 text-sm font-semibold text-white">{profile.cvvMasked}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600">
                        <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                          <Hash className="h-3.5 w-3.5" />
                          Routing Number
                        </p>
                        <p className="mt-1 font-semibold text-slate-700">{profile.routingMasked}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600">
                        <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                          <CreditCard className="h-3.5 w-3.5" />
                          Linked Account
                        </p>
                        <p className="mt-1 font-semibold text-slate-700">{profile.linkedAccount}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-flex h-2 w-2 rounded-full ${profile.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="font-semibold text-slate-700">{profile.status}</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Network</p>
                        <p className="mt-1 font-semibold text-slate-700">{profile.network}</p>
                      </div>
                    </div>
                    {profile.typeLabel === 'Credit Card' && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Credit Limit</p>
                          <p className="mt-1 font-semibold text-slate-700">
                            {profile.creditLimit ? `$${profile.creditLimit.toLocaleString()}` : '—'}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Available Credit</p>
                          <p className={`mt-1 font-semibold ${profile.available && profile.available > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {profile.available !== null ? `$${(profile.available || 0).toLocaleString()}` : '—'}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[hsl(var(--commerce-green))]" />
                        EMV & tokenized payments enabled
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[hsl(var(--commerce-teal))]" />
                        Freeze or replace card from mobile app
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Statements Sheet */}
      <Sheet open={showStatements} onOpenChange={setShowStatements}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Account Statements</SheetTitle>
            <SheetDescription>
              View and download your account statements. Statements are generated monthly from your transaction history.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Monthly Statements</h3>
              <Button onClick={downloadAllStatements} disabled={statements.length === 0} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            {statements.length === 0 ? (
              <Card className="border-dashed border-slate-200/70 bg-white/70 backdrop-blur">
                <CardContent className="py-12 text-center text-slate-500">
                  <Receipt className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <h3 className="text-lg font-semibold">No Statements Available</h3>
                  <p className="text-sm mt-2">Your statement history will appear here once you have transactions.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {statements.map((statement) => (
                  <Card key={statement.id} className="border border-slate-200/60 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shadow-lg">
                            <Receipt className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800">{statement.month} Statement</p>
                            <p className="text-sm text-slate-600 mt-1">{statement.startDate} - {statement.endDate}</p>
                            <p className="text-xs text-slate-500 mt-1">{statement.transactions} transactions</p>
                            <p className="text-lg font-semibold text-slate-900 mt-2">${statement.balance.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadStatementPDF(statement)}
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadStatementCSV(statement)}
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            CSV
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Support & Help Dialog */}
      <Dialog open={showSupportHelp} onOpenChange={setShowSupportHelp}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Support & Help</DialogTitle>
            <DialogDescription>
              Get help, chat with support, and explore current offers
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="chat" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
              <TabsTrigger value="help">Help Center</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Live Chat Support
                  </CardTitle>
                  <CardDescription>
                    Chat with our support team for immediate assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                      <div className="space-y-2">
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs">
                            Hello! I need help with my profile settings.
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-800 rounded-lg p-2 max-w-xs">
                            Hi! I'd be happy to help you with your profile. What would you like to change?
                          </div>
                        </div>
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-800 rounded-lg p-2 max-w-xs flex items-center">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Typing...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                      />
                      <Button onClick={handleChatSubmit} disabled={!chatMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help Center Tab */}
            <TabsContent value="help" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find answers to common questions about our banking services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search FAQs..."
                        value={supportSearchQuery}
                        onChange={(e) => setSupportSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {faqs.filter(faq => 
                        faq.question.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                        faq.category.toLowerCase().includes(supportSearchQuery.toLowerCase())
                      ).map((faq) => (
                        <div key={faq.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{faq.question}</h3>
                              <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                            </div>
                            <UIBadge variant="outline" className="ml-4">
                              {faq.category}
                            </UIBadge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Current Offers & Rewards
                  </CardTitle>
                  <CardDescription>
                    Take advantage of our current promotions and rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{offer.title}</h3>
                              <UIBadge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                                {offer.status}
                              </UIBadge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Valid until: {offer.validUntil}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOffer(offer)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedOffer.title}</DialogTitle>
              <DialogDescription>
                {selectedOffer.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Offer Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">{selectedOffer.description}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Valid until:</strong> {selectedOffer.validUntil}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setSelectedOffer(null);
                  setShowOfferForm(false);
                }}>
                  Close
                </Button>
                <Button onClick={handleApplyNow}>
                  Apply Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Offer Application Form Dialog - Simplified version */}
      {showOfferForm && selectedOffer && (
        <Dialog open={showOfferForm} onOpenChange={setShowOfferForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply for {selectedOffer.title}</DialogTitle>
              <DialogDescription>
                Please contact our support team to complete your application.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-600">
                For a complete application, please visit our dashboard or contact support at support@commercebank.com
              </p>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowOfferForm(false)}>
                  Close
                </Button>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 2FA Setup Modal */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Enable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              Add an extra layer of security to your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">How it works</p>
                  <p className="text-sm text-blue-700">
                    Two-factor authentication requires a verification code from your mobile device in addition to your password when logging in.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">Authenticator App</p>
                  <p className="text-xs text-slate-600">Use an app like Google Authenticator or Authy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">SMS Verification</p>
                  <p className="text-xs text-slate-600">Receive codes via text message</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShow2FAModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setTwoFactorEnabled(true);
                  setShow2FAModal(false);
                  toast({
                    title: "2FA enabled",
                    description: "Two-factor authentication has been enabled for your account.",
                  });
                  addNotification({
                    type: 'security_alert',
                    title: 'Two-Factor Authentication Enabled',
                    message: 'Two-factor authentication has been successfully enabled. You will need to verify your identity with a code when logging in.',
                    priority: 'high'
                  });
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
              >
                <Shield className="h-4 w-4 mr-2" />
                Enable 2FA
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login History Dialog */}
      <Dialog open={showLoginHistory} onOpenChange={setShowLoginHistory}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Login History
            </DialogTitle>
            <DialogDescription>
              Review your recent login activity and device information for security purposes.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Security Notice</p>
                  <p className="text-sm text-blue-700">
                    If you notice any suspicious activity, contact support immediately at 1-800-COMMERCE or support@commercebank.com
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {loginHistory.map((login, index) => {
                const isRecent = index === 0;
                const loginDate = new Date(login.date);
                const formattedDate = loginDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                });
                
                return (
                  <Card 
                    key={login.id} 
                    className={`border transition-all hover:shadow-md ${
                      isRecent ? 'border-[hsl(var(--commerce-green))] bg-green-50/30' : 'border-gray-200'
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isRecent 
                              ? 'bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))]' 
                              : 'bg-gray-100'
                          }`}>
                            {isRecent ? (
                              <CheckCircle className="h-6 w-6 text-white" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {formattedDate}
                              </h3>
                              {isRecent && (
                                <Badge className="bg-[hsl(var(--commerce-green))] text-white">
                                  Current Session
                                </Badge>
                              )}
                              <Badge variant={login.status === 'success' ? 'default' : 'destructive'}>
                                {login.status === 'success' ? 'Successful' : 'Failed'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">Time:</span>
                                <span>{login.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">Location:</span>
                                <span>{login.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Shield className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">IP Address:</span>
                                <span className="font-mono text-xs">{login.ipAddress}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <CreditCard className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">Device:</span>
                                <span>{login.device}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {login.status === 'success' && (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">About Login History</p>
                  <p className="text-sm text-gray-600">
                    This history shows the last 90 days of login activity. We track location, device, and IP address 
                    for your security. If you see any activity you don't recognize, please change your password 
                    immediately and contact our security team.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowLoginHistory(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Report sent",
                  description: "If you see suspicious activity, please contact support immediately.",
                });
              }}>
                <Shield className="h-4 w-4 mr-2" />
                Report Suspicious Activity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;