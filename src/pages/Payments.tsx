import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import QuickAccess from "@/components/QuickAccess";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import Header from "@/components/Header";
import TransferModal from "@/components/TransferModal";
import SendMoneyModal from "@/components/SendMoneyModal";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Home,
  Shield,
  CalendarDays,
  UploadCloud,
  Image as ImageIcon,
  Info,
  Receipt,
  Smartphone,
  Building2,
  AlertTriangle,
  PenLine,
  CreditCard,
  Hash,
  Lock,
  FileText,
  Download,
  MessageCircle,
  HelpCircle,
  Gift,
  Star,
  Search,
  Send,
  MapPin,
  RefreshCw,
  User,
  DollarSign,
  Headphones
} from "lucide-react";

type Account = {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  created_at: string;
};

type DepositStatus = "processing" | "pending" | "completed" | "failed";

type DepositHistoryItem = {
  id: string;
  accountId: string;
  amount: number;
  status: DepositStatus;
  submittedAt: string;
  availabilityDate: string;
  memo?: string;
  reference: string;
  type: "mobile" | "branch" | "atm";
  attachments?: {
    front?: string;
    back?: string;
  };
  notifications?: {
    email: boolean;
    sms: boolean;
  };
  checkNumber?: string;
  failureReason?: string;
};

type DepositFormState = {
  fromAccount: string;
  amount: string;
  checkNumber: string;
  memo: string;
  depositType: "mobile" | "branch" | "atm";
  depositDate: string;
  emailReceipt: boolean;
  smsAlerts: boolean;
};

