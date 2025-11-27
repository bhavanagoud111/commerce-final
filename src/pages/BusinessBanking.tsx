import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, DollarSign, CreditCard, CheckCircle, Users, TrendingUp, Shield, Clock, Home, ArrowLeft } from 'lucide-react';
import BusinessApplicationForm from '@/components/BusinessApplicationForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate, Link } from 'react-router-dom';

const BusinessBanking = () => {
  const navigate = useNavigate();
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<'business_checking' | 'business_savings' | 'merchant_services'>('business_checking');

  const businessAccounts = [
    {
      id: 'business_checking',
      name: 'Business Checking',
      description: 'Monthly Fee: $15 | Interest Rate: 0.01%',
      features: [
        'Unlimited transactions',
        'Online banking & mobile app',
        'Free business debit card',
        'Check writing privileges',
        'Monthly statements'
      ],
      requirements: {
        minimumBalance: '$0',
        transactionLimit: 'Unlimited'
      },
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'business_savings',
      name: 'Business Savings',
      description: 'Monthly Fee: $0 | Interest Rate: 1.5%',
      features: [
        'Higher interest rates',
        'Online transfers',
        'Mobile deposits',
        'Account alerts',
        'Monthly statements'
      ],
      requirements: {
        minimumBalance: '$100',
        transactionLimit: '6 per month'
      },
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'merchant_services',
      name: 'Merchant Services',
      description: 'Monthly Fee: $25 | Interest Rate: N/A',
      features: [
        'Credit card processing',
        'Point-of-sale solutions',
        'Online payment gateway',
        'Mobile payment options',
        '24/7 support'
      ],
      requirements: {
        minimumBalance: '$0',
        transactionLimit: 'Unlimited'
      },
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const handleOpenApplication = (accountType: 'business_checking' | 'business_savings' | 'merchant_services') => {
    setSelectedAccountType(accountType);
    setIsApplicationFormOpen(true);
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
                  <Building2 className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Business Banking Solutions</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Comprehensive banking solutions designed to help your business grow and succeed. From checking accounts to merchant services, we have everything you need.
                </p>
                <Button variant="secondary" size="lg" onClick={() => document.getElementById('business-accounts')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Services
                </Button>
              </div>
              <div className="lg:text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">10K+</div>
                      <div className="text-white/80 text-sm">Businesses</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">$5B+</div>
                      <div className="text-white/80 text-sm">Assets</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">24/7</div>
                      <div className="text-white/80 text-sm">Support</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white mb-2">1.5%</div>
                      <div className="text-white/80 text-sm">APY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="business-accounts" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">

        <div className="py-12">
        {/* Business Account Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {businessAccounts.map((account) => {
            const IconComponent = account.icon;
            return (
              <Card key={account.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 ${account.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 ${account.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{account.name}</CardTitle>
                      <CardDescription className="text-sm font-medium">{account.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Minimum Balance:</span>
                      <span className="font-medium">{account.requirements.minimumBalance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transaction Limit:</span>
                      <span className="font-medium">{account.requirements.transactionLimit}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-2">
                        {account.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => handleOpenApplication(account.id as 'business_checking' | 'business_savings' | 'merchant_services')}
                      className="w-full"
                      size="lg"
                    >
                      Open Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Why Choose Commerce Bank */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Why Choose Commerce Bank?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Business Growth Focus</h4>
                    <p className="text-sm text-gray-600">We understand business needs and provide solutions that scale with your growth.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Dedicated Support</h4>
                    <p className="text-sm text-gray-600">Personal business banking specialists available to help with your unique needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Quick Approval</h4>
                    <p className="text-sm text-gray-600">Fast application processing with decisions typically within 24-48 hours.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span>Application Process</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Complete Application</h4>
                    <p className="text-sm text-gray-600">Fill out our simple online application form.</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Document Review</h4>
                    <p className="text-sm text-gray-600">Our team reviews your application and supporting documents.</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Account Setup</h4>
                    <p className="text-sm text-gray-600">Once approved, your account is set up and ready to use.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
          </div>
        </section>
      </main>

      {/* Business Application Form Modal */}
      <BusinessApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        accountType={selectedAccountType}
      />

      <Footer />
    </div>
  );
};

export default BusinessBanking;