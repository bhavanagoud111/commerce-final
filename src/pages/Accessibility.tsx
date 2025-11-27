import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, Monitor, Smartphone, Users, Mail, Phone, CheckCircle2, Eye, Keyboard, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Accessibility = () => {
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
                  <h1 className="text-5xl font-bold text-white mb-2">Accessibility</h1>
                  <p className="text-lg text-white/90">
                    Ensuring equal access for everyone
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Commerce Bank is committed to ensuring our digital services are accessible to all customers, including those with disabilities.
              </p>
            </div>
          </div>
        </section>

        {/* Accessibility Content */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Our Commitment */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-[hsl(var(--commerce-green))] bg-gradient-to-br from-[hsl(var(--commerce-green))/5] to-transparent">
                <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-7 w-7 text-[hsl(var(--commerce-green))]" />
                    Our Commitment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 pt-6">
                  <p className="leading-relaxed">
                    Commerce Bank is dedicated to providing equal access to our banking services for all individuals, regardless of ability. We strive to meet or exceed the accessibility standards set forth in the Americans with Disabilities Act (ADA) and the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
                  </p>
                  <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] border-l-4 border-[hsl(var(--commerce-green))] p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">
                      We continuously work to improve the accessibility of our website, online banking platform, and mobile applications to ensure they are usable by everyone.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Website Accessibility */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Monitor className="h-7 w-7 text-blue-600" />
                    Website Accessibility Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">Our website includes the following accessibility features:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: Keyboard, title: "Keyboard Navigation", desc: "All functions can be accessed using only a keyboard" },
                      { icon: Eye, title: "Screen Reader Compatibility", desc: "Compatible with popular screen reading software" },
                      { icon: Settings, title: "Alternative Text", desc: "Images include descriptive alternative text" },
                      { icon: Monitor, title: "High Contrast Mode", desc: "Supports high contrast display settings" },
                      { icon: Settings, title: "Text Scaling", desc: "Text can be resized up to 200% without loss of functionality" },
                      { icon: Eye, title: "Focus Indicators", desc: "Clear visual indicators for keyboard focus" },
                      { icon: Keyboard, title: "Consistent Navigation", desc: "Consistent navigation structure throughout the site" },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <feature.icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-700">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mobile App */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Smartphone className="h-7 w-7 text-purple-600" />
                    Mobile App Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">Our mobile banking application includes accessibility features:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "VoiceOver and TalkBack support for screen readers",
                      "Voice commands for key functions",
                      "High contrast and dark mode options",
                      "Adjustable font sizes",
                      "Touch target sizes that meet accessibility guidelines",
                      "Haptic feedback for important actions",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-purple-50 rounded-lg p-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Branch Accessibility */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Users className="h-7 w-7 text-green-600" />
                    Branch Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700">Our physical branch locations are designed to be accessible:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Wheelchair-accessible entrances and facilities",
                      "Accessible parking spaces",
                      "Accessible ATMs and teller windows",
                      "Assistive listening devices available upon request",
                      "Service animals welcome",
                      "Staff trained in disability awareness and assistance",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Assistive Technologies */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Settings className="h-7 w-7 text-orange-600" />
                    Assistive Technologies We Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <p className="text-gray-700">Our services are compatible with a variety of assistive technologies:</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-orange-50 rounded-lg p-5">
                      <h3 className="font-semibold text-lg mb-4 text-orange-900">Screen Readers</h3>
                      <ul className="space-y-2">
                        {["JAWS (Windows)", "NVDA (Windows)", "VoiceOver (Mac/iOS)", "TalkBack (Android)"].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-orange-600" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-5">
                      <h3 className="font-semibold text-lg mb-4 text-orange-900">Other Tools</h3>
                      <ul className="space-y-2">
                        {["Speech recognition software", "Switch navigation devices", "Screen magnification software", "Braille displays"].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-orange-600" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Issue */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500 bg-gradient-to-br from-red-50/50 to-transparent">
                <CardHeader className="bg-gradient-to-r from-red-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Mail className="h-7 w-7 text-red-600" />
                    Report an Accessibility Issue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    If you encounter any accessibility barriers on our website or digital services, please let us know. We take your feedback seriously and will work to address any issues promptly.
                  </p>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <p className="font-semibold text-red-900 mb-2">When reporting an issue, please include:</p>
                    <ul className="space-y-1 ml-4">
                      {["The page or service where you encountered the issue", "A description of the problem", "The assistive technology you're using (if applicable)", "Your contact information (optional, but helpful for follow-up)"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                    <h3 className="font-semibold text-lg mb-4 text-red-900">Contact Our Accessibility Team</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <span className="text-gray-700">Email: accessibility@commercebank.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <span className="text-gray-700">Phone: 1-800-COMMERCE (1-800-266-6372), Option 5</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-4 pl-8">
                        TTY/TDD users can reach us at 1-800-COMMERCE-TTY
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ongoing Improvements */}
              <Card className="border-2 hover:shadow-xl transition-all duration-300 border-l-4 border-l-teal-500">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Heart className="h-7 w-7 text-teal-600" />
                    Ongoing Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    Accessibility is an ongoing effort. We regularly review and update our digital properties to improve accessibility and stay current with evolving standards and technologies.
                  </p>
                  <p className="text-gray-700 font-medium">Our accessibility program includes:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {["Regular accessibility audits and testing", "User testing with individuals with disabilities", "Training for our development and content teams", "Partnership with accessibility organizations", "Continuous monitoring and improvement processes"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-teal-50 rounded-lg p-3">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
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

export default Accessibility;
