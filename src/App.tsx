import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import BankingCards from "./pages/services/BankingCards";
import MortgagesLoans from "./pages/services/MortgagesLoans";
import InvestmentServices from "./pages/services/InvestmentServices";
import BusinessBankingService from "./pages/services/BusinessBanking";
import WealthManagementService from "./pages/services/WealthManagement";
import DigitalSecurity from "./pages/services/DigitalSecurity";
import PersonalBanking from "./pages/PersonalBanking";
import WealthManagement from "./pages/WealthManagement";
import BusinessBanking from "./pages/BusinessBanking";
import CorporateBanking from "./pages/CorporateBanking";
import AllServices from "./pages/AllServices";
import About from "./pages/About";
import Leadership from "./pages/Leadership";
import Careers from "./pages/Careers";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Security from "./pages/Security";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
import Disclosures from "./pages/Disclosures";
import SiteMap from "./pages/SiteMap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/support" element={<Support />} />
            <Route path="/services/banking-cards" element={<BankingCards />} />
            <Route path="/services/mortgages-loans" element={<MortgagesLoans />} />
            <Route path="/services/investment-services" element={<InvestmentServices />} />
            <Route path="/services/business-banking" element={<BusinessBankingService />} />
            <Route path="/services/wealth-management" element={<WealthManagementService />} />
            <Route path="/services/digital-security" element={<DigitalSecurity />} />
            <Route path="/personal-banking" element={<PersonalBanking />} />
            <Route path="/wealth-management" element={<WealthManagement />} />
            <Route path="/business-banking" element={<BusinessBanking />} />
            <Route path="/corporate-banking" element={<CorporateBanking />} />
            <Route path="/all-services" element={<AllServices />} />
            <Route path="/about" element={<About />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/security" element={<Security />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/disclosures" element={<Disclosures />} />
            <Route path="/site-map" element={<SiteMap />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
