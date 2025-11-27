import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface InactivityTimeoutModalProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

const InactivityTimeoutModal: React.FC<InactivityTimeoutModalProps> = ({
  isOpen,
  onStayLoggedIn,
  onLogout
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Session Timeout Warning</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            <div className="flex items-center space-x-2 text-amber-600">
              <Clock className="h-4 w-4" />
              <span>You have been inactive for 5 minutes.</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              For your security, you will be automatically logged out in 30 seconds. 
              Click "Stay Logged In" to continue your session.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={onStayLoggedIn}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Stay Logged In
          </Button>
          <Button 
            onClick={onLogout}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            Logout Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InactivityTimeoutModal;
