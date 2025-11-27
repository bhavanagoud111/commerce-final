import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, CheckCircle, AlertCircle, Info, CreditCard, DollarSign, Shield, User, Building2 } from 'lucide-react';

type NotificationCategory =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'transaction'
  | 'password_change'
  | 'account_created'
  | 'loan_application'
  | 'business_application'
  | 'security_alert';

type NotificationPriority = 'low' | 'medium' | 'high';

interface Notification {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  created_at: string;
  is_read: number | boolean;
  priority?: NotificationPriority;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications');
        // Fallback to sample notifications
        setNotifications(getSampleNotifications());
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to sample notifications
      setNotifications(getSampleNotifications());
    } finally {
      setIsLoading(false);
    }
  };

  // Sample notifications for demonstration
  const getSampleNotifications = (): Notification[] => [
    {
      id: '1',
      type: 'transaction',
      title: 'Transaction Completed',
      message: 'Your transfer of $150.00 to John Doe has been processed successfully.',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      is_read: 0,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'password_change',
      title: 'Password Updated',
      message: 'Your password was successfully changed. If this wasn\'t you, please contact support immediately.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      is_read: 0,
      priority: 'high'
    },
    {
      id: '3',
      type: 'account_created',
      title: 'New Account Opened',
      message: 'Your Cash Back Credit Card application has been approved and your account is now active.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      is_read: 1,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'loan_application',
      title: 'Loan Application Received',
      message: 'Your personal loan application for $10,000 has been received and is under review.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      is_read: 1,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'security_alert',
      title: 'Security Alert',
      message: 'Unusual login activity detected from a new device. Please verify this was you.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      is_read: 1,
      priority: 'high'
    }
  ];

  const isNotificationRead = (notification: Notification) => {
    if (typeof notification.is_read === 'boolean') {
      return notification.is_read;
    }
    return notification.is_read === 1;
  };

  const formatTypeLabel = (type: NotificationCategory) =>
    type
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      await fetch(`http://localhost:3001/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await fetch('http://localhost:3001/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: NotificationCategory) => {
    switch (type) {
      case 'transaction':
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case 'password_change':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'account_created':
        return <User className="h-4 w-4 text-emerald-600" />;
      case 'loan_application':
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'business_application':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'security_alert':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'success':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTypeColor = (type: NotificationCategory) => {
    switch (type) {
      case 'transaction':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'password_change':
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'account_created':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'loan_application':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'business_application':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'security_alert':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) {
      return 'Just now';
    }

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !isNotificationRead(n)).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  Mark All Read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No notifications yet</p>
              <p className="text-sm">You'll see important updates about your account here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const read = isNotificationRead(notification);

                return (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTypeColor(notification.type)}`}
                          >
                            {formatTypeLabel(notification.type)}
                          </Badge>
                          {!read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${
                        read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(notification.created_at)}
                        </span>
                        {!read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
