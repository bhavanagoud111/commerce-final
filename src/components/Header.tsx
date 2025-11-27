import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MapPin, ArrowRight, User, Bell, Sparkles, CheckCircle, AlertCircle, Download, Shield, X, CreditCard, FileText, DollarSign, Building2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BranchLocator from "./BranchLocator";
import { useNotifications } from "@/contexts/NotificationContext";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showBranchLocator, setShowBranchLocator] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  // Define search categories and their corresponding pages
  const searchCategories = {
    // Banking services
    'checking': { url: '/personal-banking', description: 'Personal checking accounts' },
    'savings': { url: '/personal-banking', description: 'High-yield savings accounts' },
    'credit card': { url: '/personal-banking', description: 'Credit cards and rewards' },
    'loan': { url: '/personal-banking', description: 'Personal and auto loans' },
    'mortgage': { url: '/personal-banking', description: 'Home loans and mortgages' },
    'account': { url: '/accounts', description: 'Account management' },
    'banking': { url: '/personal-banking', description: 'Personal banking services' },
    'personal': { url: '/personal-banking', description: 'Personal banking' },
    
    // Business services
    'business': { url: '/business-banking', description: 'Business banking solutions' },
    'corporate': { url: '/corporate-banking', description: 'Corporate banking services' },
    'commercial': { url: '/business-banking', description: 'Commercial banking' },
    'enterprise': { url: '/corporate-banking', description: 'Enterprise solutions' },
    'treasury': { url: '/corporate-banking', description: 'Treasury management' },
    'capital markets': { url: '/corporate-banking', description: 'Capital markets services' },
    'risk management': { url: '/corporate-banking', description: 'Risk management solutions' },
    'international': { url: '/corporate-banking', description: 'International banking' },
    
    // Support
    'help': { url: '/support', description: 'Help and support' },
    'support': { url: '/support', description: 'Customer support' },
    'contact': { url: '/support', description: 'Contact us' },
    'customer service': { url: '/support', description: 'Customer service' },
    'faq': { url: '/support', description: 'Frequently asked questions' },
    'fraud': { url: '/support', description: 'Fraud protection' },
    'report': { url: '/support', description: 'Report issues' },
    
    // Payments and transfers
    'transfer': { url: '/payments', description: 'Money transfers' },
    'payment': { url: '/payments', description: 'Payment services' },
    'send money': { url: '/payments', description: 'Send money to others' },
    'pay bills': { url: '/payments', description: 'Bill payment services' },
    'wire': { url: '/payments', description: 'Wire transfers' },
    'ach': { url: '/payments', description: 'ACH transfers' },
    
    // Accounts and profile
    'profile': { url: '/profile', description: 'User profile settings' },
    'statements': { url: '/accounts', description: 'Account statements' },
    'transactions': { url: '/accounts', description: 'Transaction history' },
    'balance': { url: '/accounts', description: 'Account balances' },
    'history': { url: '/accounts', description: 'Transaction history' },
    
    // Wealth management
    'investment': { url: '/wealth-management', description: 'Investment services' },
    'wealth': { url: '/wealth-management', description: 'Wealth management' },
    'retirement': { url: '/wealth-management', description: 'Retirement planning' },
    'portfolio': { url: '/wealth-management', description: 'Portfolio management' },
    'advisor': { url: '/wealth-management', description: 'Financial advisors' },
    'planning': { url: '/wealth-management', description: 'Financial planning' },
    
    // Services
    'services': { url: '/all-services', description: 'All banking services' },
    'cards': { url: '/services/banking-cards', description: 'Banking cards' },
    'security': { url: '/services/digital-security', description: 'Digital security' },
    'investment services': { url: '/services/investment-services', description: 'Investment services' },
    'mortgages': { url: '/services/mortgages-loans', description: 'Mortgages and loans' },
    'wealth management': { url: '/services/wealth-management', description: 'Wealth management services' },
    
    // Homepage/Dashboard
    'home': { url: '/dashboard', description: 'Home dashboard' },
    'dashboard': { url: '/dashboard', description: 'Account dashboard' },
    'main': { url: '/dashboard', description: 'Main dashboard' },
    'overview': { url: '/dashboard', description: 'Account overview' }
  };

  // Generate suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      const matches = Object.entries(searchCategories)
        .filter(([keyword, data]) => 
          keyword.toLowerCase().includes(query) || 
          data.description.toLowerCase().includes(query)
        )
        .slice(0, 8) // Limit to 8 suggestions
        .map(([keyword, data]) => ({
          keyword,
          url: data.url,
          description: data.description
        }));
      
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.keyword);
    setShowSuggestions(false);
    navigate(suggestion.url);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Find exact match first
      let redirectUrl = '/dashboard';
      let found = false;
      
      for (const [keyword, data] of Object.entries(searchCategories)) {
        if (query === keyword.toLowerCase()) {
          redirectUrl = data.url;
          found = true;
          break;
        }
      }
      
      // If no exact match, find partial match
      if (!found) {
        for (const [keyword, data] of Object.entries(searchCategories)) {
          if (keyword.toLowerCase().includes(query)) {
            redirectUrl = data.url;
            break;
          }
        }
      }

      setShowSuggestions(false);
      navigate(redirectUrl);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="relative z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl shadow-[0_12px_30px_-20px_rgba(15,23,42,0.25)]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

      {/* Top Utility Bar */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50 to-sky-50/80">
        <div className="container mx-auto px-4 py-2 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wide text-xs text-emerald-500">New</span>
            <p className="text-slate-500">Earn 4.5% APY with Commerce High-Yield Savings</p>
          </div>
          <div className="flex items-center gap-4">
            <div ref={searchRef} className="relative hidden sm:block">
              <form onSubmit={handleSearch} className="relative">
                <Search 
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-emerald-500 hover:text-emerald-600" 
                  onClick={handleSearch}
                />
                <Input 
                  placeholder="Search Commerce" 
                  className="h-9 w-64 rounded-full border-slate-200/70 bg-white/80 pl-10 text-sm shadow-inner focus-visible:ring-emerald-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                />
              </form>
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200/70 bg-white/95 shadow-xl backdrop-blur"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer border-b border-slate-100/80 px-4 py-3 transition-colors last:border-b-0 ${
                        index === selectedIndex ? "border-emerald-200 bg-emerald-50/80" : "hover:bg-slate-50/80"
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {suggestion.keyword}
                          </div>
                          <div className="text-sm text-slate-500">
                            {suggestion.description}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!isHomePage && (
              <>
                <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full border border-slate-200/70 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-white shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end" sideOffset={5}>
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="h-7 text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <Bell className="h-12 w-12 text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-600">No notifications</p>
                      <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notification) => {
                        const getIcon = () => {
                          switch (notification.type) {
                            case 'transaction_success':
                            case 'transfer_success':
                              return <CheckCircle className="h-5 w-5 text-emerald-500" />;
                            case 'transaction_failed':
                            case 'transfer_failed':
                              return <AlertCircle className="h-5 w-5 text-red-500" />;
                            case 'password_changed':
                              return <Shield className="h-5 w-5 text-blue-500" />;
                            case 'statement_downloaded':
                            case 'csv_downloaded':
                            case 'pdf_downloaded':
                              return <Download className="h-5 w-5 text-teal-500" />;
                            case 'deposit_success':
                              return <CreditCard className="h-5 w-5 text-green-500" />;
                            case 'deposit_failed':
                              return <AlertCircle className="h-5 w-5 text-red-500" />;
                            case 'bill_paid':
                              return <FileText className="h-5 w-5 text-purple-500" />;
                            case 'loan_application':
                              return <DollarSign className="h-5 w-5 text-emerald-500" />;
                            case 'business_application':
                              return <Building2 className="h-5 w-5 text-blue-500" />;
                            default:
                              return <Bell className="h-5 w-5 text-slate-400" />;
                          }
                        };

                        const getTypeColor = () => {
                          switch (notification.type) {
                            case 'transaction_success':
                            case 'transfer_success':
                            case 'deposit_success':
                              return 'bg-emerald-50 border-emerald-200';
                            case 'transaction_failed':
                            case 'transfer_failed':
                            case 'deposit_failed':
                              return 'bg-red-50 border-red-200';
                            case 'password_changed':
                              return 'bg-blue-50 border-blue-200';
                            case 'statement_downloaded':
                            case 'csv_downloaded':
                            case 'pdf_downloaded':
                              return 'bg-teal-50 border-teal-200';
                            case 'loan_application':
                              return 'bg-purple-50 border-purple-200';
                            case 'business_application':
                              return 'bg-blue-50 border-blue-200';
                            default:
                              return notification.read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200';
                          }
                        };

                        const formatTime = (date: Date) => {
                          const now = new Date();
                          const diff = now.getTime() - date.getTime();
                          const minutes = Math.floor(diff / 60000);
                          const hours = Math.floor(minutes / 60);
                          const days = Math.floor(hours / 24);

                          if (minutes < 1) return 'Just now';
                          if (minutes < 60) return `${minutes}m ago`;
                          if (hours < 24) return `${hours}h ago`;
                          if (days < 7) return `${days}d ago`;
                          return date.toLocaleDateString();
                        };

                        return (
                          <div
                            key={notification.id}
                            className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                              !notification.read ? getTypeColor() : 'bg-white'
                            }`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getIcon()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4 className={`text-sm font-semibold ${
                                      notification.read ? 'text-slate-600' : 'text-slate-900'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <p className={`text-xs mt-1 ${
                                      notification.read ? 'text-slate-500' : 'text-slate-700'
                                    }`}>
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                      {formatTime(notification.timestamp)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-slate-200/70 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600"
              onClick={() => navigate("/profile")}
              aria-label="Profile & Settings"
            >
              <User className="h-4 w-4" />
            </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 text-slate-500 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
              onClick={() => setShowBranchLocator(true)}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Find a Branch or ATM
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer transition hover:opacity-90"
            onClick={() => window.location.href = '/dashboard'}
            title="Go to Homepage"
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 shadow-lg shadow-emerald-500/30">
              <div className="absolute inset-0 animate-pulse rounded-full bg-white/10" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[hsl(var(--commerce-green))] font-semibold">
                CB
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Commerce Bank</h1>
              <p className="text-xs font-medium uppercase tracking-widest text-emerald-500">
                Digital Banking Suite
              </p>
            </div>
          </div>

          <div />
        </div>
      </div>

      {/* FDIC Notice */}
      <div className="border-t border-slate-100 bg-white/70">
        <div className="container mx-auto px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
          <span className="font-semibold text-emerald-500">FDIC Insured</span> · Backed by the full faith and credit of the U.S. Government
        </div>
      </div>

      {/* Branch Locator Modal */}
      <BranchLocator 
        isOpen={showBranchLocator} 
        onClose={() => setShowBranchLocator(false)} 
      />
    </header>
  );
};

export default Header;