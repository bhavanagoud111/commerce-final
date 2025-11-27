import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import bankingCardsImage from "@/assets/banking-cards.jpg";

const BankingCards = () => {
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
                  <CreditCard className="h-10 w-10 text-white mr-4" />
                  <h1 className="text-4xl font-bold text-white">Banking & Cards</h1>
                </div>
                <p className="text-xl text-white/90 mb-8">
                  Complete banking solutions with checking accounts, savings, credit cards, and debit cards designed for your financial needs.
                </p>
                <Link to="/personal-banking">
                  <Button variant="secondary" size="lg">
                    Open an Account
                  </Button>
                </Link>
              </div>
              <div className="lg:text-center">
                <img 
                  src={bankingCardsImage} 
                  alt="Banking and Cards Services" 
                  className="rounded-lg shadow-2xl w-full max-w-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--commerce-green))]">Checking Accounts</CardTitle>
                  <CardDescription>
                    Interest-bearing checking accounts with no monthly fees and unlimited transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>No minimum balance required</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Free online and mobile banking</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Competitive interest rates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Free ATM access nationwide</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--commerce-green))]">Savings Accounts</CardTitle>
                  <CardDescription>
                    High-yield savings accounts to help you reach your financial goals faster.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>High interest rates up to 4.5% APY</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>No monthly maintenance fees</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Automatic savings programs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Goal-based savings tools</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--commerce-green))]">Credit Cards</CardTitle>
                  <CardDescription>
                    Reward credit cards with competitive rates and exclusive benefits.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Cash back rewards up to 3%</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>No annual fees on select cards</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Fraud protection and monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3" />
                      <span>Mobile wallet compatibility</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))/5] to-[hsl(var(--commerce-teal))/5] rounded-lg p-8">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-6">Why Choose Our Banking Services?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Digital Innovation</h3>
                  <p className="text-muted-foreground mb-4">
                    Experience banking at your fingertips with our award-winning mobile app and online banking platform. 
                    Manage your accounts, pay bills, deposit checks, and transfer money anytime, anywhere.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span className="text-sm">Mobile check deposit</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span className="text-sm">Instant account alerts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span className="text-sm">Bill pay and transfers</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Service</h3>
                  <p className="text-muted-foreground mb-4">
                    Get personalized attention from our experienced banking professionals. We're here to help you 
                    make informed financial decisions and achieve your goals.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span className="text-sm">24/7 customer support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span className="text-sm">Financial planning consultations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2" />
                      <span className="text-sm">Local branch support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BankingCards;