import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, CheckCircle, Lock, Eye, Smartphone, AlertTriangle, Download, BookOpen, Calendar, X } from "lucide-react";
import { Link } from "react-router-dom";
import digitalSecurityImage from "@/assets/digital-security.jpg";

const DigitalSecurity = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<any>(null);
  const [webinarEmail, setWebinarEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-16 bg-gradient-to-br from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center mb-6">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2 backdrop-blur-sm">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Digital Security</h1>
                </div>
                <p className="text-xl text-white/95 mb-8 leading-relaxed drop-shadow-md">
                  Advanced security features and fraud protection to safeguard your financial information and give you peace of mind in the digital age.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-[hsl(var(--commerce-green))] hover:bg-white/90 font-semibold"
                  onClick={() => setActiveModal('learn')}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn About Security
                </Button>
              </div>
              <div className="lg:text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/20 to-[hsl(var(--commerce-teal))]/20 rounded-lg blur-2xl"></div>
                  <img 
                    src={digitalSecurityImage} 
                    alt="Digital Security Services" 
                    className="relative rounded-xl shadow-2xl w-full max-w-lg mx-auto border-4 border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16 bg-gradient-to-b from-background via-gray-50/30 to-background relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--commerce-green))/3%_20%,transparent_40%,hsl(var(--commerce-teal))/3%_60%,transparent_80%,hsl(var(--commerce-green))/2%_100%)]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))]/10 to-[hsl(var(--commerce-teal))]/10 px-6 py-2 rounded-full border border-[hsl(var(--commerce-green))]/20">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">
                    Advanced Security Features
                  </h2>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive security solutions to protect your financial information
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="bg-gradient-to-br from-white via-gray-50/50 to-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-200/80 hover:border-[hsl(var(--commerce-green))]/40 group hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/0 to-[hsl(var(--commerce-teal))]/0 group-hover:from-[hsl(var(--commerce-green))]/5 group-hover:via-[hsl(var(--commerce-green))]/3 group-hover:to-[hsl(var(--commerce-teal))]/5 transition-all duration-300"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center mb-3">
                    <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))]/15 to-[hsl(var(--commerce-teal))]/15 p-3 rounded-xl mr-3 group-hover:from-[hsl(var(--commerce-green))]/25 group-hover:to-[hsl(var(--commerce-teal))]/25 transition-all shadow-md group-hover:shadow-lg">
                      <Lock className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">Multi-Factor Authentication</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">
                    Multiple layers of security to protect your accounts from unauthorized access.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center p-2 rounded-lg hover:bg-[hsl(var(--commerce-green))]/5 transition-colors group/item">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700">Biometric authentication</span>
                    </li>
                    <li className="flex items-center p-2 rounded-lg hover:bg-[hsl(var(--commerce-green))]/5 transition-colors group/item">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700">SMS and email verification</span>
                    </li>
                    <li className="flex items-center p-2 rounded-lg hover:bg-[hsl(var(--commerce-green))]/5 transition-colors group/item">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700">Secure authentication apps</span>
                    </li>
                    <li className="flex items-center p-2 rounded-lg hover:bg-[hsl(var(--commerce-green))]/5 transition-colors group/item">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700">Device registration</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-5 bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-xl border border-[hsl(var(--commerce-green))]/30 shadow-lg relative overflow-hidden group/stat">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/stat:via-white/20 transition-all"></div>
                    <div className="relative">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Security Level</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">Bank-Grade</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[hsl(var(--commerce-green))]/30 group">
                <CardHeader>
                  <div className="flex items-center mb-3">
                    <div className="bg-[hsl(var(--commerce-green))]/10 p-2 rounded-lg mr-3 group-hover:bg-[hsl(var(--commerce-green))]/20 transition-colors">
                      <Eye className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle className="text-xl text-[hsl(var(--commerce-green))]">Real-Time Monitoring</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    24/7 monitoring of your accounts for suspicious activity and potential fraud.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Transaction monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Behavioral analysis</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Instant fraud alerts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Location-based security</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-5 bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-xl border border-[hsl(var(--commerce-green))]/30 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="relative">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Response Time</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">Instant</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[hsl(var(--commerce-green))]/30 group">
                <CardHeader>
                  <div className="flex items-center mb-3">
                    <div className="bg-[hsl(var(--commerce-green))]/10 p-2 rounded-lg mr-3 group-hover:bg-[hsl(var(--commerce-green))]/20 transition-colors">
                      <Smartphone className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle className="text-xl text-[hsl(var(--commerce-green))]">Mobile Security</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Advanced mobile banking security features to protect your financial data on the go.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">App-based authentication</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Encrypted data transmission</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Remote app locking</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Secure messaging</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-5 bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-xl border border-[hsl(var(--commerce-green))]/30 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="relative">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Encryption</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">256-Bit</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fraud Protection Services */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent mb-4">
                  Comprehensive Fraud Protection
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Multi-layered protection to keep your accounts and identity safe
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[hsl(var(--commerce-green))]/30">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="bg-[hsl(var(--commerce-green))]/10 p-2 rounded-lg mr-3">
                        <AlertTriangle className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <CardTitle className="text-xl">Fraud Prevention</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Proactive measures to prevent fraud before it happens.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">AI-Powered Detection</h4>
                          <p className="text-sm text-muted-foreground">Machine learning algorithms detect unusual patterns</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Transaction Limits</h4>
                          <p className="text-sm text-muted-foreground">Customizable spending limits and restrictions</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Merchant Verification</h4>
                          <p className="text-sm text-muted-foreground">Verification of legitimate merchants and transactions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[hsl(var(--commerce-green))]/30">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <div className="bg-[hsl(var(--commerce-green))]/10 p-2 rounded-lg mr-3">
                        <Shield className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <CardTitle className="text-xl">Identity Protection</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Comprehensive identity monitoring and protection services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Dark Web Monitoring</h4>
                          <p className="text-sm text-muted-foreground">Continuous monitoring of your personal information</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Credit Monitoring</h4>
                          <p className="text-sm text-muted-foreground">Regular credit report monitoring and alerts</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Identity Recovery</h4>
                          <p className="text-sm text-muted-foreground">Dedicated support for identity theft recovery</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Security Tools */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <Card className="hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-xl">Security Control Center</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Manage all your security settings and preferences in one place.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Card Controls</span>
                        <div className="w-12 h-6 bg-[hsl(var(--commerce-green))] rounded-full shadow-sm"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">Lock/unlock cards instantly via mobile app</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Alert Preferences</span>
                        <div className="w-12 h-6 bg-[hsl(var(--commerce-green))] rounded-full shadow-sm"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">Customize security alerts and notifications</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Travel Notifications</span>
                        <div className="w-12 h-6 bg-muted rounded-full"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">Set travel dates to prevent declined transactions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-5 w-5 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-xl">Security Education</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Stay informed about the latest security threats and best practices.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all">
                      <h4 className="font-semibold mb-2 text-gray-900">Phishing Protection Guide</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn how to identify and avoid phishing emails and websites.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-900 hover:text-gray-900 hover:bg-[hsl(var(--commerce-green))]/5"
                        onClick={() => {
                          setModalContent({
                            type: 'guide',
                            title: 'Phishing Protection Guide',
                            icon: Download,
                            message: 'Thank you for your interest!',
                            details: 'The "Phishing Protection Guide" has been sent to your email address. Please check your inbox and spam folder.',
                            items: [
                              'How to identify phishing emails',
                              'Red flags to watch for',
                              'Steps to take if you receive a suspicious email',
                              'Best practices for email security'
                            ]
                          });
                          setActiveModal('action');
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Guide
                      </Button>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all">
                      <h4 className="font-semibold mb-2 text-gray-900">Password Security Tips</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Best practices for creating and managing secure passwords.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-900 hover:text-gray-900 hover:bg-[hsl(var(--commerce-green))]/5"
                        onClick={() => {
                          setModalContent({
                            type: 'tips',
                            title: 'Password Security Tips',
                            icon: BookOpen,
                            message: 'Essential password security practices',
                            items: [
                              'Use a unique password for each account',
                              'Make passwords at least 12 characters long',
                              'Include a mix of uppercase, lowercase, numbers, and symbols',
                              'Avoid using personal information (names, birthdays, etc.)',
                              'Consider using a password manager',
                              'Enable two-factor authentication when available',
                              'Change passwords regularly, especially after a security breach',
                              'Never share your passwords with anyone',
                              'Use passphrases instead of passwords when possible',
                              'Be cautious of password reset requests'
                            ]
                          });
                          setActiveModal('action');
                        }}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Tips
                      </Button>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all">
                      <h4 className="font-semibold mb-2 text-gray-900">Security Webinars</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Join our monthly security awareness webinars.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-900 hover:text-gray-900 hover:bg-[hsl(var(--commerce-green))]/5"
                        onClick={() => {
                          setModalContent({
                            type: 'webinar',
                            title: 'Security Webinar Registration',
                            icon: Calendar,
                            message: 'Thank you for your interest in our Security Awareness Webinars!',
                            details: 'You will receive a confirmation email with the webinar link and calendar invitation.',
                            items: [
                              '"Protecting Your Digital Identity" - First Tuesday of each month at 2:00 PM',
                              '"Safe Online Banking Practices" - Second Thursday of each month at 6:00 PM',
                              '"Recognizing and Avoiding Scams" - Third Wednesday of each month at 1:00 PM'
                            ],
                            note: 'All webinars are free and open to Commerce Bank customers.'
                          });
                          setActiveModal('action');
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Register Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Promise */}
            <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-2xl p-10 border border-[hsl(var(--commerce-green))]/30 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"></div>
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] bg-clip-text text-transparent mb-3">
                    Our Security Promise
                  </h2>
                  <p className="text-muted-foreground text-lg">Your security is our top priority</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-teal))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))]/15 to-[hsl(var(--commerce-teal))]/15 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <Shield className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">Zero Liability</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        You're not responsible for unauthorized transactions when you report them promptly. 
                        We'll investigate and restore your funds quickly.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-teal))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))]/15 to-[hsl(var(--commerce-teal))]/15 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <Eye className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Support</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our security team is available around the clock to help with any security concerns 
                        or to assist with account recovery.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-teal))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))]/15 to-[hsl(var(--commerce-teal))]/15 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <CheckCircle className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">Continuous Innovation</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We continuously invest in the latest security technologies and stay ahead of 
                        emerging threats to protect your financial information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Learn About Security Modal */}
      <Dialog open={activeModal === 'learn'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[hsl(var(--commerce-green))]/10 p-3 rounded-full">
                <Shield className="h-8 w-8 text-[hsl(var(--commerce-green))]" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center text-[hsl(var(--commerce-green))]">
              Digital Security Overview
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Learn how Commerce Bank protects your financial information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-[hsl(var(--commerce-green))]" />
                Multi-Layer Protection
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our security system uses multiple layers of protection including encryption, authentication, 
                and real-time monitoring to keep your accounts safe from unauthorized access.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2 text-[hsl(var(--commerce-green))]" />
                24/7 Monitoring
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Advanced AI-powered systems continuously monitor your accounts for suspicious activity, 
                detecting potential fraud before it impacts you.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-[hsl(var(--commerce-green))]" />
                Mobile Security
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our mobile banking app uses bank-grade encryption and biometric authentication to ensure 
                your financial data remains secure on any device.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Your Security Matters:</strong> We invest millions annually in security technology 
                and employ a dedicated team of security experts to protect your financial information.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              variant="commerce" 
              onClick={() => setActiveModal(null)}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Got it, thank you!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Modal (Guide, Tips, Webinar) */}
      <Dialog open={activeModal === 'action'} onOpenChange={(open) => {
        if (!open) {
          setActiveModal(null);
          setModalContent(null);
          setWebinarEmail("");
          setEmailError("");
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[hsl(var(--commerce-green))]/10 p-3 rounded-full">
                {modalContent?.icon && (() => {
                  const IconComponent = modalContent.icon as React.ComponentType<{ className?: string }>;
                  return <IconComponent className="h-8 w-8 text-[hsl(var(--commerce-green))]" />;
                })()}
              </div>
            </div>
            <DialogTitle className="text-2xl text-center text-[hsl(var(--commerce-green))]">
              {modalContent?.title}
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              {modalContent?.message}
            </DialogDescription>
          </DialogHeader>
          
          {modalContent && (
            <div className="space-y-4 py-4">
              {modalContent.type === 'webinar' && (
                <div className="space-y-2">
                  <Label htmlFor="webinar-email" className="text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="webinar-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={webinarEmail}
                    onChange={(e) => {
                      setWebinarEmail(e.target.value);
                      setEmailError("");
                    }}
                    className={emailError ? "border-red-500" : ""}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                </div>
              )}

              {modalContent.details && (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {modalContent.details}
                  </p>
                </div>
              )}

              {modalContent.items && modalContent.items.length > 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">
                    {modalContent.type === 'guide' ? 'This comprehensive guide includes:' : 
                     modalContent.type === 'tips' ? 'Key Recommendations:' : 'Upcoming Sessions:'}
                  </h4>
                  <ul className="space-y-2">
                    {modalContent.items.map((item: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-[hsl(var(--commerce-teal))] mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {modalContent.note && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    {modalContent.note}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button 
              variant="commerce" 
              onClick={() => {
                if (modalContent?.type === 'webinar') {
                  // Validate email for webinar registration
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!webinarEmail.trim()) {
                    setEmailError("Email address is required");
                    return;
                  }
                  if (!emailRegex.test(webinarEmail)) {
                    setEmailError("Please enter a valid email address");
                    return;
                  }
                  // Update details to include email
                  const updatedContent = {
                    ...modalContent,
                    details: `You will receive a confirmation email at ${webinarEmail} with the webinar link and calendar invitation.`
                  };
                  setModalContent(updatedContent);
                  // Show success message
                  setTimeout(() => {
                    setActiveModal(null);
                    setModalContent(null);
                    setWebinarEmail("");
                    setEmailError("");
                  }, 2000);
                } else {
                  setActiveModal(null);
                  setModalContent(null);
                  setWebinarEmail("");
                  setEmailError("");
                }
              }}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {modalContent?.type === 'webinar' ? 'Register Now' : 'Got it, thank you!'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DigitalSecurity;