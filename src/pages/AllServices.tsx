import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainNavigation from "@/components/MainNavigation";
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
  Phone,
  Mail,
  MapPin,
  Users,
  Building2,
  Target,
  Briefcase,
  Globe,
  BarChart3,
  PieChart,
  Zap,
  Lock,
  Award,
  Plane,
  ArrowRight,
  Search
} from "lucide-react";

const AllServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allServices = [
    // Personal Banking Services
    {
      category: "Personal Banking",
      services: [
        {
          name: "Checking Accounts",
          description: "Manage your daily finances with our checking accounts",
          features: ["No monthly fees", "Free online banking", "Mobile app access", "Debit card included"],
          icon: CreditCard,
          route: "/personal-banking"
        },
        {
          name: "Savings Accounts",
          description: "Grow your money with competitive interest rates",
          features: ["High-yield savings", "No minimum balance", "Online transfers", "Mobile banking"],
          icon: PiggyBank,
          route: "/personal-banking"
        },
        {
          name: "Credit Cards",
          description: "Rewards and benefits with our credit card options",
          features: ["Cash back rewards", "No annual fees", "Travel benefits", "Fraud protection"],
          icon: CreditCard,
          route: "/personal-banking"
        },
        {
          name: "Personal Loans",
          description: "Flexible financing for your personal needs",
          features: ["Competitive rates", "Quick approval", "Flexible terms", "Online application"],
          icon: DollarSign,
          route: "/personal-banking"
        }
      ]
    },
    // Business Banking Services
    {
      category: "Business Banking",
      services: [
        {
          name: "Business Checking",
          description: "Comprehensive checking solutions for businesses",
          features: ["Unlimited transactions", "Online banking", "Mobile app", "Check writing"],
          icon: Building2,
          route: "/business-banking"
        },
        {
          name: "Business Loans",
          description: "Financing solutions for business growth",
          features: ["Term loans", "Lines of credit", "Equipment financing", "Quick approval"],
          icon: DollarSign,
          route: "/business-banking"
        },
        {
          name: "Merchant Services",
          description: "Payment processing for your business",
          features: ["Credit card processing", "Point-of-sale solutions", "Online payments", "24/7 support"],
          icon: CreditCard,
          route: "/business-banking"
        }
      ]
    },
    // Wealth Management Services
    {
      category: "Wealth Management",
      services: [
        {
          name: "Investment Advisory",
          description: "Professional investment management and advice",
          features: ["Portfolio management", "Risk assessment", "Tax optimization", "Regular reviews"],
          icon: TrendingUp,
          route: "/wealth-management"
        },
        {
          name: "Retirement Planning",
          description: "Comprehensive retirement planning services",
          features: ["401(k) management", "IRA planning", "Social Security optimization", "Income planning"],
          icon: Target,
          route: "/wealth-management"
        }
      ]
    },
    // Corporate Banking Services
    {
      category: "Corporate Banking",
      services: [
        {
          name: "Treasury Services",
          description: "Comprehensive cash management for large corporations",
          features: ["Multi-currency accounts", "ACH services", "Wire transfers", "Cash concentration"],
          icon: DollarSign,
          route: "/corporate-banking"
        },
        {
          name: "Corporate Loans",
          description: "Sophisticated financing for large corporations",
          features: ["Term loans", "Revolving credit", "Asset-based lending", "Project finance"],
          icon: Building2,
          route: "/corporate-banking"
        }
      ]
    }
  ];

  const categories = [
    { value: "all", label: "All Services" },
    { value: "Personal Banking", label: "Personal Banking" },
    { value: "Business Banking", label: "Business Banking" },
    { value: "Wealth Management", label: "Wealth Management" },
    { value: "Corporate Banking", label: "Corporate Banking" }
  ];

  const filteredServices = allServices.filter(category => 
    selectedCategory === "all" || category.category === selectedCategory
  ).flatMap(category => 
    category.services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Navigation */}
      <MainNavigation />

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Banking Solutions
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover our comprehensive range of banking services designed to meet all your financial needs, from personal banking to sophisticated corporate solutions.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search banking services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <service.icon className="h-6 w-6 mr-3 text-[hsl(var(--commerce-green))]" />
                  {service.name}
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = service.route}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help Choosing?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
};

export default AllServices;