const Payments = () => {
  console.log('🚀 Payments component loading...');
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: "Jane Doe", account: "****5678", bank: "Commerce Bank", type: "internal", email: "jane@example.com" },
    { id: 2, name: "ABC Company", account: "****1234", bank: "Other Bank", type: "external", email: "billing@abc.com" },
    { id: 3, name: "John's Savings", account: "****9012", bank: "Commerce Bank", type: "internal", email: "john@example.com" }
  ]);
  const [scheduledTransfers, setScheduledTransfers] = useState<any[]>([]);
  const [scheduledBills, setScheduledBills] = useState<any[]>([]);
  const [isLoadingScheduled, setIsLoadingScheduled] = useState(false);
  const [showAddTransferModal, setShowAddTransferModal] = useState(false);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<any>(null);
  const [editingBill, setEditingBill] = useState<any>(null);
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);
  const [transferErrors, setTransferErrors] = useState<string[]>([]);
  const [billErrors, setBillErrors] = useState<string[]>([]);
  
  // Form state for scheduled transfer
  const [transferForm, setTransferForm] = useState({
    fromAccountId: '',
    toAccountId: '',
    toDescription: '',
    amount: '',
    frequency: 'Monthly',
    nextDate: '',
    description: ''
  });
  
  // Form state for scheduled bill
  const [billForm, setBillForm] = useState({
    fromAccountId: '',
    billName: '',
    billType: 'electric',
    amount: '',
    frequency: 'Monthly',
    nextDate: '',
    description: '',
    payeeName: '',
    payeeAccount: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositForm, setDepositForm] = useState<DepositFormState>({
    fromAccount: "",
    amount: "",
    checkNumber: "",
    memo: "",
    depositType: "mobile",
    depositDate: new Date().toISOString().slice(0, 10),
    emailReceipt: true,
    smsAlerts: false
  });
  const [checkImages, setCheckImages] = useState<{ front: File | null; back: File | null }>({ front: null, back: null });
  const [checkPreviews, setCheckPreviews] = useState<{ front: string; back: string }>({ front: "", back: "" });
  const [depositErrors, setDepositErrors] = useState<string[]>([]);
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);
  const [depositHistory, setDepositHistory] = useState<DepositHistoryItem[]>([]);
  
  // Quick Bill Payment state
  const [quickBillForm, setQuickBillForm] = useState({
    billType: '',
    amount: '',
    fromAccountId: '',
    memo: ''
  });
  const [isPayingBill, setIsPayingBill] = useState(false);
  const [quickBillErrors, setQuickBillErrors] = useState<string[]>([]);
  
  // Quick Access state
  const { user: authUser } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [showCardManager, setShowCardManager] = useState(false);
  const [showSupportHelp, setShowSupportHelp] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [statements, setStatements] = useState<any[]>([]);
  const [supportSearchQuery, setSupportSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
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

  useEffect(() => {
    console.log('🔧 useEffect triggered');
    fetchAccounts();
    fetchScheduledPayments();
    // Process any due scheduled payments on component mount
    processScheduledPayments();
  }, []);

  // Process scheduled transfers and bills that are due
  const processScheduledPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping scheduled payment processing');
        return;
      }

      console.log('Processing scheduled payments...');

      // Process scheduled transfers
      const transfersResponse = await fetch('http://localhost:3001/process-scheduled-transfers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (transfersResponse.ok) {
        const transfersData = await transfersResponse.json();
        console.log('Scheduled transfers processing result:', transfersData);
        if (transfersData.results && transfersData.results.length > 0) {
          transfersData.results.forEach((result: any) => {
            console.log('Processing transfer result:', result);
            if (result.success) {
              addNotification({
                type: 'transfer_success',
                title: 'Scheduled Transfer Completed',
                message: `Your scheduled transfer of $${result.amount?.toFixed(2) || 'N/A'} has been processed successfully. Next transfer scheduled for ${result.nextDate || 'N/A'}.`,
                priority: 'high'
              });
              console.log('Added success notification for transfer');
            } else {
              addNotification({
                type: 'transfer_failed',
                title: 'Scheduled Transfer Failed',
                message: `Your scheduled transfer could not be processed: ${result.message || 'Unknown error'}.`,
                priority: 'high'
              });
              console.log('Added failure notification for transfer');
            }
          });
          // Refresh scheduled payments after processing
          fetchScheduledPayments();
          // Refresh accounts to show updated balances
          fetchAccounts();
        } else {
          console.log('No scheduled transfers to process');
        }
      } else {
        const errorText = await transfersResponse.text();
        console.error('Failed to process scheduled transfers:', transfersResponse.status, errorText);
      }

      // Process scheduled bills
      const billsResponse = await fetch('http://localhost:3001/process-scheduled-bills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (billsResponse.ok) {
        const billsData = await billsResponse.json();
        console.log('Scheduled bills processing result:', billsData);
        if (billsData.results && billsData.results.length > 0) {
          let successCount = 0;
          let failureCount = 0;
          
          billsData.results.forEach((result: any) => {
            console.log('Processing bill result:', result);
            if (result.success) {
              successCount++;
              addNotification({
                type: 'bill_paid',
                title: 'Auto-Pay Completed',
                message: `Your scheduled payment for ${result.billName || 'bill'} of $${result.amount?.toFixed(2) || 'N/A'} has been processed successfully. Next payment scheduled for ${result.nextDate || 'N/A'}.`,
                priority: 'high'
              });
              console.log('Added success notification for bill');
            } else {
              failureCount++;
              addNotification({
                type: 'transaction_failed',
                title: 'Auto-Pay Failed',
                message: `Your scheduled bill payment could not be processed: ${result.message || 'Unknown error'}.`,
                priority: 'high'
              });
              console.log('Added failure notification for bill');
            }
          });
          
          // Show toast summary
          if (successCount > 0 || failureCount > 0) {
            toast({
              title: "Processing Complete",
              description: `Processed ${successCount} successful and ${failureCount} failed auto-pay bills.`,
            });
          }
          
          // Refresh scheduled payments after processing
          fetchScheduledPayments();
          // Refresh accounts to show updated balances
          fetchAccounts();
        } else {
          console.log('No scheduled bills to process');
          toast({
            title: "No Bills Due",
            description: "There are no scheduled bills due for processing at this time.",
          });
        }
      } else {
        const errorText = await billsResponse.text();
        console.error('Failed to process scheduled bills:', billsResponse.status, errorText);
        // Silently handle errors - don't show popup
      }
    } catch (error) {
      console.error('Error processing scheduled payments:', error);
    }
  };

  const fetchScheduledPayments = async () => {
    try {
      setIsLoadingScheduled(true);
      const token = localStorage.getItem('token');
      if (!token) {
        // Use static data if not logged in
        setScheduledTransfers([
          { id: 1, to: "Savings Account", amount: 500.00, frequency: "Monthly", nextDate: "2024-02-01", status: "active" },
          { id: 2, to: "Rent Payment", amount: 1200.00, frequency: "Monthly", nextDate: "2024-02-01", status: "active" }
        ]);
        setScheduledBills([
          { id: 1, name: 'Electric Bill', amount: 125.75, frequency: 'Monthly', nextDate: '2024-02-01', status: 'active' },
          { id: 2, name: 'Internet Bill', amount: 79.99, frequency: 'Monthly', nextDate: '2024-02-01', status: 'active' }
        ]);
        setIsLoadingScheduled(false);
        return;
      }

      // Fetch scheduled transfers
      const transfersResponse = await fetch('http://localhost:3001/scheduled-transfers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (transfersResponse.ok) {
        const transfersData = await transfersResponse.json();
        setScheduledTransfers(transfersData.transfers || []);
      } else {
        console.error('Failed to fetch scheduled transfers:', transfersResponse.status);
        // Use static data as fallback
        setScheduledTransfers([
          { id: 1, to: "Savings Account", amount: 500.00, frequency: "Monthly", nextDate: "2024-02-01", status: "active" },
          { id: 2, to: "Rent Payment", amount: 1200.00, frequency: "Monthly", nextDate: "2024-02-01", status: "active" }
        ]);
      }

      // Fetch scheduled bills
      const billsResponse = await fetch('http://localhost:3001/scheduled-bills', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (billsResponse.ok) {
        const billsData = await billsResponse.json();
        setScheduledBills(billsData.bills || []);
      } else {
        console.error('Failed to fetch scheduled bills:', billsResponse.status);
        // Use static data as fallback
        setScheduledBills([
          { id: 1, name: 'Electric Bill', amount: 125.75, frequency: 'Monthly', nextDate: '2024-02-01', status: 'active' },
          { id: 2, name: 'Internet Bill', amount: 79.99, frequency: 'Monthly', nextDate: '2024-02-01', status: 'active' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching scheduled payments:', error);
      // Use static data as fallback
      setScheduledTransfers([
        { id: 1, to: "Savings Account", amount: 500.00, frequency: "Monthly", nextDate: "2024-02-01", status: "active" },
        { id: 2, to: "Rent Payment", amount: 1200.00, frequency: "Monthly", nextDate: "2024-02-01", status: "active" }
      ]);
      setScheduledBills([
        { id: 1, name: 'Electric Bill', amount: 125.75, frequency: 'Monthly', nextDate: '2024-02-01', status: 'active' },
        { id: 2, name: 'Internet Bill', amount: 79.99, frequency: 'Monthly', nextDate: '2024-02-01', status: 'active' }
      ]);
    } finally {
      setIsLoadingScheduled(false);
    }
  };

  const handleDeleteTransfer = async (transferId: string | number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to local state update
        setScheduledTransfers(prev => prev.filter(t => t.id !== transferId));
        toast({ title: "Transfer deleted", description: "Scheduled transfer removed successfully." });
        return;
      }

      const response = await fetch(`http://localhost:3001/scheduled-transfers/${transferId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setScheduledTransfers(prev => prev.filter(t => t.id !== transferId));
        toast({ title: "Transfer deleted", description: "Scheduled transfer removed successfully." });
      } else {
        throw new Error('Failed to delete transfer');
      }
    } catch (error) {
      console.error('Error deleting transfer:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete scheduled transfer. Please try again."
      });
    }
  };

  const handleDeleteBill = async (billId: string | number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to local state update
        setScheduledBills(prev => prev.filter(b => b.id !== billId));
        toast({ title: "Bill deleted", description: "Scheduled bill removed successfully." });
        return;
      }

      const response = await fetch(`http://localhost:3001/scheduled-bills/${billId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setScheduledBills(prev => prev.filter(b => b.id !== billId));
        toast({ title: "Bill deleted", description: "Scheduled bill removed successfully." });
      } else {
        throw new Error('Failed to delete bill');
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete scheduled bill. Please try again."
      });
    }
  };

  const validateTransferForm = () => {
    const errs: string[] = [];
    if (!transferForm.fromAccountId) errs.push("Please select a source account.");
    if (!transferForm.amount || Number(transferForm.amount) <= 0) errs.push("Enter a valid amount greater than 0.");
    if (!transferForm.frequency) errs.push("Select a frequency.");
    if (!transferForm.nextDate) errs.push("Choose the next transfer date.");
    if (!transferForm.toAccountId && !transferForm.toDescription) errs.push("Provide a destination account or description.");
    setTransferErrors(errs);
    return errs.length === 0;
  };

  const handleCreateTransfer = async () => {
    try {
      if (!validateTransferForm()) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fix the highlighted issues and try again."
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "Please log in to create scheduled transfers."
        });
        return;
      }

      setIsSubmittingTransfer(true);
      const response = await fetch('http://localhost:3001/scheduled-transfers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromAccountId: transferForm.fromAccountId,
          toAccountId: transferForm.toAccountId || null,
          toDescription: transferForm.toDescription || null,
          amount: parseFloat(transferForm.amount),
          frequency: transferForm.frequency,
          nextDate: transferForm.nextDate,
          description: transferForm.description || null
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Transfer created", description: "Scheduled transfer created successfully." });
        setShowAddTransferModal(false);
        setTransferErrors([]);
        setTransferForm({
          fromAccountId: '',
          toAccountId: '',
          toDescription: '',
          amount: '',
          frequency: 'Monthly',
          nextDate: '',
          description: ''
        });
        fetchScheduledPayments();
      } else {
        throw new Error(result.message || 'Failed to create transfer');
      }
    } catch (error: any) {
      console.error('Error creating scheduled transfer:', error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: error.message || "Could not create scheduled transfer. Please try again."
      });
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const handleUpdateTransfer = async () => {
    if (!editingTransfer) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "Please log in to update scheduled transfers."
        });
        return;
      }

      setIsSubmittingTransfer(true);
      const response = await fetch(`http://localhost:3001/scheduled-transfers/${editingTransfer.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: transferForm.amount ? parseFloat(transferForm.amount) : undefined,
          frequency: transferForm.frequency || undefined,
          nextDate: transferForm.nextDate || undefined,
          description: transferForm.description || undefined
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Transfer updated", description: "Scheduled transfer updated successfully." });
        setEditingTransfer(null);
        setShowAddTransferModal(false);
        setTransferErrors([]);
        setTransferForm({
          fromAccountId: '',
          toAccountId: '',
          toDescription: '',
          amount: '',
          frequency: 'Monthly',
          nextDate: '',
          description: ''
        });
        fetchScheduledPayments();
      } else {
        throw new Error(result.message || 'Failed to update transfer');
      }
    } catch (error: any) {
      console.error('Error updating scheduled transfer:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Could not update scheduled transfer. Please try again."
      });
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const validateQuickBillForm = () => {
    const errs: string[] = [];
    if (!quickBillForm.billType) errs.push("Please select a bill type.");
    if (!quickBillForm.amount || Number(quickBillForm.amount) <= 0) errs.push("Enter a valid amount greater than 0.");
    if (!quickBillForm.fromAccountId) errs.push("Please select an account to pay from.");
    setQuickBillErrors(errs);
    return errs.length === 0;
  };

  const handlePayBill = async () => {
    try {
      if (!validateQuickBillForm()) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fill in all required fields and try again."
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "Please log in to pay bills."
        });
        return;
      }

      setIsPayingBill(true);
      setQuickBillErrors([]);

      // Get the selected account to check balance
      const selectedAccount = accounts.find(acc => acc.id === quickBillForm.fromAccountId);
      if (!selectedAccount) {
        throw new Error('Selected account not found');
      }

      const amount = parseFloat(quickBillForm.amount);
      if (selectedAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }

      // Process bill payment
      const response = await fetch('http://localhost:3001/bill-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromAccountId: quickBillForm.fromAccountId,
          amount: amount,
          billType: quickBillForm.billType,
          description: quickBillForm.memo || `Bill payment - ${quickBillForm.billType}`
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response. Please ensure the backend server is running and the /bill-payment endpoint is available.`);
      }

      const result = await response.json();

      if (response.ok && result.success !== false) {
        // Update account balance locally
        setAccounts(prev => prev.map(acc => 
          acc.id === quickBillForm.fromAccountId 
            ? { ...acc, balance: acc.balance - amount }
            : acc
        ));

        // Reset form
        setQuickBillForm({
          billType: '',
          amount: '',
          fromAccountId: '',
          memo: ''
        });

        // Add success notification
        addNotification({
          type: 'bill_paid',
          title: 'Bill Payment Successful',
          message: `Your ${quickBillForm.billType} bill payment of $${amount.toFixed(2)} has been processed successfully.`,
          priority: 'high'
        });

        toast({
          title: "Payment successful",
          description: `Your ${quickBillForm.billType} bill payment of $${amount.toFixed(2)} has been processed.`,
        });
      } else {
        throw new Error(result.message || 'Failed to process bill payment');
      }
    } catch (error: any) {
      console.error('Error paying bill:', error);
      
      let errorMessage = error.message || 'Your bill payment could not be processed. Please try again.';
      
      // Check if it's a JSON parsing error (backend returning HTML)
      if (errorMessage.includes('JSON') || errorMessage.includes('<!DOCTYPE')) {
        errorMessage = 'Backend server error. Please ensure the backend server is running and has been restarted to include the bill payment endpoint.';
      }
      
      // Add failure notification
      addNotification({
        type: 'transaction_failed',
        title: 'Bill Payment Failed',
        message: errorMessage,
        priority: 'high'
      });

      toast({
        variant: "destructive",
        title: "Payment failed",
        description: errorMessage,
      });
    } finally {
      setIsPayingBill(false);
    }
  };

  const validateBillForm = () => {
    const errs: string[] = [];
    if (!billForm.fromAccountId) errs.push("Please select an account to pay from.");
    if (!billForm.billName) errs.push("Enter a bill name.");
    if (!billForm.billType) errs.push("Select a bill type.");
    if (!billForm.amount || Number(billForm.amount) <= 0) errs.push("Enter a valid amount greater than 0.");
    if (!billForm.frequency) errs.push("Select a frequency.");
    if (!billForm.nextDate) errs.push("Choose the next payment date.");
    setBillErrors(errs);
    return errs.length === 0;
  };

  const handleCreateBill = async () => {
    try {
      if (!validateBillForm()) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fix the highlighted issues and try again."
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "Please log in to create scheduled bills."
        });
        return;
      }

      setIsSubmittingBill(true);
      const response = await fetch('http://localhost:3001/scheduled-bills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromAccountId: billForm.fromAccountId,
          billName: billForm.billName,
          billType: billForm.billType,
          amount: parseFloat(billForm.amount),
          frequency: billForm.frequency,
          nextDate: billForm.nextDate,
          description: billForm.description || null,
          payeeName: billForm.payeeName || null,
          payeeAccount: billForm.payeeAccount || null
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Bill created", description: "Scheduled bill created successfully." });
        setShowAddBillModal(false);
        setBillErrors([]);
        setBillForm({
          fromAccountId: '',
          billName: '',
          billType: 'electric',
          amount: '',
          frequency: 'Monthly',
          nextDate: '',
          description: '',
          payeeName: '',
          payeeAccount: ''
        });
        fetchScheduledPayments();
      } else {
        throw new Error(result.message || 'Failed to create bill');
      }
    } catch (error: any) {
      console.error('Error creating scheduled bill:', error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: error.message || "Could not create scheduled bill. Please try again."
      });
    } finally {
      setIsSubmittingBill(false);
    }
  };

  const handleUpdateBill = async () => {
    if (!editingBill) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "Please log in to update scheduled bills."
        });
        return;
      }

      setIsSubmittingBill(true);
      const response = await fetch(`http://localhost:3001/scheduled-bills/${editingBill.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: billForm.amount ? parseFloat(billForm.amount) : undefined,
          frequency: billForm.frequency || undefined,
          nextDate: billForm.nextDate || undefined,
          description: billForm.description || undefined
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({ title: "Bill updated", description: "Scheduled bill updated successfully." });
        setEditingBill(null);
        setShowAddBillModal(false);
        setBillErrors([]);
        setBillForm({
          fromAccountId: '',
          billName: '',
          billType: 'electric',
          amount: '',
          frequency: 'Monthly',
          nextDate: '',
          description: '',
          payeeName: '',
          payeeAccount: ''
        });
        fetchScheduledPayments();
      } else {
        throw new Error(result.message || 'Failed to update bill');
      }
    } catch (error: any) {
      console.error('Error updating scheduled bill:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Could not update scheduled bill. Please try again."
      });
    } finally {
      setIsSubmittingBill(false);
    }
  };

  const openEditTransfer = (transfer: any) => {
    setEditingTransfer(transfer);
    setTransferForm({
      fromAccountId: transfer.from_account_id || transfer.fromAccountId || '',
      toAccountId: transfer.to_account_id || transfer.toAccountId || '',
      toDescription: transfer.to_description || transfer.toDescription || transfer.to || '',
      amount: transfer.amount?.toString() || '',
      frequency: transfer.frequency || 'Monthly',
      nextDate: transfer.next_date || transfer.nextDate || '',
      description: transfer.description || ''
    });
    setShowAddTransferModal(true);
  };

  const openEditBill = (bill: any) => {
    setEditingBill(bill);
    setBillForm({
      fromAccountId: bill.from_account_id || bill.fromAccountId || '',
      billName: bill.bill_name || bill.name || '',
      billType: bill.bill_type || bill.billType || 'electric',
      amount: bill.amount?.toString() || '',
      frequency: bill.frequency || 'Monthly',
      nextDate: bill.next_date || bill.nextDate || '',
      description: bill.description || '',
      payeeName: bill.payee_name || bill.payeeName || '',
      payeeAccount: bill.payee_account || bill.payeeAccount || ''
    });
    setShowAddBillModal(true);
  };

  const fetchAccounts = async () => {
    try {
      console.log('🔍 Fetching accounts...');
      
      // Use static data first to prevent blank page
      const staticAccounts = [
        { id: '1', account_number: 'CHK1234', account_type: 'checking', balance: 1000, created_at: '2024-01-01' },
        { id: '2', account_number: 'SAV5678', account_type: 'savings', balance: 5000, created_at: '2024-01-01' }
      ];
      
      setAccounts(staticAccounts);
      setIsLoading(false);
      
      // Try to fetch real data in background
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Token:', 'Present');
        
        const response = await fetch('http://localhost:3001/accounts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Accounts data:', data);
          setAccounts(data.accounts || staticAccounts);
        } else {
          console.error('API Error:', response.status, response.statusText);
        }
      } else {
        console.log('Token:', 'Missing');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to load accounts. Using demo data.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accounts.length > 0) {
      setDepositForm((prev) => ({
        ...prev,
        fromAccount: prev.fromAccount || accounts[0].id
      }));

      setDepositHistory((prev) => {
        if (prev.length > 0) {
          return prev;
        }

        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

        return [
          {
            id: "demo-1",
            accountId: accounts[0].id,
            amount: 275.35,
            status: "completed",
            submittedAt: yesterday.toISOString(),
            availabilityDate: today.toISOString(),
            memo: "Payroll reimbursement",
            reference: "MOBILE-4839",
            type: "mobile",
            attachments: {},
            notifications: { email: true, sms: false },
            checkNumber: "1034"
          },
          accounts[1]
            ? {
                id: "demo-2",
                accountId: accounts[1].id,
                amount: 1280,
                status: "pending",
                submittedAt: today.toISOString(),
                availabilityDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                memo: "Client retainer",
                reference: "BRANCH-2190",
                type: "branch",
                attachments: {},
                notifications: { email: true, sms: true },
                checkNumber: "2219"
              }
            : {
                id: "demo-2",
                accountId: accounts[0].id,
                amount: 1280,
                status: "pending",
                submittedAt: today.toISOString(),
                availabilityDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                memo: "Client retainer",
                reference: "BRANCH-2190",
                type: "branch",
                attachments: {},
                notifications: { email: true, sms: true },
                checkNumber: "2219"
              },
          {
            id: "demo-3",
            accountId: accounts[0].id,
            amount: 642.75,
            status: "processing",
            submittedAt: threeDaysAgo.toISOString(),
            availabilityDate: today.toISOString(),
            memo: "Insurance refund",
            reference: "MOBILE-8004",
            type: "mobile",
            attachments: {},
            notifications: { email: true, sms: false },
            checkNumber: "9981"
          }
        ];
      });
    }
  }, [accounts]);

  const depositStats = useMemo(() => {
    const totals = depositHistory.reduce(
      (acc, deposit) => {
        if (deposit.status === "completed") {
          acc.completed += deposit.amount;
        }
        if (deposit.status === "processing" || deposit.status === "pending") {
          acc.processing += deposit.amount;
        }
        acc.count += 1;
        return acc;
      },
      { completed: 0, processing: 0, count: 0 }
    );

    return totals;
  }, [depositHistory]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));

  const getAccountDisplayName = (accountId: string) => {
    const account = accounts.find((item) => item.id === accountId);
    if (!account) {
      return "Account";
    }
    return `${account.account_number} • ${account.account_type.toUpperCase()}`;
  };

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationId = `APP-${Date.now().toString().slice(-6)}`;
      
      setOfferSubmitted(true);
      setShowOfferForm(false);
      
      toast({
        title: "Application submitted successfully!",
        description: `Your application ID is ${applicationId}. We'll review and contact you within 2-3 business days.`,
      });
      
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

  // Generate statements from transactions (simplified for Payments page)
  const generateStatements = (transactions: any[]) => {
    if (transactions.length === 0) return [];
    const groupedTransactions = transactions.reduce((groups: any, transaction) => {
      const date = new Date(transaction.created_at || transaction.date || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(transaction);
      return groups;
    }, {});

    const statements = Object.keys(groupedTransactions).map(monthKey => {
      const monthTransactions = groupedTransactions[monthKey];
      const firstDate = new Date(Math.min(...monthTransactions.map((t: any) => new Date(t.created_at || t.date || Date.now()).getTime())));
      const lastDate = new Date(Math.max(...monthTransactions.map((t: any) => new Date(t.created_at || t.date || Date.now()).getTime())));
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

    return accounts
      .filter((account) => allowedTypes.has(account.account_type))
      .map((account, index) => {
        const isCredit = creditTypes.has(account.account_type);
        const cardDetails: any = (account as any).card_details || {};
        const rawAccountDigits = (account.account_number || '').replace(/\D/g, '') || `${index + 1}`.repeat(4);
        const fallbackCardNumber = (rawAccountDigits + '1234567890123456').slice(-16);
        const cardNumberRaw = (cardDetails.card_number || fallbackCardNumber)
          .replace(/\D/g, '')
          .padStart(16, '0')
          .slice(-16);
        const cardNumberMasked = cardNumberRaw.replace(/\d(?=\d{4})/g, '•').replace(/(.{4})/g, '$1 ').trim();

        const routingRawBase = (cardDetails.routing_number || `0210000${(index * 7 + 3) % 90}`)
          .toString()
          .replace(/\D/g, '')
          .padStart(9, '2')
          .slice(-9);
        const routingMasked = routingRawBase.replace(/\d(?=\d{3})/g, '•');

        const openedDate = new Date(account.created_at);
        const expiryDate = cardDetails.expiry
          ? cardDetails.expiry
          : (() => {
              const d = new Date(openedDate.getTime());
              d.setFullYear(d.getFullYear() + 4);
              return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
            })();

        const network = cardDetails.network || (isCredit ? creditNetworks[index % creditNetworks.length] : debitNetworks[index % debitNetworks.length]);
        const creditLimit = isCredit ? cardDetails.credit_limit || (account as any).credit_limit || 5000 + index * 1500 : null;
        const available = isCredit ? Math.max(0, (creditLimit || 0) - Math.abs(account.balance)) : null;

        const monthYearFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

        return {
          id: `card-${account.id}`,
          title: account.account_type.replace(/_/g, ' '),
          typeLabel: isCredit ? 'Credit Card' : 'Debit Card',
          cardNumberMasked,
          routingMasked,
          network,
          creditLimit,
          available,
          cardHolder: cardDetails.cardholder || authUser?.name || 'Commerce Bank Client',
          expiry: expiryDate,
          openedLabel: monthYearFormatter.format(openedDate),
          linkedAccount: account.account_number,
          cvvMasked: cardDetails.cvv ? cardDetails.cvv.replace(/\d/g, '•') : '•••',
          status: cardDetails.status || 'Active',
          gradientClass: isCredit
            ? 'from-purple-500 via-indigo-500 to-slate-900'
            : 'from-emerald-400 via-teal-500 to-sky-500',
          borderClass: isCredit ? 'border-indigo-200/70' : 'border-emerald-200/70'
        };
      });
  }, [accounts, authUser?.name]);

  // Generate statements when accounts change
  useEffect(() => {
    // For Payments page, we'll use a simplified statement generation
    // In a real app, you'd fetch transactions from the API
    const mockTransactions = depositHistory.map(deposit => ({
      id: deposit.id,
      amount: deposit.amount,
      transaction_type: 'deposit',
      description: `Check deposit - ${deposit.reference}`,
      created_at: deposit.submittedAt,
      status: deposit.status
    }));
    const generatedStatements = generateStatements(mockTransactions);
    setStatements(generatedStatements);
  }, [depositHistory]);

  // Statement download functions (simplified versions)
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

  const handleDepositInputChange = (field: keyof DepositFormState, value: string | boolean) => {
    setDepositForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckImage = (side: "front" | "back") => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setCheckImages((prev) => ({ ...prev, [side]: null }));
      setCheckPreviews((prev) => ({ ...prev, [side]: "" }));
      return;
    }

    setCheckImages((prev) => ({ ...prev, [side]: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = typeof e.target?.result === "string" ? e.target.result : "";
      setCheckPreviews((prev) => ({ ...prev, [side]: result }));
    };
    reader.readAsDataURL(file);
  };

  const resetDepositForm = () => {
    setDepositForm((prev) => ({
      ...prev,
      amount: "",
      checkNumber: "",
      memo: "",
      depositDate: new Date().toISOString().slice(0, 10)
    }));
    setCheckImages({ front: null, back: null });
    setCheckPreviews({ front: "", back: "" });
  };

  const validateDepositForm = () => {
    const errors: string[] = [];

    if (!depositForm.fromAccount) {
      errors.push("Select an account to deposit into.");
    }

    const amountValue = parseFloat(depositForm.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      errors.push("Enter a check amount greater than zero.");
    } else if (amountValue > 5000 && depositForm.depositType === "mobile") {
      errors.push("Mobile deposits are limited to $5,000. Please choose branch or ATM deposit.");
    }

    if (!depositForm.checkNumber.trim()) {
      errors.push("Enter the check number for tracking.");
    }

    if (!checkImages.front || !checkImages.back) {
      errors.push("Upload clear images of both sides of the check.");
    }

    return errors;
  };

  const handleDepositSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateDepositForm();
    if (errors.length > 0) {
      setDepositErrors(errors);
      toast({
        variant: "destructive",
        title: "Unable to submit deposit",
        description: errors[0]
      });
      return;
    }

    setDepositErrors([]);
    setIsSubmittingDeposit(true);

    const amountValue = parseFloat(depositForm.amount);
    const depositId = `dep-${Date.now()}`;
    const now = new Date();
    const availability = new Date(now.getTime() + (depositForm.depositType === "mobile" ? 2 : 1) * 24 * 60 * 60 * 1000);

    const optimisticDeposit: DepositHistoryItem = {
      id: depositId,
      accountId: depositForm.fromAccount,
      amount: amountValue,
      status: "processing",
      submittedAt: now.toISOString(),
      availabilityDate: availability.toISOString(),
      memo: depositForm.memo,
      reference: `${depositForm.depositType === "mobile" ? "MOBILE" : depositForm.depositType === "branch" ? "BRANCH" : "ATM"}-${Math.floor(Math.random() * 9000) + 1000}`,
      type: depositForm.depositType,
      attachments: { ...checkPreviews },
      notifications: { email: depositForm.emailReceipt, sms: depositForm.smsAlerts },
      checkNumber: depositForm.checkNumber
    };

    setDepositHistory((prev) => [optimisticDeposit, ...prev]);

    const payload = {
      accountId: optimisticDeposit.accountId,
      amount: optimisticDeposit.amount,
      memo: optimisticDeposit.memo,
      type: optimisticDeposit.type,
      checkNumber: optimisticDeposit.checkNumber,
      depositDate: depositForm.depositDate,
      notifications: optimisticDeposit.notifications
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setDepositHistory((prev) =>
          prev.map((deposit) =>
            deposit.id === depositId
              ? {
                  ...deposit,
                  status: "completed",
                  availabilityDate: data?.deposit?.availabilityDate || deposit.availabilityDate,
                  reference: data?.deposit?.reference || deposit.reference
                }
              : deposit
          )
        );
        toast({
          title: "Deposit submitted",
          description: "Your check has been accepted. Funds will be available soon."
        });
        // Add success notification
        addNotification({
          type: 'deposit_success',
          title: 'Check Deposit Submitted',
          message: `Your check deposit of $${amountValue.toFixed(2)} has been submitted successfully. Reference: ${optimisticDeposit.reference}. Funds will be available ${new Date(availability).toLocaleDateString()}.`,
          priority: 'high'
        });
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Deposit submission failed' }));
        // Update deposit status to failed
        setDepositHistory((prev) =>
          prev.map((deposit) =>
            deposit.id === depositId
              ? {
                  ...deposit,
                  status: "failed"
                }
              : deposit
          )
        );
        // Add failure notification
        addNotification({
          type: 'deposit_failed',
          title: 'Check Deposit Failed',
          message: `Your check deposit of $${amountValue.toFixed(2)} could not be processed: ${errorData.message || 'Unknown error'}. Please try again or contact support.`,
          priority: 'high'
        });
        throw new Error(`Deposit API responded with status ${response.status}`);
      }
    } catch (apiError) {
      console.warn("Deposit API unavailable, simulating success:", apiError);
      // Check if the error was from a failed response (not just API unavailable)
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
      const isFailure = errorMessage.includes('status');
      
      if (isFailure) {
        // Update deposit status to failed
        setDepositHistory((prev) =>
          prev.map((deposit) =>
            deposit.id === depositId
              ? {
                  ...deposit,
                  status: "failed"
                }
              : deposit
          )
        );
        // Add failure notification
        addNotification({
          type: 'deposit_failed',
          title: 'Check Deposit Failed',
          message: `Your check deposit of $${amountValue.toFixed(2)} could not be processed. Please try again or contact support.`,
          priority: 'high'
        });
      } else {
        // API unavailable but simulating success
        setTimeout(() => {
          setDepositHistory((prev) =>
            prev.map((deposit) =>
              deposit.id === depositId
                ? {
                    ...deposit,
                    status: "completed"
                  }
                : deposit
            )
          );
          toast({
            title: "Deposit submitted",
            description: "Funds will be available after standard review."
          });
          // Add success notification
          addNotification({
            type: 'deposit_success',
            title: 'Check Deposit Submitted',
            message: `Your check deposit of $${amountValue.toFixed(2)} has been submitted successfully. Reference: ${optimisticDeposit.reference}. Funds will be available ${new Date(availability).toLocaleDateString()}.`,
            priority: 'high'
          });
        }, 1200);
      }
    } finally {
      setIsSubmittingDeposit(false);
      resetDepositForm();
    }
  };

  // Show loading state if still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Payments</h2>
          <p className="text-gray-600">Please wait while we load your payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <Header />

      <div className="container mx-auto px-4 py-6">
        <QuickAccess 
          className="mb-6"
          onOpenCardManager={() => setShowCardManager(true)}
          onOpenSupportHelp={() => setShowSupportHelp(true)}
          onOpenStatements={() => setShowStatements(true)}
        />

        {/* Main Content */}
        <Tabs defaultValue="transfer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transfer">Transfer Money</TabsTrigger>
            <TabsTrigger value="bills">Pay Bills</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Payments</TabsTrigger>
            <TabsTrigger value="deposit">Deposit Check</TabsTrigger>
          </TabsList>

          {/* Transfer Money Tab */}
          <TabsContent value="transfer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.3)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(195,92%,56%,0.12)] via-transparent to-[hsla(150,60%,35%,0.08)] pointer-events-none" />
                <CardHeader className="relative z-10">
                  <CardTitle>Transfer Between Accounts</CardTitle>
                  <CardDescription>
                    Move money between your accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <TransferModal 
                    accounts={accounts} 
                    onTransferSuccess={() => {
                      fetchAccounts(); // Refresh accounts after transfer
                    }}
                    renderInline
                  />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.3)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(150,60%,35%,0.12)] via-transparent to-[hsla(195,92%,56%,0.08)] pointer-events-none" />
                <CardHeader className="relative z-10">
                  <CardTitle>Send Money to Others</CardTitle>
                  <CardDescription>
                    Send money to external accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <SendMoneyModal 
                    accounts={accounts} 
                    onSendSuccess={() => {
                      fetchAccounts(); // Refresh accounts after send
                    }}
                    renderInline
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pay Bills Tab */}
          <TabsContent value="bills" className="space-y-6">
            <Card className="relative overflow-hidden border-none bg-white/80 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.4)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsla(150,60%,35%,0.12)] via-[hsla(180,70%,45%,0.08)] to-[hsla(195,100%,50%,0.06)]" />
              <CardHeader className="relative z-10 pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Badge className="rounded-full border border-[hsla(150,60%,35%,0.2)] bg-[hsla(150,60%,35%,0.15)] text-[hsl(var(--commerce-green))]">
                      Pay Bills
                    </Badge>
                    <CardTitle className="mt-2 text-2xl text-slate-800">Quick Bill Payment</CardTitle>
                    <CardDescription>
                      Pay utilities, subscriptions, or tuition in just a few taps. Choose a bill type, amount, and fund source.
                    </CardDescription>
                  </div>
                  <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-xs text-slate-500 shadow-sm">
                    <div className="font-semibold text-slate-700">Next autopay draft</div>
                    <div className="text-slate-500">Nov 21 · $325.40 scheduled</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6 p-6">
                {quickBillErrors.length > 0 && (
                  <div className="rounded-xl border border-rose-300/60 bg-rose-50/80 p-3 text-sm text-rose-700 shadow-sm">
                    <div className="font-semibold mb-1">Please fix the following:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {quickBillErrors.map((e, idx) => (<li key={idx}>{e}</li>))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bill-type" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bill type</Label>
                      <Select value={quickBillForm.billType} onValueChange={(value) => setQuickBillForm({ ...quickBillForm, billType: value })}>
                        <SelectTrigger id="bill-type" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                          <SelectValue placeholder="Select bill type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electric">Electric bill</SelectItem>
                          <SelectItem value="water">Water bill</SelectItem>
                          <SelectItem value="internet">Internet bill</SelectItem>
                          <SelectItem value="phone">Phone bill</SelectItem>
                          <SelectItem value="tuition">Tuition</SelectItem>
                          <SelectItem value="rent">Rent / Mortgage</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-400">Need to add a new payee? Manage beneficiaries from your dashboard.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bill-amount" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</Label>
                      <Input
                        id="bill-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        value={quickBillForm.amount}
                        onChange={(e) => setQuickBillForm({ ...quickBillForm, amount: e.target.value })}
                        className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-right text-lg font-semibold text-slate-700 shadow-inner"
                      />
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>No processing fees</span>
                        <span>USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="account-select" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pay from</Label>
                      <Select value={quickBillForm.fromAccountId} onValueChange={(value) => setQuickBillForm({ ...quickBillForm, fromAccountId: value })}>
                        <SelectTrigger id="account-select" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                          <SelectValue placeholder="Choose source account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.filter(acc => acc.balance > 0).map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.account_number} · ${account.balance.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-400">Only accounts with available funds are displayed.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-memo" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Memo (optional)</Label>
                      <Input
                        id="payment-memo"
                        placeholder="Add a note for this payment"
                        value={quickBillForm.memo}
                        onChange={(e) => setQuickBillForm({ ...quickBillForm, memo: e.target.value })}
                        className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
                      />
                    </div>
                  </div>

                <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-500 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Shield className="h-4 w-4 text-[hsl(var(--commerce-green))]" />
                      Secure ACH transfer • Arrives in 1-2 business days
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <CalendarDays className="h-4 w-4" />
                      Schedule for later from the "Scheduled Payments" tab
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePayBill}
                  disabled={isPayingBill || !quickBillForm.billType || !quickBillForm.amount || !quickBillForm.fromAccountId}
                  className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-[hsl(var(--commerce-green))]/30"
                >
                  {isPayingBill ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Pay Bill'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Payments Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={processScheduledPayments}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Process Due Payments Now
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="relative overflow-hidden border-none bg-white/80 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.4)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(195,100%,50%,0.12)] via-transparent to-[hsla(150,60%,35%,0.08)]" />
                <CardHeader className="relative z-10 pb-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Badge className="rounded-full border border-[hsla(195,100%,50%,0.18)] bg-[hsla(195,100%,50%,0.12)] text-[hsl(var(--commerce-teal))]">
                        Scheduled Transfers
                      </Badge>
                      <CardTitle className="mt-2 text-xl text-slate-800">Manage Recurring Transfers</CardTitle>
                      <CardDescription>Keep money moving automatically between your accounts.</CardDescription>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-xs text-slate-500 shadow-sm">
                      <div className="font-semibold text-slate-700">Next cycle</div>
                      <div>{scheduledTransfers[0]?.nextDate || '—'}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 p-6">
                  {scheduledTransfers.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500 shadow-inner">
                      No scheduled transfers yet. Click "Add Scheduled Transfer" to create one.
                    </div>
                  ) : (
                    scheduledTransfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/85 p-4 shadow-sm transition hover:border-[hsl(var(--commerce-teal))]/40 hover:shadow-lg"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{transfer.to_description || transfer.to || 'Transfer'}</p>
                          <p className="text-xs uppercase tracking-wide text-slate-400">{transfer.frequency}</p>
                          <p className="mt-1 text-sm text-slate-500">Amount: {formatCurrency(transfer.amount)}</p>
                          <p className="text-xs text-slate-400">Next transfer {transfer.next_date || transfer.nextDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full border-slate-200 text-slate-500 hover:border-[hsl(var(--commerce-teal))]/50"
                            onClick={() => openEditTransfer(transfer)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit transfer</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full border-slate-200 text-slate-500 hover:border-rose-300"
                            onClick={() => handleDeleteTransfer(transfer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Cancel transfer</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Button 
                    variant="ghost" 
                    className="h-12 w-full rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-[hsl(var(--commerce-teal))]/50 hover:text-[hsl(var(--commerce-teal))]"
                    onClick={() => {
                      setEditingTransfer(null);
                      setTransferForm({
                        fromAccountId: '',
                        toAccountId: '',
                        toDescription: '',
                        amount: '',
                        frequency: 'Monthly',
                        nextDate: '',
                        description: ''
                      });
                      setShowAddTransferModal(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Scheduled Transfer
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-none bg-white/80 shadow-[0_40px_80px_-60px_rgba(12,74,110,0.4)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(48,96%,53%,0.12)] via-transparent to-[hsla(150,60%,35%,0.06)]" />
                <CardHeader className="relative z-10 pb-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Badge className="rounded-full border border-[hsla(48,96%,53%,0.2)] bg-[hsla(48,96%,53%,0.12)] text-amber-600">
                        Auto-Pay Setup
                      </Badge>
                      <CardTitle className="mt-2 text-xl text-slate-800">Never Miss a Payment</CardTitle>
                      <CardDescription>Automate monthly bills and control drafts from one place.</CardDescription>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-xs text-slate-500 shadow-sm">
                      <div className="font-semibold text-slate-700">Autopay status</div>
                      <div>{scheduledBills.filter(b => b.status === 'active').length} active · {scheduledBills.filter(b => b.status === 'paused').length} paused</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 p-6">
                  {scheduledBills.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500 shadow-inner">
                      No scheduled bills yet. Click "Add Auto-Pay" to set up automatic bill payments.
                    </div>
                  ) : (
                    scheduledBills.map((bill) => (
                      <div
                        key={bill.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/90 p-4 shadow-sm transition hover:border-amber-300 hover:shadow-lg"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{bill.bill_name || bill.name}</p>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Auto-pay enabled</p>
                          <p className="mt-1 text-sm text-slate-500">{formatCurrency(bill.amount)}/{bill.frequency === 'Monthly' ? 'month' : bill.frequency?.toLowerCase() || 'period'}</p>
                          {bill.next_date && (
                            <p className="text-xs text-slate-400">Next payment: {bill.next_date}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-500"
                            onClick={() => openEditBill(bill)}
                          >
                            Configure
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full border-slate-200 text-slate-500 hover:border-rose-300"
                            onClick={() => handleDeleteBill(bill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete bill</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Button 
                    variant="ghost" 
                    className="h-12 w-full rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-amber-300 hover:text-amber-500"
                    onClick={() => {
                      setEditingBill(null);
                      setBillForm({
                        fromAccountId: '',
                        billName: '',
                        billType: 'electric',
                        amount: '',
                        frequency: 'Monthly',
                        nextDate: '',
                        description: '',
                        payeeName: '',
                        payeeAccount: ''
                      });
                      setShowAddBillModal(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Auto-Pay
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deposit Check Tab */}
          <TabsContent value="deposit" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1.1fr]">
              <Card className="relative overflow-hidden border-none bg-white/80 shadow-[0_40px_80px_-60px_rgba(18,84,120,0.35)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(165,82%,46%,0.12)] via-transparent to-[hsla(195,92%,56%,0.08)]" />
                <CardHeader className="relative z-10 pb-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Badge className="rounded-full border border-[hsla(165,82%,46%,0.2)] bg-[hsla(165,82%,46%,0.15)] text-[hsl(var(--commerce-teal))]">
                        Deposit Check
                      </Badge>
                      <CardTitle className="mt-2 text-2xl text-slate-800">Mobile Check Deposit</CardTitle>
                      <CardDescription>
                        Capture your check, choose where to send the funds, and get real-time tracking updates.
                      </CardDescription>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-xs text-slate-500 shadow-sm">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <Clock className="h-4 w-4 text-[hsl(var(--commerce-teal))]" />
                        Funds availability
                      </div>
                      <div className="mt-1 text-slate-500">Most deposits clear in 1-2 business days*</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <form onSubmit={handleDepositSubmit} className="space-y-6">
                    {depositErrors.length > 0 && (
                      <div className="rounded-xl border border-amber-300/60 bg-amber-50/80 p-4 text-sm text-amber-700 shadow-sm">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-500" />
                          <div>
                            <p className="font-semibold">Please review your deposit</p>
                            <ul className="mt-2 space-y-1 text-amber-600">
                              {depositErrors.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="deposit-account" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Deposit into
                        </Label>
                        <Select
                          value={depositForm.fromAccount}
                          onValueChange={(value) => handleDepositInputChange("fromAccount", value)}
                        >
                          <SelectTrigger id="deposit-account" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                            <SelectValue placeholder="Select destination account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.account_number} • {account.account_type.toUpperCase()} · {formatCurrency(account.balance)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400">Only eligible accounts appear here.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deposit-amount" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Check amount
                        </Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={depositForm.amount}
                          onChange={(event) => handleDepositInputChange("amount", event.target.value)}
                          placeholder="0.00"
                          className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-right text-lg font-semibold text-slate-700 shadow-inner"
                        />
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Daily mobile limit $5,000</span>
                          <span>USD</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="deposit-check-number" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Check number
                        </Label>
                        <Input
                          id="deposit-check-number"
                          value={depositForm.checkNumber}
                          onChange={(event) => handleDepositInputChange("checkNumber", event.target.value)}
                          placeholder="Enter check number"
                          className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor="deposit-date" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Deposit date
                        </Label>
                        <Input
                          id="deposit-date"
                          type="date"
                          value={depositForm.depositDate}
                          onChange={(event) => handleDepositInputChange("depositDate", event.target.value)}
                          className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-3">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Delivery method
                        </Label>
                        <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-2 text-xs shadow-inner">
                          <Button
                            type="button"
                            variant={depositForm.depositType === "mobile" ? "default" : "ghost"}
                            className="h-9 flex-1 rounded-lg"
                            onClick={() => handleDepositInputChange("depositType", "mobile")}
                          >
                            <Smartphone className="mr-2 h-4 w-4" />
                            Mobile
                          </Button>
                          <Button
                            type="button"
                            variant={depositForm.depositType === "atm" ? "default" : "ghost"}
                            className="h-9 flex-1 rounded-lg"
                            onClick={() => handleDepositInputChange("depositType", "atm")}
                          >
                            <Home className="mr-2 h-4 w-4" />
                            ATM
                          </Button>
                          <Button
                            type="button"
                            variant={depositForm.depositType === "branch" ? "default" : "ghost"}
                            className="h-9 flex-1 rounded-lg"
                            onClick={() => handleDepositInputChange("depositType", "branch")}
                          >
                            <Building2 className="mr-2 h-4 w-4" />
                            Branch
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {(["front", "back"] as const).map((side) => (
                        <div key={side} className="space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {side === "front" ? "Front of check" : "Back of check"}
                          </Label>
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-500 shadow-inner">
                            <label
                              htmlFor={`check-${side}`}
                              className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 text-center"
                            >
                              {checkPreviews[side] ? (
                                <img
                                  src={checkPreviews[side]}
                                  alt={`${side} of check preview`}
                                  className="h-full w-full rounded-xl object-cover shadow"
                                />
                              ) : (
                                <>
                                  <UploadCloud className="h-8 w-8 text-[hsl(var(--commerce-teal))]" />
                                  <span className="text-sm font-medium text-slate-600">Tap to upload image</span>
                                  <span className="text-xs text-slate-400">PNG or JPG • Max 10MB</span>
                                </>
                              )}
                            </label>
                            <Input
                              id={`check-${side}`}
                              type="file"
                              accept="image/*"
                              onChange={handleCheckImage(side)}
                              className="sr-only"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="deposit-memo" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Memo (optional)
                        </Label>
                        <Textarea
                          id="deposit-memo"
                          value={depositForm.memo}
                          onChange={(event) => handleDepositInputChange("memo", event.target.value)}
                          placeholder="Add any details to help you recognize this deposit later."
                          className="min-h-[110px] rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 text-sm shadow-inner"
                        />
                      </div>

                      <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-white/75 p-4 shadow-inner">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notifications</p>
                        <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[hsl(var(--commerce-teal))]" />
                            Email receipt
                          </div>
                          <Switch
                            checked={depositForm.emailReceipt}
                            onCheckedChange={(value) => handleDepositInputChange("emailReceipt", value)}
                          />
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[hsl(var(--commerce-teal))]" />
                            SMS alerts
                          </div>
                          <Switch
                            checked={depositForm.smsAlerts}
                            onCheckedChange={(value) => handleDepositInputChange("smsAlerts", value)}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-slate-400" />
                            <span>We'll notify you once the deposit is reviewed.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-xs text-slate-500 shadow-inner">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Shield className="h-4 w-4 text-[hsl(var(--commerce-teal))]" />
                        Encrypted upload · All deposits reviewed for fraud protection
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="h-4 w-4" />
                        Cut-off time 7:30 PM CT for same-day processing
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl text-lg font-semibold shadow-lg shadow-[hsl(var(--commerce-teal))]/35"
                      disabled={isSubmittingDeposit}
                    >
                      {isSubmittingDeposit ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting deposit...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Submit Deposit
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(18,84,120,0.3)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(205,92%,56%,0.12)] via-transparent to-[hsla(165,82%,46%,0.08)]" />
                <CardHeader className="relative z-10 pb-3">
                  <Badge className="w-fit rounded-full border border-[hsla(205,92%,56%,0.2)] bg-[hsla(205,92%,56%,0.12)] text-[hsl(var(--commerce-teal))]">
                    Deposit checklist
                  </Badge>
                  <CardTitle className="text-xl text-slate-800">Tips for a successful deposit</CardTitle>
                  <CardDescription>Follow these steps to avoid holds and ensure quick approval.</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-5 p-6">
                  <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-600 shadow-inner">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="mt-1 h-5 w-5 flex-shrink-0 text-[hsl(var(--commerce-teal))]" />
                      <div>
                        <p className="font-semibold text-slate-700">Capture with good lighting</p>
                        <p className="text-xs text-slate-500">Place the check on a dark, flat surface and keep all four corners visible.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <PenLine className="mt-1 h-5 w-5 flex-shrink-0 text-[hsl(var(--commerce-teal))]" />
                      <div>
                        <p className="font-semibold text-slate-700">Endorse correctly</p>
                        <p className="text-xs text-slate-500">Sign the back and write "For Commerce Bank Mobile Deposit Only".</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Receipt className="mt-1 h-5 w-5 flex-shrink-0 text-[hsl(var(--commerce-teal))]" />
                      <div>
                        <p className="font-semibold text-slate-700">Hold onto the paper check</p>
                        <p className="text-xs text-slate-500">Keep the physical check for 14 days in case we need additional review.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-xs text-slate-500 shadow-inner">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-700">Deposit limits</p>
                        <ul className="space-y-1 text-slate-500">
                          <li>• Up to $5,000 per check via mobile</li>
                          <li>• $7,500 total mobile deposits per rolling 30 days</li>
                          <li>• Branch deposits have no limit</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-xs text-slate-500 shadow-inner">
                    <p className="font-semibold text-slate-700">Need faster availability?</p>
                    <p>
                      Deposits made before 7:30 PM CT Mon-Sat begin processing immediately. Visit a branch for instant credit on
                      higher-value checks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(18,84,120,0.25)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(140,80%,40%,0.12)] via-transparent to-[hsla(195,92%,56%,0.08)]" />
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className="text-xl text-slate-800">Recent deposits</CardTitle>
                  <CardDescription>Track the status and availability of your deposits.</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 p-6">
                  {depositHistory.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500 shadow-inner">
                      No deposits yet. Your activity will appear here once you submit a check.
                    </div>
                  ) : (
                    depositHistory.map((deposit) => {
                      const statusStyles: Record<DepositStatus, string> = {
                        completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
                        processing: "border-sky-200 bg-sky-50 text-sky-700",
                        pending: "border-amber-200 bg-amber-50 text-amber-700",
                        failed: "border-rose-200 bg-rose-50 text-rose-700"
                      };

                      return (
                        <div
                          key={deposit.id}
                          className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition hover:border-[hsl(var(--commerce-teal))]/40 hover:shadow-lg"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {formatCurrency(deposit.amount)} • {getAccountDisplayName(deposit.accountId)}
                              </p>
                              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                                {deposit.type === "mobile" ? "Mobile deposit" : deposit.type === "atm" ? "ATM deposit" : "Branch deposit"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">Submitted {formatDate(deposit.submittedAt)}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span>Ref #{deposit.reference}</span>
                                {deposit.checkNumber && <span>Check #{deposit.checkNumber}</span>}
                                <span>Available {formatDate(deposit.availabilityDate)}</span>
                              </div>
                              {deposit.memo && (
                                <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                                  <span className="font-semibold text-slate-600">Memo:</span> {deposit.memo}
                                </p>
                              )}
                              {deposit.status === "failed" && deposit.failureReason && (
                                <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
                                  <span className="font-semibold">Needs attention:</span> {deposit.failureReason}
                                </p>
                              )}
                            </div>
                            <Badge className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[deposit.status]}`}>
                              {deposit.status === "completed" && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  Completed
                                </span>
                              )}
                              {deposit.status === "processing" && (
                                <span className="flex items-center gap-1">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Processing review
                                </span>
                              )}
                              {deposit.status === "pending" && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  Pending availability
                                </span>
                              )}
                              {deposit.status === "failed" && (
                                <span className="flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4" />
                                  Action required
                                </span>
                              )}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-none bg-white/85 shadow-[0_40px_80px_-60px_rgba(18,84,120,0.2)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsla(195,92%,56%,0.12)] via-transparent to-[hsla(140,80%,40%,0.08)]" />
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className="text-xl text-slate-800">Deposit insights</CardTitle>
                  <CardDescription>Overview of your recent mobile deposits.</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-5 p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-sm text-slate-600 shadow-inner">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Completed this month</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-800">{formatCurrency(depositStats.completed)}</p>
                      <p className="text-xs text-slate-400">Across {depositHistory.filter((d) => d.status === "completed").length} deposits</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-sm text-slate-600 shadow-inner">
                      <p className="text-xs uppercase tracking-wide text-slate-400">In review</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-800">{formatCurrency(depositStats.processing)}</p>
                      <p className="text-xs text-slate-400">
                        {depositHistory.filter((d) => d.status === "processing" || d.status === "pending").length} deposits awaiting approval
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 text-xs text-slate-500 shadow-inner">
                    <p className="font-semibold text-slate-700">Processing timeline</p>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[hsl(var(--commerce-teal))]">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Submit before 7:30 PM CT</p>
                          <p>Starts processing same day.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[hsl(var(--commerce-teal))]">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Standard review</p>
                          <p>Typically completes within 1 business day.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[hsl(var(--commerce-teal))]">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Funds available</p>
                          <p>Deposits appear instantly once cleared.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 text-xs text-slate-500 shadow-inner">
                    <p className="font-semibold text-slate-700">Need help?</p>
                    <p>
                      Chat with support in the app or call 800-000-COMM for assistance. Branch team members can also review mobile deposits on
                      the spot.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Scheduled Transfer Modal */}
      <Dialog open={showAddTransferModal} onOpenChange={setShowAddTransferModal}>
        <DialogContent className="sm:max-w-xl w-[92vw] max-w-[560px] max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0">
          <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-[hsla(195,92%,56%,0.25)] via-[hsla(195,92%,56%,0.10)] to-[hsla(150,60%,35%,0.18)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-20 z-0 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
          <DialogHeader className="relative z-10 pb-4 border-b border-slate-100">
            <DialogTitle>{editingTransfer ? 'Edit Scheduled Transfer' : 'Create Scheduled Transfer'}</DialogTitle>
            <DialogDescription>
              {editingTransfer ? 'Update your scheduled transfer details' : 'Set up a recurring transfer between your accounts'}
            </DialogDescription>
          </DialogHeader>
          <div className="relative z-10 space-y-5 py-4">
            {transferErrors.length > 0 && (
              <div className="rounded-xl border border-rose-300/60 bg-rose-50/80 p-3 text-sm text-rose-700 shadow-sm">
                <div className="font-semibold mb-1">Please fix the following</div>
                <ul className="list-disc pl-5 space-y-1">
                  {transferErrors.map((e) => (<li key={e}>{e}</li>))}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="transfer-from-account">From Account *</Label>
              <Select
                value={transferForm.fromAccountId}
                onValueChange={(value) => setTransferForm({ ...transferForm, fromAccountId: value })}
                disabled={!!editingTransfer}
              >
                <SelectTrigger id="transfer-from-account" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_number} • {account.account_type} · {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(account.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-to-account">To Account (optional)</Label>
              <Select
                value={transferForm.toAccountId}
                onValueChange={(value) => setTransferForm({ ...transferForm, toAccountId: value === 'external' ? '' : value })}
                disabled={!!editingTransfer}
              >
                <SelectTrigger id="transfer-to-account" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">External / Other</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_number} • {account.account_type} · {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(account.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!transferForm.toAccountId && (
              <div className="space-y-2">
                <Label htmlFor="transfer-to-description">To Description</Label>
                <Input
                  id="transfer-to-description"
                  value={transferForm.toDescription}
                  onChange={(e) => setTransferForm({ ...transferForm, toDescription: e.target.value })}
                  placeholder="E.g., Savings Account, Investment Account"
                  disabled={!!editingTransfer}
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount *</Label>
              <Input
                id="transfer-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={transferForm.amount}
                onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                placeholder="0.00"
                required
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-right text-lg font-semibold text-slate-700 shadow-inner"
              />
              <p className="text-[11px] text-slate-400">Enter the transfer amount in USD</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-frequency">Frequency *</Label>
              <Select
                value={transferForm.frequency}
                onValueChange={(value) => setTransferForm({ ...transferForm, frequency: value })}
              >
                <SelectTrigger id="transfer-frequency" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-next-date">Next Transfer Date *</Label>
              <Input
                id="transfer-next-date"
                type="date"
                value={transferForm.nextDate}
                onChange={(e) => setTransferForm({ ...transferForm, nextDate: e.target.value })}
                required
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-description">Description (optional)</Label>
              <Textarea
                id="transfer-description"
                value={transferForm.description}
                onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                placeholder="Add a note for this scheduled transfer"
                rows={3}
                className="min-h-[110px] rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 text-sm shadow-inner"
              />
            </div>
          </div>
          
          <div className="sticky bottom-0 -mx-6 mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-6 py-3 backdrop-blur sm:flex-row sm:justify-end rounded-b-2xl relative z-10">
            <Button variant="outline" className="rounded-full" onClick={() => setShowAddTransferModal(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full"
              onClick={() => editingTransfer ? handleUpdateTransfer() : handleCreateTransfer()}
              disabled={isSubmittingTransfer || !transferForm.fromAccountId || !transferForm.amount || !transferForm.frequency || !transferForm.nextDate}
            >
              {isSubmittingTransfer ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {editingTransfer ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                editingTransfer ? 'Update Transfer' : 'Create Transfer'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scheduled Bill Modal */}
      <Dialog open={showAddBillModal} onOpenChange={setShowAddBillModal}>
        <DialogContent className="sm:max-w-xl w-[92vw] max-w-[560px] max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0">
          <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-[hsla(48,96%,53%,0.25)] via-[hsla(48,96%,53%,0.10)] to-[hsla(165,82%,46%,0.2)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-20 z-0 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
          <DialogHeader className="relative z-10 pb-4 border-b border-slate-100">
            <DialogTitle>{editingBill ? 'Edit Scheduled Bill Payment' : 'Create Auto-Pay Bill'}</DialogTitle>
            <DialogDescription>
              {editingBill ? 'Update your scheduled bill payment details' : 'Set up automatic bill payments'}
            </DialogDescription>
          </DialogHeader>
          <div className="relative z-10 space-y-5 py-4">
            {billErrors.length > 0 && (
              <div className="rounded-xl border border-rose-300/60 bg-rose-50/80 p-3 text-sm text-rose-700 shadow-sm">
                <div className="font-semibold mb-1">Please fix the following</div>
                <ul className="list-disc pl-5 space-y-1">
                  {billErrors.map((e) => (<li key={e}>{e}</li>))}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="bill-from-account">From Account *</Label>
              <Select
                value={billForm.fromAccountId}
                onValueChange={(value) => setBillForm({ ...billForm, fromAccountId: value })}
                disabled={!!editingBill}
              >
                <SelectTrigger id="bill-from-account" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                  <SelectValue placeholder="Select payment account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_number} • {account.account_type} · {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(account.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-name">Bill Name *</Label>
              <Input
                id="bill-name"
                value={billForm.billName}
                onChange={(e) => setBillForm({ ...billForm, billName: e.target.value })}
                placeholder="E.g., Electric Company, Phone Bill"
                disabled={!!editingBill}
                required
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-type">Bill Type *</Label>
              <Select
                value={billForm.billType}
                onValueChange={(value) => setBillForm({ ...billForm, billType: value })}
                disabled={!!editingBill}
              >
                <SelectTrigger id="bill-type" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="cable">Cable/TV</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-amount">Amount *</Label>
              <Input
                id="bill-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                placeholder="0.00"
                required
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-right text-lg font-semibold text-slate-700 shadow-inner"
              />
              <p className="text-[11px] text-slate-400">Draft amount in USD</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-frequency">Frequency *</Label>
              <Select
                value={billForm.frequency}
                onValueChange={(value) => setBillForm({ ...billForm, frequency: value })}
              >
                <SelectTrigger id="bill-frequency" className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-next-date">Next Payment Date *</Label>
              <Input
                id="bill-next-date"
                type="date"
                value={billForm.nextDate}
                onChange={(e) => setBillForm({ ...billForm, nextDate: e.target.value })}
                required
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-payee-name">Payee Name (optional)</Label>
              <Input
                id="bill-payee-name"
                value={billForm.payeeName}
                onChange={(e) => setBillForm({ ...billForm, payeeName: e.target.value })}
                placeholder="Company or person name"
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-payee-account">Payee Account (optional)</Label>
              <Input
                id="bill-payee-account"
                value={billForm.payeeAccount}
                onChange={(e) => setBillForm({ ...billForm, payeeAccount: e.target.value })}
                placeholder="Account number or reference"
                className="h-12 rounded-xl border border-slate-200/70 bg-white/80 px-4 text-sm shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-description">Description (optional)</Label>
              <Textarea
                id="bill-description"
                value={billForm.description}
                onChange={(e) => setBillForm({ ...billForm, description: e.target.value })}
                placeholder="Add a note for this bill payment"
                rows={3}
                className="min-h-[110px] rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 text-sm shadow-inner"
              />
            </div>
          </div>
          
          <div className="sticky bottom-0 -mx-6 mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 px-6 py-3 backdrop-blur sm:flex-row sm:justify-end rounded-b-2xl relative z-10">
            <Button variant="outline" className="rounded-full" onClick={() => setShowAddBillModal(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full"
              onClick={() => editingBill ? handleUpdateBill() : handleCreateBill()}
              disabled={isSubmittingBill || !billForm.fromAccountId || !billForm.billName || !billForm.billType || !billForm.amount || !billForm.frequency || !billForm.nextDate}
            >
              {isSubmittingBill ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {editingBill ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                editingBill ? 'Update Bill' : 'Create Auto-Pay'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                              <p className="text-sm font-medium">Hello! I need help with transferring money.</p>
                            </div>
                            <div className="absolute -bottom-1 right-0 w-3 h-3 bg-blue-600 transform rotate-45"></div>
                          </div>
                        </div>
                        <div className="flex justify-start animate-in slide-in-from-left duration-300">
                          <div className="relative max-w-xs">
                            <div className="bg-white text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border-2 border-slate-200">
                              <p className="text-sm">Hi! I'd be happy to help you with money transfers. What specific issue are you experiencing?</p>
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
                  setOfferSubmitted(false);
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

      {/* Offer Application Form Dialog - Simplified version for Payments page */}
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

export default Payments;