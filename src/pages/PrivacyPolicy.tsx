import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, Database, Eye, Lock, Users, Cookie, Baby, RefreshCw, Mail, FileText, Share2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const sections = [
    { id: 1, icon: FileText, title: "Introduction", color: "from-blue-500 to-blue-600" },
    { id: 2, icon: Database, title: "Information We Collect", color: "from-purple-500 to-purple-600" },
    { id: 3, icon: Eye, title: "How We Use Your Information", color: "from-green-500 to-green-600" },
    { id: 4, icon: Share2, title: "Information Sharing and Disclosure", color: "from-orange-500 to-orange-600" },
    { id: 5, icon: Lock, title: "Data Security", color: "from-red-500 to-red-600" },
    { id: 6, icon: Users, title: "Your Rights and Choices", color: "from-teal-500 to-teal-600" },
    { id: 7, icon: Cookie, title: "Cookies and Tracking Technologies", color: "from-yellow-500 to-yellow-600" },
    { id: 8, icon: Baby, title: "Children's Privacy", color: "from-pink-500 to-pink-600" },
    { id: 9, icon: RefreshCw, title: "Changes to This Privacy Policy", color: "from-indigo-500 to-indigo-600" },
    { id: 10, icon: Mail, title: "Contact Us", color: "from-gray-500 to-gray-600" },
  ];

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
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Privacy Policy</h1>
                  <p className="text-lg text-white/90">
                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Introduction */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="h-7 w-7 text-blue-600" />
                    1. Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="leading-relaxed">
                    Commerce Bank ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our online banking services, or interact with us in any way.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-blue-900 font-medium">
                      Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Information We Collect */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Database className="h-7 w-7 text-purple-600" />
                    2. Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="bg-purple-50 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 text-purple-900">2.1 Personal Information</h3>
                    <p className="mb-3 text-gray-700">We may collect personal information that you provide to us, including:</p>
                    <ul className="space-y-2 ml-4">
                      {["Name, date of birth, and Social Security number", "Contact information (address, phone number, email address)", "Account numbers and financial information", "Government-issued identification documents", "Employment and income information"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 text-purple-900">2.2 Transaction Information</h3>
                    <p className="text-gray-700">We collect information about your transactions with us, including account balances, payment history, and transaction details.</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3 text-purple-900">2.3 Technical Information</h3>
                    <p className="mb-3 text-gray-700">We automatically collect certain technical information when you visit our website or use our mobile app, including:</p>
                    <ul className="space-y-2 ml-4">
                      {["IP address and device identifiers", "Browser type and version", "Operating system", "Pages visited and time spent on pages", "Cookies and similar tracking technologies"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Information */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Eye className="h-7 w-7 text-green-600" />
                    3. How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">We use the information we collect for the following purposes:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Providing Services", desc: "To process transactions, maintain your accounts, and provide banking services" },
                      { title: "Communication", desc: "To send you account statements, transaction alerts, and important notices" },
                      { title: "Security", desc: "To verify your identity, prevent fraud, and protect against unauthorized access" },
                      { title: "Compliance", desc: "To comply with legal obligations and regulatory requirements" },
                      { title: "Improvement", desc: "To enhance our services, develop new products, and improve user experience" },
                      { title: "Marketing", desc: "To send you promotional materials (you can opt-out at any time)" },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-700">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Information Sharing */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Share2 className="h-7 w-7 text-orange-600" />
                    4. Information Sharing and Disclosure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                    <p className="font-semibold text-orange-900 mb-2">We do not sell your personal information.</p>
                  </div>
                  <p className="text-gray-700">We may share your information in the following circumstances:</p>
                  <ul className="space-y-3 ml-4">
                    {[
                      { title: "Service Providers", desc: "With third-party vendors who assist us in operating our business and providing services" },
                      { title: "Legal Requirements", desc: "When required by law, court order, or regulatory authority" },
                      { title: "Business Transfers", desc: "In connection with a merger, acquisition, or sale of assets" },
                      { title: "With Your Consent", desc: "When you explicitly authorize us to share your information" },
                      { title: "Credit Bureaus", desc: "To report account information as required by law" },
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-1.5 bg-orange-100 rounded-full mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <strong className="text-orange-900">{item.title}:</strong>
                          <span className="text-gray-700 ml-2">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
                <CardHeader className="bg-gradient-to-r from-red-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Lock className="h-7 w-7 text-red-600" />
                    5. Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {["Encryption of data in transit and at rest", "Secure socket layer (SSL) technology", "Multi-factor authentication", "Regular security audits and assessments", "Employee training on data protection"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-red-50 rounded-lg p-3">
                        <Lock className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                    <p className="text-sm text-gray-700">
                      However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-teal-500">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Users className="h-7 w-7 text-teal-600" />
                    6. Your Rights and Choices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">You have certain rights regarding your personal information:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Access", desc: "Request access to your personal information we hold" },
                      { title: "Correction", desc: "Request correction of inaccurate or incomplete information" },
                      { title: "Deletion", desc: "Request deletion of your personal information (subject to legal requirements)" },
                      { title: "Opt-Out", desc: "Unsubscribe from marketing communications" },
                      { title: "Data Portability", desc: "Request a copy of your data in a portable format" },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                        <h4 className="font-semibold text-teal-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-700">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg mt-4">
                    <p className="text-gray-700">
                      To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-500">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Cookie className="h-7 w-7 text-yellow-600" />
                    7. Cookies and Tracking Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar tracking technologies to collect and store information about your preferences and activities. Cookies help us:
                  </p>
                  <ul className="space-y-2 ml-4">
                    {["Remember your preferences and settings", "Analyze website traffic and usage patterns", "Provide personalized content and advertising", "Improve website functionality and performance"].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
                    <p className="text-gray-700">
                      You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Children's Privacy */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-pink-500">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Baby className="h-7 w-7 text-pink-600" />
                    8. Children's Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">
                      Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete such information.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Changes */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <RefreshCw className="h-7 w-7 text-indigo-600" />
                    9. Changes to This Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Us */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-[hsl(var(--commerce-green))] bg-gradient-to-br from-[hsl(var(--commerce-green))/5] to-transparent">
                <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Mail className="h-7 w-7 text-[hsl(var(--commerce-green))]" />
                    10. Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:</p>
                  <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg p-6 space-y-3 border border-[hsl(var(--commerce-green))/20]">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-[hsl(var(--commerce-green))]">Commerce Bank Privacy Office</p>
                        <p className="text-gray-700">Email: privacy@commercebank.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="text-gray-700">Phone: 1-800-COMMERCE (1-800-266-6372)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="text-gray-700">Mail: Commerce Bank, Privacy Office, P.O. Box 1000, Your City, State ZIP</p>
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

export default PrivacyPolicy;
