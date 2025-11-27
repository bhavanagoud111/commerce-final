import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import InactivityTimeoutModal from './InactivityTimeoutModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  
  const {
    showTimeoutModal,
    handleStayLoggedIn,
    handleLogout
  } = useInactivityTimeout({
    timeoutMinutes: 5,
    onTimeout: () => {
      console.log('Session timed out due to inactivity');
    }
  });

  useEffect(() => {
    console.log('ProtectedRoute: isInitialized =', isInitialized, 'isAuthenticated =', isAuthenticated);
    
    // Only check authentication after initialization is complete
    if (isInitialized && !isAuthenticated) {
      console.log('User not authenticated after initialization, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Show loading while initializing authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after initialization, don't render anything (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {children}
      <InactivityTimeoutModal
        isOpen={showTimeoutModal}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
};

export default ProtectedRoute;
