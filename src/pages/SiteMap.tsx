import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ChevronRight, Map, Building2, Briefcase, Users, HelpCircle, Lock, Scale, CreditCard, TrendingUp, Home, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SiteMap = () => {
  const siteStructure = [
    {
      title: "Banking Services",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      links: [
        { name: "Personal Banking", path: "/personal-banking" },
        { name: "Business Banking", path: "/business-banking" },
        { name: "Corporate Banking", path: "/corporate-banking" },
        { name: "Wealth Management", path: "/wealth-management" },
        { name: "All Services", path: "/all-services" },
      ]
    },
    {
      title: "Service Categories",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      textColor: "text-purple-700",
      links: [
        { name: "Banking Cards", path: "/services/banking-cards" },
        { name: "Mortgages & Loans", path: "/services/mortgages-loans" },
        { name: "Investment Services", path: "/services/investment-services" },
        { name: "Business Banking Services", path: "/services/business-banking" },
        { name: "Wealth Management Services", path: "/services/wealth-management" },
        { name: "Digital Security", path: "/services/digital-security" },
      ]
    },
    {
      title: "About Commerce Bank",
      icon: Building2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-700",
      links: [
        { name: "Our Story", path: "/about" },
        { name: "Leadership Team", path: "/leadership" },
        { name: "Careers", path: "/careers" },
        { name: "News & Updates", path: "/news" },
      ]
    },
    {
      title: "Customer Support",
      icon: HelpCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      textColor: "text-orange-700",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "Customer Service", path: "/support" },
        { name: "Security Center", path: "/security" },
        { name: "Find Locations", path: "/locations" },
      ]
    },
    {
      title: "Account Access",
      icon: Lock,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-700",
      links: [
        { name: "Dashboard", path: "/dashboard", protected: true },
        { name: "Accounts", path: "/accounts", protected: true },
        { name: "Payments", path: "/payments", protected: true },
        { name: "Profile", path: "/profile", protected: true },
      ]
    },
    {
      title: "Legal & Compliance",
      icon: Scale,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-500",
      textColor: "text-indigo-700",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms-of-service" },
        { name: "Accessibility", path: "/accessibility" },
        { name: "Disclosures", path: "/disclosures" },
      ]
    }
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
                  <Map className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Site Map</h1>
                  <p className="text-lg text-white/90">
                    Navigate through all sections of our website
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Find everything you need quickly and easily with our comprehensive site map.
              </p>
            </div>
          </div>
        </section>

        {/* Site Map Content */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteStructure.map((section, index) => {
                  const IconComponent = section.icon;
                  return (
                    <Card key={index} className={`h-full border-2 hover:shadow-xl transition-all duration-300 border-l-4 ${section.borderColor}`}>
                      <CardHeader className={`bg-gradient-to-r ${section.bgColor} to-transparent`}>
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color} text-white`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span>{section.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-2">
                          {section.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <Link
                                to={link.path}
                                className="flex items-center gap-2 text-gray-700 hover:text-[hsl(var(--commerce-green))] transition-colors group"
                              >
                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[hsl(var(--commerce-green))]" />
                                <span className="flex-1">{link.name}</span>
                                {link.protected && (
                                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Login Required</span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quick Links */}
              <Card className="mt-8 border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-[hsl(var(--commerce-green))]">
                <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <TrendingUp className="h-7 w-7 text-[hsl(var(--commerce-green))]" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4 text-[hsl(var(--commerce-green))] flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Most Popular
                      </h3>
                      <ul className="space-y-3">
                        {[
                          { name: "Home", path: "/", icon: Home },
                          { name: "Online Banking", path: "/dashboard", icon: Lock },
                          { name: "All Services", path: "/all-services", icon: Briefcase },
                          { name: "Contact Us", path: "/contact", icon: Mail },
                          { name: "Customer Service", path: "/support", icon: HelpCircle },
                        ].map((link, idx) => (
                          <li key={idx}>
                            <Link
                              to={link.path}
                              className="flex items-center gap-3 text-gray-700 hover:text-[hsl(var(--commerce-green))] transition-colors group"
                            >
                              <link.icon className="h-4 w-4" />
                              <span>{link.name}</span>
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 text-[hsl(var(--commerce-green))] flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        Customer Resources
                      </h3>
                      <ul className="space-y-3">
                        {[
                          { name: "Security Center", path: "/security", icon: Lock },
                          { name: "Privacy Policy", path: "/privacy-policy", icon: Lock },
                          { name: "Terms of Service", path: "/terms-of-service", icon: Scale },
                          { name: "Accessibility", path: "/accessibility", icon: Users },
                          { name: "Disclosures", path: "/disclosures", icon: MessageSquare },
                        ].map((link, idx) => (
                          <li key={idx}>
                            <Link
                              to={link.path}
                              className="flex items-center gap-3 text-gray-700 hover:text-[hsl(var(--commerce-green))] transition-colors group"
                            >
                              <link.icon className="h-4 w-4" />
                              <span>{link.name}</span>
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card className="mt-8 border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-[hsl(var(--commerce-teal))] bg-gradient-to-br from-[hsl(var(--commerce-teal))/10] to-[hsl(var(--commerce-green))/10]">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white mb-4">
                      <HelpCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Need Help Finding Something?</h3>
                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                      If you can't find what you're looking for, our customer service team is here to help. Contact us anytime for assistance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild variant="commerce" size="lg">
                        <Link to="/contact" className="flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          Contact Us
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link to="/support" className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Get Support
                        </Link>
                      </Button>
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

export default SiteMap;
