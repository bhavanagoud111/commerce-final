import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge as UIBadge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import QuickAccess from "@/components/QuickAccess";
import { toast } from "@/components/ui/use-toast";
// import { useAccounts, useTransactions } from "@/hooks/useBankingAPI";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Filter,
  Eye,
  EyeOff,
  Calendar,
  CreditCard,
  PiggyBank,
  Receipt,
  FileText,
  ArrowUpDown,
  Plus,
  Settings,
  Loader2,
  Home,
  Hash,
  Lock,
  Shield,
  MessageCircle,
  HelpCircle,
  Gift,
  Star,
  Search,
  Send,
  MapPin,
  User,
  Building2,
  AlertTriangle,
  CheckCircle,
  Headphones,
  CalendarDays
} from "lucide-react";

const Accounts = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(1);
  
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

  const [accounts] = useState([
    { 
      id: 1, 
      name: "Checking Account", 
      number: "****1234", 
      balance: 8547.89, 
      available: 8547.89,
      type: "checking",
      interestRate: 0.01,
      lastActivity: "2024-01-15"
    },
    { 
      id: 2, 
      name: "Savings Account", 
      number: "****5678", 
      balance: 4000.00, 
      available: 4000.00,
      type: "savings",
      interestRate: 2.5,
      lastActivity: "2024-01-14"
    },
    { 
      id: 3, 
      name: "Credit Card", 
      number: "****9012", 
      balance: -1250.00, 
      available: 8750.00,
      type: "credit",
      interestRate: 18.99,
      lastActivity: "2024-01-13"
    }
  ]);

  const [transactions] = useState([
    { id: 1, description: "Grocery Store Purchase", amount: -85.50, date: "2024-01-15", type: "debit", category: "Food", balance: 8547.89 },
    { id: 2, description: "Salary Deposit", amount: 3500.00, date: "2024-01-14", type: "credit", category: "Income", balance: 8633.39 },
    { id: 3, description: "ATM Withdrawal", amount: -100.00, date: "2024-01-13", type: "debit", category: "Cash", balance: 5133.39 },
    { id: 4, description: "Online Transfer", amount: -250.00, date: "2024-01-12", type: "debit", category: "Transfer", balance: 5233.39 },
    { id: 5, description: "Interest Payment", amount: 8.50, date: "2024-01-11", type: "credit", category: "Interest", balance: 5483.39 },
    { id: 6, description: "Bill Payment - Electric", amount: -125.75, date: "2024-01-10", type: "debit", category: "Utilities", balance: 5474.89 },
    { id: 7, description: "Direct Deposit", amount: 2500.00, date: "2024-01-09", type: "credit", category: "Income", balance: 5600.64 },
    { id: 8, description: "Coffee Shop", amount: -4.75, date: "2024-01-08", type: "debit", category: "Food", balance: 3100.64 }
  ]);


  const currentAccount = accounts.find(acc => acc.id === selectedAccount);

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

  // Generate statements from transactions
  const generateStatements = (transactions: any[]) => {
    if (transactions.length === 0) return [];
    const groupedTransactions = transactions.reduce((groups: any, transaction) => {
      const date = new Date(transaction.date || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(transaction);
      return groups;
    }, {});

    const statements = Object.keys(groupedTransactions).map(monthKey => {
      const monthTransactions = groupedTransactions[monthKey];
      const firstDate = new Date(Math.min(...monthTransactions.map((t: any) => new Date(t.date || Date.now()).getTime())));
      const lastDate = new Date(Math.max(...monthTransactions.map((t: any) => new Date(t.date || Date.now()).getTime())));
      const totalAmount = monthTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0);
      
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

    return statements.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
  };

  // Card Profiles
  const cardProfiles = accounts
    .filter((account) => ['checking', 'credit'].includes(account.type))
    .map((account, index) => {
      const isCredit = account.type === 'credit';
      const rawAccountDigits = (account.number || '').replace(/\D/g, '') || `${index + 1}`.repeat(4);
      const fallbackCardNumber = (rawAccountDigits + '1234567890123456').slice(-16);
      const cardNumberMasked = fallbackCardNumber.replace(/\d(?=\d{4})/g, '•').replace(/(.{4})/g, '$1 ').trim();
      const routingMasked = `0210000${(index * 7 + 3) % 90}`.replace(/\d(?=\d{3})/g, '•');
      const openedDate = new Date();
      const expiryDate = `${String((openedDate.getMonth() + 1) % 12 + 1).padStart(2, '0')}/${String(openedDate.getFullYear() + 4).slice(-2)}`;
      const network = isCredit ? ['Visa Signature', 'World Mastercard'][index % 2] : ['Visa Debit', 'Mastercard Debit'][index % 2];
      const creditLimit = isCredit ? account.available + Math.abs(account.balance) : null;
      const available = isCredit ? account.available : null;
      const monthYearFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

      return {
        id: `card-${account.id}`,
        title: account.name,
        typeLabel: isCredit ? 'Credit Card' : 'Debit Card',
        cardNumberMasked,
        routingMasked,
        network,
        creditLimit,
        available,
        cardHolder: authUser?.name || 'Commerce Bank Client',
        expiry: expiryDate,
        openedLabel: monthYearFormatter.format(openedDate),
        linkedAccount: account.number,
        cvvMasked: '•••',
        status: 'Active',
        gradientClass: isCredit
          ? 'from-purple-500 via-indigo-500 to-slate-900'
          : 'from-emerald-400 via-teal-500 to-sky-500',
        borderClass: isCredit ? 'border-indigo-200/70' : 'border-emerald-200/70'
      };
    });

  // Generate statements when transactions change
  useEffect(() => {
    const generatedStatements = generateStatements(transactions);
    setStatements(generatedStatements);
  }, [transactions]);

  // Statement download functions
  const downloadStatementPDF = (statement: any) => {
    toast({
      title: "Statement PDF",
      description: `Downloading ${statement.month} statement...`,
    });
  };

  const downloadStatementCSV = (statement: any) => {
    toast({
      title: "Statement CSV",
      description: `Downloading ${statement.month} statement...`,
    });
  };

  const downloadAllStatements = () => {
    if (statements.length === 0) {
      toast({
        variant: "destructive",
        title: "No statements available",
        description: "Generate account activity to access downloadable statements.",
      });
      return;
    }
    toast({
      title: "Downloading statements",
      description: `Preparing ${statements.length} statements for download...`,
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="h-6 w-6" />;
      case 'savings':
        return <PiggyBank className="h-6 w-6" />;
      case 'credit':
        return <CreditCard className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'text-blue-600';
      case 'savings':
        return 'text-green-600';
      case 'credit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <QuickAccess 
          className="mb-6"
          onOpenCardManager={() => setShowCardManager(true)}
          onOpenSupportHelp={() => setShowSupportHelp(true)}
          onOpenStatements={() => setShowStatements(true)}
        />
        {/* Account Selection */}
        <div className="mb-6">
          <Label htmlFor="accountSelect">Select Account</Label>
          <Select value={selectedAccount.toString()} onValueChange={(value) => setSelectedAccount(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.name} ({account.number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Account Overview */}
        {currentAccount && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getAccountColor(currentAccount.type).replace('text-', 'bg-').replace('-600', '-100')}`}>
                      {getAccountIcon(currentAccount.type)}
                    </div>
                    <div>
                      <CardTitle>{currentAccount.name}</CardTitle>
                      <CardDescription>{currentAccount.number}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={currentAccount.type === 'credit' ? 'destructive' : 'secondary'}>
                    {currentAccount.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Balance</p>
                    {showBalance ? (
                      <p className={`text-2xl font-bold ${currentAccount.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${Math.abs(currentAccount.balance).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-2xl font-bold text-gray-400">••••••</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available Balance</p>
                    {showBalance ? (
                      <p className="text-2xl font-bold text-blue-600">
                        ${currentAccount.available.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-2xl font-bold text-gray-400">••••••</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="text-lg font-semibold">{currentAccount.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Activity</p>
                    <p className="text-lg font-semibold">{currentAccount.lastActivity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Transfer Money
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Open New Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transaction Details */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="details">Account Details</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Transaction History</CardTitle>
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
                        <SelectItem value="transfer">Transfers</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                            <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Balance: ${transaction.balance.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statements Tab */}
          <TabsContent value="statements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Account Statements</CardTitle>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statements.map((statement) => (
                    <div key={statement.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{statement.month}</p>
                          <p className="text-sm text-gray-600">
                            {statement.startDate} - {statement.endDate}
                          </p>
                          <p className="text-sm text-gray-500">
                            {statement.transactions} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${statement.balance.toFixed(2)}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Account Number</Label>
                      <p className="font-mono text-lg">{currentAccount?.number}</p>
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <p className="text-lg capitalize">{currentAccount?.type}</p>
                    </div>
                    <div>
                      <Label>Interest Rate</Label>
                      <p className="text-lg">{currentAccount?.interestRate}% APY</p>
                    </div>
                    <div>
                      <Label>Opening Date</Label>
                      <p className="text-lg">January 15, 2020</p>
                    </div>
                    <div>
                      <Label>Last Activity</Label>
                      <p className="text-lg">{currentAccount?.lastActivity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Overdraft Protection</p>
                        <p className="text-sm text-gray-600">Protect against overdrafts</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Account Alerts</p>
                        <p className="text-sm text-gray-600">Get notified of account activity</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Paper Statements</p>
                        <p className="text-sm text-gray-600">Receive statements by mail</p>
                      </div>
                      <Button variant="outline" size="sm">Disable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Account Nickname</p>
                        <p className="text-sm text-gray-600">Personalize your account</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Card Management Sheet */}
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
                          {profile.cardNumberMasked}
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
                            <p className="mt-1 text-base font-bold text-white">{profile.cvvMasked}</p>
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
                        <p className="mt-1 text-base font-bold text-slate-800">{profile.routingMasked}</p>
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

                    {/* Security Features */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-slate-200">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">EMV & Tokenized Payments</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                        <Lock className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">Freeze/Replace via App</span>
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
            {statements.length === 0 ? (
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
                        <div className="flex justify-end animate-in slide-in-from-right duration-300">
                          <div className="relative max-w-xs">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
                              <p className="text-sm font-medium">Hello! I need help with my account.</p>
                            </div>
                            <div className="absolute -bottom-1 right-0 w-3 h-3 bg-blue-600 transform rotate-45"></div>
                          </div>
                        </div>
                        <div className="flex justify-start animate-in slide-in-from-left duration-300">
                          <div className="relative max-w-xs">
                            <div className="bg-white text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border-2 border-slate-200">
                              <p className="text-sm">Hi! I'd be happy to help you. What can I assist you with today?</p>
                            </div>
                            <div className="absolute -bottom-1 left-0 w-3 h-3 bg-white border-b-2 border-l-2 border-slate-200 transform rotate-45"></div>
                          </div>
                        </div>
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
    </div>
  );
};

export default Accounts;
