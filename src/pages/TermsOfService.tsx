import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, FileCheck, Users, Lock, Shield, CreditCard, Scale, AlertTriangle, XCircle, RefreshCw, Gavel, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center mb-6">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2 rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <FileCheck className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Terms of Service</h1>
                  <p className="text-lg text-white/90">
                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Please read these terms carefully. By using our services, you agree to be bound by these terms and conditions.
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Acceptance of Terms */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileCheck className="h-7 w-7 text-blue-600" />
                    1. Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="leading-relaxed">
                    Welcome to Commerce Bank. These Terms of Service ("Terms") govern your access to and use of Commerce Bank's website, online banking services, mobile applications, and other digital services (collectively, the "Services").
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-blue-900 font-medium">
                      By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our Services.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Users className="h-7 w-7 text-purple-600" />
                    2. Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">To use our Services, you must:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Be at least 18 years old (or the age of majority in your jurisdiction)",
                      "Have the legal capacity to enter into binding agreements",
                      "Provide accurate and complete information when creating an account",
                      "Comply with all applicable laws and regulations",
                      "Not be prohibited from using banking services under applicable law"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-purple-50 rounded-lg p-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Account Registration */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Lock className="h-7 w-7 text-green-600" />
                    3. Account Registration and Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="bg-green-50 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 text-green-900">3.1 Account Creation</h3>
                    <p className="mb-3 text-gray-700">To access certain Services, you must create an account. You agree to:</p>
                    <ul className="space-y-2 ml-4">
                      {["Provide accurate, current, and complete information", "Maintain and promptly update your account information", "Maintain the security of your account credentials", "Accept responsibility for all activities under your account"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 text-green-900">3.2 Security Obligations</h3>
                    <p className="mb-3 text-gray-700">You are responsible for:</p>
                    <ul className="space-y-2 ml-4">
                      {["Keeping your username, password, and other credentials confidential", "Using strong, unique passwords", "Promptly notifying us of any unauthorized access or security breach", "Logging out of your account when finished"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Use of Services */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-7 w-7 text-orange-600" />
                    4. Use of Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="bg-orange-50 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 text-orange-900">4.1 Permitted Use</h3>
                    <p className="text-gray-700">You may use our Services only for lawful purposes and in accordance with these Terms.</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                    <h3 className="font-semibold text-lg mb-3 text-red-900 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      4.2 Prohibited Activities
                    </h3>
                    <p className="mb-3 text-gray-700">You agree not to:</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {["Violate any applicable laws or regulations", "Infringe upon the rights of others", "Transmit any harmful, malicious, or fraudulent content", "Attempt to gain unauthorized access to our systems", "Use automated systems to access our Services without permission", "Interfere with or disrupt the Services", "Impersonate any person or entity", "Collect or harvest information about other users"].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Banking Services */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <CreditCard className="h-7 w-7 text-indigo-600" />
                    5. Banking Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="font-semibold text-indigo-900 mb-2">5.1 Account Terms</h3>
                      <p className="text-gray-700 mb-2">Your use of banking services is also governed by:</p>
                      <ul className="space-y-1 ml-4">
                        {["Your account agreement", "Deposit account disclosures", "Fee schedules", "Other applicable banking agreements"].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="font-semibold text-indigo-900 mb-2">5.2 Transaction Limits</h3>
                      <p className="text-gray-700">We reserve the right to set and modify transaction limits, including daily withdrawal limits, transfer limits, and other restrictions as we deem necessary for security or regulatory compliance.</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="font-semibold text-indigo-900 mb-2">5.3 Fees</h3>
                      <p className="text-gray-700">You agree to pay all fees associated with your accounts and Services as disclosed in our fee schedules. We reserve the right to modify fees with appropriate notice.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intellectual Property */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-cyan-500">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileCheck className="h-7 w-7 text-cyan-600" />
                    6. Intellectual Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">
                      All content, features, and functionality of our Services, including but not limited to text, graphics, logos, images, and software, are owned by Commerce Bank or its licensors and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                  </div>
                  <p className="text-gray-700 mt-4 leading-relaxed">
                    You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use our content without our express written permission.
                  </p>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
                <CardHeader className="bg-gradient-to-r from-red-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <AlertTriangle className="h-7 w-7 text-red-600" />
                    7. Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg space-y-3">
                    <p className="text-gray-700 font-semibold">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMMERCE BANK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                    </p>
                    <p className="text-gray-700">
                      Our liability for any claims arising out of or relating to these Terms or the Services shall not exceed the amount you paid us in the 12 months preceding the claim.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Indemnification */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-500">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-7 w-7 text-yellow-600" />
                    8. Indemnification
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">
                      You agree to indemnify, defend, and hold harmless Commerce Bank and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your use of the Services or violation of these Terms.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Termination */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-gray-500">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <XCircle className="h-7 w-7 text-gray-600" />
                    9. Termination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to suspend or terminate your access to the Services at any time, with or without cause or notice, for any reason including but not limited to breach of these Terms, fraudulent activity, or legal requirements.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You may terminate your account at any time by contacting us. Upon termination, your right to use the Services will immediately cease.
                  </p>
                </CardContent>
              </Card>

              {/* Dispute Resolution */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Gavel className="h-7 w-7 text-purple-600" />
                    10. Dispute Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      Any disputes arising out of or relating to these Terms or the Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
                    </p>
                    <p className="text-gray-700 font-medium">
                      You waive your right to a jury trial and to participate in class action lawsuits.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Changes to Terms */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-teal-500">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <RefreshCw className="h-7 w-7 text-teal-600" />
                    11. Changes to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Services after such modifications constitutes acceptance of the updated Terms.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-[hsl(var(--commerce-green))] bg-gradient-to-br from-[hsl(var(--commerce-green))/5] to-transparent">
                <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Mail className="h-7 w-7 text-[hsl(var(--commerce-green))]" />
                    12. Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">If you have questions about these Terms, please contact us:</p>
                  <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg p-6 space-y-3 border border-[hsl(var(--commerce-green))/20]">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-[hsl(var(--commerce-green))]">Commerce Bank Legal Department</p>
                        <p className="text-gray-700">Email: legal@commercebank.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="text-gray-700">Phone: 1-800-COMMERCE (1-800-266-6372)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gavel className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="text-gray-700">Mail: Commerce Bank, Legal Department, P.O. Box 1000, Your City, State ZIP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
