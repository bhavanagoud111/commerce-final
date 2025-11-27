import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicCheckingApplicationForm from "@/components/BasicCheckingApplicationForm";
import ApplicationForm from "@/components/ApplicationForm";
import LoanApplicationForm from "@/components/LoanApplicationForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Home,
  Car,
  GraduationCap,
  Heart,
  Shield,
  Smartphone,
  PiggyBank,
  Calculator,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Users,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const PersonalBanking = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState("checking");
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedApplicationType, setSelectedApplicationType] = useState("");
  const [isLoanApplicationFormOpen, setIsLoanApplicationFormOpen] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState("");

  const checkingAccounts = [
    {
      name: "Basic Checking",
      features: ["No monthly fee", "Free online banking", "Mobile app access", "Debit card included"],
      minBalance: 0,
      interestRate: 0.01,
      monthlyFee: 0
    },
    {
      name: "Premium Checking",
      features: ["Higher interest rate", "Free checks", "Overdraft protection", "Priority customer service"],
      minBalance: 1500,
      interestRate: 0.15,
      monthlyFee: 0
    },
    {
      name: "Student Checking",
      features: ["No monthly fee for students", "Free ATM transactions", "Mobile banking", "Financial education resources"],
      minBalance: 0,
      interestRate: 0.01,
      monthlyFee: 0
    }
  ];

  const savingsAccounts = [
    {
      name: "High-Yield Savings",
      features: ["Competitive interest rate", "No monthly fees", "Online transfers", "Mobile banking"],
      minBalance: 100,
      interestRate: 2.5,
      monthlyFee: 0
    },
    {
      name: "Money Market",
      features: ["Higher interest rates", "Check writing privileges", "Tiered interest rates", "Online banking"],
      minBalance: 2500,
      interestRate: 1.8,
      monthlyFee: 0
    }
  ];

  const creditCards = [
    {
      name: "Cash Back Card",
      features: ["2% cash back on all purchases", "No annual fee", "0% intro APR", "Mobile app"],
      apr: 18.99,
      annualFee: 0,
      rewards: "2% cash back"
    },
    {
      name: "Travel Rewards Card",
      features: ["3x points on travel", "Travel insurance", "No foreign transaction fees", "Airport lounge access"],
      apr: 19.99,
      annualFee: 95,
      rewards: "3x travel points"
    },
    {
      name: "Student Credit Card",
      features: ["No annual fee", "Low APR for students", "Credit building tools", "Mobile app"],
      apr: 16.99,
      annualFee: 0,
      rewards: "1% cash back"
    }
  ];

  const loans = [
    {
      name: "Personal Loan",
      features: ["Fixed interest rates", "No prepayment penalties", "Quick approval", "Online application"],
      minAmount: 1000,
      maxAmount: 50000,
      interestRate: "6.99% - 24.99%",
      term: "12-84 months"
    },
    {
      name: "Auto Loan",
      features: ["Competitive rates", "Quick approval", "Online account management", "Flexible terms"],
      minAmount: 5000,
      maxAmount: 100000,
      interestRate: "3.99% - 8.99%",
      term: "12-84 months"
    },
    {
      name: "Home Equity Loan",
      features: ["Use home equity", "Fixed rates", "Tax-deductible interest", "Flexible terms"],
      minAmount: 10000,
      maxAmount: 500000,
      interestRate: "4.99% - 9.99%",
      term: "5-30 years"
    }
  ];

  const services = [
    {
      name: "Online Banking",
      description: "Manage your accounts 24/7 with our secure online banking platform",
      features: ["Account balance & history", "Bill pay", "Transfer money", "Mobile deposits"],
      icon: Smartphone
    },
    {
      name: "Mobile Banking",
      description: "Bank on the go with our award-winning mobile app",
      features: ["Mobile check deposit", "Account alerts", "Card controls", "Biometric login"],
      icon: Smartphone
    },
    {
      name: "ATM Network",
      description: "Access your money at thousands of ATMs nationwide",
      features: ["Free ATM withdrawals", "Deposit cash & checks", "24/7 access", "Mobile app locator"],
      icon: DollarSign
    },
    {
      name: "Bill Pay",
      description: "Pay bills online quickly and securely",
      features: ["Schedule payments", "Pay anyone", "Automatic payments", "Payment history"],
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-16 bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))]">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-6">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Wallet className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Personal Banking Solutions</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Discover our comprehensive range of personal banking products and services designed to help you manage your finances, achieve your goals, and secure your future.
                </p>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById('product-categories')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Services
                </Button>
              </div>
              <div className="lg:text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">500+</div>
                      <div className="text-white/80 text-sm">Products</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">24/7</div>
                      <div className="text-white/80 text-sm">Support</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">100%</div>
                      <div className="text-white/80 text-sm">Secure</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">4.5%</div>
                      <div className="text-white/80 text-sm">APY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product-categories" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">


        {/* Product Categories */}
        <Tabs value={selectedProduct} onValueChange={setSelectedProduct} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checking">Checking</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="credit">Credit Cards</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
          </TabsList>

          {/* Checking Accounts */}
          <TabsContent value="checking" className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm border-b rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900">Banking & Cards</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {checkingAccounts.map((account, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      {account.name}
                    </CardTitle>
                    <CardDescription>
                      Interest Rate: {account.interestRate}% APY
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Minimum Balance:</span>
                          <span className="font-semibold">${account.minBalance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Monthly Fee:</span>
                          <span className="font-semibold">${account.monthlyFee}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {account.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          if (account.name === "Basic Checking") {
                            setIsApplicationFormOpen(true);
                          } else if (account.name === "Premium Checking") {
                            setSelectedApplicationType("premium_checking");
                            setIsApplicationFormOpen(true);
                          } else if (account.name === "Student Checking") {
                            setSelectedApplicationType("student_checking");
                            setIsApplicationFormOpen(true);
                          } else {
                            toast({
                              title: "Coming soon",
                              description: `${account.name} applications are being prepared.`,
                            });
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Savings Accounts */}
          <TabsContent value="savings" className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm border-b rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900">Savings & Investment</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savingsAccounts.map((account, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PiggyBank className="h-5 w-5 mr-2" />
                      {account.name}
                    </CardTitle>
                    <CardDescription>
                      Interest Rate: {account.interestRate}% APY
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Minimum Balance:</span>
                          <span className="font-semibold">${account.minBalance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Monthly Fee:</span>
                          <span className="font-semibold">${account.monthlyFee}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {account.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          if (account.name === "High-Yield Savings") {
                            setSelectedApplicationType("high_yield_savings");
                            setIsApplicationFormOpen(true);
                          } else if (account.name === "Money Market") {
                            setSelectedApplicationType("money_market");
                            setIsApplicationFormOpen(true);
                          } else {
                            toast({
                              title: "Coming soon",
                              description: `${account.name} applications are being prepared.`,
                            });
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Credit Cards */}
          <TabsContent value="credit" className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm border-b rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900">Credit Cards</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {creditCards.map((card, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      {card.name}
                    </CardTitle>
                    <CardDescription>
                      APR: {card.apr}% | Annual Fee: ${card.annualFee}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Rewards:</span>
                          <span className="font-semibold">{card.rewards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Annual Fee:</span>
                          <span className="font-semibold">${card.annualFee}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {card.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          if (card.name === "Cash Back Card") {
                            setSelectedApplicationType("cash_back_card");
                            setIsApplicationFormOpen(true);
                          } else if (card.name === "Travel Rewards Card") {
                            setSelectedApplicationType("travel_rewards_card");
                            setIsApplicationFormOpen(true);
                          } else if (card.name === "Student Credit Card") {
                            setSelectedApplicationType("student_credit_card");
                            setIsApplicationFormOpen(true);
                          } else {
                            toast({
                              title: "Coming soon",
                              description: `${card.name} applications are being prepared.`,
                            });
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Loans */}
          <TabsContent value="loans" className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm border-b rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900">Mortgages & Loans</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {loans.map((loan, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      {loan.name}
                    </CardTitle>
                    <CardDescription>
                      Interest Rate: {loan.interestRate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount Range:</span>
                          <span className="font-semibold">${loan.minAmount.toLocaleString()} - ${loan.maxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Term:</span>
                          <span className="font-semibold">{loan.term}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {loan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setSelectedLoanType(loan.name);
                          setIsLoanApplicationFormOpen(true);
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Banking Services */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Banking Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <service.icon className="h-5 w-5 mr-2" />
                    {service.name}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Get Started Today</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Call Us</p>
                <p className="text-sm text-gray-600">1-800-COMMERCE</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Email Us</p>
                <p className="text-sm text-gray-600">support@commercebank.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Visit Us</p>
                <p className="text-sm text-gray-600">Find a branch near you</p>
              </div>
            </div>
          </div>
        </div>
          </div>
        </section>
      </main>

      {/* Application Form Modal */}
      {selectedApplicationType === "" ? (
        <BasicCheckingApplicationForm 
          isOpen={isApplicationFormOpen} 
          onClose={() => setIsApplicationFormOpen(false)} 
        />
      ) : (
        <ApplicationForm 
          isOpen={isApplicationFormOpen} 
          onClose={() => {
            setIsApplicationFormOpen(false);
            setSelectedApplicationType("");
          }}
          applicationType={selectedApplicationType}
        />
      )}

      {/* Loan Application Form Modal */}
      <LoanApplicationForm 
        isOpen={isLoanApplicationFormOpen} 
        onClose={() => {
          setIsLoanApplicationFormOpen(false);
          setSelectedLoanType("");
        }}
        loanType={selectedLoanType}
      />

      <Footer />
    </div>
  );
};

export default PersonalBanking;
