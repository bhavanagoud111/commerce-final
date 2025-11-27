import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseInactivityTimeoutProps {
  timeoutMinutes?: number;
  onTimeout?: () => void;
}

export const useInactivityTimeout = ({ 
  timeoutMinutes = 5, 
  onTimeout 
}: UseInactivityTimeoutProps = {}) => {
  const { isAuthenticated, logout } = useAuth();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Only set timeout if user is authenticated
    if (isAuthenticated) {
      // Set warning timeout (4 minutes 30 seconds)
      warningTimeoutRef.current = setTimeout(() => {
        setShowTimeoutModal(true);
      }, (timeoutMinutes - 0.5) * 60 * 1000);

      // Set logout timeout (5 minutes)
      timeoutRef.current = setTimeout(() => {
        if (onTimeout) {
          onTimeout();
        } else {
          logout();
        }
      }, timeoutMinutes * 60 * 1000);
    }
  };

  const handleActivity = () => {
    if (isAuthenticated) {
      resetTimeout();
      setShowTimeoutModal(false);
    }
  };

  const handleStayLoggedIn = () => {
    setShowTimeoutModal(false);
    resetTimeout();
  };

  const handleLogout = () => {
    setShowTimeoutModal(false);
    logout();
  };

  useEffect(() => {
    if (isAuthenticated) {
      resetTimeout();

      // Add event listeners for user activity
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click'
      ];

      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
      };
    } else {
      // Clear timeouts when not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      setShowTimeoutModal(false);
    }
  }, [isAuthenticated]);

  return {
    showTimeoutModal,
    handleStayLoggedIn,
    handleLogout
  };
};
