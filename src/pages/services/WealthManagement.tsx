import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, PiggyBank, CheckCircle, Crown, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import wealthManagementImage from "@/assets/wealth-management.jpg";

const WealthManagement = () => {
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
                  <PiggyBank className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Wealth Management</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Comprehensive wealth management and private banking services designed for high-net-worth individuals and families seeking personalized financial solutions.
                </p>
                <Button variant="secondary" size="lg">
                  Schedule Private Consultation
                </Button>
              </div>
              <div className="lg:text-center">
                <img 
                  src={wealthManagementImage} 
                  alt="Wealth Management Services" 
                  className="rounded-lg shadow-2xl w-full max-w-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Wealth Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[hsl(var(--commerce-green))] mb-12">Exclusive Wealth Services</h2>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Crown className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-[hsl(var(--commerce-green))]">Private Banking</CardTitle>
                  </div>
                  <CardDescription>
                    Exclusive banking services with dedicated private bankers and priority access.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Dedicated relationship manager</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Private banking suite access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Concierge banking services</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Preferential loan rates</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg">
                    <div className="text-sm text-muted-foreground">Minimum Relationship</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">$1M</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Shield className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-[hsl(var(--commerce-green))]">Trust Services</CardTitle>
                  </div>
                  <CardDescription>
                    Comprehensive trust and estate planning services to protect and transfer wealth.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Revocable and irrevocable trusts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Estate administration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Charitable giving strategies</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Business succession planning</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg">
                    <div className="text-sm text-muted-foreground">Trust Assets Managed</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">$5B+</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-[hsl(var(--commerce-green))]">Investment Management</CardTitle>
                  </div>
                  <CardDescription>
                    Sophisticated investment strategies tailored to preserve and grow wealth.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Custom portfolio construction</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Alternative investments</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Tax-efficient strategies</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Risk management solutions</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg">
                    <div className="text-sm text-muted-foreground">Average Portfolio Performance</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">12.3%</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estate Planning Services */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-[hsl(var(--commerce-green))] mb-12">Estate Planning Services</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Comprehensive Estate Planning</CardTitle>
                    <CardDescription>
                      Protect your legacy with our comprehensive estate planning services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Will and Testament Preparation</h4>
                          <p className="text-sm text-muted-foreground">Comprehensive will drafting and regular updates</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Power of Attorney</h4>
                          <p className="text-sm text-muted-foreground">Financial and healthcare power of attorney documents</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Tax Minimization Strategies</h4>
                          <p className="text-sm text-muted-foreground">Reduce estate taxes and maximize inheritance</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Family Wealth Transfer</CardTitle>
                    <CardDescription>
                      Strategies to efficiently transfer wealth across generations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Generation-Skipping Trusts</h4>
                          <p className="text-sm text-muted-foreground">Transfer wealth to grandchildren tax-efficiently</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Family Limited Partnerships</h4>
                          <p className="text-sm text-muted-foreground">Maintain control while transferring ownership</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Charitable Planning</h4>
                          <p className="text-sm text-muted-foreground">Philanthropic strategies that benefit your legacy</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Exclusive Benefits */}
            <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))/5] to-[hsl(var(--commerce-teal))/5] rounded-lg p-8 mb-16">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-6">Exclusive Client Benefits</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Priority Access</h3>
                  <p className="text-muted-foreground mb-4">
                    Skip the lines with priority access to all banking services, exclusive events, and premier investment opportunities.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span>VIP banking hours</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span>Exclusive investment opportunities</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Global Services</h3>
                  <p className="text-muted-foreground mb-4">
                    Access international banking services and investment opportunities worldwide through our global network.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span>International wire transfers</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span>Foreign exchange services</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Family Office Services</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive family office services including bill pay, lifestyle management, and coordinated financial planning.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span>Personal CFO services</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span>Multi-generational planning</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button variant="commerce" size="lg" className="text-lg px-8">
                Discover Wealth Management Solutions
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WealthManagement;