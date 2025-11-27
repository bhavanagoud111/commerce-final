import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRightLeft, CreditCard } from "lucide-react";

interface Transaction {
  id: string;
  from_account_id: string | null;
  to_account_id: string | null;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  from_account_number?: string;
  to_account_number?: string;
  from_account_type?: string;
  to_account_type?: string;
  from_user_name?: string;
  from_username?: string;
  to_user_name?: string;
  to_username?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  userAccountIds?: string[];
}

const TransactionCard = ({ transaction, userAccountIds = [] }: TransactionCardProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'withdrawal':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'transfer':
        return <ArrowRightLeft className="h-5 w-5 text-blue-600" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      default:
        return <ArrowRightLeft className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAccountNumber = (accountNumber: string) => {
    return `****${accountNumber.slice(-4)}`;
  };

  const getTransactionDescription = () => {
    if (transaction.transaction_type === 'transfer') {
      // For incoming transactions, show "Money received from [username]"
      if (isIncoming && transaction.from_username) {
        return `Money received from ${transaction.from_username}`;
      }
      // For outgoing transactions, show "Money sent to [username]"
      if (isOutgoing && transaction.to_username) {
        return `Money sent to ${transaction.to_username}`;
      }
      // Fallback to account numbers if usernames not available
      if (isIncoming && transaction.from_account_number) {
        return `Amount received from ${formatAccountNumber(transaction.from_account_number)}`;
      }
      if (isOutgoing && transaction.to_account_number) {
        return `Transfer to ${formatAccountNumber(transaction.to_account_number)}`;
      }
      // Fallback for internal transfers
      if (transaction.from_account_number && transaction.to_account_number) {
        return `Transfer from ${formatAccountNumber(transaction.from_account_number)} to ${formatAccountNumber(transaction.to_account_number)}`;
      }
      return 'Account Transfer';
    }
    return transaction.description || 'Transaction';
  };

  // Determine if transaction is incoming or outgoing from user's perspective
  const isUserSender = userAccountIds.includes(transaction.from_account_id);
  const isUserReceiver = userAccountIds.includes(transaction.to_account_id);
  
  const isOutgoing = isUserSender && !isUserReceiver;
  const isIncoming = !isUserSender && isUserReceiver;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isOutgoing ? 'bg-red-100' : isIncoming ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {getTransactionIcon(transaction.transaction_type)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{getTransactionDescription()}</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-gray-600">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
                <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-bold text-lg ${
              isOutgoing ? 'text-red-600' : isIncoming ? 'text-green-600' : 'text-blue-600'
            }`}>
              {isOutgoing ? '-' : isIncoming ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {transaction.transaction_type}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
