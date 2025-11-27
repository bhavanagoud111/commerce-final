import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, Home, DollarSign, FileText, CreditCard, AlertCircle, Mail, Phone, ExternalLink, Lock, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Disclosures = () => {
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
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Disclosures</h1>
                  <p className="text-lg text-white/90">
                    Important banking information and legal disclosures
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Important information about our banking products, services, and legal disclosures.
              </p>
            </div>
          </div>
        </section>

        {/* Disclosures Content */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* FDIC Insurance */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-transparent">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-7 w-7 text-blue-600" />
                    FDIC Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="font-semibold text-blue-900 mb-2">Member FDIC</p>
                    <p className="text-gray-700">
                      Commerce Bank is a member of the Federal Deposit Insurance Corporation (FDIC). Deposits are insured up to the maximum amount allowed by law.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    The standard insurance amount is <strong>$250,000 per depositor, per insured bank</strong>, for each account ownership category. This includes principal and accrued interest up to the insured limit.
                  </p>
                  <div className="bg-blue-100 rounded-lg p-4 border border-blue-300">
                    <p className="text-sm text-gray-700 mb-2">For more information about FDIC insurance coverage:</p>
                    <a href="https://www.fdic.gov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium">
                      <ExternalLink className="h-4 w-4" />
                      Visit www.fdic.gov
                    </a>
                    <p className="text-sm text-gray-700 mt-2">Call 1-877-ASK-FDIC (1-877-275-3342)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Equal Housing Lender */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Home className="h-7 w-7 text-green-600" />
                    Equal Housing Lender
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">
                      Commerce Bank is an Equal Housing Lender. We do business in accordance with the Fair Housing Act and Equal Credit Opportunity Act.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    It is illegal to discriminate against any person because of race, color, religion, national origin, sex, familial status (including children under the age of 18 living with parents or legal custodians, pregnant women, and people securing custody of children under 18), or handicap (disability) in:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Selling or renting housing",
                      "Providing mortgage financing",
                      "Providing appraisal services",
                      "Setting terms, conditions, or privileges",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                        <Scale className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-r-lg mt-4">
                    <p className="text-sm text-gray-700 mb-2">If you believe you have been discriminated against:</p>
                    <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium">
                      <ExternalLink className="h-4 w-4" />
                      File a complaint with the Consumer Financial Protection Bureau
                    </a>
                    <p className="text-sm text-gray-700 mt-2">Call 1-855-411-2372</p>
                  </div>
                </CardContent>
              </Card>

              {/* Truth in Savings */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <DollarSign className="h-7 w-7 text-purple-600" />
                    Truth in Savings Disclosure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    The Annual Percentage Yield (APY) and interest rates for deposit accounts are subject to change without notice. Current rates and terms are disclosed at account opening and in your account agreement.
                  </p>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-5 rounded-r-lg">
                    <p className="font-semibold text-purple-900 mb-3">Important Information About Interest Rates:</p>
                    <ul className="space-y-2">
                      {[
                        "Interest rates and APY may vary based on account type and balance",
                        "Interest is calculated on a daily basis",
                        "Minimum balance requirements may apply",
                        "Fees may reduce earnings on interest-bearing accounts",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <DollarSign className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                      Please refer to your specific account agreement and fee schedule for complete details about your account terms, conditions, and fees.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Loan Disclosures */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <CreditCard className="h-7 w-7 text-orange-600" />
                    Loan Disclosures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    All loans are subject to credit approval. Rates, terms, and conditions are subject to change without notice. Actual rates may vary based on creditworthiness, loan amount, loan term, and other factors.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Mortgage Loans",
                        items: [
                          "APR (Annual Percentage Rate) includes interest and certain fees",
                          "Property insurance and taxes may be required",
                          "Early payment penalties may apply on some loan products",
                        ]
                      },
                      {
                        title: "Personal Loans",
                        items: [
                          "Fixed and variable rate options available",
                          "Origination fees may apply",
                          "Minimum and maximum loan amounts vary by product",
                        ]
                      },
                      {
                        title: "Credit Cards",
                        items: [
                          "APR varies based on creditworthiness",
                          "Annual fees may apply",
                          "Cash advance fees and balance transfer fees may apply",
                          "See cardholder agreement for complete terms",
                        ]
                      },
                    ].map((loanType, idx) => (
                      <div key={idx} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h3 className="font-semibold text-lg mb-3 text-orange-900">{loanType.title}</h3>
                        <ul className="space-y-2">
                          {loanType.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2">
                              <CreditCard className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fees and Charges */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
                <CardHeader className="bg-gradient-to-r from-red-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <AlertCircle className="h-7 w-7 text-red-600" />
                    Fees and Charges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    Various fees and charges may apply to your accounts and services. Common fees include:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { title: "Monthly Service Fees", desc: "Some accounts may have monthly maintenance fees" },
                      { title: "Overdraft Fees", desc: "Fees may apply for overdrafts and returned items" },
                      { title: "ATM Fees", desc: "Fees may apply for using non-Commerce Bank ATMs" },
                      { title: "Wire Transfer Fees", desc: "Fees apply for domestic and international wire transfers" },
                      { title: "Stop Payment Fees", desc: "Fees for stop payment requests" },
                      { title: "Account Research Fees", desc: "Fees for account research and copies of statements" },
                    ].map((fee, idx) => (
                      <div key={idx} className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <h4 className="font-semibold text-red-900 mb-1">{fee.title}</h4>
                        <p className="text-sm text-gray-700">{fee.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-r-lg mt-4">
                    <p className="text-sm text-gray-700">
                      Fee schedules are provided at account opening and are available upon request. We will notify you in advance of any fee changes as required by law.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy and Data Security */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-teal-500">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Lock className="h-7 w-7 text-teal-600" />
                    Privacy and Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    Commerce Bank is committed to protecting your personal and financial information. We collect and use information as described in our Privacy Policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We implement security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.
                  </p>
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                    <p className="text-gray-700">
                      For complete information about how we collect, use, and protect your information, please review our{" "}
                      <Link to="/privacy-policy" className="text-teal-700 hover:text-teal-900 font-medium underline">
                        Privacy Policy
                      </Link>.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Reporting */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-500">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="h-7 w-7 text-yellow-600" />
                    Tax Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We will provide you with appropriate tax forms (such as Form 1099-INT) for interest earned on your accounts. It is your responsibility to report all interest income on your tax returns.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r-lg">
                    <p className="font-semibold text-yellow-900">
                      Important: Commerce Bank and its affiliates do not provide tax or legal advice. Please consult your tax advisor or attorney for guidance regarding your specific tax situation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Information */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Scale className="h-7 w-7 text-indigo-600" />
                    Regulatory Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    Commerce Bank is regulated by various federal and state banking authorities. Our primary federal regulator is the Office of the Comptroller of the Currency (OCC).
                  </p>
                  <p className="text-gray-700 font-medium">For information about filing a complaint or concern, you may contact:</p>
                  <div className="grid md:grid-cols-1 gap-3">
                    {[
                      { name: "Consumer Financial Protection Bureau", url: "https://www.consumerfinance.gov", phone: "1-855-411-2372" },
                      { name: "Office of the Comptroller of the Currency", url: "https://www.occ.gov", phone: "1-800-613-6743" },
                      { name: "FDIC", url: "https://www.fdic.gov", phone: "1-877-ASK-FDIC" },
                    ].map((reg, idx) => (
                      <div key={idx} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <p className="font-semibold text-indigo-900 mb-2">{reg.name}</p>
                        <a href={reg.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 text-sm mb-1">
                          <ExternalLink className="h-4 w-4" />
                          {reg.url}
                        </a>
                        <p className="text-sm text-gray-700">Phone: {reg.phone}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Us */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-[hsl(var(--commerce-green))] bg-gradient-to-br from-[hsl(var(--commerce-green))/5] to-transparent">
                <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Mail className="h-7 w-7 text-[hsl(var(--commerce-green))]" />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="text-gray-700">If you have questions about these disclosures or need additional information about your accounts, please contact us:</p>
                  <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg p-6 space-y-3 border border-[hsl(var(--commerce-green))/20]">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="font-semibold text-[hsl(var(--commerce-green))]">Commerce Bank Customer Service</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="text-gray-700">Phone: 1-800-COMMERCE (1-800-266-6372)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="text-gray-700">Email: support@commercebank.com</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-1 flex-shrink-0" />
                      <p className="text-gray-700">Mail: Commerce Bank, Customer Service, P.O. Box 1000, Your City, State ZIP</p>
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

export default Disclosures;
