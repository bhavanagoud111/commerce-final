import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
}

interface TransferModalProps {
  accounts: Account[];
  onTransferSuccess: () => void;
  renderInline?: boolean;
}

const TransferModal = ({ accounts, onTransferSuccess, renderInline = false }: TransferModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const resetForm = () => {
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setDescription("");
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: parseFloat(amount),
          description: description || 'Account transfer'
        })
      });

      const result = await response.json();

      if (result.success) {
        const transferAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));
        toast({
          title: "Transfer completed",
          description: `${amount || "Funds"} moved from your ${fromAccountData?.account_type ?? "account"} successfully.`,
        });
        addNotification({
          type: 'transfer_success',
          title: 'Transfer Completed',
          message: `Successfully transferred ${transferAmount} from ${fromAccountData?.account_number || 'your account'} to ${toAccountData?.account_number || 'destination account'}.`,
          priority: 'medium'
        });
        if (!renderInline) {
          setIsOpen(false);
        }
        resetForm();
        onTransferSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Transfer failed",
          description: result.message || "Please check the details and try again.",
        });
        addNotification({
          type: 'transfer_failed',
          title: 'Transfer Failed',
          message: result.message || `Failed to transfer ${amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount)) : 'funds'}. Please try again.`,
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Error transferring money:', error);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "We couldn't complete the transfer. Please try again.",
      });
      addNotification({
        type: 'transfer_failed',
        title: 'Transfer Failed',
        message: 'Network error occurred. Please check your connection and try again.',
        priority: 'high'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fromAccountData = accounts.find(acc => acc.id === fromAccount);
  const toAccountData = accounts.find(acc => acc.id === toAccount);

  const formContent = (
    <form onSubmit={handleTransfer} className="space-y-6">
      <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-[hsl(var(--commerce-green)_/_0.08)] via-white to-white p-5 shadow-inner flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Badge className="rounded-full px-3 py-1 text-xs uppercase tracking-wider bg-[hsl(var(--commerce-green)_/_0.15)] text-[hsl(var(--commerce-green))] border-none">
            Internal Transfer
          </Badge>
          <span className="text-xs font-semibold text-slate-500">Instant • No fees</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Choose the accounts and enter an amount to move funds securely within Commerce Bank.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur">
          <Label htmlFor="fromAccount" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            From Account
          </Label>
          <Select value={fromAccount} onValueChange={setFromAccount} required>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select source account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} -
                  {account.account_number} (${account.balance.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fromAccountData && (
            <p className="mt-3 text-xs font-medium text-[hsl(var(--commerce-green))]">
              Available balance: ${fromAccountData.balance.toFixed(2)}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur">
          <Label htmlFor="toAccount" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            To Account
          </Label>
          <Select value={toAccount} onValueChange={setToAccount} required>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select destination account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.filter(acc => acc.id !== fromAccount).map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} -
                  {account.account_number} (${account.balance.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toAccountData && (
            <p className="mt-3 text-xs text-slate-500">
              Current balance: ${toAccountData.balance.toFixed(2)}
            </p>
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
            max={fromAccountData?.balance || 0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="mt-2 text-lg font-semibold"
          />
          {fromAccountData && (
            <p className="mt-3 text-xs text-slate-400">
              Maximum transferable: ${fromAccountData.balance.toFixed(2)}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200/60 bg-white/60 p-4 backdrop-blur">
          <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a note for your records"
            rows={3}
            className="mt-2"
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2'>
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
          className="h-12 rounded-full border-[hsl(var(--commerce-green))]/40 text-[hsl(var(--commerce-green))]"
        >
          {renderInline ? 'Clear' : 'Cancel'}
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !fromAccount ||
            !toAccount ||
            !amount ||
            fromAccount === toAccount
          }
          className="h-12 rounded-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Transferring...
            </>
          ) : (
            <>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transfer
            </>
          )}
        </Button>
      </div>
    </form>
  );

  if (renderInline) {
    return (
      <div className="space-y-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        {formContent}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Transfer Between Accounts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Between Accounts</DialogTitle>
          <DialogDescription>
            Move money between your own accounts.
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
