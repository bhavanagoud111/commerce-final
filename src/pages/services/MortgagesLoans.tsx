import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoanApplicationForm from "@/components/LoanApplicationForm";
import { ArrowLeft, Home, CheckCircle, Calculator, Phone, Shield, Clock, DollarSign, TrendingUp, FileCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import mortgagesLoansImage from "@/assets/mortgages-loans.jpg";

const MortgagesLoans = () => {
  // Loan Application Form State
  const [isLoanApplicationFormOpen, setIsLoanApplicationFormOpen] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState("");

  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(6.25);
  const [loanTerm, setLoanTerm] = useState(30);
  const [loanType, setLoanType] = useState("mortgage");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate loan payment using the standard mortgage formula
  const calculateLoanPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      // Handle zero interest rate
      const payment = principal / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalInterest(0);
      setTotalAmount(principal);
    } else {
      // Standard mortgage formula
      const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      setMonthlyPayment(payment);
      setTotalInterest((payment * numberOfPayments) - principal);
      setTotalAmount(payment * numberOfPayments);
    }
  };

  // Calculate on component mount and when values change
  useEffect(() => {
    calculateLoanPayment();
  }, [loanAmount, interestRate, loanTerm]);

  // Update calculations when inputs change
  const handleLoanAmountChange = (value) => {
    setLoanAmount(parseFloat(value) || 0);
    setTimeout(calculateLoanPayment, 0);
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(parseFloat(value) || 0);
    setTimeout(calculateLoanPayment, 0);
  };

  const handleLoanTermChange = (value) => {
    setLoanTerm(parseInt(value) || 0);
    setTimeout(calculateLoanPayment, 0);
  };

  const handleLoanTypeChange = (value) => {
    setLoanType(value);
    // Set default values based on loan type
    switch(value) {
      case "mortgage":
        setInterestRate(6.25);
        setLoanTerm(30);
        break;
      case "personal":
        setInterestRate(12.99);
        setLoanTerm(5);
        break;
      case "auto":
        setInterestRate(5.49);
        setLoanTerm(5);
        break;
      default:
        break;
    }
    setTimeout(calculateLoanPayment, 0);
  };

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
                  <Home className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Mortgages & Loans</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Make your dreams come true with our competitive mortgage rates and flexible loan options. From first-time homebuyers to seasoned investors.
                </p>
              </div>
              <div className="lg:text-center">
                <img 
                  src={mortgagesLoansImage} 
                  alt="Mortgages and Loans Services" 
                  className="rounded-lg shadow-2xl w-full max-w-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Loan Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[hsl(var(--commerce-green))] mb-12">Our Loan Solutions</h2>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--commerce-green))]">Home Mortgages</CardTitle>
                  <CardDescription>
                    Competitive rates and flexible terms for first-time buyers and refinancing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-teal))]">Starting at 6.25% APR</div>
                    <div className="text-sm text-muted-foreground">Fixed rate mortgages</div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>30-year and 15-year terms</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>No prepayment penalties</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>First-time buyer programs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Refinancing options</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button 
                      variant="commerce" 
                      className="w-full"
                      onClick={() => {
                        setSelectedLoanType("Home Equity Loan");
                        setIsLoanApplicationFormOpen(true);
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--commerce-green))]">Personal Loans</CardTitle>
                  <CardDescription>
                    Unsecured personal loans for debt consolidation, home improvements, or major purchases.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-teal))]">7.99% - 18.99% APR</div>
                    <div className="text-sm text-muted-foreground">Based on creditworthiness</div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>$5,000 to $100,000 loan amounts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Quick approval process</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Fixed monthly payments</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>No origination fees</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button 
                      variant="commerce" 
                      className="w-full"
                      onClick={() => {
                        setSelectedLoanType("Personal Loan");
                        setIsLoanApplicationFormOpen(true);
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--commerce-green))]">Auto Financing</CardTitle>
                  <CardDescription>
                    Competitive auto loan rates for new and used vehicles with flexible terms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-teal))]">Starting at 5.49% APR</div>
                    <div className="text-sm text-muted-foreground">New vehicle financing</div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>New and used vehicle loans</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Up to 84-month terms</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Pre-approval available</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Refinancing options</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Button 
                      variant="commerce" 
                      className="w-full"
                      onClick={() => {
                        setSelectedLoanType("Auto Loan");
                        setIsLoanApplicationFormOpen(true);
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loan Calculator & Process */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Calculator className="h-8 w-8 text-[hsl(var(--commerce-green))] mr-3" />
                    <CardTitle>Loan Calculator</CardTitle>
                  </div>
                  <CardDescription>
                    Estimate your monthly payments and see what you can afford.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Loan Type Selection */}
                    <div>
                      <Label htmlFor="loanType">Loan Type</Label>
                      <Select value={loanType} onValueChange={handleLoanTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mortgage">Home Mortgage</SelectItem>
                          <SelectItem value="personal">Personal Loan</SelectItem>
                          <SelectItem value="auto">Auto Loan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Loan Amount */}
                    <div>
                      <Label htmlFor="loanAmount">Loan Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="loanAmount"
                          type="number"
                          value={loanAmount}
                          onChange={(e) => handleLoanAmountChange(e.target.value)}
                          className="pl-8"
                          placeholder="Enter loan amount"
                        />
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <Label htmlFor="interestRate">Interest Rate (% APR)</Label>
                      <div className="relative">
                        <Input
                          id="interestRate"
                          type="number"
                          step="0.01"
                          value={interestRate}
                          onChange={(e) => handleInterestRateChange(e.target.value)}
                          placeholder="Enter interest rate"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                      </div>
                    </div>

                    {/* Loan Term */}
                    <div>
                      <Label htmlFor="loanTerm">Loan Term</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="loanTerm"
                          type="number"
                          value={loanTerm}
                          onChange={(e) => handleLoanTermChange(e.target.value)}
                          placeholder="Enter term"
                          className="flex-1"
                        />
                        <Select value={loanType === "mortgage" ? "years" : loanType === "auto" ? "years" : "years"} disabled>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="years">Years</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Calculation Results */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-lg font-semibold text-gray-900">Monthly Payment</div>
                        <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">
                          ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-gray-600">Total Interest</div>
                          <div className="font-semibold text-gray-900">
                            ${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-gray-600">Total Amount</div>
                          <div className="font-semibold text-gray-900">
                            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setLoanAmount(250000);
                          setInterestRate(6.25);
                          setLoanTerm(30);
                          setLoanType("mortgage");
                        }}
                      >
                        Reset
                      </Button>
                      <Button 
                        variant="commerce" 
                        className="flex-1"
                        onClick={() => {
                          // Map calculator loan type to form loan type
                          let loanTypeName = "";
                          switch(loanType) {
                            case "mortgage":
                              loanTypeName = "Home Equity Loan";
                              break;
                            case "personal":
                              loanTypeName = "Personal Loan";
                              break;
                            case "auto":
                              loanTypeName = "Auto Loan";
                              break;
                            default:
                              loanTypeName = "Personal Loan";
                          }
                          setSelectedLoanType(loanTypeName);
                          setIsLoanApplicationFormOpen(true);
                        }}
                      >
                        Apply for This Loan
                      </Button>
                    </div>

                    {/* Helpful Tips */}
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                      <h4 className="font-semibold text-blue-900 mb-2">💡 Calculator Tips:</h4>
                      <ul className="text-blue-800 space-y-1">
                        <li>• This calculator provides estimates only</li>
                        <li>• Actual rates may vary based on credit score</li>
                        <li>• Additional fees may apply</li>
                        <li>• Contact us for personalized quotes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Commerce Bank for Loans?</CardTitle>
                  <CardDescription>
                    Experience exceptional service, competitive rates, and personalized solutions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        icon: Clock,
                        title: "Fast Approval Process",
                        description: "Get pre-approved in as little as 24 hours with our streamlined online application.",
                        color: "text-blue-600",
                        bgColor: "bg-blue-50"
                      },
                      {
                        icon: DollarSign,
                        title: "Competitive Rates",
                        description: "Low interest rates and flexible terms tailored to your financial situation and credit profile.",
                        color: "text-green-600",
                        bgColor: "bg-green-50"
                      },
                      {
                        icon: Shield,
                        title: "Secure & Trusted",
                        description: "Bank with confidence knowing your information is protected with industry-leading security.",
                        color: "text-purple-600",
                        bgColor: "bg-purple-50"
                      },
                      {
                        icon: Users,
                        title: "Expert Guidance",
                        description: "Work with our experienced loan specialists who will guide you through every step of the process.",
                        color: "text-orange-600",
                        bgColor: "bg-orange-50"
                      },
                      {
                        icon: FileCheck,
                        title: "No Hidden Fees",
                        description: "Transparent pricing with no origination fees, prepayment penalties, or surprise charges.",
                        color: "text-teal-600",
                        bgColor: "bg-teal-50"
                      },
                      {
                        icon: TrendingUp,
                        title: "Build Your Credit",
                        description: "Responsible borrowing can help improve your credit score and financial future.",
                        color: "text-pink-600",
                        bgColor: "bg-pink-50"
                      }
                    ].map((benefit, idx) => {
                      const IconComponent = benefit.icon;
                      return (
                        <div key={idx} className={`flex items-start p-4 rounded-lg ${benefit.bgColor} hover:shadow-md transition-shadow`}>
                          <div className={`flex-shrink-0 p-2 ${benefit.bgColor} rounded-lg mr-4`}>
                            <IconComponent className={`h-5 w-5 ${benefit.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                            <p className="text-sm text-gray-700">{benefit.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                variant="commerce" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  toast({
                    title: "Loan Specialist Contact",
                    description: "Call us at 1-800-LOANS-CB or email loans@commercebank.com. Our specialists are available Monday-Friday 8 AM - 8 PM EST.",
                  });
                }}
              >
                <Phone className="h-5 w-5 mr-2" />
                Speak with a Loan Specialist
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Loan Application Form Modal */}
      <LoanApplicationForm 
        isOpen={isLoanApplicationFormOpen} 
        onClose={() => {
          setIsLoanApplicationFormOpen(false);
          setSelectedLoanType("");
        }}
        loanType={selectedLoanType}
      />
    </div>
  );
};

export default MortgagesLoans;