import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, AlertTriangle, Lock, Eye, Smartphone, CreditCard, Wifi, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Security = () => {
  const securityTips = [
    {
      icon: <Lock className="h-6 w-6 text-[hsl(var(--commerce-green))]" />,
      title: "Strong Passwords",
      description: "Use unique, complex passwords with at least 12 characters including numbers, symbols, and mixed case letters."
    },
    {
      icon: <Eye className="h-6 w-6 text-[hsl(var(--commerce-green))]" />,
      title: "Monitor Your Accounts",
      description: "Regularly review your account statements and transaction history for any unauthorized activity."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-[hsl(var(--commerce-green))]" />,
      title: "Secure Your Devices",
      description: "Keep your devices updated, use biometric authentication, and avoid public Wi-Fi for banking."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-[hsl(var(--commerce-green))]" />,
      title: "Protect Your Cards",
      description: "Never share your card details, use contactless payments when possible, and report lost cards immediately."
    }
  ];

  const fraudTypes = [
    {
      title: "Phishing Emails",
      description: "Fraudulent emails pretending to be from your bank asking for personal information.",
      prevention: "Never click links in suspicious emails. Always go directly to our website."
    },
    {
      title: "Phone Scams",
      description: "Criminals calling pretending to be bank representatives asking for account details.",
      prevention: "We never call asking for your password or PIN. Hang up and call us directly."
    },
    {
      title: "Identity Theft",
      description: "Someone using your personal information to open accounts or make purchases.",
      prevention: "Monitor your credit reports and report suspicious activity immediately."
    },
    {
      title: "Card Skimming",
      description: "Devices placed on ATMs or card readers to steal your card information.",
      prevention: "Check for loose or unusual devices on card readers before using them."
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
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold text-white mb-6">Security Center</h1>
              <p className="text-xl text-white/90 mb-8">
                Your security is our top priority. Learn how to protect yourself from fraud, secure your accounts, and stay informed about the latest security threats and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Security Alert */}
        <section className="py-8 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Alert:</strong> We're seeing an increase in phishing attempts targeting our customers. 
                  Remember, Commerce Bank will never ask for your password, PIN, or account details via email, phone, or text message.
                  <Button 
                    variant="link" 
                    className="p-0 ml-2 h-auto"
                    onClick={() => alert('If you receive a suspicious call, email, or text claiming to be from Commerce Bank:\n\n1. Do not provide any personal information\n2. Hang up or delete the message\n3. Call us directly at 1-800-COMMERCE\n4. Report the incident to our fraud department\n\nWe take security seriously and will investigate all reported incidents.')}
                  >
                    Learn More
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        {/* Security Tips */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-12 text-center">Security Best Practices</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {securityTips.map((tip, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        {tip.icon}
                      </div>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tip.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Fraud Prevention */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-12 text-center">Common Fraud Types & Prevention</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {fraudTypes.map((fraud, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">{fraud.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{fraud.description}</p>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">How to Protect Yourself:</h4>
                        <p className="text-green-700">{fraud.prevention}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-12 text-center">Our Security Features</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Shield className="h-8 w-8 text-[hsl(var(--commerce-green))] mr-3" />
                      <CardTitle>Multi-Factor Authentication</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Additional security layer requiring multiple forms of verification to access your accounts.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Wifi className="h-8 w-8 text-[hsl(var(--commerce-green))] mr-3" />
                      <CardTitle>Encrypted Connections</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      All online banking sessions use 256-bit SSL encryption to protect your data.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-8 w-8 text-[hsl(var(--commerce-green))] mr-3" />
                      <CardTitle>Fraud Monitoring</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      24/7 monitoring of your accounts for suspicious activity with instant alerts.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Report Fraud */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-red-800 mb-6">Report Suspicious Activity</h2>
              <p className="text-lg text-red-700 mb-8">
                If you notice any suspicious activity on your account or believe you've been a victim of fraud, 
                contact us immediately. We're here to help protect your accounts and resolve any issues.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-800">Immediate Action Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        variant="destructive" 
                        size="lg" 
                        className="w-full"
                        onClick={() => alert('Fraud Hotline: 1-800-FRAUD-CB (1-800-372-8322)\n\nAvailable 24/7 for immediate assistance with:\n• Unauthorized transactions\n• Lost or stolen cards\n• Identity theft\n• Suspicious account activity\n\nOur fraud specialists will help secure your accounts and investigate the incident.')}
                      >
                        Call Fraud Hotline
                      </Button>
                      <p className="text-sm text-gray-600">
                        24/7 Emergency Fraud Hotline
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-800">Online Reporting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => alert('Online Fraud Reporting:\n\n1. Log into your online banking account\n2. Go to the "Security" section\n3. Click "Report Fraud"\n4. Fill out the fraud report form\n5. Submit for immediate review\n\nYou can also email fraud@commercebank.com with details of the incident.')}
                      >
                        Report Online
                      </Button>
                      <p className="text-sm text-gray-600">
                        Secure online fraud reporting form
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Security Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-8 text-center">Additional Resources</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>✓ Use strong, unique passwords</li>
                      <li>✓ Enable two-factor authentication</li>
                      <li>✓ Keep software updated</li>
                      <li>✓ Monitor account activity</li>
                      <li>✓ Be cautious with emails</li>
                      <li>✓ Secure your devices</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Stay informed about the latest security threats and best practices.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => alert('Security Education Resources:\n\n• Monthly security newsletters\n• Webinars on fraud prevention\n• Security awareness training\n• Latest threat intelligence\n\nSign up for our security alerts at security.commercebank.com to stay informed about new threats and protection methods.')}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Security;
