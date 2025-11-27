import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobApplicationForm from "@/components/JobApplicationForm";
import { ArrowLeft, MapPin, Clock, Users, Heart, Award, TrendingUp, Briefcase, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Careers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Technology",
      location: "New York, NY",
      type: "Full-time",
      experience: "5+ years",
      description: "Join our technology team to build innovative banking solutions and digital platforms. You'll work on cutting-edge projects, collaborate with talented engineers, and contribute to shaping the future of digital banking."
    },
    {
      id: 2,
      title: "Personal Banker",
      department: "Retail Banking",
      location: "Chicago, IL",
      type: "Full-time",
      experience: "2+ years",
      description: "Help customers achieve their financial goals with personalized banking solutions. Build lasting relationships, provide exceptional service, and grow your career in a supportive environment."
    },
    {
      id: 3,
      title: "Risk Analyst",
      department: "Risk Management",
      location: "Boston, MA",
      type: "Full-time",
      experience: "3+ years",
      description: "Analyze and assess financial risks to ensure the bank's stability and compliance. Work with cross-functional teams to develop risk management strategies and maintain regulatory standards."
    },
    {
      id: 4,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "2+ years",
      description: "Develop and execute marketing campaigns to promote our banking services. Create compelling content, manage digital marketing channels, and drive customer engagement."
    },
    {
      id: 5,
      title: "Customer Service Representative",
      department: "Customer Service",
      location: "Remote",
      type: "Full-time",
      experience: "1+ years",
      description: "Provide exceptional customer support through phone, email, and chat channels. Help customers with their banking needs and ensure a positive experience with Commerce Bank."
    },
    {
      id: 6,
      title: "Financial Advisor",
      department: "Wealth Management",
      location: "Miami, FL",
      type: "Full-time",
      experience: "4+ years",
      description: "Help clients build and manage their investment portfolios and financial plans. Provide expert financial guidance and help clients achieve their long-term financial goals."
    },
    {
      id: 7,
      title: "Data Analyst",
      department: "Technology",
      location: "Austin, TX",
      type: "Full-time",
      experience: "3+ years",
      description: "Analyze complex data sets to drive business decisions and improve banking operations. Work with SQL, Python, and data visualization tools to provide actionable insights to stakeholders."
    },
    {
      id: 8,
      title: "Branch Manager",
      department: "Retail Banking",
      location: "Los Angeles, CA",
      type: "Full-time",
      experience: "5+ years",
      description: "Lead and manage a branch team to deliver exceptional customer service and achieve business goals. Oversee daily operations, develop team members, and build strong community relationships."
    },
    {
      id: 9,
      title: "Compliance Officer",
      department: "Risk Management",
      location: "Washington, DC",
      type: "Full-time",
      experience: "4+ years",
      description: "Ensure the bank's operations comply with all regulatory requirements and internal policies. Conduct audits, develop compliance programs, and provide training to staff."
    },
    {
      id: 10,
      title: "UX/UI Designer",
      department: "Technology",
      location: "Seattle, WA",
      type: "Full-time",
      experience: "3+ years",
      description: "Design intuitive and engaging user experiences for our digital banking platforms. Collaborate with product managers and developers to create beautiful, functional interfaces."
    },
    {
      id: 11,
      title: "Loan Officer",
      department: "Retail Banking",
      location: "Denver, CO",
      type: "Full-time",
      experience: "2+ years",
      description: "Help customers secure loans for homes, vehicles, and personal needs. Evaluate applications, guide customers through the process, and build relationships with local communities."
    },
    {
      id: 12,
      title: "Cybersecurity Specialist",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Protect our digital infrastructure and customer data from cyber threats. Monitor security systems, respond to incidents, and implement security best practices across the organization."
    },
    {
      id: 13,
      title: "Business Development Manager",
      department: "Business Banking",
      location: "Dallas, TX",
      type: "Full-time",
      experience: "5+ years",
      description: "Develop and maintain relationships with business clients, identify growth opportunities, and expand our commercial banking portfolio. Drive revenue growth through strategic partnerships."
    },
    {
      id: 14,
      title: "Product Manager",
      department: "Technology",
      location: "San Jose, CA",
      type: "Full-time",
      experience: "4+ years",
      description: "Lead product development initiatives for our digital banking services. Work with cross-functional teams to define product vision, prioritize features, and deliver innovative solutions."
    },
    {
      id: 15,
      title: "HR Business Partner",
      department: "Human Resources",
      location: "Atlanta, GA",
      type: "Full-time",
      experience: "3+ years",
      description: "Partner with business leaders to develop and execute HR strategies. Support talent acquisition, employee development, and organizational effectiveness initiatives."
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Competitive Benefits",
      description: "Comprehensive health, dental, and vision insurance, plus retirement plans with company matching.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Career Development",
      description: "Professional development opportunities, tuition reimbursement, and mentorship programs.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "Flexible work arrangements, generous PTO, and wellness programs to support your well-being.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-500",
    },
    {
      icon: Users,
      title: "Inclusive Culture",
      description: "Diverse and inclusive workplace where everyone's voice is valued and respected.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
    }
  ];

  const filteredJobs = selectedCategory === "all" 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department.toLowerCase() === selectedCategory.toLowerCase());

  const handleApplyClick = (jobId: number) => {
    setSelectedJob(jobId);
    setIsApplicationFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsApplicationFormOpen(false);
    setSelectedJob(null);
  };

  const selectedJobData = selectedJob ? jobOpenings.find(job => job.id === selectedJob) : null;

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
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Join Our Team</h1>
                  <p className="text-lg text-white/90">
                    Build your career with Commerce Bank
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Be part of a team that's shaping the future of banking. We offer exciting opportunities for growth, innovation, and making a real difference in people's lives.
              </p>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Why Work With Us?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  At Commerce Bank, we're committed to creating an exceptional workplace where you can thrive.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <Card 
                      key={index} 
                      className={`text-center border-2 border-l-4 ${benefit.borderColor} hover:shadow-xl transition-all duration-300`}
                    >
                      <CardHeader className={`bg-gradient-to-r ${benefit.bgColor} to-transparent`}>
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 bg-gradient-to-br ${benefit.color} rounded-lg text-white`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                        </div>
                        <CardTitle className="text-lg">{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-600">{benefit.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Current Openings</h2>
                <p className="text-lg text-gray-600">
                  Explore our available positions and find your perfect fit
                </p>
              </div>
              
              {/* Filter */}
              <div className="mb-8">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-64 border-2">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="retail banking">Retail Banking</SelectItem>
                    <SelectItem value="risk management">Risk Management</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="customer service">Customer Service</SelectItem>
                    <SelectItem value="wealth management">Wealth Management</SelectItem>
                    <SelectItem value="business banking">Business Banking</SelectItem>
                    <SelectItem value="human resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Listings */}
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <Card 
                    key={job.id} 
                    className="hover:shadow-xl transition-all duration-300 border-2 border-l-4 border-l-[hsl(var(--commerce-green))]"
                  >
                    <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/5] to-transparent">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                          <CardDescription className="text-[hsl(var(--commerce-green))] font-semibold text-base">
                            {job.department}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="commerce"
                          size="lg"
                          onClick={() => handleApplyClick(job.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                          <span className="font-medium">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                          <span className="font-medium">{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                          <span className="font-medium">{job.experience}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-gray-600 text-lg mb-4">No positions found in this category.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedCategory("all")}
                    >
                      View All Positions
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--commerce-green))/10] via-[hsl(var(--commerce-teal))/10] to-[hsl(var(--commerce-green))/10]">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">Application Process</h2>
                <p className="text-lg text-gray-600">
                  Our straightforward application process makes it easy to join our team
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Apply Online",
                    description: "Submit your application and resume through our online portal. Make sure to highlight relevant experience and skills.",
                    icon: CheckCircle2,
                  },
                  {
                    step: "2",
                    title: "Initial Review",
                    description: "Our HR team will review your application and contact qualified candidates within 5-7 business days.",
                    icon: CheckCircle2,
                  },
                  {
                    step: "3",
                    title: "Interview Process",
                    description: "Selected candidates will participate in interviews with the hiring manager and team members.",
                    icon: CheckCircle2,
                  },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={idx} className="text-center border-2 hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                          {item.step}
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Job Application Form Dialog */}
      {selectedJobData && (
        <JobApplicationForm
          isOpen={isApplicationFormOpen}
          onClose={handleCloseForm}
          job={selectedJobData}
        />
      )}
    </div>
  );
};

export default Careers;
