import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Briefcase, CheckCircle, Building, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import businessBankingImage from "@/assets/business-banking.jpg";

const BusinessBanking = () => {
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
                  <Briefcase className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Business Banking</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Complete banking solutions designed for businesses of all sizes. From startups to enterprises, we have the tools and expertise to help your business grow.
                </p>
                <Button variant="secondary" size="lg">
                  Open Business Account
                </Button>
              </div>
              <div className="lg:text-center">
                <img 
                  src={businessBankingImage} 
                  alt="Business Banking Services" 
                  className="rounded-lg shadow-2xl w-full max-w-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Business Solutions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[hsl(var(--commerce-green))] mb-12">Business Solutions by Size</h2>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Users className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-[hsl(var(--commerce-green))]">Small Business</CardTitle>
                  </div>
                  <CardDescription>
                    Perfect for startups and small businesses with under 50 employees.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Free business checking</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Business savings accounts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Business credit cards</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>SBA loan assistance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Mobile and online banking</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg">
                    <div className="text-sm text-muted-foreground">Monthly Fee</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">$0</div>
                    <div className="text-xs text-muted-foreground">With minimum balance</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Building className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-[hsl(var(--commerce-green))]">Commercial Banking</CardTitle>
                  </div>
                  <CardDescription>
                    Comprehensive solutions for mid-size businesses and corporations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Commercial loans</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Lines of credit</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Equipment financing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Commercial real estate loans</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Cash management services</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg">
                    <div className="text-sm text-muted-foreground">Loan Amounts</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">$100K+</div>
                    <div className="text-xs text-muted-foreground">Competitive rates</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-[hsl(var(--commerce-green))]">Treasury Services</CardTitle>
                  </div>
                  <CardDescription>
                    Advanced treasury management for large organizations and enterprises.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Cash flow management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>ACH and wire services</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Fraud prevention tools</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Investment services</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>International banking</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg">
                    <div className="text-sm text-muted-foreground">Dedicated Support</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">24/7</div>
                    <div className="text-xs text-muted-foreground">Relationship manager</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Industry Expertise */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-[hsl(var(--commerce-green))] mb-12">Industry Expertise</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">Healthcare</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Specialized banking solutions for medical practices and healthcare organizations.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">Real Estate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Construction loans, development financing, and property management services.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">Manufacturing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Equipment financing, working capital, and supply chain financing solutions.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">Technology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Venture debt, growth capital, and banking services for tech companies.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Business Tools & Resources */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <CardTitle>Business Tools & Resources</CardTitle>
                  <CardDescription>
                    Access powerful tools to manage your business finances effectively.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <div>
                        <div className="font-semibold">QuickBooks Integration</div>
                        <div className="text-sm text-muted-foreground">Seamless accounting integration</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <div>
                        <div className="font-semibold">Business Analytics</div>
                        <div className="text-sm text-muted-foreground">Comprehensive financial reporting</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <div>
                        <div className="font-semibold">Mobile Business Banking</div>
                        <div className="text-sm text-muted-foreground">Manage accounts on the go</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <div>
                        <div className="font-semibold">Merchant Services</div>
                        <div className="text-sm text-muted-foreground">Accept payments anywhere</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Support</CardTitle>
                  <CardDescription>
                    Get the support you need to grow your business with our expert guidance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Dedicated Relationship Manager</h4>
                      <p className="text-sm text-muted-foreground">
                        Personal banker who understands your business and provides tailored solutions.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Business Planning Resources</h4>
                      <p className="text-sm text-muted-foreground">
                        Access to business planning tools, market research, and financial projections.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">SBA Loan Expertise</h4>
                      <p className="text-sm text-muted-foreground">
                        Preferred SBA lender with streamlined application processes.
                      </p>
                    </div>
                    <Button variant="commerce" className="w-full">
                      Connect with Business Banker
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button variant="commerce" size="lg" className="text-lg px-8">
                Start Your Business Banking Relationship
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessBanking;