import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, PiggyBank, DollarSign } from "lucide-react";

interface Account {
  id: string;
  account_number: string;
  account_type: 'checking' | 'savings' | 'credit' | 'basic_checking' | 'premium_checking' | 'student_checking' | 'high_yield_savings' | 'money_market' | 'cash_back_card' | 'travel_rewards_card' | 'student_credit_card';
  balance: number;
  created_at: string;
  status?: string;
  credit_limit?: number;
}

interface AccountCardProps {
  account: Account;
}

const AccountCard = ({ account }: AccountCardProps) => {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'basic_checking':
      case 'premium_checking':
      case 'student_checking':
        return <CreditCard className="h-6 w-6" />;
      case 'savings':
      case 'high_yield_savings':
      case 'money_market':
        return <PiggyBank className="h-6 w-6" />;
      case 'credit':
      case 'cash_back_card':
      case 'travel_rewards_card':
      case 'student_credit_card':
        return <DollarSign className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking':
      case 'basic_checking':
      case 'premium_checking':
      case 'student_checking':
        return 'text-blue-600';
      case 'savings':
      case 'high_yield_savings':
      case 'money_market':
        return 'text-green-600';
      case 'credit':
      case 'cash_back_card':
      case 'travel_rewards_card':
      case 'student_credit_card':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'credit':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Handle "no account found" status
  if (account.status === 'No account found') {
    return (
      <Card className="relative overflow-hidden border-none bg-white/75 backdrop-blur-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(12,74,110,0.6)] opacity-60">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/40 via-white/70 to-white/30" />
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                {getAccountIcon(account.account_type)}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-700">
                  {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} Account
                </CardTitle>
                <CardDescription className="text-slate-400">N/A</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="rounded-full border-slate-200 text-slate-400">
              Unavailable
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <p className="text-lg font-semibold text-slate-400">No account found</p>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200/60 bg-white/80 p-4 text-sm text-slate-500">
            This account type is not currently available for your profile. Contact support to learn more about eligibility requirements.
          </div>
        </CardContent>
      </Card>
    );
  }

  const accountLabel = account.account_type === 'basic_checking'
    ? 'Basic Checking'
    : account.account_type === 'premium_checking'
    ? 'Premium Checking'
    : account.account_type === 'student_checking'
    ? 'Student Checking'
    : account.account_type === 'high_yield_savings'
    ? 'High-Yield Savings'
    : account.account_type === 'money_market'
    ? 'Money Market'
    : account.account_type === 'cash_back_card'
    ? 'Cash Back Card'
    : account.account_type === 'travel_rewards_card'
    ? 'Travel Rewards Card'
    : account.account_type === 'student_credit_card'
    ? 'Student Credit Card'
    : account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1);

  const accountTitle = account.account_type.includes('card')
    ? accountLabel
    : `${accountLabel} Account`;

  const balanceColor = account.balance < 0 ? 'text-rose-500' : 'text-emerald-500';

  const availableCredit =
    account.credit_limit !== undefined
      ? account.credit_limit - Math.abs(account.balance)
      : null;

  return (
    <Card className="group relative overflow-hidden border-none bg-white/75 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-40px_rgba(12,74,110,0.55)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsla(150,60%,35%,0.18)] via-[hsla(180,70%,45%,0.12)] to-[hsla(195,100%,50%,0.08)] opacity-90" />
      <CardHeader className="relative z-10 border-b border-white/40 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 text-[hsl(var(--commerce-green))] shadow-inner shadow-white/40 backdrop-blur-sm`}
            >
              {getAccountIcon(account.account_type)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                {accountTitle}
              </CardTitle>
              <CardDescription className="text-sm tracking-wide text-slate-500">
                {account.account_number}
              </CardDescription>
            </div>
          </div>
          <Badge variant={getBadgeVariant(account.account_type)} className="rounded-full px-3 py-1 text-xs uppercase tracking-wide">
            {accountLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Balance</p>
            <p className={`mt-2 text-2xl font-bold ${balanceColor}`}>
              ${Math.abs(account.balance).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Updated {new Date().toLocaleDateString()}</p>
          </div>

          <div className="rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Opened</p>
            <p className="mt-2 text-lg font-semibold text-slate-700">
              {new Date(account.created_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-400">Account tenure {(new Date().getFullYear() - new Date(account.created_at).getFullYear()) || 0} yrs</p>
          </div>
        </div>

        {(account.account_type === 'credit' ||
          account.account_type === 'cash_back_card' ||
          account.account_type === 'travel_rewards_card' ||
          account.account_type === 'student_credit_card') &&
          account.credit_limit && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Credit Limit</p>
                <p className="mt-2 text-lg font-semibold text-slate-700">
                  ${account.credit_limit.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Available Credit</p>
                <p className={`mt-2 text-lg font-semibold ${availableCredit !== null && availableCredit > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  ${availableCredit !== null ? availableCredit.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          )}

        {account.balance < 0 && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-600">
            <div className="flex items-center gap-2 font-medium">
              <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
              Overdraft Fee Applied
            </div>
            <p className="mt-2 text-xs">
              $35 overdraft fee charged. Deposit funds to avoid additional fees.
            </p>
          </div>
        )}

        {account.balance >= 0 &&
          account.balance < 100 &&
          !['credit', 'cash_back_card', 'travel_rewards_card', 'student_credit_card'].includes(account.account_type) && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-600">
              <div className="flex items-center gap-2 font-medium">
                <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
                Low Balance Alert
              </div>
              <p className="mt-2 text-xs">
                Balance below $100. Consider transferring funds to avoid fees.
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default AccountCard;
