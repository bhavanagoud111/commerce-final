import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Globe,
  Shield,
  Users,
  BarChart3,
  PieChart,
  Target,
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Zap,
  Lock,
  Home,
  Award,
  Plane
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const CorporateBanking = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("treasury");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    preferredContact: 'phone'
  });
  const [selectedResource, setSelectedResource] = useState(null);

  const handleLearnMore = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const handleContactBank = () => {
    setShowContactForm(true);
    setSelectedItem(null); // Close the service details modal
  };

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission
    const submissionData = {
      ...contactFormData,
      service: selectedItem ? selectedItem.name : 'General Corporate Banking',
      timestamp: new Date().toISOString()
    };
    
    console.log('Contact form submitted:', submissionData);
    
    // Show success message
    toast({
      title: "Request received",
      description: `Thank you, ${contactFormData.name}! We'll contact you within 24 hours at ${contactFormData.preferredContact === 'phone' ? contactFormData.phone : contactFormData.email}. Reference ID: CB-${Date.now().toString().slice(-6)}`,
    });
    
    // Reset form and close modal
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: '',
      preferredContact: 'phone'
    });
    setShowContactForm(false);
  };

  const handleContactFormChange = (field, value) => {
    setContactFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccessResource = (resource) => {
    setSelectedResource(resource);
  };

  const treasuryServices = [
    {
      name: "Cash Management",
      description: "Comprehensive cash management solutions for large corporations",
      features: [
        "Multi-currency accounts",
        "Automated clearing house (ACH)",
        "Wire transfer services",
        "Cash concentration",
        "Account reconciliation",
        "Liquidity management"
      ],
      minimumBalance: 1000000,
      icon: DollarSign
    },
    {
      name: "Foreign Exchange",
      description: "Global currency trading and risk management",
      features: [
        "Spot and forward contracts",
        "Currency hedging strategies",
        "Real-time rates",
        "Risk management tools",
        "International wire transfers",
        "Multi-currency reporting"
      ],
      minimumBalance: 500000,
      icon: Globe
    },
    {
      name: "Investment Services",
      description: "Sophisticated investment and portfolio management",
      features: [
        "Money market funds",
        "Government securities",
        "Corporate bonds",
        "Portfolio optimization",
        "Risk assessment",
        "Performance reporting"
      ],
      minimumBalance: 2000000,
      icon: TrendingUp
    }
  ];

  const corporateLoans = [
    {
      name: "Corporate Term Loan",
      description: "Long-term financing for corporate expansion and acquisitions",
      features: [
        "Flexible repayment terms",
        "Competitive interest rates",
        "Covenant flexibility",
        "Prepayment options",
        "Syndication capabilities"
      ],
      amount: "$1M - $500M",
      rate: "Prime + 0.5% - 3.5%",
      term: "1-10 years",
      minRevenue: 10000000
    },
    {
      name: "Revolving Credit Facility",
      description: "Flexible credit line for working capital and general corporate purposes",
      features: [
        "Revolving credit line",
        "Quick access to funds",
        "Competitive rates",
        "Flexible drawdowns",
        "Multi-currency options"
      ],
      amount: "$5M - $1B",
      rate: "Prime + 0.25% - 2.5%",
      term: "Revolving",
      minRevenue: 50000000
    },
    {
      name: "Asset-Based Lending",
      description: "Lending secured by corporate assets",
      features: [
        "Asset-based credit lines",
        "Inventory financing",
        "Accounts receivable financing",
        "Equipment financing",
        "Real estate financing"
      ],
      amount: "$2M - $200M",
      rate: "Prime + 1.0% - 4.0%",
      term: "1-5 years",
      minRevenue: 25000000
    },
    {
      name: "Project Finance",
      description: "Specialized financing for large infrastructure and development projects",
      features: [
        "Non-recourse financing",
        "Long-term funding",
        "Risk sharing structures",
        "Regulatory compliance",
        "Environmental considerations"
      ],
      amount: "$10M - $2B",
      rate: "Variable based on project",
      term: "5-30 years",
      minRevenue: 100000000
    }
  ];

  const capitalMarkets = [
    {
      name: "Debt Capital Markets",
      description: "Corporate bond issuance and debt structuring",
      features: [
        "Investment grade bonds",
        "High yield bonds",
        "Convertible bonds",
        "Private placements",
        "Debt restructuring",
        "Credit rating advisory"
      ],
      minimumSize: 100000000,
      icon: BarChart3
    },
    {
      name: "Equity Capital Markets",
      description: "Equity issuance and capital raising services",
      features: [
        "Initial public offerings (IPOs)",
        "Secondary offerings",
        "Private equity placements",
        "Rights offerings",
        "Share buybacks",
        "Equity research"
      ],
      minimumSize: 50000000,
      icon: TrendingUp
    },
    {
      name: "Mergers & Acquisitions",
      description: "Strategic advisory for M&A transactions",
      features: [
        "Buy-side advisory",
        "Sell-side advisory",
        "Valuation services",
        "Due diligence support",
        "Transaction structuring",
        "Integration planning"
      ],
      minimumSize: 100000000,
      icon: Target
    }
  ];

  const riskManagement = [
    {
      name: "Credit Risk Management",
      description: "Comprehensive credit risk assessment and mitigation",
      features: [
        "Credit analysis",
        "Risk rating models",
        "Portfolio monitoring",
        "Stress testing",
        "Credit derivatives",
        "Regulatory compliance"
      ],
      icon: Shield
    },
    {
      name: "Market Risk Management",
      description: "Hedging and risk management for market exposures",
      features: [
        "Interest rate hedging",
        "Currency hedging",
        "Commodity hedging",
        "Derivatives trading",
        "Risk measurement",
        "Regulatory reporting"
      ],
      icon: BarChart3
    },
    {
      name: "Operational Risk Management",
      description: "Operational risk assessment and mitigation strategies",
      features: [
        "Risk identification",
        "Control frameworks",
        "Business continuity",
        "Cyber security",
        "Regulatory compliance",
        "Incident management"
      ],
      icon: Lock
    }
  ];

  const internationalServices = [
    {
      name: "Trade Finance",
      description: "International trade financing and documentation",
      features: [
        "Letters of credit",
        "Documentary collections",
        "Trade loans",
        "Export financing",
        "Import financing",
        "Supply chain finance"
      ],
      icon: Globe
    },
    {
      name: "Correspondent Banking",
      description: "Global banking relationships and services",
      features: [
        "Correspondent network",
        "Cross-border payments",
        "Foreign exchange",
        "Trade services",
        "Cash management",
        "Regulatory compliance"
      ],
      icon: Building2
    },
    {
      name: "International Treasury",
      description: "Global cash management and treasury services",
      features: [
        "Multi-currency accounts",
        "Cross-border cash pooling",
        "Foreign exchange services",
        "International wire transfers",
        "Regulatory reporting",
        "Tax optimization"
      ],
      icon: DollarSign
    }
  ];

  const industryExpertise = [
    {
      name: "Technology",
      description: "Banking solutions for technology companies",
      features: [
        "Growth capital",
        "M&A financing",
        "Working capital",
        "International expansion",
        "IPO preparation",
        "ESOP financing"
      ],
      icon: Zap
    },
    {
      name: "Healthcare",
      description: "Specialized banking for healthcare organizations",
      features: [
        "Hospital financing",
        "Medical equipment loans",
        "Practice acquisitions",
        "Regulatory compliance",
        "Revenue cycle management",
        "Technology investments"
      ],
      icon: Target
    },
    {
      name: "Manufacturing",
      description: "Banking solutions for manufacturing companies",
      features: [
        "Equipment financing",
        "Working capital",
        "Export financing",
        "Supply chain finance",
        "International trade",
        "Technology upgrades"
      ],
      icon: Building2
    },
    {
      name: "Energy",
      description: "Specialized banking for energy sector",
      features: [
        "Project finance",
        "Commodity trading",
        "Risk management",
        "Environmental compliance",
        "Technology investments",
        "International operations"
      ],
      icon: Award
    }
  ];

  const corporateResources = [
    {
      title: "Market Research Reports",
      description: "Latest industry analysis and market insights",
      type: "Research",
      updateFrequency: "Monthly"
    },
    {
      title: "Regulatory Updates",
      description: "Stay informed about regulatory changes affecting your industry",
      type: "Compliance",
      updateFrequency: "Weekly"
    },
    {
      title: "Economic Outlook",
      description: "Quarterly economic forecasts and market analysis",
      type: "Analysis",
      updateFrequency: "Quarterly"
    },
    {
      title: "Industry Benchmarks",
      description: "Performance benchmarks for your industry sector",
      type: "Benchmarking",
      updateFrequency: "Annually"
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
                  <Building2 className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Corporate Banking Solutions</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Partner with our corporate banking team for sophisticated financial solutions tailored to large corporations. From treasury management to capital markets, we provide comprehensive banking services for your complex business needs.
                </p>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById('service-categories')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Services
                </Button>
              </div>
              <div className="lg:text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">$50B+</div>
                      <div className="text-white/80 text-sm">Assets Managed</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">500+</div>
                      <div className="text-white/80 text-sm">Corporations</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">150+</div>
                      <div className="text-white/80 text-sm">Countries</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">24/7</div>
                      <div className="text-white/80 text-sm">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="service-categories" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
        {/* Service Categories */}
        <Tabs defaultValue="treasury" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="treasury">Treasury Services</TabsTrigger>
            <TabsTrigger value="loans">Corporate Loans</TabsTrigger>
            <TabsTrigger value="capital">Capital Markets</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="international">International</TabsTrigger>
          </TabsList>

          {/* Treasury Services */}
          <TabsContent value="treasury" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {treasuryServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <service.icon className="h-5 w-5 mr-2" />
                      {service.name}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Minimum Balance:</span>
                          <span className="font-semibold">${service.minimumBalance.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Services Include:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleLearnMore(service, 'treasury')}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Corporate Loans */}
          <TabsContent value="loans" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {corporateLoans.map((loan, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      {loan.name}
                    </CardTitle>
                    <CardDescription>{loan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="font-semibold">{loan.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Rate:</span>
                          <span className="font-semibold">{loan.rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Term:</span>
                          <span className="font-semibold">{loan.term}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Min Revenue:</span>
                          <span className="font-semibold">${loan.minRevenue.toLocaleString()}</span>
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
                        onClick={() => handleLearnMore(loan, 'loan')}
                      >
                        Contact Us
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Capital Markets */}
          <TabsContent value="capital" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {capitalMarkets.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <service.icon className="h-5 w-5 mr-2" />
                      {service.name}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Minimum Size:</span>
                          <span className="font-semibold">${service.minimumSize.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Services Include:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleLearnMore(service, 'capital')}
                      >
                        Contact Us
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Risk Management */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {riskManagement.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <service.icon className="h-5 w-5 mr-2" />
                      {service.name}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold mb-2">Services Include:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={() => handleLearnMore(service, 'risk')}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* International Services */}
          <TabsContent value="international" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {internationalServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <service.icon className="h-5 w-5 mr-2" />
                      {service.name}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold mb-2">Services Include:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={() => handleLearnMore(service, 'international')}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Industry Expertise */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Industry Expertise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryExpertise.map((industry, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <industry.icon className="h-5 w-5 mr-2" />
                    {industry.name}
                  </CardTitle>
                  <CardDescription>{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {industry.features.map((feature, idx) => (
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

        {/* Corporate Resources */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Corporate Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corporateResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {resource.title}
                  </CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{resource.type}</Badge>
                      <span className="text-sm text-gray-600">{resource.updateFrequency}</span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleAccessResource(resource)}
                    >
                      Access Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Corporate Banking Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Corporate Banking</p>
                <p className="text-sm text-gray-600">1-800-CORPORATE</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Email Us</p>
                <p className="text-sm text-gray-600">corporate@commercebank.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Visit Us</p>
                <p className="text-sm text-gray-600">Corporate banking centers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-light-blue))] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CB</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                    <p className="text-sm text-gray-600">Corporate Banking Service</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Service Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Overview</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                </div>

                {/* Service Details based on type */}
                {modalType === 'treasury' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Treasury Service Details</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Minimum Balance Required:</span>
                        <p className="font-semibold text-lg">${selectedItem.minimumBalance.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">What's Included:</h4>
                        <ul className="space-y-2">
                          {selectedItem.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'loan' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Corporate Loan Details</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Loan Amount:</span>
                          <p className="font-semibold text-lg">{selectedItem.amount}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Interest Rate:</span>
                          <p className="font-semibold text-lg">{selectedItem.rate}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Term:</span>
                          <p className="font-semibold text-lg">{selectedItem.term}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Minimum Revenue:</span>
                          <p className="font-semibold text-lg">${selectedItem.minRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Loan Features:</h4>
                        <ul className="space-y-2">
                          {selectedItem.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'capital' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Capital Markets Details</h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Minimum Transaction Size:</span>
                        <p className="font-semibold text-lg">${selectedItem.minimumSize.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Services Provided:</h4>
                        <ul className="space-y-2">
                          {selectedItem.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'risk' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Management Details</h3>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div>
                        <h4 className="font-medium mb-2">Risk Management Services:</h4>
                        <ul className="space-y-2">
                          {selectedItem.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Additional Risk Management Information */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Risk Management Approach:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border">
                          <h5 className="font-medium text-gray-900 mb-2">Risk Assessment</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Comprehensive risk identification</li>
                            <li>• Quantitative risk modeling</li>
                            <li>• Scenario analysis and stress testing</li>
                            <li>• Risk appetite framework</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <h5 className="font-medium text-gray-900 mb-2">Risk Mitigation</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Diversification strategies</li>
                            <li>• Hedging instruments</li>
                            <li>• Insurance solutions</li>
                            <li>• Operational controls</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Service-Specific Details */}
                    {selectedItem.name === 'Credit Risk Management' && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Credit Risk Management Features:</h4>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Credit Analysis Tools</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Financial statement analysis</li>
                                <li>• Industry benchmarking</li>
                                <li>• Credit scoring models</li>
                                <li>• Peer comparison analysis</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Monitoring & Reporting</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Real-time portfolio monitoring</li>
                                <li>• Early warning systems</li>
                                <li>• Regulatory reporting</li>
                                <li>• Risk dashboard analytics</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedItem.name === 'Market Risk Management' && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Market Risk Management Features:</h4>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Hedging Solutions</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Interest rate swaps</li>
                                <li>• Currency forwards</li>
                                <li>• Commodity futures</li>
                                <li>• Options strategies</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Risk Measurement</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Value at Risk (VaR) models</li>
                                <li>• Stress testing scenarios</li>
                                <li>• Sensitivity analysis</li>
                                <li>• Monte Carlo simulations</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedItem.name === 'Operational Risk Management' && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Operational Risk Management Features:</h4>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Risk Identification</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Process mapping</li>
                                <li>• Risk register maintenance</li>
                                <li>• Loss event tracking</li>
                                <li>• Key risk indicators</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Control Framework</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Internal controls assessment</li>
                                <li>• Business continuity planning</li>
                                <li>• Cyber security protocols</li>
                                <li>• Incident response procedures</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Regulatory Compliance */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Regulatory Compliance & Standards:</h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Basel III</h5>
                            <p className="text-gray-600">Capital adequacy and liquidity requirements</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">IFRS 9</h5>
                            <p className="text-gray-600">Financial instruments and expected credit losses</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">CCAR/DFAST</h5>
                            <p className="text-gray-600">Comprehensive capital analysis and review</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technology & Tools */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Advanced Technology & Tools:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Risk Management Systems</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Real-time risk monitoring</li>
                              <li>• Automated reporting</li>
                              <li>• Machine learning models</li>
                              <li>• Cloud-based solutions</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Data & Analytics</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Big data analytics</li>
                              <li>• Predictive modeling</li>
                              <li>• Risk visualization</li>
                              <li>• Performance metrics</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'international' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">International Services Details</h3>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div>
                        <h4 className="font-medium mb-2">International Services:</h4>
                        <ul className="space-y-2">
                          {selectedItem.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Service-Specific Details */}
                    {selectedItem.name === 'Trade Finance' && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Trade Finance Solutions:</h4>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Documentary Trade</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Letter of Credit (LC) issuance</li>
                                <li>• Documentary collections</li>
                                <li>• Bank guarantees</li>
                                <li>• Standby letters of credit</li>
                                <li>• Trade documentation review</li>
                                <li>• UCP 600 compliance</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Financing Solutions</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Pre-export financing</li>
                                <li>• Post-import financing</li>
                                <li>• Supply chain finance</li>
                                <li>• Working capital loans</li>
                                <li>• Export credit insurance</li>
                                <li>• Factoring services</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedItem.name === 'Correspondent Banking' && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Correspondent Banking Network:</h4>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Global Network</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• 200+ correspondent banks worldwide</li>
                                <li>• Major financial centers coverage</li>
                                <li>• Regional expertise networks</li>
                                <li>• SWIFT connectivity</li>
                                <li>• Real-time messaging</li>
                                <li>• 24/7 support coverage</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Cross-Border Services</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• International wire transfers</li>
                                <li>• Foreign exchange services</li>
                                <li>• Trade finance processing</li>
                                <li>• Cash management solutions</li>
                                <li>• Regulatory reporting</li>
                                <li>• Compliance monitoring</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedItem.name === 'International Treasury' && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">International Treasury Solutions:</h4>
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Multi-Currency Management</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• 50+ currencies supported</li>
                                <li>• Real-time currency conversion</li>
                                <li>• Cross-border cash pooling</li>
                                <li>• Multi-currency accounts</li>
                                <li>• Currency hedging solutions</li>
                                <li>• Interest optimization</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Global Cash Management</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• International wire transfers</li>
                                <li>• Automated clearing systems</li>
                                <li>• Liquidity management</li>
                                <li>• Regulatory reporting</li>
                                <li>• Tax optimization strategies</li>
                                <li>• Centralized treasury operations</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Global Coverage */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Global Coverage & Support:</h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Americas</h5>
                            <p className="text-gray-600">North America, South America, Caribbean</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Europe & Africa</h5>
                            <p className="text-gray-600">EU, UK, Middle East, Africa</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Asia Pacific</h5>
                            <p className="text-gray-600">China, India, Japan, Southeast Asia</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Regulatory Compliance */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">International Regulatory Compliance:</h4>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Compliance Standards</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• FATCA compliance</li>
                              <li>• CRS reporting</li>
                              <li>• AML/KYC procedures</li>
                              <li>• Sanctions screening</li>
                              <li>• Basel III requirements</li>
                              <li>• Local regulatory compliance</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Documentation & Reporting</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Automated regulatory reporting</li>
                              <li>• Real-time transaction monitoring</li>
                              <li>• Audit trail maintenance</li>
                              <li>• Risk assessment tools</li>
                              <li>• Compliance dashboards</li>
                              <li>• Regulatory updates</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technology & Innovation */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Technology & Innovation:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Digital Solutions</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Online trade finance platform</li>
                              <li>• Mobile banking applications</li>
                              <li>• API integration services</li>
                              <li>• Blockchain solutions</li>
                              <li>• AI-powered risk assessment</li>
                              <li>• Real-time notifications</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Security & Reliability</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• End-to-end encryption</li>
                              <li>• Multi-factor authentication</li>
                              <li>• 99.9% uptime guarantee</li>
                              <li>• Disaster recovery systems</li>
                              <li>• 24/7 monitoring</li>
                              <li>• Cyber security protocols</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Benefits & Value Proposition */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Why Choose Our International Services:</h4>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Competitive Advantages</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Competitive exchange rates</li>
                              <li>• Faster settlement times</li>
                              <li>• Lower transaction costs</li>
                              <li>• Dedicated relationship managers</li>
                              <li>• 24/7 customer support</li>
                              <li>• Local market expertise</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Value-Added Services</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Market intelligence reports</li>
                              <li>• Currency risk advisory</li>
                              <li>• Trade finance consulting</li>
                              <li>• Regulatory guidance</li>
                              <li>• Training and education</li>
                              <li>• Customized solutions</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Commerce Bank Corporate Banking?</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Dedicated relationship managers with deep industry expertise</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Sophisticated technology platform for complex transactions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Global reach with local expertise in key markets</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>24/7 support for time-sensitive transactions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Regulatory compliance and risk management expertise</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Get Started Today</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Call Us</p>
                          <p className="text-gray-600">1-800-CORPORATE</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Email Us</p>
                          <p className="text-gray-600">corporate@commercebank.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Visit Us</p>
                          <p className="text-gray-600">Corporate banking centers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Ready to discuss your corporate banking needs?</p>
                    <p>Contact the bank for starting an account and personalized consultation.</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setSelectedItem(null)}>
                      Close
                    </Button>
                    <Button onClick={handleContactBank}>
                      Contact Bank
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </section>
      </main>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-light-blue))] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CB</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Contact Corporate Banking</h2>
                    <p className="text-sm text-gray-600">Get started with your corporate banking solutions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleContactFormSubmit} className="form-surface">
                {/* Personal Information */}
                <div className="form-section space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={contactFormData.name}
                        onChange={(e) => handleContactFormChange('name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={contactFormData.email}
                        onChange={(e) => handleContactFormChange('email', e.target.value)}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={contactFormData.phone}
                        onChange={(e) => handleContactFormChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        type="text"
                        required
                        value={contactFormData.company}
                        onChange={(e) => handleContactFormChange('company', e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                      <Select
                        value={contactFormData.preferredContact}
                        onValueChange={(value) => handleContactFormChange('preferredContact', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="both">Both Phone and Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Service Interest */}
                <div className="form-section space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Service Interest</h3>
                  <div>
                    <Label htmlFor="service">Service of Interest</Label>
                    <Select
                      value={contactFormData.service}
                      onValueChange={(value) => handleContactFormChange('service', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service you're interested in" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash-management">Cash Management</SelectItem>
                        <SelectItem value="foreign-exchange">Foreign Exchange</SelectItem>
                        <SelectItem value="investment-services">Investment Services</SelectItem>
                        <SelectItem value="corporate-loans">Corporate Loans</SelectItem>
                        <SelectItem value="capital-markets">Capital Markets</SelectItem>
                        <SelectItem value="risk-management">Risk Management</SelectItem>
                        <SelectItem value="international-services">International Services</SelectItem>
                        <SelectItem value="general-consultation">General Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="form-section space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={contactFormData.message}
                      onChange={(e) => handleContactFormChange('message', e.target.value)}
                      placeholder="Tell us about your corporate banking needs, current situation, or any specific questions you have..."
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="form-section form-section-accent text-blue-900">
                  <h4 className="font-semibold text-gray-900 mb-2">Need Immediate Assistance?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <p className="text-gray-600">1-800-CORPORATE</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <p className="text-gray-600">corporate@commercebank.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Visit Us</p>
                        <p className="text-gray-600">Corporate banking centers</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">We'll contact you within 24 hours</p>
                    <p>All information is secure and confidential</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowContactForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Submit Request
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Resource Details Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedResource.title}</h2>
                    <p className="text-gray-600">{selectedResource.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Resource Content */}
              <div className="space-y-6">
                {/* Resource Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-lg">{selectedResource.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Update Frequency</p>
                      <p className="font-semibold text-lg">{selectedResource.updateFrequency}</p>
                    </div>
                  </div>
                </div>

                {/* Resource-specific content */}
                {selectedResource.title === 'Market Research Reports' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Research Reports</h3>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Industry Analysis</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Market trends and forecasts</li>
                            <li>• Competitive landscape</li>
                            <li>• Industry growth projections</li>
                            <li>• Regulatory impact analysis</li>
                            <li>• Technology adoption rates</li>
                            <li>• Consumer behavior insights</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Financial Metrics</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Revenue projections</li>
                            <li>• Profit margin analysis</li>
                            <li>• Investment opportunities</li>
                            <li>• Risk assessment</li>
                            <li>• Valuation models</li>
                            <li>• Cash flow forecasts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedResource.title === 'Regulatory Updates' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Regulatory Updates</h3>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Compliance Requirements</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Banking regulations</li>
                            <li>• Financial reporting standards</li>
                            <li>• Anti-money laundering (AML)</li>
                            <li>• Know Your Customer (KYC)</li>
                            <li>• Data protection laws</li>
                            <li>• International regulations</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Implementation Guidance</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Compliance checklists</li>
                            <li>• Best practices</li>
                            <li>• Risk mitigation strategies</li>
                            <li>• Timeline requirements</li>
                            <li>• Documentation needs</li>
                            <li>• Training resources</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedResource.title === 'Economic Outlook' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Economic Outlook</h3>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Economic Indicators</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• GDP Growth Projections</li>
                            <li>• Inflation Rate Forecasts</li>
                            <li>• Interest Rate Trends</li>
                            <li>• Employment Statistics</li>
                            <li>• Consumer Confidence Index</li>
                            <li>• Business Investment Trends</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Market Analysis</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Stock market outlook</li>
                            <li>• Bond market trends</li>
                            <li>• Currency exchange rates</li>
                            <li>• Commodity prices</li>
                            <li>• Real estate market</li>
                            <li>• Global economic factors</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedResource.title === 'Industry Benchmarks' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry Benchmarks</h3>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Revenue growth rates</li>
                            <li>• Profit margin benchmarks</li>
                            <li>• Return on investment (ROI)</li>
                            <li>• Operating efficiency ratios</li>
                            <li>• Market share analysis</li>
                            <li>• Customer acquisition costs</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Comparative Analysis</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Peer group comparisons</li>
                            <li>• Industry standards</li>
                            <li>• Best-in-class metrics</li>
                            <li>• Trend analysis</li>
                            <li>• Performance gaps</li>
                            <li>• Improvement opportunities</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Need Access to This Resource?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <p className="text-gray-600">1-800-CORPORATE</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <p className="text-gray-600">corporate@commercebank.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Visit Us</p>
                        <p className="text-gray-600">Corporate banking centers</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Ready to access this resource?</p>
                      <p>Contact your relationship manager for immediate access.</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setSelectedResource(null)}>
                        Close
                      </Button>
                      <Button onClick={() => {
                        setSelectedResource(null);
                        setShowContactForm(true);
                      }}>
                        Contact Bank
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CorporateBanking;
