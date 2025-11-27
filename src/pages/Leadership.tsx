import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Mail, Users, Trophy, TrendingUp, Shield, Heart, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Leadership = () => {
  const leadershipTeam = [
    {
      name: "Bhavana Ediga",
      title: "Chief Executive Officer",
      bio: "Bhavana brings visionary leadership and strategic expertise to Commerce Bank. With extensive experience in banking and financial services, she drives innovation and excellence across all operations while maintaining our commitment to exceptional customer service.",
      image: "👩‍💼",
      email: "bhavana.ediga@commercebank.com",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
    },
    {
      name: "Rasagyna Peddapalli",
      title: "Chief Financial Officer",
      bio: "Rasagyna oversees all financial operations and strategic planning with precision and expertise. Her strong background in corporate finance and strategic financial management ensures sustainable growth and fiscal responsibility for Commerce Bank.",
      image: "👩‍💼",
      email: "rasagyna.peddapalli@commercebank.com",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
    },
    {
      name: "Harshitha Bonthu",
      title: "Chief Technology Officer",
      bio: "Harshitha leads our digital transformation initiatives and cybersecurity efforts with innovative solutions. Her expertise in technology and digital innovation drives Commerce Bank's evolution into a modern, secure, and customer-centric digital banking platform.",
      image: "👩‍💻",
      email: "harshitha.bonthu@commercebank.com",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
    },
    {
      name: "Rohith Belede",
      title: "Chief Risk Officer",
      bio: "Rohith manages enterprise risk and compliance across all business lines with meticulous attention to detail. His extensive experience in risk management and regulatory compliance ensures Commerce Bank maintains the highest standards of security and operational excellence.",
      image: "👨‍💼",
      email: "rohith.belede@commercebank.com",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
    },
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
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Leadership Team</h1>
                  <p className="text-lg text-white/90">
                    Meet our exceptional executive leaders
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Meet the experienced leaders who guide Commerce Bank's vision and drive our commitment to exceptional customer service and innovative banking solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Executive Leadership</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our leadership team brings together decades of experience and expertise to drive Commerce Bank forward.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {leadershipTeam.map((leader, index) => (
                  <Card 
                    key={index} 
                    className={`group hover:shadow-2xl transition-all duration-300 border-2 border-l-4 ${leader.borderColor} overflow-hidden`}
                  >
                    {/* Gradient Header */}
                    <div className={`bg-gradient-to-r ${leader.color} p-6 text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-6xl bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                            {leader.image}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-1">{leader.name}</h3>
                            <p className="text-white/90 font-medium">{leader.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <p className="text-gray-700 leading-relaxed mb-6 min-h-[100px]">
                        {leader.bio}
                      </p>
                      <div className="flex justify-center pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-[hsl(var(--commerce-green))] hover:text-white hover:border-[hsl(var(--commerce-green))] transition-colors"
                          onClick={() =>
                            toast({
                              title: "Contact leadership",
                              description: `Email ${leader.email} and we'll route your message to the right executive.`,
                            })
                          }
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Philosophy */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] via-[hsl(var(--commerce-teal))/10] to-[hsl(var(--commerce-green))/10]">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white mb-4">
                  <Trophy className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Our Leadership Philosophy</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  At Commerce Bank, we believe that strong leadership is built on integrity, innovation, and a deep commitment to serving our customers and communities.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 border-l-4 border-l-[hsl(var(--commerce-green))] hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-transparent">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] rounded-lg text-white">
                        <Target className="h-6 w-6" />
                      </div>
                      Vision & Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {[
                        "Setting clear direction and strategic goals",
                        "Embracing innovation and digital transformation",
                        "Building sustainable long-term value",
                        "Fostering a culture of excellence"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="p-1 bg-[hsl(var(--commerce-green))] rounded-full mt-0.5">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-l-4 border-l-[hsl(var(--commerce-teal))] hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-teal))/10] to-transparent">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-gradient-to-br from-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] rounded-lg text-white">
                        <Heart className="h-6 w-6" />
                      </div>
                      People & Culture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {[
                        "Developing and empowering our team",
                        "Promoting diversity and inclusion",
                        "Maintaining ethical standards",
                        "Supporting community engagement"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="p-1 bg-[hsl(var(--commerce-teal))] rounded-full mt-0.5">
                            <Shield className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
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

export default Leadership;
