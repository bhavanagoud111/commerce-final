import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface SendMoneyModalProps {
  accounts: Account[];
  onSendSuccess: () => void;
  renderInline?: boolean;
}

const SendMoneyModal = ({ accounts, onSendSuccess, renderInline = false }: SendMoneyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<User | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'not_found'>('idle');
  const { addNotification } = useNotifications();

  // Filter accounts to only show checking accounts
  const checkingAccounts = accounts.filter(account => 
    account.account_type === 'checking' || 
    account.account_type === 'basic_checking' || 
    account.account_type === 'premium_checking' || 
    account.account_type === 'student_checking'
  );

  const resetForm = () => {
    setRecipientEmail("");
    setSelectedAccount("");
    setAmount("");
    setDescription("");
    setRecipientInfo(null);
    setVerificationStatus('idle');
    setShowConfirmation(false);
  };

  const verifyRecipient = async () => {
    if (!recipientEmail) return;

    setVerificationStatus('verifying');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/verify-recipient', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: recipientEmail
        })
      });

      const result = await response.json();

      if (result.success && result.user) {
        setRecipientInfo(result.user);
        setVerificationStatus('verified');
      } else {
        setRecipientInfo(null);
        setVerificationStatus('not_found');
      }
    } catch (error) {
      console.error('Error verifying recipient:', error);
      setVerificationStatus('not_found');
    }
  };

  const handleSendMoney = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/send-money', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromAccountId: selectedAccount,
          toEmail: recipientEmail,
          amount: parseFloat(amount),
          description: description || `Payment to ${recipientInfo?.name || recipientEmail}`
        })
      });

      const result = await response.json();

      if (result.success) {
        const transferAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));
        toast({
          title: "Transfer sent!",
          description: `${amount || "Funds"} will arrive shortly at ${recipientEmail}.`,
        });
        addNotification({
          type: 'transaction_success',
          title: 'Money Sent Successfully',
          message: `Successfully sent ${transferAmount} to ${recipientInfo?.name || recipientEmail}. The funds will arrive shortly.`,
          priority: 'medium'
        });
        if (!renderInline) {
          setIsOpen(false);
        }
        resetForm();
        onSendSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Transfer failed",
          description: result.message || "Please review the details and try again.",
        });
        addNotification({
          type: 'transaction_failed',
          title: 'Money Transfer Failed',
          message: result.message || `Failed to send ${amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount)) : 'funds'} to ${recipientEmail}. Please try again.`,
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Error sending money:', error);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "We couldn't complete the transfer. Please try again.",
      });
      addNotification({
        type: 'transaction_failed',
        title: 'Money Transfer Failed',
        message: 'Network error occurred while sending money. Please check your connection and try again.',
        priority: 'high'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  const primaryContent = !showConfirmation ? (
    <form onSubmit={(e) => { e.preventDefault(); verifyRecipient(); }} className="space-y-6">
      <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-[hsl(var(--commerce-teal)_/_0.08)] via-white to-white p-5 shadow-inner flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Badge className="rounded-full px-3 py-1 text-xs uppercase tracking-wider bg-[hsl(var(--commerce-teal)_/_0.15)] text-[hsl(var(--commerce-teal))] border-none">
            External Transfer
          </Badge>
          <span className="text-xs font-semibold text-slate-500">Secure & Verified</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Send money to another Commerce Bank customer using their registered email.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur">
          <Label htmlFor="account" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            From Account (Checking Only)
          </Label>
          <Select value={selectedAccount} onValueChange={setSelectedAccount} required>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select checking account" />
            </SelectTrigger>
            <SelectContent>
              {checkingAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} -
                  {account.account_number} (${account.balance.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAccountData && (
            <p className="mt-3 text-xs font-medium text-[hsl(var(--commerce-green))]">
              Available balance: ${selectedAccountData.balance.toFixed(2)}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recipient Email
          </Label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              id="email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
              required
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={verifyRecipient}
              disabled={!recipientEmail || verificationStatus === 'verifying'}
              className="h-11 rounded-full border-[hsl(var(--commerce-teal))]/40 text-[hsl(var(--commerce-teal))]"
            >
              {verificationStatus === 'verifying' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </Button>
          </div>

          {verificationStatus === 'verified' && recipientInfo && (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50/80 p-3 text-sm text-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Verified recipient: {recipientInfo.name} ({recipientInfo.email})</span>
              </div>
            </div>
          )}

          {verificationStatus === 'not_found' && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>No Commerce Bank account found for this email</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur">
          <Label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="mt-2 text-lg font-semibold"
          />
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200/60 bg-white/60 p-4 backdrop-blur">
          <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a memo for your recipient"
            rows={3}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (renderInline) {
              resetForm();
            } else {
              setIsOpen(false);
            }
          }}
          className="h-12 rounded-full border-[hsl(var(--commerce-teal))]/40 text-[hsl(var(--commerce-teal))]"
        >
          {renderInline ? 'Clear' : 'Cancel'}
        </Button>
        <Button
          type="submit"
          disabled={!selectedAccount || !recipientEmail || !amount || verificationStatus !== 'verified'}
          className="h-12 rounded-full"
          onClick={() => setShowConfirmation(true)}
        >
          Continue
        </Button>
      </div>
    </form>
  ) : (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-inner backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <Badge className="rounded-full px-3 py-1 text-xs uppercase tracking-wider bg-[hsl(var(--commerce-teal)_/_0.15)] text-[hsl(var(--commerce-teal))] border-none">
            Confirm Details
          </Badge>
          <span className="text-xs font-semibold text-slate-500">Review before sending</span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">From</span>
            <span className="font-semibold text-slate-800">{selectedAccountData?.account_type} - {selectedAccountData?.account_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">To</span>
            <span className="font-semibold text-slate-800">{recipientInfo?.name} ({recipientInfo?.email})</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-medium text-slate-500">Amount</span>
            <span className="font-semibold text-[hsl(var(--commerce-green))]">${parseFloat(amount).toFixed(2)}</span>
          </div>
          {description && (
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Memo</span>
              <span className="text-slate-700">{description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-yellow-200 bg-yellow-50/80 p-4 text-sm text-yellow-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>Transfers to verified users are usually instant. Double-check the recipient before confirming.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowConfirmation(false)}
          className="h-12 rounded-full border-[hsl(var(--commerce-teal))]/40 text-[hsl(var(--commerce-teal))]"
        >
          Back
        </Button>
        <Button
          onClick={handleSendMoney}
          disabled={isSubmitting}
          className="h-12 rounded-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Confirm Send
            </>
          )}
        </Button>
      </div>
    </div>
  );

  if (renderInline) {
    return (
      <div className="space-y-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        {primaryContent}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Send Money
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Money to External Account</DialogTitle>
          <DialogDescription>
            Send money to another Commerce Bank account holder by email.
          </DialogDescription>
        </DialogHeader>
        {primaryContent}
      </DialogContent>
    </Dialog>
  );
};

export default SendMoneyModal;
