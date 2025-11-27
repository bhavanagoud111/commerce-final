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
  TrendingUp, 
  DollarSign, 
  PieChart,
  Target,
  Shield,
  Users,
  BarChart3,
  Calculator,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Home,
  MapPin,
  Briefcase,
  Car,
  GraduationCap,
  Heart,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const WealthManagement = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("investment");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    preferredContact: 'phone',
    minimumInvestment: '',
    managementFee: ''
  });

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
      service: selectedItem ? selectedItem.name : 'General Wealth Management',
      timestamp: new Date().toISOString()
    };
    
    console.log('Contact form submitted:', submissionData);
    
    // Show success message
    toast({
      title: "Request received",
      description: `Thank you, ${contactFormData.name}! We'll contact you within 24 hours at ${contactFormData.preferredContact === "phone" ? contactFormData.phone : contactFormData.email}. Reference ID: WM-${Date.now().toString().slice(-6)}.`,
    });
    
    // Reset form and close modal
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      preferredContact: 'phone',
      minimumInvestment: '',
      managementFee: ''
    });
    setShowContactForm(false);
  };

  const handleContactFormChange = (field, value) => {
    setContactFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const investmentServices = [
    {
      name: "Investment Advisory",
      description: "Professional investment management tailored to your goals",
      features: [
        "Personalized investment strategy",
        "Portfolio diversification",
        "Risk assessment",
        "Regular portfolio reviews",
        "Tax optimization strategies"
      ],
      minimumInvestment: 100000,
      managementFee: "0.75% - 1.25%",
      icon: TrendingUp
    },
    {
      name: "Retirement Planning",
      description: "Comprehensive retirement planning and wealth preservation",
      features: [
        "401(k) and IRA management",
        "Social Security optimization",
        "Retirement income planning",
        "Estate planning coordination",
        "Healthcare cost planning"
      ],
      minimumInvestment: 50000,
      managementFee: "0.50% - 1.00%",
      icon: Target
    },
    {
      name: "Estate Planning",
      description: "Protect and transfer your wealth efficiently",
      features: [
        "Will and trust creation",
        "Tax-efficient wealth transfer",
        "Charitable giving strategies",
        "Business succession planning",
        "Asset protection strategies"
      ],
      minimumInvestment: 250000,
      managementFee: "Fixed fee structure",
      icon: Shield
    }
  ];

  const investmentProducts = [
    {
      name: "Mutual Funds",
      description: "Diversified investment portfolios managed by professionals",
      types: [
        "Equity Funds",
        "Bond Funds", 
        "Balanced Funds",
        "Index Funds",
        "International Funds"
      ],
      minimumInvestment: 1000,
      fees: "0.25% - 2.00%",
      riskLevel: "Low to High"
    },
    {
      name: "Exchange-Traded Funds (ETFs)",
      description: "Low-cost, diversified investment vehicles",
      types: [
        "Stock ETFs",
        "Bond ETFs",
        "Sector ETFs",
        "International ETFs",
        "Commodity ETFs"
      ],
      minimumInvestment: 100,
      fees: "0.03% - 0.50%",
      riskLevel: "Low to High"
    },
    {
      name: "Individual Retirement Accounts (IRAs)",
      description: "Tax-advantaged retirement savings accounts",
      types: [
        "Traditional IRA",
        "Roth IRA",
        "SEP IRA",
        "Simple IRA",
        "Rollover IRA"
      ],
      minimumInvestment: 0,
      fees: "No annual fees",
      riskLevel: "Depends on investments"
    }
  ];

  const advisoryServices = [
    {
      name: "Financial Planning",
      description: "Comprehensive financial planning for all life stages",
      services: [
        "Cash flow analysis",
        "Goal setting and prioritization",
        "Insurance needs analysis",
        "Education funding planning",
        "Tax planning strategies"
      ],
      fee: "Fixed fee: $2,500 - $10,000",
      duration: "3-6 months"
    },
    {
      name: "Tax Planning",
      description: "Strategic tax planning to minimize your tax burden",
      services: [
        "Tax-efficient investing",
        "Retirement account optimization",
        "Charitable giving strategies",
        "Business tax planning",
        "Estate tax minimization"
      ],
      fee: "Hourly: $200 - $400",
      duration: "Ongoing"
    },
    {
      name: "Insurance Planning",
      description: "Comprehensive insurance analysis and recommendations",
      services: [
        "Life insurance needs analysis",
        "Disability insurance review",
        "Long-term care planning",
        "Property and casualty review",
        "Business insurance planning"
      ],
      fee: "Commission-based",
      duration: "One-time consultation"
    }
  ];

  const wealthServices = [
    {
      name: "Private Banking",
      description: "Exclusive banking services for high-net-worth individuals",
      features: [
        "Dedicated relationship manager",
        "Concierge banking services",
        "Premium credit products",
        "Specialized lending solutions",
        "Priority customer service"
      ],
      minimumBalance: 1000000,
      icon: Users
    },
    {
      name: "Trust Services",
      description: "Professional trust administration and management",
      features: [
        "Trust administration",
        "Asset management",
        "Beneficiary services",
        "Tax reporting",
        "Distribution management"
      ],
      minimumAssets: 500000,
      icon: Shield
    },
    {
      name: "Family Office Services",
      description: "Comprehensive wealth management for ultra-high-net-worth families",
      features: [
        "Multi-generational planning",
        "Family governance",
        "Philanthropic planning",
        "Business succession",
        "Lifestyle management"
      ],
      minimumAssets: 10000000,
      icon: Briefcase
    }
  ];

  const marketInsights = [
    {
      title: "Market Outlook",
      description: "Our latest insights on market trends and opportunities",
      date: "January 15, 2024",
      author: "Investment Research Team",
      category: "Market Analysis"
    },
    {
      title: "Retirement Planning in 2024",
      description: "Key strategies for maximizing your retirement savings",
      date: "January 10, 2024", 
      author: "Wealth Planning Team",
      category: "Retirement"
    },
    {
      title: "Tax-Efficient Investing",
      description: "How to minimize taxes while maximizing returns",
      date: "January 5, 2024",
      author: "Tax Advisory Team", 
      category: "Tax Planning"
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
                  <TrendingUp className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Wealth Management Services</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Partner with our experienced wealth management team to grow, protect, and transfer your wealth. We provide comprehensive investment, planning, and advisory services tailored to your unique financial goals.
                </p>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById('service-categories')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Services
                </Button>
              </div>
              <div className="lg:text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">$2B+</div>
                      <div className="text-white/80 text-sm">Assets Managed</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">15+</div>
                      <div className="text-white/80 text-sm">Years Experience</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">500+</div>
                      <div className="text-white/80 text-sm">Clients</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">1.25%</div>
                      <div className="text-white/80 text-sm">Avg. Fee</div>
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
        <Tabs defaultValue="investment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="investment">Investment Services</TabsTrigger>
            <TabsTrigger value="advisory">Advisory Services</TabsTrigger>
            <TabsTrigger value="products">Investment Products</TabsTrigger>
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
          </TabsList>

          {/* Investment Services */}
          <TabsContent value="investment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {investmentServices.map((service, index) => (
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
                          <span className="text-sm text-gray-600">Minimum Investment:</span>
                          <span className="font-semibold">${service.minimumInvestment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Management Fee:</span>
                          <span className="font-semibold">{service.managementFee}</span>
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
                        onClick={() => handleLearnMore(service, 'investment')}
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Advisory Services */}
          <TabsContent value="advisory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {advisoryServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      {service.name}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Fee:</span>
                          <span className="font-semibold">{service.fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Duration:</span>
                          <span className="font-semibold">{service.duration}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Services Include:</h4>
                        <ul className="space-y-1">
                          {service.services.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleLearnMore(service, 'advisory')}
                      >
                        Schedule Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Investment Products */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {investmentProducts.map((product, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      {product.name}
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Minimum Investment:</span>
                          <span className="font-semibold">${product.minimumInvestment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Fees:</span>
                          <span className="font-semibold">{product.fees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Risk Level:</span>
                          <span className="font-semibold">{product.riskLevel}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Available Types:</h4>
                        <ul className="space-y-1">
                          {product.types.map((type, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {type}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleLearnMore(product, 'product')}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Market Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-6">
              {marketInsights.map((insight, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{insight.title}</CardTitle>
                        <CardDescription>{insight.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{insight.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>By {insight.author}</span>
                        <span>•</span>
                        <span>{insight.date}</span>
                      </div>
                      <Button variant="outline" size="sm">Read More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Wealth Services */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Premium Wealth Services</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {wealthServices.map((service, index) => (
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
                        <span className="text-sm text-gray-600">Minimum:</span>
                        <span className="font-semibold">${service.minimumBalance || service.minimumAssets}</span>
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
                      onClick={() => handleLearnMore(service, 'wealth')}
                    >
                      Contact Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Start Your Wealth Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Wealth Management</p>
                <p className="text-sm text-gray-600">1-800-WEALTH-1</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Email Us</p>
                <p className="text-sm text-gray-600">wealth@commercebank.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">Visit Us</p>
                <p className="text-sm text-gray-600">Private banking offices</p>
              </div>
            </div>
          </div>
        </div>
          </div>
        </section>
      </main>

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
                    <p className="text-sm text-gray-600">Wealth Management Service</p>
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
                {modalType === 'investment' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Details</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Minimum Investment:</span>
                          <p className="font-semibold text-lg">${selectedItem.minimumInvestment.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Management Fee:</span>
                          <p className="font-semibold text-lg">{selectedItem.managementFee}</p>
                        </div>
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

                {modalType === 'advisory' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Advisory Details</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Fee Structure:</span>
                          <p className="font-semibold text-lg">{selectedItem.fee}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Duration:</span>
                          <p className="font-semibold text-lg">{selectedItem.duration}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Services Provided:</h4>
                        <ul className="space-y-2">
                          {selectedItem.services.map((service, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'product' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Minimum Investment:</span>
                          <p className="font-semibold">${selectedItem.minimumInvestment.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Fees:</span>
                          <p className="font-semibold">{selectedItem.fees}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Risk Level:</span>
                          <p className="font-semibold">{selectedItem.riskLevel}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Available Types:</h4>
                        <ul className="space-y-2">
                          {selectedItem.types.map((type, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{type}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'wealth' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Premium Service Details</h3>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Minimum Requirements:</span>
                        <p className="font-semibold text-lg">${(selectedItem.minimumBalance || selectedItem.minimumAssets).toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Premium Features:</h4>
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

                {/* Benefits Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Commerce Bank?</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Over 50 years of wealth management experience</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Personalized service with dedicated relationship managers</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Comprehensive financial planning and advisory services</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Advanced technology and secure online access</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>FDIC insured and regulated by federal authorities</span>
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
                          <p className="text-gray-600">1-800-WEALTH-1</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Email Us</p>
                          <p className="text-gray-600">wealth@commercebank.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Visit Us</p>
                          <p className="text-gray-600">Private banking offices</p>
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
                    <p className="font-medium">Ready to start your wealth management journey?</p>
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
                    <h2 className="text-xl font-bold text-gray-900">Contact Wealth Management</h2>
                    <p className="text-sm text-gray-600">Get started with your wealth management journey</p>
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
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
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
                        <SelectItem value="investment-advisory">Investment Advisory</SelectItem>
                        <SelectItem value="retirement-planning">Retirement Planning</SelectItem>
                        <SelectItem value="estate-planning">Estate Planning</SelectItem>
                        <SelectItem value="financial-planning">Financial Planning</SelectItem>
                        <SelectItem value="tax-planning">Tax Planning</SelectItem>
                        <SelectItem value="insurance-planning">Insurance Planning</SelectItem>
                        <SelectItem value="private-banking">Private Banking</SelectItem>
                        <SelectItem value="trust-services">Trust Services</SelectItem>
                        <SelectItem value="family-office">Family Office Services</SelectItem>
                        <SelectItem value="general-consultation">General Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="form-section space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minimumInvestment">Minimum Investment</Label>
                      <Input
                        id="minimumInvestment"
                        type="number"
                        value={contactFormData.minimumInvestment}
                        onChange={(e) => handleContactFormChange('minimumInvestment', e.target.value)}
                        placeholder="Enter minimum investment amount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="managementFee">Management Fee</Label>
                      <Input
                        id="managementFee"
                        type="text"
                        value={contactFormData.managementFee}
                        onChange={(e) => handleContactFormChange('managementFee', e.target.value)}
                        placeholder="Enter management fee"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="form-section space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="message">How can we help you?</Label>
                      <Textarea
                        id="message"
                        value={contactFormData.message}
                        onChange={(e) => handleContactFormChange('message', e.target.value)}
                        rows={4}
                        placeholder="Tell us about your goals and how we can assist you"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="form-section form-section-accent text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <ShieldCheck className="h-5 w-5 mt-1" />
                    <div>
                      <p className="font-medium">By submitting this form, you agree to our</p>
                      <p>Terms of Service and Privacy Policy.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WealthManagement;
