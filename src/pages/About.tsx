import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Users, Award, Heart, TrendingUp, Shield, Globe, Building2, Target, Zap, CheckCircle2, Calendar, MapPin, DollarSign, Briefcase, Star, Lightbulb, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="relative pt-16 pb-0 bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="container mx-auto px-4 pb-16 relative z-10">
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
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Our Story</h1>
                  <p className="text-lg text-white/90">
                    150+ years of trusted banking excellence
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                For over 150 years, Commerce Bank has been a trusted financial partner, helping individuals, families, and businesses achieve their financial goals through innovative banking solutions and exceptional service. From our humble beginnings to becoming one of the nation's leading financial institutions, our commitment to integrity, innovation, and community has never wavered.
              </p>
            </div>
          </div>
        </div>

        {/* Company Stats - Enhanced */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Commerce Bank by the Numbers</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our impact and reach across the communities we serve
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Calendar, value: "150+", label: "Years of Service", color: "from-blue-500 to-blue-600" },
                  { icon: Users, value: "2M+", label: "Customers Served", color: "from-green-500 to-green-600" },
                  { icon: MapPin, value: "500+", label: "Branch Locations", color: "from-purple-500 to-purple-600" },
                  { icon: DollarSign, value: "$50B+", label: "Assets Under Management", color: "from-orange-500 to-orange-600" },
                  { icon: Briefcase, value: "15,000+", label: "Team Members", color: "from-teal-500 to-teal-600" },
                  { icon: Target, value: "15", label: "States Served", color: "from-pink-500 to-pink-600" },
                  { icon: Star, value: "4.8/5", label: "Customer Rating", color: "from-yellow-500 to-yellow-600" },
                  { icon: Award, value: "50+", label: "Industry Awards", color: "from-indigo-500 to-indigo-600" }
                ].map((stat, idx) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={idx} className="text-center border-2 hover:shadow-xl transition-all duration-300">
                      <CardHeader className="bg-gradient-to-br from-[hsl(var(--commerce-green))/5] to-transparent">
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-full text-white`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-2">{stat.value}</div>
                        <CardDescription className="text-base font-medium">{stat.label}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Company History - Enhanced Timeline */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Our Journey Through Time</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  A legacy of innovation, trust, and growth spanning over a century and a half
                </p>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] hidden md:block"></div>
                
                <div className="space-y-12">
                  {[
                    {
                      year: "1870s",
                      title: "The Beginning",
                      content: "Commerce Bank was founded in 1873 by a group of visionary local businessmen who recognized the need for a reliable financial institution in our growing community. Starting with just $50,000 in capital, we opened our first branch in the heart of downtown, serving local merchants, farmers, and families. Our founders established principles of trust, integrity, and community service that continue to guide us today.",
                      icon: Building2,
                      color: "from-blue-500 to-blue-600",
                      achievements: ["Founded with $50,000 capital", "First branch opened", "Serving local community"]
                    },
                    {
                      year: "1920s",
                      title: "Regional Expansion",
                      content: "During the roaring twenties, Commerce Bank expanded across the region, opening branches in neighboring towns and cities. We introduced innovative services like personal loans and specialized savings accounts, making banking more accessible to everyday Americans. The bank survived the Great Depression by maintaining conservative lending practices and supporting our customers through difficult times.",
                      icon: MapPin,
                      color: "from-green-500 to-green-600",
                      achievements: ["Multi-city expansion", "Personal loans introduced", "Survived Great Depression"]
                    },
                    {
                      year: "1950s",
                      title: "Modern Banking Era",
                      content: "The post-war era brought significant changes to banking. We were among the first banks to introduce checking accounts, credit cards, and automated teller machines, revolutionizing how people managed their money. Our commitment to technological innovation helped us serve a rapidly growing customer base while maintaining personalized service.",
                      icon: Zap,
                      color: "from-purple-500 to-purple-600",
                      achievements: ["First ATMs installed", "Credit cards launched", "Checking accounts introduced"]
                    },
                    {
                      year: "1980s-1990s",
                      title: "National Recognition",
                      content: "Commerce Bank expanded its reach across multiple states and gained national recognition for excellence in customer service and financial innovation. We launched comprehensive business banking services, wealth management divisions, and established ourselves as a trusted partner for both individuals and corporations. Our focus on relationship banking set us apart in an increasingly competitive market.",
                      icon: Award,
                      color: "from-orange-500 to-orange-600",
                      achievements: ["Multi-state expansion", "Business banking division", "Wealth management services"]
                    },
                    {
                      year: "2000s",
                      title: "Digital Revolution",
                      content: "As the internet transformed the world, Commerce Bank embraced digital banking wholeheartedly. We launched comprehensive online banking platforms, mobile apps, and digital payment solutions, making banking more convenient than ever while maintaining our commitment to personal service. Our early investment in digital infrastructure positioned us as an industry leader.",
                      icon: TrendingUp,
                      color: "from-teal-500 to-teal-600",
                      achievements: ["Online banking launched", "Mobile app developed", "Digital payments introduced"]
                    },
                    {
                      year: "2010s-2020s",
                      title: "Innovation & Sustainability",
                      content: "Commerce Bank continued to lead with cutting-edge technology, sustainable banking practices, and unwavering commitment to our customers. We expanded our branch network to over 500 locations, reached 2 million customers, and introduced innovative products like high-yield savings accounts, green loans, and AI-powered fraud detection. Our focus on ESG initiatives and community impact strengthened our position as a responsible financial leader.",
                      icon: Globe,
                      color: "from-pink-500 to-pink-600",
                      achievements: ["500+ branches", "2M+ customers", "ESG initiatives launched"]
                    },
                    {
                      year: "Today",
                      title: "Leading with Purpose",
                      content: "Today, Commerce Bank continues to evolve, combining our rich heritage with forward-thinking innovation. We serve over 2 million customers across 15 states with a full range of financial services, from personal banking to corporate solutions. Our commitment to technology, sustainability, community impact, and exceptional customer service drives everything we do as we build the bank of tomorrow, today.",
                      icon: Star,
                      color: "from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))]",
                      achievements: ["$50B+ in assets", "15 states served", "Industry-leading customer satisfaction"]
                    }
                  ].map((era, idx) => {
                    const IconComponent = era.icon;
                    return (
                      <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Timeline dot */}
                        <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-5 h-5 bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                        
                        <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 md:text-left'}`}>
                          <Card className={`border-2 hover:shadow-xl transition-all duration-300 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                            <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/5] to-transparent">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 bg-gradient-to-br ${era.color} rounded-lg text-white`}>
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div>
                                  <Badge variant="outline" className="border-[hsl(var(--commerce-green))] text-[hsl(var(--commerce-green))]">
                                    {era.year}
                                  </Badge>
                                  <CardTitle className="text-2xl mt-2">{era.title}</CardTitle>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                              <p className="text-gray-700 mb-4 leading-relaxed">{era.content}</p>
                              <div className="flex flex-wrap gap-2">
                                {era.achievements.map((achievement, aIdx) => (
                                  <Badge key={aIdx} variant="secondary" className="text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values - Enhanced */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] via-[hsl(var(--commerce-teal))/10] to-[hsl(var(--commerce-green))/10]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Our Mission & Values</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The principles that guide everything we do and define who we are
                </p>
              </div>
              
              <Card className="mb-12 border-2 bg-gradient-to-r from-white to-[hsl(var(--commerce-green))/5]">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To empower individuals, families, and businesses to achieve their financial goals through innovative banking solutions, personalized service, and unwavering commitment to integrity and excellence. We strive to be the trusted financial partner that makes a positive difference in the lives of our customers and communities.
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Trust & Security",
                    description: "We prioritize the security of our customers' financial information and maintain the highest standards of trust and integrity in all our operations. Your financial well-being is our top priority.",
                    color: "from-blue-500 to-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-500"
                  },
                  {
                    icon: Users,
                    title: "Customer First",
                    description: "Our customers are at the heart of everything we do. We listen, understand, and deliver solutions that meet their unique financial needs with personalized attention and care.",
                    color: "from-green-500 to-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-500"
                  },
                  {
                    icon: Zap,
                    title: "Innovation",
                    description: "We embrace technology and innovation to provide cutting-edge banking solutions while maintaining the personal touch our customers value. We're always evolving to serve you better.",
                    color: "from-purple-500 to-purple-600",
                    bgColor: "bg-purple-50",
                    borderColor: "border-purple-500"
                  },
                  {
                    icon: Heart,
                    title: "Community Impact",
                    description: "We're deeply committed to supporting the communities we serve through volunteerism, charitable giving, local economic development, and financial education programs.",
                    color: "from-pink-500 to-pink-600",
                    bgColor: "bg-pink-50",
                    borderColor: "border-pink-500"
                  },
                  {
                    icon: Award,
                    title: "Excellence",
                    description: "We strive for excellence in everything we do, from customer service to financial products, ensuring the highest quality experience. Good enough is never enough.",
                    color: "from-orange-500 to-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-500"
                  },
                  {
                    icon: Globe,
                    title: "Sustainability",
                    description: "We're committed to sustainable banking practices and environmental responsibility, building a better future for generations to come. We invest in green initiatives and responsible lending.",
                    color: "from-teal-500 to-teal-600",
                    bgColor: "bg-teal-50",
                    borderColor: "border-teal-500"
                  }
                ].map((value, idx) => {
                  const IconComponent = value.icon;
                  return (
                    <Card key={idx} className={`text-center border-2 hover:shadow-xl transition-all duration-300`}>
                      <CardHeader className={`bg-gradient-to-r ${value.bgColor} to-transparent`}>
                        <div className="flex justify-center mb-4">
                          <div className={`p-4 bg-gradient-to-br ${value.color} rounded-full text-white`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                        </div>
                        <CardTitle className="text-lg">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-700 leading-relaxed">{value.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Achievements & Recognition */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Recognition & Achievements</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Industry recognition for excellence in banking, customer service, and innovation
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Best Bank for Small Business", year: "2024", organization: "Banking Industry Magazine", icon: Briefcase },
                  { title: "Most Trusted Bank", year: "2023", organization: "Regional Banking Survey", icon: Shield },
                  { title: "Best Customer Service", year: "2023", organization: "Banking Excellence Awards", icon: Star },
                  { title: "Innovation in Digital Banking", year: "2023", organization: "Financial Technology Awards", icon: Zap },
                  { title: "Top Workplace", year: "2023", organization: "Great Place to Work", icon: Users },
                  { title: "Environmental Excellence", year: "2024", organization: "Green Banking Initiative", icon: Globe }
                ].map((award, idx) => {
                  const IconComponent = award.icon;
                  return (
                    <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-2">
                      <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/5] to-transparent">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] rounded-lg text-white">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className="border-[hsl(var(--commerce-green))] text-[hsl(var(--commerce-green))]">
                            {award.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{award.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-[hsl(var(--commerce-green))] font-medium">
                          {award.organization}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Community Commitment */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white mb-4">
                  <Handshake className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Our Community Commitment</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Making a positive impact in the communities we serve
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/5] to-transparent">
                    <CardTitle className="flex items-center gap-3">
                      <Heart className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      Community Investment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-0.5 flex-shrink-0" />
                        <span><strong>$10M+</strong> in community grants and loans since 2020</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-0.5 flex-shrink-0" />
                        <span><strong>10,000+</strong> volunteer hours donated by employees annually</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-0.5 flex-shrink-0" />
                        <span><strong>$500K</strong> committed to hunger relief programs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-green))] mt-0.5 flex-shrink-0" />
                        <span><strong>$2M</strong> in small business grants awarded</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-teal))/5] to-transparent">
                    <CardTitle className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-[hsl(var(--commerce-teal))]" />
                      Financial Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-teal))] mt-0.5 flex-shrink-0" />
                        <span><strong>10,000+</strong> students reached through financial literacy programs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-teal))] mt-0.5 flex-shrink-0" />
                        <span><strong>50+</strong> schools partnered for education initiatives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-teal))] mt-0.5 flex-shrink-0" />
                        <span><strong>Free</strong> workshops and resources for all ages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--commerce-teal))] mt-0.5 flex-shrink-0" />
                        <span><strong>Scholarship</strong> programs for financial education</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Story?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Become part of the Commerce Bank family and experience banking that puts you first. Let us help you achieve your financial goals with the expertise, innovation, and personalized service that have defined us for over 150 years.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/personal-banking">
                  <Button variant="secondary" size="lg" className="hover:scale-105 transition-transform">
                    Open an Account
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="secondary" size="lg" className="hover:scale-105 transition-transform">
                    Explore Our Services
                  </Button>
                </Link>
                <Link to="/leadership">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[hsl(var(--commerce-green))] transition-all duration-300 font-semibold"
                  >
                    Meet Our Leadership
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
