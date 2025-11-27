import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message received",
      description: `Thank you, ${formData.name}! We’ll reply about “${formData.subject}” at ${formData.email} within 24 hours. Reference ID: CONTACT-${Date.now().toString().slice(-6)}.`,
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
              <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
              <p className="text-xl text-white/90 mb-8">
                We're here to help! Get in touch with our team for any questions, concerns, or assistance you may need. We're committed to providing you with exceptional service and support.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-12 text-center">Get in Touch</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <Card className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <Phone className="h-12 w-12 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle>Phone Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Speak with a customer service representative</p>
                    <div className="space-y-2">
                      <p className="font-semibold">General Inquiries</p>
                      <p className="text-[hsl(var(--commerce-green))]">1-800-COMMERCE</p>
                      <p className="text-sm text-gray-600">24/7 Customer Service</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() =>
                        toast({
                          title: "Customer Service",
                          description: "Phone: 1-800-COMMERCE • 24/7 support • Avg wait under 2 minutes.",
                        })
                      }
                    >
                      Call Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <Mail className="h-12 w-12 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle>Email Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Send us a message and we'll respond quickly</p>
                    <div className="space-y-2">
                      <p className="font-semibold">General Support</p>
                      <p className="text-[hsl(var(--commerce-green))]">support@commercebank.com</p>
                      <p className="text-sm text-gray-600">Response within 24 hours</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() =>
                        toast({
                          title: "Email Support",
                          description: "General: support@commercebank.com • Technical: tech@commercebank.com • Business: business@commercebank.com. Responses within 24 hours.",
                        })
                      }
                    >
                      Send Email
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <MapPin className="h-12 w-12 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle>Visit a Branch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Find a branch near you for in-person assistance</p>
                    <div className="space-y-2">
                      <p className="font-semibold">Branch Locator</p>
                      <p className="text-[hsl(var(--commerce-green))]">500+ Locations</p>
                      <p className="text-sm text-gray-600">Nationwide coverage</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() =>
                        toast({
                          title: "Branches & ATMs",
                          description: "Visit commercebank.com/locations or call 1-800-COMMERCE. Most branches open Mon–Fri 9-5, Sat 9-1.",
                        })
                      }
                    >
                      Find Branch
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-8 text-center">Send us a Message</h2>
              
              <Card className="form-section form-section-accent">
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="form-surface">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inquiryType">Type of Inquiry</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Question</SelectItem>
                            <SelectItem value="account">Account Issue</SelectItem>
                            <SelectItem value="loan">Loan Inquiry</SelectItem>
                            <SelectItem value="business">Business Banking</SelectItem>
                            <SelectItem value="investment">Investment Services</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={5}
                        placeholder="Please provide details about your inquiry..."
                      />
                    </div>

                    <Button type="submit" variant="commerce" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--commerce-green))] mb-8 text-center">Business Hours</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-3" />
                      <CardTitle>Branch Hours</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-semibold">9:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-semibold">9:00 AM - 1:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span className="font-semibold">Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <MessageSquare className="h-6 w-6 text-[hsl(var(--commerce-green))] mr-3" />
                      <CardTitle>Customer Service</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Phone Support</span>
                        <span className="font-semibold">24/7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Online Banking</span>
                        <span className="font-semibold">24/7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile App</span>
                        <span className="font-semibold">24/7</span>
                      </div>
                    </div>
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

export default Contact;
