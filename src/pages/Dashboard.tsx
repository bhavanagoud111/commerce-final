import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import AccountCard from "@/components/AccountCard";
import TransactionCard from "@/components/TransactionCard";
import NotificationsModal from "@/components/NotificationsModal";
import Header from "@/components/Header";
import QuickAccess from "@/components/QuickAccess";
import LoanApplicationForm from "@/components/LoanApplicationForm";
import BusinessApplicationForm from "@/components/BusinessApplicationForm";
import { toast } from "@/components/ui/use-toast";
import {
  DollarSign,
  TrendingUp,
  Download,
  User,
  Settings,
  Bell,
  LogOut,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Receipt,
  CreditCard,
  Building2,
  ShieldCheck,
  CalendarDays,
  FileText,
  Lock,
  Shield,
  Hash,
  MessageCircle,
  HelpCircle,
  Gift,
  Star,
  Search,
  Send,
  CheckCircle,
  MapPin,
  AlertTriangle,
  Headphones,
  Info
} from "lucide-react";
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Dashboard = () => {
  console.log('🚀 Dashboard component starting...');
  const navigate = useNavigate();
  const { user: authUser, token, logout } = useAuth();
  const { addNotification } = useNotifications();
  
  // State for database-driven data
  const [user, setUser] = useState({
    name: "Loading...",
    accountNumber: "****1234",
    balance: 0,
    lastLogin: "Today at 2:30 PM"
  });
  const [accounts, setAccounts] = useState([
    { id: '1', account_number: 'CHK1234', account_type: 'checking' as const, balance: 1000, created_at: '2024-01-01' },
    { id: '2', account_number: 'SAV5678', account_type: 'savings' as const, balance: 5000, created_at: '2024-01-01' },
    { id: '3', account_number: 'CRD9012', account_type: 'cash_back_card' as const, balance: 1200, created_at: '2023-06-15', credit_limit: 8000 }
  ]);
  const [transactions, setTransactions] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);
  const [businessApplications, setBusinessApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statements, setStatements] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());
  const [showCardManager, setShowCardManager] = useState(false);
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);
  const [showSupportHelp, setShowSupportHelp] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [supportSearchQuery, setSupportSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({});
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showLoanSelectionDialog, setShowLoanSelectionDialog] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState("");
  const [showBusinessSelectionDialog, setShowBusinessSelectionDialog] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [selectedBusinessAccountType, setSelectedBusinessAccountType] = useState<'business_checking' | 'business_savings' | 'merchant_services'>('business_checking');
  const [offerFormData, setOfferFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    employmentStatus: "",
    employerName: "",
    annualIncome: "",
    initialDeposit: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });
  const [offerFormErrors, setOfferFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);

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

  const BANKING_SYSTEM_INSTRUCTION = `You are Commerce Assist, a helpful banking assistant for Commerce Bank's digital banking application. Your role is to assist customers with banking-related queries only.

IMPORTANT RULES:
1. ONLY answer questions related to banking services, account management, transfers, payments, cards, security, loans, mortgages, investments, and other financial services offered by Commerce Bank.
2. If a user asks about non-banking topics (weather, general knowledge, jokes, etc.), politely redirect them: "I'm here to help with banking questions. How can I assist you with your Commerce Bank account, transfers, payments, or other banking services?"
3. Be professional, friendly, and concise.
4. Guide users to specific features in the Commerce Bank application when relevant (e.g., "Go to Payments → Transfer Money").
5. Never provide financial advice or make recommendations about investments.
6. For sensitive account issues, suggest contacting customer support.

Available banking services: account management, money transfers, bill payments, card management, security settings, loan applications, mortgage services, investment services, and account statements.`;

  const [chatMessages, setChatMessages] = useState<Array<{sender: 'user' | 'bot', text: string, timestamp: string}>>([
    {
      sender: 'bot',
      text: "Hi! I'm Commerce Assist. I can help you with transfers, payments, card management, account questions, and more. What can I help you with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const getBotReply = async (input: string, conversationHistory: Array<{sender: 'user' | 'bot', text: string}>) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return "I'm currently unavailable. Please try again later or contact support.";
    }

    try {
      const messages = [
        { role: "system", content: BANKING_SYSTEM_INSTRUCTION },
        ...conversationHistory
          .filter((msg) => msg.sender !== 'bot' || !msg.text.includes("Hi! I'm Commerce Assist"))
          .map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        { role: "user", content: input },
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenAI API error:", errorData);
        return "I'm having trouble connecting right now. Please try again in a moment.";
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm sorry, I didn't understand that. Could you rephrase your banking question?";
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return "I'm experiencing technical difficulties. Please try again or contact support for immediate assistance.";
    }
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      sender: 'user' as const,
      text: chatMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage("");
    setIsTyping(true);

    try {
      const botReply = await getBotReply(userMessage.text, chatMessages);
      const botMessage = {
        sender: 'bot' as const,
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        sender: 'bot' as const,
        text: "I'm sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOfferFormChange = (field: string, value: string | boolean) => {
    setOfferFormData(prev => ({ ...prev, [field]: value }));
    if (offerFormErrors[field]) {
      setOfferFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateOfferForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!offerFormData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!offerFormData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!offerFormData.email.trim()) newErrors.email = "Email is required";
    if (offerFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(offerFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!offerFormData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!offerFormData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!offerFormData.ssn.trim()) newErrors.ssn = "SSN is required";
    if (!offerFormData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!offerFormData.city.trim()) newErrors.city = "City is required";
    if (!offerFormData.state.trim()) newErrors.state = "State is required";
    if (!offerFormData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!offerFormData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (offerFormData.employmentStatus === "employed" && !offerFormData.employerName.trim()) {
      newErrors.employerName = "Employer name is required";
    }
    if (!offerFormData.annualIncome.trim()) newErrors.annualIncome = "Annual income is required";
    
    if (selectedOffer?.id === 1 || selectedOffer?.id === 2) {
      if (!offerFormData.initialDeposit.trim()) {
        newErrors.initialDeposit = "Initial deposit amount is required";
      } else if (parseFloat(offerFormData.initialDeposit) < 100) {
        newErrors.initialDeposit = "Minimum initial deposit is $100";
      }
    }
    
    if (!offerFormData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";
    
    setOfferFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOfferFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOfferForm()) return;
    
    setIsSubmittingOffer(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationId = `APP-${Date.now().toString().slice(-6)}`;
      
      setOfferSubmitted(true);
      setShowOfferForm(false);
      
      toast({
        title: "Application submitted successfully!",
        description: `Your application ID is ${applicationId}. We'll review and contact you within 2-3 business days.`,
      });
      
      // Reset form
      setOfferFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        ssn: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        employmentStatus: "",
        employerName: "",
        annualIncome: "",
        initialDeposit: "",
        agreeToTerms: false,
        agreeToMarketing: false
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "We couldn't process your application. Please try again.",
      });
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleApplyNow = () => {
    setShowOfferForm(true);
  };

  const expenseCategories = useMemo(() => {
    const categories = [
      { name: 'Housing', amount: 1800, color: '#22c55e' },
      { name: 'Groceries', amount: 550, color: '#0ea5e9' },
      { name: 'Transportation', amount: 320, color: '#f97316' },
      { name: 'Entertainment', amount: 250, color: '#a855f7' },
      { name: 'Utilities', amount: 280, color: '#14b8a6' },
      { name: 'Miscellaneous', amount: 140, color: '#facc15' }
    ];

    return categories;
  }, []);

  const totalExpenses = expenseCategories.reduce((sum, category) => sum + category.amount, 0);

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

  // Download all statements as ZIP
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
      // Create individual statement files
      const statementFiles = statements.map(statement => {
        const csvContent = generateStatementCSV(statement);
        const pdfContent = generateStatementPDF(statement);
        
        return {
          name: `statement_${statement.id}`,
          csv: csvContent,
          pdf: pdfContent
      };
    });

    // For now, download each statement individually
    // In a real implementation, you'd use a ZIP library like JSZip
    statements.forEach((statement, index) => {
      setTimeout(() => {
        downloadStatementCSV(statement);
      }, index * 500); // Stagger downloads
    });

    console.log(`✅ Downloaded ${statements.length} statements`);
    } catch (error) {
      console.error('Error downloading statements:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "We couldn't prepare your statements. Please try again shortly.",
      });
    }
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

  // Download functions for PDF and CSV
  const downloadCSV = () => {
    if (transactions.length === 0) {
      toast({
        variant: "destructive",
        title: "No transactions available",
        description: "Exporting requires at least one transaction.",
      });
      return;
    }

    try {
      const csvHeaders = ['Date', 'Description', 'Type', 'Amount', 'From Account', 'To Account', 'Status'];
      const csvData = transactions.map((transaction: any) => {
        // Use the enhanced transaction data that already includes account information
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

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `commerce_bank_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      console.log(`✅ CSV downloaded successfully with ${transactions.length} transactions`);
      addNotification({
        type: 'csv_downloaded',
        title: 'Transaction Export Complete',
        message: `Successfully exported ${transactions.length} transactions as CSV file.`,
        priority: 'low'
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        variant: "destructive",
        title: "CSV download failed",
        description: "We couldn't export your transactions. Please try again.",
      });
    }
  };

  const downloadPDF = () => {
    if (transactions.length === 0) {
      toast({
        variant: "destructive",
        title: "No transactions available",
        description: "Generate activity before creating a PDF report.",
      });
      return;
    }

    try {
      // Create a professional HTML table for PDF generation
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Commerce Bank - Transaction Report</title>
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
                margin: 0;
                padding: 20px;
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
              .header h1 { 
                color: white; 
                margin: 0 0 10px 0; 
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -0.5px;
              }
              .header p { 
                margin: 5px 0; 
                color: rgba(255, 255, 255, 0.95);
                font-size: 14px;
              }
              .header-info {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.3);
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 15px;
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
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                background-color: white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                border-radius: 6px;
                overflow: hidden;
              }
              thead {
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                color: white;
              }
              th, td { 
                padding: 14px 12px; 
                text-align: left; 
              }
              th { 
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                color: white; 
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #10b981;
              }
              td { 
                font-size: 12px;
                border-bottom: 1px solid #e5e7eb;
              }
              tbody tr {
                transition: background-color 0.2s;
              }
              tbody tr:nth-child(even) {
                background-color: #f9fafb;
              }
              tbody tr:hover {
                background-color: #f3f4f6;
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
              .summary-section {
                margin-top: 30px;
                padding: 25px;
                background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
                border: 2px solid #10b981;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              }
              .summary-title {
                font-size: 18px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #10b981;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 15px;
              }
              .summary-item {
                text-align: center;
                padding: 15px;
                background: white;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
              }
              .summary-label {
                font-size: 11px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
              }
              .summary-value {
                font-size: 20px;
                font-weight: 700;
                color: #059669;
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
              .disclaimer {
                margin-top: 15px;
                padding: 15px;
                background-color: #f9fafb;
                border-left: 4px solid #10b981;
                border-radius: 4px;
                font-size: 10px;
                color: #4b5563;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Commerce Bank</h1>
                <p style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">Transaction Report</p>
                <div class="header-info">
                  <div class="info-item">
                    <span class="info-label">Generated On</span>
                    <span class="info-value">${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Account Holder</span>
                    <span class="info-value">${user.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Total Transactions</span>
                    <span class="info-value">${transactions.length}</span>
                  </div>
                </div>
              </div>
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
                ${transactions.map((transaction: any) => {
                  // Use the enhanced transaction data that already includes account information
                  let fromAccountInfo = 'N/A';
                  let toAccountInfo = 'N/A';
                  
                  if (transaction.from_account_number && transaction.from_account_type) {
                    fromAccountInfo = `${transaction.from_account_number} (${transaction.from_account_type})`;
                  }
                  
                  if (transaction.to_account_number && transaction.to_account_type) {
                    toAccountInfo = `${transaction.to_account_number} (${transaction.to_account_type})`;
                  }
                  
                  const accountInfo = transaction.transaction_type === 'transfer' 
                    ? `${fromAccountInfo} → ${toAccountInfo}`
                    : fromAccountInfo;
                  
                  const transactionType = transaction.transaction_type.toLowerCase();
                  const typeClass = transactionType.includes('deposit') ? 'type-deposit' : 
                                   transactionType.includes('withdrawal') ? 'type-withdrawal' : 
                                   transactionType.includes('payment') ? 'type-payment' : 
                                   transactionType.includes('transfer') ? 'type-transfer' : '';
                  const statusClass = (transaction.status || 'completed').toLowerCase() === 'completed' ? 'status-completed' : 'status-pending';
                  
                  return `
                    <tr>
                      <td>${new Date(transaction.created_at).toLocaleDateString()}</td>
                      <td>${transaction.description || 'N/A'}</td>
                      <td><span class="transaction-type ${typeClass}">${transaction.transaction_type}</span></td>
                      <td class="${parseFloat(transaction.amount) >= 0 ? 'amount-positive' : 'amount-negative'}">
                        $${parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td>${accountInfo}</td>
                      <td><span class="status-badge ${statusClass}">${transaction.status || 'completed'}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
              <div class="summary-section">
                <div class="summary-title">Summary</div>
                <div class="summary-grid">
                  <div class="summary-item">
                    <div class="summary-label">Total Transactions</div>
                    <div class="summary-value">${transactions.length}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Total Amount Processed</div>
                    <div class="summary-value">$${transactions.reduce((sum: number, transaction: any) => sum + Math.abs(parseFloat(transaction.amount)), 0).toFixed(2)}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Net Balance Change</div>
                    <div class="summary-value" style="color: ${transactions.reduce((sum: number, transaction: any) => sum + parseFloat(transaction.amount), 0) >= 0 ? '#059669' : '#dc2626'}">
                      $${transactions.reduce((sum: number, transaction: any) => sum + parseFloat(transaction.amount), 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <p><strong>Commerce Bank Digital Banking System</strong></p>
                <div class="footer-links">
                  <span>For support, contact us at support@commercebank.com</span>
                </div>
                <div class="disclaimer">
                  <p><strong>Disclaimer:</strong> This report is generated for informational purposes only. All transactions are subject to verification and may be pending final settlement. Please review your account statements regularly.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing/saving as PDF
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          // Auto-trigger print dialog
          setTimeout(() => {
            newWindow.print();
          }, 500);
        };
      } else {
        toast({
          variant: "destructive",
          title: "Pop-up blocked",
          description: "Enable pop-ups to open the PDF report.",
        });
      }
      
      // Clean up the URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      
      console.log(`✅ PDF generated successfully with ${transactions.length} transactions`);
      addNotification({
        type: 'pdf_downloaded',
        title: 'Transaction Report Generated',
        message: `Successfully generated PDF report with ${transactions.length} transactions.`,
        priority: 'low'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Report generation failed",
        description: "We couldn't create the PDF report. Please try again.",
      });
    }
  };

  // Load dashboard with real data from backend
  const fetchUserData = async () => {
    try {
      console.log('🚀 Loading dashboard with real data...');
      
      // Use auth context user data if available, otherwise use demo data
      if (authUser) {
        setUser({
          name: authUser.name || "Demo User",
          accountNumber: "****1234",
          balance: 6000,
          lastLogin: "Today at 2:30 PM"
        });
      } else {
        setUser({
          name: "Demo User",
          accountNumber: "****1234",
          balance: 6000,
          lastLogin: "Today at 2:30 PM"
        });
      }
      
      // Fetch real accounts data from backend
      if (token) {
        console.log('Fetching accounts from backend...');
        
        const accountsResponse = await fetch(`http://localhost:3001/accounts?t=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          console.log('Accounts data:', accountsData);
          console.log('Individual accounts:', accountsData.accounts);
          accountsData.accounts?.forEach((account, index) => {
            console.log(`Account ${index}:`, account);
            if (account.account_type === 'cash_back_card') {
              console.log('Cash Back Card details:', {
                id: account.id,
                account_type: account.account_type,
                credit_limit: account.credit_limit,
                balance: account.balance
              });
            }
          });
          setAccounts(accountsData.accounts || []);
          setLastRefreshedAt(new Date());
        } else {
          console.error('Failed to fetch accounts:', accountsResponse.status);
          // Fallback to static data
          setAccounts([
            { id: '1', account_number: 'CHK1234', account_type: 'checking' as const, balance: 1000, created_at: '2024-01-01' },
            { id: '2', account_number: 'SAV5678', account_type: 'savings' as const, balance: 5000, created_at: '2024-01-01' },
            { id: '3', account_number: 'CRD9012', account_type: 'cash_back_card' as const, balance: 1200, created_at: '2023-06-15', credit_limit: 8000 }
          ]);
          setLastRefreshedAt(new Date());
        }

        // Fetch transactions data
        const transactionsResponse = await fetch('http://localhost:3001/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          console.log('Transactions data:', transactionsData);
          const transactionList = transactionsData.transactions || [];
          setTransactions(transactionList);
          
          // Generate statements from transactions
          const generatedStatements = generateStatements(transactionList);
          setStatements(generatedStatements);
          console.log('Generated statements:', generatedStatements);
        } else {
          console.error('Failed to fetch transactions:', transactionsResponse.status);
          // Fallback to static data
          const fallbackTransactions = [
            { id: '1', amount: 500, transaction_type: 'deposit', description: 'Salary deposit', created_at: '2024-01-15' },
            { id: '2', amount: 150, transaction_type: 'withdrawal', description: 'ATM withdrawal', created_at: '2024-01-14' },
            { id: '3', amount: 75, transaction_type: 'payment', description: 'Grocery store', created_at: '2024-01-13' }
          ];
          setTransactions(fallbackTransactions);
          
          // Generate statements from fallback data
          const generatedStatements = generateStatements(fallbackTransactions);
          setStatements(generatedStatements);
        }

        // Fetch loan applications data
        const loanApplicationsResponse = await fetch('http://localhost:3001/loan-applications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (loanApplicationsResponse.ok) {
          const loanApplicationsData = await loanApplicationsResponse.json();
          console.log('Loan applications data:', loanApplicationsData);
          setLoanApplications(loanApplicationsData.applications || []);
        } else {
          console.error('Failed to fetch loan applications:', loanApplicationsResponse.status);
          setLoanApplications([]);
        }

        // Fetch business applications data
        const businessApplicationsResponse = await fetch('http://localhost:3001/business-applications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (businessApplicationsResponse.ok) {
          const businessApplicationsData = await businessApplicationsResponse.json();
          console.log('Business applications data:', businessApplicationsData);
          setBusinessApplications(businessApplicationsData.applications || []);
        } else {
          console.error('Failed to fetch business applications:', businessApplicationsResponse.status);
          setBusinessApplications([]);
        }
      } else {
        console.log('No token found, using static data');
        // Fallback to static data when no token
        setAccounts([
          { id: '1', account_number: 'CHK1234', account_type: 'checking' as const, balance: 1000, created_at: '2024-01-01' },
          { id: '2', account_number: 'SAV5678', account_type: 'savings' as const, balance: 5000, created_at: '2024-01-01' },
          { id: '3', account_number: 'CRD9012', account_type: 'cash_back_card' as const, balance: 1200, created_at: '2023-06-15', credit_limit: 8000 }
        ]);
        setLastRefreshedAt(new Date());
        setTransactions([
          { id: '1', amount: 500, transaction_type: 'deposit', description: 'Salary deposit', created_at: '2024-01-15' },
          { id: '2', amount: 150, transaction_type: 'withdrawal', description: 'ATM withdrawal', created_at: '2024-01-14' },
          { id: '3', amount: 75, transaction_type: 'payment', description: 'Grocery store', created_at: '2024-01-13' }
        ]);
      }
      
      console.log('✅ Dashboard loaded with data');
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load dashboard');
      // Fallback to static data on error
      setAccounts([
        { id: '1', account_number: 'CHK1234', account_type: 'checking' as const, balance: 1000, created_at: '2024-01-01' },
        { id: '2', account_number: 'SAV5678', account_type: 'savings' as const, balance: 5000, created_at: '2024-01-01' },
        { id: '3', account_number: 'CRD9012', account_type: 'cash_back_card' as const, balance: 1200, created_at: '2023-06-15', credit_limit: 8000 }
      ]);
      setLastRefreshedAt(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchUserData();
  };

  // Database-driven data is now handled by the state variables above

  const [beneficiaries] = useState([
    { id: 1, name: "Jane Doe", account: "****5678", bank: "Commerce Bank", type: "internal" },
    { id: 2, name: "ABC Company", account: "****1234", bank: "Other Bank", type: "external" },
    { id: 3, name: "John's Savings", account: "****9012", bank: "Commerce Bank", type: "internal" }
  ]);


  const quickActions = [
    { title: "Download Statement", icon: Download, color: "text-purple-500", action: "statement" }
  ];

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Implement quick action logic
  };

  const handleLogout = () => {
    // Use auth context logout
    logout();
    
    // Show logout message
    toast({
      title: "Logged out",
      description: "You have been signed out securely.",
    });
  };

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  const formattedTotalBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(totalBalance);
  const accountCount = accounts.length;
  const totalTransactions = transactions.length;
  const refreshedDisplay = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(lastRefreshedAt);
  const positiveAccountCount = accounts.filter(account => account.balance >= 0).length;
  const topAccount =
    accounts.length > 0
      ? accounts.reduce(
          (prev, current) =>
            Math.abs(current.balance) > Math.abs(prev.balance) ? current : prev,
          accounts[0]
        )
      : null;
 
  const cardProfiles = useMemo(() => {
    const allowedTypes = new Set([
      'checking',
      'basic_checking',
      'premium_checking',
      'student_checking',
      'credit',
      'cash_back_card',
      'travel_rewards_card',
      'student_credit_card'
    ]);
    const creditTypes = new Set(['credit', 'cash_back_card', 'travel_rewards_card', 'student_credit_card']);
    const creditNetworks = ['Visa Signature', 'World Mastercard', 'American Express', 'Discover It'];
    const debitNetworks = ['Visa Debit', 'Mastercard Debit', 'UnionPay Debit', 'Maestro Debit'];

    // Get user ID from auth context
    const userId = authUser?.userId || 0;

    return accounts
      .filter((account) => allowedTypes.has(account.account_type))
      .map((account, index) => {
        const isCredit = creditTypes.has(account.account_type);
        const cardDetails: any = (account as any).card_details || {};
        
        // Generate unique seed based on user ID and account ID
        const userIdStr = String(userId || '0');
        const userIdNum = parseInt(userIdStr.replace(/\D/g, '').slice(-5)) || 1;
        const accountIdStr = String(account.id || '0');
        const accountIdNum = parseInt(accountIdStr.replace(/\D/g, '').slice(-5)) || 1;
        const uniqueSeed = userIdNum * 100000 + accountIdNum;
        
        // Generate unique card number based on user and account (digits only)
        // Use BigInt to avoid scientific notation, then convert to string
        const seedBigInt = BigInt(uniqueSeed);
        const multiplier = BigInt(123456789012345);
        const maxValue = BigInt(1000000000000000); // 15 digits max
        const cardNumberDigits = String(seedBigInt * multiplier % maxValue).padStart(15, '0');
        const baseCardNumber = (isCredit ? '4' : '5') + cardNumberDigits;
        const cardNumberRaw = baseCardNumber.replace(/(.{4})/g, '$1 ').trim();
        // Mask all digits except last 4
        const lastFour = baseCardNumber.slice(-4);
        const cardNumberMasked = '•••• •••• •••• ' + lastFour;

        // Generate unique CVV based on user and account
        const cvvRaw = String((uniqueSeed * 7) % 1000).padStart(3, '0');
        const cvvMasked = '•••';

        // Generate unique routing number
        const routingRawBase = String(210000000 + (uniqueSeed % 1000)).padStart(9, '0');
        // Mask all digits except last 3
        const lastThree = routingRawBase.slice(-3);
        const routingMasked = '••••••' + lastThree;

        const openedDate = new Date(account.created_at);
        const expiryDate = cardDetails.expiry
          ? cardDetails.expiry
          : (() => {
              const d = new Date(openedDate.getTime());
              d.setFullYear(d.getFullYear() + 4);
              return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
            })();

        const network = cardDetails.network || (isCredit ? creditNetworks[index % creditNetworks.length] : debitNetworks[index % debitNetworks.length]);
        const creditLimit = isCredit ? cardDetails.credit_limit || account.credit_limit || 5000 + index * 1500 : null;
        const available = isCredit ? Math.max(0, (creditLimit || 0) - Math.abs(account.balance)) : null;

        const monthYearFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

        return {
          id: `card-${account.id}`,
          title: account.account_type.replace(/_/g, ' '),
          typeLabel: isCredit ? 'Credit Card' : 'Debit Card',
          cardNumberMasked,
          cardNumberRaw,
          routingMasked,
          routingRaw: routingRawBase,
          network,
          creditLimit,
          available,
          cardHolder: cardDetails.cardholder || user.name || 'Commerce Bank Client',
          expiry: expiryDate,
          openedLabel: monthYearFormatter.format(openedDate),
          linkedAccount: account.account_number,
          cvvMasked,
          cvvRaw,
          status: cardDetails.status || 'Active',
          gradientClass: isCredit
            ? 'from-purple-500 via-indigo-500 to-slate-900'
            : 'from-emerald-400 via-teal-500 to-sky-500',
          borderClass: isCredit ? 'border-indigo-200/70' : 'border-emerald-200/70'
        };
      });
  }, [accounts, user.name, authUser]);

  // Show full-screen loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Please wait while we load your account information...</p>
        </div>
      </div>
    );
  }


  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <Button onClick={handleRefresh} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎨 Dashboard rendering...');
  console.log('🚀 Loading dashboard (authentication optional)');
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <Header />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-36 h-80 w-80 rounded-full bg-[hsl(var(--commerce-teal)_/_0.12)] blur-3xl" />
        <div className="absolute left-[-6%] bottom-24 h-96 w-96 rounded-full bg-[hsl(var(--commerce-green)_/_0.1)] blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 space-y-10">
        {/* Personalized Welcome Message */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-light-blue))] p-8 text-white shadow-[0_32px_60px_-28px_rgba(12,74,110,0.6)]">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute right-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-6 max-w-xl">
              <Badge className="w-max rounded-full border border-white/40 bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm shadow-md">
                Personalized Dashboard
              </Badge>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Welcome back, {user.name}!
                </h2>
                <p className="flex items-center gap-2 text-white/90 font-medium">
                  <CalendarDays className="h-5 w-5 text-white" />
                  Last login: {user.lastLogin}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="rounded-full border border-white/40 bg-white/20 px-5 text-white hover:bg-white/30 hover:text-white shadow-sm font-semibold backdrop-blur-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
                <button
                  type="button"
                  onClick={() => setShowBalance(prev => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30 hover:text-white shadow-sm backdrop-blur-sm"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showBalance ? 'Hide Balances' : 'Show Balances'}
                </button>
              </div>
            </div>

            <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {showBalance ? formattedTotalBalance : '••••'}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                  <TrendingUp className="h-4 w-4 text-[hsl(var(--commerce-green))]" />
                  Real-time snapshot
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
                <p className="text-sm text-gray-600">Active Accounts</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{accountCount}</p>
                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--commerce-green))]" />
                  Secured by Commerce Guard
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:col-span-2">
                <p className="text-sm text-gray-600">Transactions Tracked</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-2xl font-semibold text-gray-900">{totalTransactions}</span>
                  <span className="text-xs text-gray-500">Current period</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Navigation Hub */}
        <QuickAccess
          onOpenCardManager={() => setShowCardManager(true)}
          onOpenSupportHelp={() => setShowSupportHelp(true)}
          onOpenStatements={() => setShowStatements(true)}
        />


        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl border border-slate-200/70 bg-white/80 p-1 shadow-sm backdrop-blur">
            <TabsTrigger
              value="overview"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Account Overview
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Recent Transactions
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Loan Applications
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Business Applications
            </TabsTrigger>
          </TabsList>

          {/* Account Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[3fr,2fr]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-200/60 bg-white/85 p-5 shadow-[0_25px_60px_-40px_rgba(12,74,110,0.45)] backdrop-blur">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Your Accounts</h3>
                    <p className="text-sm text-slate-500">Showing {accounts.length} account{accounts.length === 1 ? '' : 's'}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsLoading(true);
                      fetchUserData();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Refresh data
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">Balances are updated in real time</span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
                    {accounts.length > 0 ? (
                      accounts.map((account) => <AccountCard key={account.id} account={account} />)
                    ) : (
                      <Card className="col-span-full border-dashed border-slate-200/70 bg-white/70 backdrop-blur">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                          <CreditCard className="mb-4 h-12 w-12 text-slate-300" />
                          <h3 className="text-lg font-semibold">No Accounts Found</h3>
                          <p className="text-sm">Contact support to set up your first account.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200/60 bg-white/85 p-6 shadow-[0_25px_50px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Account Health</h3>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Stay ahead of potential issues</p>
                    </div>
                    <Badge className={`rounded-full px-3 py-1 text-xs ${positiveAccountCount === accountCount ? 'bg-[hsl(var(--commerce-green))] text-white' : 'bg-amber-100 text-amber-600'}`}>
                      {positiveAccountCount === accountCount ? 'Stable' : 'Attention needed'}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-4">
                    {accounts.length === 0 ? (
                      <p className="text-sm text-slate-500">Add an account to start monitoring health insights.</p>
                    ) : (
                      accounts.map((account) => {
                        const hasOverdraft = account.balance < 0;
                        const hasLowBalance =
                          account.balance < 100 &&
                          !['credit', 'cash_back_card', 'travel_rewards_card', 'student_credit_card'].includes(account.account_type);

                        return (
                          <div
                            key={account.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-700">{account.account_number}</p>
                              <p className="text-xs text-slate-400 capitalize">{account.account_type.replace(/_/g, ' ')}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-semibold ${hasOverdraft ? 'text-rose-500' : hasLowBalance ? 'text-amber-500' : 'text-emerald-500'}`}>
                                ${Math.abs(account.balance).toLocaleString()}
                              </p>
                              <div className="mt-1 flex items-center justify-end gap-2 text-xs text-slate-400">
                                {hasOverdraft && <Badge variant="destructive">Overdraft</Badge>}
                                {!hasOverdraft && hasLowBalance && <Badge variant="outline">Low balance</Badge>}
                                {!hasOverdraft && !hasLowBalance && <span>Healthy</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/60 bg-white/85 p-6 shadow-[0_25px_50px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                  <h3 className="text-lg font-semibold text-slate-800">Insights</h3>
                  {topAccount ? (
                    <div className="mt-4 space-y-4">
                      <div className="rounded-2xl border border-white/50 bg-gradient-to-r from-[hsl(var(--commerce-teal)_/_0.12)] to-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strongest balance</p>
                        <p className="mt-2 text-lg font-semibold text-slate-800">{topAccount.account_number}</p>
                        <p className="text-sm text-slate-500">
                          {topAccount.account_type.replace(/_/g, ' ')} · ${Math.abs(topAccount.balance).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upcoming tip</p>
                        <p className="mt-2 text-sm text-slate-600">
                          Keep at least $500 across checking accounts to avoid monthly maintenance fees and unlock premium features.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">Insights will appear here once you add an account.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="debit">Debits</SelectItem>
                        <SelectItem value="credit">Credits</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={downloadPDF} disabled={transactions.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF ({transactions.length})
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCSV} disabled={transactions.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      CSV ({transactions.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading transactions...</span>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No transactions found.</p>
                    <p className="text-sm">Your transaction history will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.slice(0, 10).map((transaction) => (
                      <TransactionCard 
                        key={transaction.id} 
                        transaction={transaction} 
                        userAccountIds={accounts.map(acc => acc.id)}
                      />
                    ))}
                    {transactions.length > 10 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => navigate('/accounts')}>
                          View All Transactions
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Applications Tab */}
          <TabsContent value="loans" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Loan Applications</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowLoanSelectionDialog(true)}
                  >
                    Apply for Loan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading loan applications...</span>
                  </div>
                ) : loanApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No loan applications found.</p>
                    <p className="text-sm">Your loan applications will appear here once you submit them.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setShowLoanSelectionDialog(true)}
                    >
                      Apply for a Loan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loanApplications.map((application) => (
                      <div key={application.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{application.loan_type}</p>
                            <p className="text-sm text-gray-600">Amount: ${parseFloat(application.loan_amount).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Submitted: {new Date(application.submitted_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              application.status === 'approved' ? 'default' :
                              application.status === 'rejected' ? 'destructive' :
                              application.status === 'under_review' ? 'secondary' :
                              'outline'
                            }
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                          {application.reviewed_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Reviewed: {new Date(application.reviewed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Applications Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Business Applications</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowBusinessSelectionDialog(true)}
                  >
                    Apply for Business Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading business applications...</span>
                  </div>
                ) : businessApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No business applications found.</p>
                    <p className="text-sm">Your business applications will appear here once you submit them.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setShowBusinessSelectionDialog(true)}
                    >
                      Apply for Business Account
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {businessApplications.map((application) => (
                      <div key={application.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{application.business_name}</p>
                            <p className="text-sm text-gray-600">{application.account_type.replace('_', ' ').toUpperCase()}</p>
                            <p className="text-sm text-gray-500">Submitted: {new Date(application.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              application.status === 'approved' ? 'default' :
                              application.status === 'rejected' ? 'destructive' :
                              application.status === 'under_review' ? 'secondary' :
                              'outline'
                            }
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                          {application.reviewed_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Reviewed: {new Date(application.reviewed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <Sheet open={showCardManager} onOpenChange={setShowCardManager}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl p-0 border-0">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] p-6 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <SheetHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold text-white">Card Management</SheetTitle>
              </div>
              <SheetDescription className="text-base text-white/90">
              View and manage debit and credit cards linked to your accounts. Card data is masked for your security.
            </SheetDescription>
          </SheetHeader>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            {cardProfiles.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white shadow-lg">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Cards Available</h3>
                  <p className="text-sm text-slate-500">Apply for a card to see it listed here.</p>
                </CardContent>
              </Card>
            ) : (
              cardProfiles.map((profile, index) => (
                <Card
                  key={profile.id}
                  className={`relative overflow-hidden border-2 ${profile.borderClass} bg-white shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${profile.gradientClass} opacity-10`} />
                  <CardContent className="relative z-10 space-y-6 p-6">
                    {/* Card Visual */}
                    <div className={`relative overflow-hidden rounded-3xl border-2 border-white/50 bg-gradient-to-br ${profile.gradientClass} p-6 text-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-300`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/80 mb-6">
                          <span className="font-bold">{profile.network}</span>
                          <span className="font-bold">{profile.typeLabel}</span>
                      </div>
                        <div className="mt-6 text-2xl font-mono tracking-widest font-semibold">
                        {showCardDetails[profile.id] ? profile.cardNumberRaw : profile.cardNumberMasked}
                      </div>
                        <div className="mt-8 grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <p className="uppercase text-white/70 font-semibold mb-1">Card Holder</p>
                            <p className="mt-1 text-base font-bold text-white">{profile.cardHolder}</p>
                        </div>
                        <div>
                            <p className="uppercase text-white/70 font-semibold mb-1">Expires</p>
                            <p className="mt-1 text-base font-bold text-white">{profile.expiry}</p>
                        </div>
                        <div>
                            <p className="uppercase text-white/70 font-semibold mb-1">Opened</p>
                          <p className="mt-1 text-sm font-semibold text-white/90">{profile.openedLabel}</p>
                        </div>
                        <div className="text-right">
                            <p className="uppercase text-white/70 font-semibold mb-1">Security</p>
                            <p className="mt-1 text-base font-bold text-white">{showCardDetails[profile.id] ? profile.cvvRaw : profile.cvvMasked}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-md hover:shadow-lg transition-all hover:border-[hsl(var(--commerce-teal))]">
                        <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                          <Hash className="h-4 w-4 text-[hsl(var(--commerce-teal))]" />
                          Routing Number
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-800">{showCardDetails[profile.id] ? profile.routingRaw : profile.routingMasked}</p>
                      </div>
                      <div className="rounded-xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-md hover:shadow-lg transition-all hover:border-[hsl(var(--commerce-teal))]">
                        <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                          <CreditCard className="h-4 w-4 text-[hsl(var(--commerce-green))]" />
                          Linked Account
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-800">{profile.linkedAccount}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-md hover:shadow-lg transition-all hover:border-[hsl(var(--commerce-teal))]">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Status</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-flex h-2.5 w-2.5 rounded-full shadow-lg ${profile.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="text-base font-bold text-slate-800">{profile.status}</span>
                        </div>
                      </div>
                      <div className="rounded-xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-md hover:shadow-lg transition-all hover:border-[hsl(var(--commerce-teal))]">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Network</p>
                        <p className="mt-1 text-base font-bold text-slate-800">{profile.network}</p>
                      </div>
                    </div>

                    {profile.typeLabel === 'Credit Card' && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-md hover:shadow-lg transition-all hover:border-[hsl(var(--commerce-teal))]">
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Credit Limit</p>
                          <p className="mt-1 text-base font-bold text-slate-800">
                            {profile.creditLimit ? `$${profile.creditLimit.toLocaleString()}` : '—'}
                          </p>
                        </div>
                        <div className="rounded-xl border-2 border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-md hover:shadow-lg transition-all hover:border-[hsl(var(--commerce-teal))]">
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Available Credit</p>
                          <p className={`mt-1 text-base font-bold ${profile.available && profile.available > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {profile.available !== null ? `$${(profile.available || 0).toLocaleString()}` : '—'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Show Card Details Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                          <Shield className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">EMV & Tokenized Payments</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                          <Lock className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">Freeze/Replace via App</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowCardDetails(prev => ({
                          ...prev,
                          [profile.id]: !prev[profile.id]
                        }))}
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-2 border-slate-300 hover:border-[hsl(var(--commerce-teal))] hover:bg-[hsl(var(--commerce-teal))]/10"
                      >
                        {showCardDetails[profile.id] ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Show Card Details
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showStatements} onOpenChange={setShowStatements}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl p-0 border-0">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] p-6 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <SheetHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold text-white">Account Statements</SheetTitle>
              </div>
              <SheetDescription className="text-base text-white/90">
                View and download your account statements. Statements are generated monthly from your transaction history.
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                Monthly Statements
              </h3>
              <Button 
                onClick={downloadAllStatements} 
                disabled={statements.length === 0} 
                className="rounded-xl bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
                <span className="text-base font-semibold text-slate-600">Loading statements...</span>
              </div>
            ) : statements.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white shadow-lg">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Statements Available</h3>
                  <p className="text-sm text-slate-500">Your statement history will appear here once you have transactions.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {statements.map((statement) => (
                  <Card key={statement.id} className="border-2 border-slate-200/80 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:border-[hsl(var(--commerce-teal))] group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Receipt className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-bold text-lg text-slate-800">{statement.month} Statement</p>
                              <div className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200">
                                <p className="text-xs font-semibold text-emerald-700">{statement.transactions} transactions</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-1">
                              <CalendarDays className="h-3.5 w-3.5 inline mr-1" />
                              {statement.startDate} - {statement.endDate}
                            </p>
                            <div className="mt-3 flex items-baseline gap-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Balance</p>
                              <p className="text-xl font-bold text-slate-900">${statement.balance.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadStatementPDF(statement)}
                            className="rounded-lg border-2 border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 font-semibold transition-all shadow-sm hover:shadow-md"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadStatementCSV(statement)}
                            className="rounded-lg border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 hover:text-green-600 font-semibold transition-all shadow-sm hover:shadow-md"
                          >
                            <FileText className="h-4 w-4 mr-1" />
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

      <Sheet open={showExpenseTracker} onOpenChange={setShowExpenseTracker}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Expense Tracker</SheetTitle>
            <SheetDescription>
              Visualize your recent spending. Categories are grouped from your most recent transactions to help you budget better.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,3fr]">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_45px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Spending Overview</div>
              <div className="mt-1 text-3xl font-semibold text-slate-800">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">Last 30 days</p>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expenseCategories}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                      contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_45px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Breakdown</h3>
                <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-600">
                  {expenseCategories.length} categories
                </Badge>
              </div>
              <div className="space-y-4">
                {expenseCategories.map((category) => {
                  const percent = totalExpenses ? Math.round((category.amount / totalExpenses) * 100) : 0;
                  return (
                    <div
                      key={category.name}
                      className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/90 p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{category.name}</p>
                          <p className="text-xs text-slate-400">{percent}% of spending</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">${category.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">${(category.amount / 4).toFixed(0)}/week avg</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Support & Help Dialog */}
      <Dialog open={showSupportHelp} onOpenChange={setShowSupportHelp}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 border-0 shadow-2xl">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] p-6 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <DialogTitle className="text-3xl font-bold text-white">Support & Help</DialogTitle>
              </div>
              <DialogDescription className="text-base text-white/90">
                Get help, chat with support, and explore current offers
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs defaultValue="chat" className="mt-0">
            <TabsList className="grid w-full grid-cols-3 rounded-xl border border-slate-200/70 bg-white/80 p-1 shadow-sm backdrop-blur h-12">
              <TabsTrigger value="chat" className="rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg">Live Chat</TabsTrigger>
              <TabsTrigger value="help" className="rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg">Help Center</TabsTrigger>
              <TabsTrigger value="offers" className="rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--commerce-green))] data-[state=active]:to-[hsl(var(--commerce-teal))] data-[state=active]:text-white data-[state=active]:shadow-lg">Offers</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4 mt-6">
              <Card className="border-2 border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-100 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    Live Chat Support
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Chat with our support team for immediate assistance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl p-4 h-80 overflow-y-auto border-2 border-slate-200/50 shadow-inner">
                      <div className="space-y-4">
                        {chatMessages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${msg.sender === 'user' ? 'right' : 'left'} duration-300`}
                          >
                            <div className="relative max-w-xs">
                              <div className={`${msg.sender === 'user' 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm' 
                                : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border-2 border-slate-200'} px-4 py-3 shadow-lg`}>
                                <p className="text-sm font-medium">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{msg.timestamp}</p>
                              </div>
                              <div className={`absolute -bottom-1 ${msg.sender === 'user' ? 'right-0 bg-blue-600' : 'left-0 bg-white border-b-2 border-l-2 border-slate-200'} w-3 h-3 transform rotate-45`}></div>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-white text-slate-600 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200 flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              <span className="text-sm">Typing...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                        className="h-12 rounded-xl border-2 border-slate-300 focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20"
                      />
                      <Button 
                        onClick={handleChatSubmit} 
                        disabled={!chatMessage.trim()}
                        className="h-12 px-6 rounded-xl bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] hover:opacity-90 shadow-lg disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help Center Tab */}
            <TabsContent value="help" className="space-y-4 mt-6">
              <Card className="border-2 border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Find answers to common questions about our banking services
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        placeholder="Search FAQs..."
                        value={supportSearchQuery}
                        onChange={(e) => setSupportSearchQuery(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-2 border-slate-300 focus:border-[hsl(var(--commerce-teal))] focus:ring-2 focus:ring-[hsl(var(--commerce-teal))]/20 text-base"
                      />
                    </div>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {faqs.filter(faq => 
                        faq.question.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                        faq.category.toLowerCase().includes(supportSearchQuery.toLowerCase())
                      ).map((faq) => (
                        <div 
                          key={faq.id} 
                          className="group border-2 border-slate-200 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50/50 hover:border-[hsl(var(--commerce-teal))] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors">
                                  <HelpCircle className="h-4 w-4 text-emerald-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 text-lg group-hover:text-[hsl(var(--commerce-teal))] transition-colors">{faq.question}</h3>
                              </div>
                              <p className="text-sm text-slate-600 mt-2 ml-11 leading-relaxed">{faq.answer}</p>
                            </div>
                            <UIBadge 
                              variant="outline" 
                              className="ml-4 px-3 py-1 rounded-full border-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 font-semibold whitespace-nowrap"
                            >
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
            <TabsContent value="offers" className="space-y-4 mt-6">
              <Card className="border-2 border-slate-200/70 bg-white/90 shadow-xl backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-100 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-md">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    Current Offers & Rewards
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    Take advantage of our current promotions and rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {offers.map((offer, index) => (
                      <div 
                        key={offer.id} 
                        className="group relative overflow-hidden border-2 border-slate-200 rounded-xl p-6 bg-gradient-to-br from-white to-amber-50/30 hover:border-[hsl(var(--commerce-teal))] hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:from-amber-200/50 group-hover:to-orange-200/50 transition-colors"></div>
                        <div className="relative flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                <Gift className="h-5 w-5 text-white" />
                              </div>
                              <h3 className="font-bold text-slate-900 text-lg group-hover:text-[hsl(var(--commerce-teal))] transition-colors">{offer.title}</h3>
                              <UIBadge 
                                variant={offer.status === 'active' ? 'default' : 'secondary'}
                                className={`rounded-full px-3 py-1 font-semibold ${
                                  offer.status === 'active' 
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md' 
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {offer.status}
                              </UIBadge>
                            </div>
                            <p className="text-sm text-slate-700 ml-11 leading-relaxed font-medium">{offer.description}</p>
                            <div className="flex items-center gap-2 ml-11 text-xs text-slate-500">
                              <CalendarDays className="h-4 w-4" />
                              <span className="font-medium">Valid until: {offer.validUntil}</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => setSelectedOffer(offer)}
                            className="rounded-xl border-2 border-[hsl(var(--commerce-teal))] bg-white hover:bg-gradient-to-r hover:from-[hsl(var(--commerce-green))] hover:to-[hsl(var(--commerce-teal))] hover:text-white hover:border-transparent shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                          >
                            <Star className="h-4 w-4 mr-2" />
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 border-0 shadow-2xl">
            {/* Enhanced Header */}
            <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-6 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <DialogHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                    <Gift className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold text-white">{selectedOffer.title}</DialogTitle>
                    <DialogDescription className="text-base text-white/90 mt-1">
                      {selectedOffer.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-gradient-to-br from-slate-50 via-white to-slate-50">
              <div className="space-y-6">
                {/* Offer Details Card */}
                <Card className="border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 border-b-2 border-amber-200 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5 text-amber-600" />
                      Offer Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Gift className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700 font-medium leading-relaxed">{selectedOffer.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-amber-200/50">
                        <CalendarDays className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valid Until</p>
                          <p className="text-sm font-bold text-slate-700">{selectedOffer.validUntil}</p>
                        </div>
                        <div className="ml-auto">
                          <UIBadge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                            {selectedOffer.status}
                          </UIBadge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Offer-Specific Details */}
                {selectedOffer.id === 1 && (
                  <Card className="border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-100/50 to-cyan-100/50 border-b-2 border-blue-200 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        New Account Bonus Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">Open Checking Account</p>
                              <p className="text-xs text-slate-600 mt-1">Open a new Commerce Bank checking account</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">Initial Deposit</p>
                              <p className="text-xs text-slate-600 mt-1">Make an initial deposit of $500 or more</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                              <CalendarDays className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">Direct Deposit</p>
                              <p className="text-xs text-slate-600 mt-1">Set up direct deposit within 60 days</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                              <Gift className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">Get Your Bonus</p>
                              <p className="text-xs text-slate-600 mt-1">Receive $200 bonus within 30 days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedOffer.id === 2 && (
                  <Card className="border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-green-50/50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-emerald-100/50 to-green-100/50 border-b-2 border-emerald-200 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        High-Yield Savings Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                              <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">4.5% APY</p>
                              <p className="text-xs text-slate-600 mt-1">Earn competitive Annual Percentage Yield</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">No Minimum</p>
                              <p className="text-xs text-slate-600 mt-1">No minimum balance requirement</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                              <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">No Fees</p>
                              <p className="text-xs text-slate-600 mt-1">No monthly maintenance fees</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                              <RefreshCw className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">Unlimited Transfers</p>
                              <p className="text-xs text-slate-600 mt-1">Unlimited online transfers</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-sm md:col-span-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                              <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">FDIC Insured</p>
                              <p className="text-xs text-slate-600 mt-1">FDIC insured up to $250,000</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedOffer.id === 3 && (
                  <Card className="border-2 border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 border-b-2 border-purple-200 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Star className="h-5 w-5 text-purple-600" />
                        Credit Card Rewards Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                              <Star className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">2% Cashback</p>
                              <p className="text-xs text-slate-600 mt-1">Earn 2% cashback on all purchases</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">No Annual Fee</p>
                              <p className="text-xs text-slate-600 mt-1">Zero annual fees ever</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                              <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">No Foreign Fees</p>
                              <p className="text-xs text-slate-600 mt-1">No foreign transaction fees</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                              <Gift className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">Flexible Redemption</p>
                              <p className="text-xs text-slate-600 mt-1">Redeem as credit or deposit</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm md:col-span-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                              <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">24/7 Protection</p>
                              <p className="text-xs text-slate-600 mt-1">24/7 fraud protection and monitoring</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t-2 border-slate-200">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedOffer(null);
                      setShowOfferForm(false);
                      setOfferSubmitted(false);
                    }}
                    className="h-12 px-6 rounded-xl border-2 hover:bg-slate-50 font-semibold"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={handleApplyNow}
                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Offer Application Form Dialog */}
      <Dialog open={showOfferForm && !!selectedOffer} onOpenChange={setShowOfferForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="relative bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] p-6 text-white">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <Gift className="h-7 w-7 text-white" />
                </div>
                <DialogTitle className="text-3xl font-bold text-white">
                  Apply for {selectedOffer?.title}
                </DialogTitle>
              </div>
              <DialogDescription className="text-base text-white/90">
                Please fill out the form below to apply for this offer. All fields marked with <span className="text-white font-semibold">*</span> are required.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 bg-gray-50">

          <form onSubmit={handleOfferFormSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[hsl(var(--commerce-green))]">
                <User className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              </div>
              <Card className="border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={offerFormData.firstName}
                        onChange={(e) => handleOfferFormChange("firstName", e.target.value)}
                        className={`h-11 transition-all ${offerFormErrors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                        placeholder="Enter your first name"
                      />
                      {offerFormErrors.firstName && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={offerFormData.lastName}
                        onChange={(e) => handleOfferFormChange("lastName", e.target.value)}
                        className={`h-11 transition-all ${offerFormErrors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                        placeholder="Enter your last name"
                      />
                      {offerFormErrors.lastName && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.lastName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={offerFormData.email}
                        onChange={(e) => handleOfferFormChange("email", e.target.value)}
                        className={`h-11 transition-all ${offerFormErrors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                        placeholder="your.email@example.com"
                      />
                      {offerFormErrors.email && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={offerFormData.phone}
                        onChange={(e) => handleOfferFormChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className={`h-11 transition-all ${offerFormErrors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                      />
                      {offerFormErrors.phone && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={offerFormData.dateOfBirth}
                        onChange={(e) => handleOfferFormChange("dateOfBirth", e.target.value)}
                        className={`h-11 transition-all ${offerFormErrors.dateOfBirth ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                      />
                      {offerFormErrors.dateOfBirth && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.dateOfBirth}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ssn" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Social Security Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="ssn"
                        type="text"
                        value={offerFormData.ssn}
                        onChange={(e) => handleOfferFormChange("ssn", e.target.value)}
                        placeholder="XXX-XX-XXXX"
                        maxLength={11}
                        className={`h-11 transition-all ${offerFormErrors.ssn ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                      />
                      {offerFormErrors.ssn && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.ssn}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[hsl(var(--commerce-teal))]">
                <MapPin className="h-5 w-5 text-[hsl(var(--commerce-teal))]" />
                <h3 className="text-xl font-bold text-gray-800">Address Information</h3>
              </div>
              <Card className="border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="streetAddress" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Street Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="streetAddress"
                        value={offerFormData.streetAddress}
                        onChange={(e) => handleOfferFormChange("streetAddress", e.target.value)}
                        className={`h-11 transition-all ${offerFormErrors.streetAddress ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                        placeholder="123 Main Street"
                      />
                      {offerFormErrors.streetAddress && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.streetAddress}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          value={offerFormData.city}
                          onChange={(e) => handleOfferFormChange("city", e.target.value)}
                          className={`h-11 transition-all ${offerFormErrors.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                          placeholder="New York"
                        />
                        {offerFormErrors.city && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {offerFormErrors.city}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="state"
                          value={offerFormData.state}
                          onChange={(e) => handleOfferFormChange("state", e.target.value)}
                          maxLength={2}
                          placeholder="NY"
                          className={`h-11 transition-all ${offerFormErrors.state ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                        />
                        {offerFormErrors.state && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {offerFormErrors.state}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                          ZIP Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="zipCode"
                          value={offerFormData.zipCode}
                          onChange={(e) => handleOfferFormChange("zipCode", e.target.value)}
                          maxLength={5}
                          className={`h-11 transition-all ${offerFormErrors.zipCode ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                          placeholder="10001"
                        />
                        {offerFormErrors.zipCode && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {offerFormErrors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Employment Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[hsl(var(--commerce-blue))]">
                <Building2 className="h-5 w-5 text-[hsl(var(--commerce-blue))]" />
                <h3 className="text-xl font-bold text-gray-800">Employment Information</h3>
              </div>
              <Card className="border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="employmentStatus" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Employment Status <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={offerFormData.employmentStatus}
                        onValueChange={(value) => handleOfferFormChange("employmentStatus", value)}
                      >
                        <SelectTrigger className={`h-11 transition-all ${offerFormErrors.employmentStatus ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}>
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                      {offerFormErrors.employmentStatus && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.employmentStatus}
                        </p>
                      )}
                    </div>
                    {offerFormData.employmentStatus === "employed" && (
                      <div className="space-y-2 animate-in slide-in-from-left duration-300">
                        <Label htmlFor="employerName" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                          Employer Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="employerName"
                          value={offerFormData.employerName}
                          onChange={(e) => handleOfferFormChange("employerName", e.target.value)}
                          className={`h-11 transition-all ${offerFormErrors.employerName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                          placeholder="Company name"
                        />
                        {offerFormErrors.employerName && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {offerFormErrors.employerName}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="annualIncome" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Annual Income <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                        <Input
                          id="annualIncome"
                          type="number"
                          value={offerFormData.annualIncome}
                          onChange={(e) => handleOfferFormChange("annualIncome", e.target.value)}
                          placeholder="50000"
                          className={`h-11 pl-8 transition-all ${offerFormErrors.annualIncome ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                        />
                      </div>
                      {offerFormErrors.annualIncome && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.annualIncome}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Details Section */}
            {(selectedOffer?.id === 1 || selectedOffer?.id === 2) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-[hsl(var(--commerce-orange))]">
                  <DollarSign className="h-5 w-5 text-[hsl(var(--commerce-orange))]" />
                  <h3 className="text-xl font-bold text-gray-800">Account Details</h3>
                </div>
                <Card className="border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="initialDeposit" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Initial Deposit Amount <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                        <Input
                          id="initialDeposit"
                          type="number"
                          value={offerFormData.initialDeposit}
                          onChange={(e) => handleOfferFormChange("initialDeposit", e.target.value)}
                          placeholder={selectedOffer?.id === 1 ? "Minimum $500" : "Minimum $100"}
                          className={`h-11 pl-8 transition-all ${offerFormErrors.initialDeposit ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[hsl(var(--commerce-green))] focus:ring-[hsl(var(--commerce-green))]"}`}
                        />
                      </div>
                      {offerFormErrors.initialDeposit && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {offerFormErrors.initialDeposit}
                        </p>
                      )}
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {selectedOffer?.id === 1 
                            ? "Minimum deposit of $500 required for new account bonus eligibility"
                            : "No minimum required for high-yield savings account"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Terms and Conditions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-300">
                <Shield className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-800">Terms & Conditions</h3>
              </div>
              <Card className="border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6 space-y-4">
                  <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${offerFormErrors.agreeToTerms ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}>
                    <Checkbox
                      id="agreeToTerms"
                      checked={offerFormData.agreeToTerms}
                      onCheckedChange={(checked) => handleOfferFormChange("agreeToTerms", checked as boolean)}
                      className={`mt-1 ${offerFormErrors.agreeToTerms ? "border-red-500" : ""}`}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer flex-1 leading-relaxed">
                      I agree to the <a href="/terms-of-service" target="_blank" className="text-[hsl(var(--commerce-green))] hover:underline font-semibold">Terms of Service</a> and <a href="/privacy-policy" target="_blank" className="text-[hsl(var(--commerce-green))] hover:underline font-semibold">Privacy Policy</a> <span className="text-red-500 font-semibold">*</span>
                    </Label>
                  </div>
                  {offerFormErrors.agreeToTerms && (
                    <p className="text-sm text-red-500 ml-7 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {offerFormErrors.agreeToTerms}
                    </p>
                  )}
                  
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 bg-white">
                    <Checkbox
                      id="agreeToMarketing"
                      checked={offerFormData.agreeToMarketing}
                      onCheckedChange={(checked) => handleOfferFormChange("agreeToMarketing", checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="agreeToMarketing" className="text-sm cursor-pointer flex-1 leading-relaxed">
                      I would like to receive marketing communications and promotional offers <span className="text-gray-500">(optional)</span>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowOfferForm(false);
                  setOfferFormErrors({});
                }}
                disabled={isSubmittingOffer}
                className="h-11 px-6 font-semibold border-2 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingOffer}
                className="h-11 px-8 font-semibold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] hover:from-[hsl(var(--commerce-green))]/90 hover:to-[hsl(var(--commerce-teal))]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmittingOffer ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loan Selection Dialog */}
      <Dialog open={showLoanSelectionDialog} onOpenChange={setShowLoanSelectionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Loan Type</DialogTitle>
            <DialogDescription>
              Choose the type of loan you would like to apply for
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[hsl(var(--commerce-green))]"
              onClick={() => {
                setSelectedLoanType("Personal Loan");
                setShowLoanSelectionDialog(false);
                setShowLoanForm(true);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Personal Loan</CardTitle>
                <CardDescription>
                  Flexible loans for personal expenses
                </CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[hsl(var(--commerce-green))]"
              onClick={() => {
                setSelectedLoanType("Auto Loan");
                setShowLoanSelectionDialog(false);
                setShowLoanForm(true);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Auto Loan</CardTitle>
                <CardDescription>
                  Finance your vehicle purchase
                </CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[hsl(var(--commerce-green))]"
              onClick={() => {
                setSelectedLoanType("Home Equity Loan");
                setShowLoanSelectionDialog(false);
                setShowLoanForm(true);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Home Equity Loan</CardTitle>
                <CardDescription>
                  Borrow against your home equity
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loan Application Form */}
      <LoanApplicationForm
        isOpen={showLoanForm}
        onClose={() => {
          setShowLoanForm(false);
          setSelectedLoanType("");
        }}
        loanType={selectedLoanType}
        onSuccess={() => {
          // Refresh loan applications after successful submission
          if (token) {
            fetch('http://localhost:3001/loan-applications', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
              .then(response => response.json())
              .then(data => {
                setLoanApplications(data.applications || []);
                // Add notification for loan application
                addNotification({
                  type: 'loan_application',
                  title: 'Loan Application Submitted',
                  message: 'Your loan application has been successfully submitted and is under review.',
                  priority: 'high'
                });
                toast({
                  title: "Application submitted",
                  description: "Your loan application has been submitted and will appear in your account.",
                });
              })
              .catch(error => {
                console.error('Error refreshing loan applications:', error);
              });
          }
        }}
      />

      {/* Business Account Selection Dialog */}
      <Dialog open={showBusinessSelectionDialog} onOpenChange={setShowBusinessSelectionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Business Account Type</DialogTitle>
            <DialogDescription>
              Choose the type of business account you would like to apply for
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[hsl(var(--commerce-green))]"
              onClick={() => {
                setSelectedBusinessAccountType("business_checking");
                setShowBusinessSelectionDialog(false);
                setShowBusinessForm(true);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Business Checking</CardTitle>
                <CardDescription>
                  Unlimited transactions for your business
                </CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[hsl(var(--commerce-green))]"
              onClick={() => {
                setSelectedBusinessAccountType("business_savings");
                setShowBusinessSelectionDialog(false);
                setShowBusinessForm(true);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Business Savings</CardTitle>
                <CardDescription>
                  Higher interest rates for business savings
                </CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[hsl(var(--commerce-green))]"
              onClick={() => {
                setSelectedBusinessAccountType("merchant_services");
                setShowBusinessSelectionDialog(false);
                setShowBusinessForm(true);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Merchant Services</CardTitle>
                <CardDescription>
                  Credit card processing solutions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Business Application Form */}
      <BusinessApplicationForm
        isOpen={showBusinessForm}
        onClose={() => {
          setShowBusinessForm(false);
          setSelectedBusinessAccountType("business_checking");
        }}
        accountType={selectedBusinessAccountType}
        onSuccess={() => {
          // Refresh business applications after successful submission
          if (token) {
            fetch('http://localhost:3001/business-applications', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
              .then(response => response.json())
              .then(data => {
                setBusinessApplications(data.applications || []);
                // Add notification for business application
                addNotification({
                  type: 'business_application',
                  title: 'Business Application Submitted',
                  message: 'Your business account application has been successfully submitted and is under review.',
                  priority: 'high'
                });
                toast({
                  title: "Application submitted",
                  description: "Your business application has been submitted and will appear in your account.",
                });
              })
              .catch(error => {
                console.error('Error refreshing business applications:', error);
              });
          }
        }}
      />
    </div>
  );
};

export default Dashboard;