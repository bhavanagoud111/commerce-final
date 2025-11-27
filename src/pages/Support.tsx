import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Shield,
  Gift,
  Star,
  Search,
  Send,
  Download,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Home,
  ArrowLeft,
  Headphones
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";

const Support = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to focus search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);


  const faqs = [
    {
      id: 1,
      question: "How do I transfer money between accounts?",
      answer: "You can transfer money between your accounts by going to the Payments section and selecting 'Internal Transfer'. Choose your source and destination accounts, enter the amount, and confirm the transfer.",
      category: "Transfers"
    },
    {
      id: 2,
      question: "How do I send money to another user?",
      answer: "To send money to another user, go to Payments > Send to Others, enter their username or email, specify the amount, and confirm the transaction.",
      category: "Transfers"
    },
    {
      id: 3,
      question: "How do I change my password?",
      answer: "Go to Profile > Security > Change Password. Enter your current password and create a new secure password.",
      category: "Security"
    },
    {
      id: 4,
      question: "How do I download my account statement?",
      answer: "Navigate to Dashboard > Statements tab, select the statement period you want, and click the Download button to get your statement in PDF or CSV format.",
      category: "Statements"
    },
    {
      id: 5,
      question: "How do I set up automatic bill payments?",
      answer: "Go to Payments > Bill Payments > Auto-Pay Setup. Select your bill type, enter the payment details, and set up the recurring schedule.",
      category: "Bills"
    },
    {
      id: 6,
      question: "What is the daily transfer limit?",
      answer: "The daily transfer limit is $10,000 for standard accounts. Premium accounts have higher limits up to $50,000 per day.",
      category: "Transfers"
    },
    {
      id: 7,
      question: "How do I enable two-factor authentication?",
      answer: "Go to Profile > Security > Two-Factor Authentication. Follow the setup instructions to link your mobile device for enhanced security.",
      category: "Security"
    },
    {
      id: 8,
      question: "How do I view my transaction history?",
      answer: "Navigate to Dashboard > Transactions tab to view your complete transaction history. You can filter by date range, amount, or transaction type.",
      category: "Statements"
    },
    {
      id: 9,
      question: "How do I dispute a transaction?",
      answer: "Contact customer support immediately if you notice an unauthorized transaction. You can also use the 'Report Fraud' feature in the Support section.",
      category: "Security"
    },
    {
      id: 10,
      question: "How do I update my contact information?",
      answer: "Go to Profile > Personal Information to update your address, phone number, or email address. Changes may require verification.",
      category: "Account"
    }
  ];

  const branches = [
    {
      id: 1,
      name: "Downtown Branch",
      address: "123 Main Street, New York, NY 10001",
      phone: "(555) 123-4567",
      hours: "Mon-Fri: 9AM-5PM, Sat: 9AM-2PM",
      services: ["Personal Banking", "Business Banking", "ATM"]
    },
    {
      id: 2,
      name: "Midtown Branch",
      address: "456 Broadway, New York, NY 10013",
      phone: "(555) 234-5678",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM",
      services: ["Personal Banking", "Investment Services", "ATM"]
    },
    {
      id: 3,
      name: "Uptown Branch",
      address: "789 Park Avenue, New York, NY 10021",
      phone: "(555) 345-6789",
      hours: "Mon-Fri: 9AM-5PM, Sat: 10AM-2PM",
      services: ["Personal Banking", "Wealth Management", "ATM"]
    }
  ];

  const offers = [
    {
      id: 1,
      title: "New Account Bonus",
      description: "Get $200 when you open a new checking account",
      validUntil: "2024-03-31",
      status: "active"
    },
    {
      id: 2,
      title: "High-Yield Savings",
      description: "Earn 4.5% APY on your savings account",
      validUntil: "2024-06-30",
      status: "active"
    },
    {
      id: 3,
      title: "Credit Card Rewards",
      description: "Earn 2% cashback on all purchases",
      validUntil: "2024-12-31",
      status: "active"
    }
  ];

  const BANKING_SYSTEM_INSTRUCTION = `You are Commerce Assist, a helpful banking assistant for Commerce Bank's digital banking application. Your role is to assist customers with banking-related queries only.

IMPORTANT RULES:
1. ONLY answer questions related to banking services, account management, transfers, payments, cards, security, loans, mortgages, investments, and other financial services offered by Commerce Bank.
2. If a user asks about non-banking topics (weather, general knowledge, jokes, etc.), politely redirect them: "I'm here to help with banking questions. How can I assist you with your Commerce Bank account, transfers, payments, or other banking services?"
3. Be professional, friendly, and concise.
4. Guide users to specific features in the Commerce Bank application when relevant (e.g., "Go to Payments → Transfer Money").
5. Never provide financial advice or make recommendations about investments.
6. For sensitive account issues, suggest contacting customer support.

Available banking services: account management, money transfers, bill payments, card management, security settings, loan applications, mortgage services, investment services, and account statements.`;

  const [chatMessages, setChatMessages] = useState<Array<{sender: 'user' | 'bot', text: string, timestamp: string}>>([
    {
      sender: 'bot',
      text: "Hi! I'm Commerce Assist. I can help you with transfers, payments, card management, account questions, and more. What can I help you with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const getBotReply = async (input: string, conversationHistory: Array<{sender: 'user' | 'bot', text: string}>) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return "I'm currently unavailable. Please try again later or contact support.";
    }

    try {
      const messages = [
        { role: "system", content: BANKING_SYSTEM_INSTRUCTION },
        ...conversationHistory
          .filter((msg) => msg.sender !== 'bot' || !msg.text.includes("Hi! I'm Commerce Assist"))
          .map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        { role: "user", content: input },
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenAI API error:", errorData);
        return "I'm having trouble connecting right now. Please try again in a moment.";
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm sorry, I didn't understand that. Could you rephrase your banking question?";
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return "I'm experiencing technical difficulties. Please try again or contact support for immediate assistance.";
    }
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      sender: 'user' as const,
      text: chatMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage("");
    setIsTyping(true);

    try {
      const botReply = await getBotReply(userMessage.text, chatMessages);
      const botMessage = {
        sender: 'bot' as const,
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        sender: 'bot' as const,
        text: "I'm sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFraudReport = () => {
    console.log('Fraud report button clicked');
    
    const fraudMessage = `🚨 FRAUD REPORT SUBMITTED 🚨

Your fraud report has been received and is being processed immediately.

📋 NEXT STEPS - BANK SIDE:
• Account security review initiated
• Suspicious transactions flagged and monitored
• Account temporarily secured with enhanced protection
• Fraud investigation team notified
• Credit bureau alerts placed (if applicable)
• New cards/credentials issued (if needed)
• 24/7 monitoring activated

👤 NEXT STEPS - YOUR SIDE:
• Check your email for confirmation and case number
• Review recent transactions for any unauthorized activity
• Change your online banking password immediately
• Update security questions and answers
• Monitor your account statements closely
• Keep all receipts and documentation
• Contact us if you notice any new suspicious activity

📞 IMMEDIATE ACTIONS:
• Call our Fraud Hotline: 1-800-FRAUD-ALERT
• Save this case number: FR-${Date.now().toString().slice(-6)}
• Check your email within 15 minutes for detailed instructions

⏰ TIMELINE:
• Investigation: 3-5 business days
• Resolution: 7-10 business days
• Refund processing: 1-2 business days (if applicable)

Your account is now under enhanced security protection.`;

    toast({
      variant: "destructive",
      title: "Fraud report submitted",
      description: "Your account is now under enhanced security. Check your email shortly for next steps.",
    });
  };

  const handleLearnMore = (offer) => {
    setSelectedOffer(offer);
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] overflow-hidden">
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
                  <Headphones className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Customer Service</h1>
                  <p className="text-lg text-white/90">
                    We're here to help you 24/7
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/95 leading-relaxed">
                Get the support you need with our comprehensive help center, live chat, phone support, and extensive FAQ database. Our dedicated team is ready to assist you with any questions or concerns.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 space-y-6">
          <Tabs defaultValue="help" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="help">Help Center</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>

          {/* Help Center Tab */}
          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about our banking services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Search FAQs... (Ctrl+K to focus)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <p className="text-sm text-gray-600">
                        {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found for "{searchQuery}"
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq) => (
                        <div key={faq.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {highlightText(faq.question, searchQuery)}
                              </h3>
                              <p className="text-sm text-gray-600 mt-2">
                                {highlightText(faq.answer, searchQuery)}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {highlightText(faq.category, searchQuery)}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : searchQuery.trim() ? (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600 mb-4">
                          We couldn't find any FAQs matching "{searchQuery}"
                        </p>
                        <div className="text-sm text-gray-500">
                          <p>Try searching for:</p>
                          <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {['transfer', 'password', 'statement', 'bill', 'security'].map((term) => (
                              <button
                                key={term}
                                onClick={() => setSearchQuery(term)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Browse FAQs</h3>
                        <p className="text-gray-600">
                          Use the search bar above to find specific questions, or browse all FAQs below.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Live Chat Support
                </CardTitle>
                <CardDescription>
                  Chat with our support team for immediate assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 h-40 overflow-y-auto">
                    <div className="space-y-2">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`${msg.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-800'} rounded-lg p-2 max-w-xs`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-800 rounded-lg p-2 max-w-xs flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Typing...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    />
                    <Button onClick={handleChatSubmit} disabled={!chatMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Us Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">1-800-COMMERCE (1-800-266-6372)</p>
                        <p className="text-xs text-gray-500">24/7 Customer Service</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@commercebank.com</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-600">Available 9AM-9PM EST</p>
                        <p className="text-xs text-gray-500">Monday through Friday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Fraud</CardTitle>
                  <CardDescription>
                    Report suspicious activity or fraud immediately
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="font-medium text-red-800">Suspicious Activity?</h3>
                      </div>
                      <p className="text-sm text-red-700 mt-2">
                        If you notice any unauthorized transactions or suspicious activity, 
                        report it immediately to protect your account.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">What happens when you report fraud:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Immediate account security review</li>
                          <li>• Enhanced monitoring activated</li>
                          <li>• Investigation team notified</li>
                          <li>• You'll receive a case number and timeline</li>
                        </ul>
                      </div>
                      
                      <Button onClick={handleFraudReport} className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Report Fraud Now
                      </Button>
                      
                      <div className="text-xs text-gray-500 text-center">
                        <p>⏰ Available 24/7 • Response within 15 minutes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Branches Tab */}
          <TabsContent value="branches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Branch & ATM Locator
                </CardTitle>
                <CardDescription>
                  Find our branches and ATMs near you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{branch.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                          <p className="text-sm text-gray-500 mt-1">{branch.phone}</p>
                          <p className="text-sm text-gray-500">{branch.hours}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {branch.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Current Offers & Rewards
                </CardTitle>
                <CardDescription>
                  Take advantage of our current promotions and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{offer.title}</h3>
                            <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                              {offer.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Valid until: {offer.validUntil}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleLearnMore(offer)}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </main>

      <Footer />

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Gift className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedOffer.title}</h2>
                    <Badge variant={selectedOffer.status === 'active' ? 'default' : 'secondary'}>
                      {selectedOffer.status}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Offer Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">{selectedOffer.description}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Valid until:</strong> {selectedOffer.validUntil}
                    </p>
                  </div>
                </div>

                {/* Detailed Information based on offer type */}
                {selectedOffer.id === 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">New Account Bonus Details</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Open a new Commerce Bank checking account</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Make an initial deposit of $500 or more</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Set up direct deposit within 60 days</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Receive $200 bonus within 30 days of meeting requirements</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedOffer.id === 2 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">High-Yield Savings Details</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Earn 4.5% Annual Percentage Yield (APY)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>No minimum balance requirement</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>No monthly maintenance fees</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Unlimited online transfers</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>FDIC insured up to $250,000</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedOffer.id === 3 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Credit Card Rewards Details</h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Earn 2% cashback on all purchases</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>No annual fee</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>No foreign transaction fees</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Redeem rewards as statement credit or direct deposit</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>24/7 fraud protection and monitoring</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Offer subject to credit approval and account verification</li>
                      <li>• Must be a new customer or not have had an account in the past 12 months</li>
                      <li>• Terms and conditions may apply</li>
                      <li>• Bank reserves the right to modify or terminate offer at any time</li>
                      <li>• Contact customer service for complete terms and conditions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Ready to take advantage of this offer?</p>
                    <p>Contact our customer service team to get started.</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setSelectedOffer(null)}>
                      Close
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Coming soon",
                        description: "Redirecting to the application form...",
                      });
                      setSelectedOffer(null);
                    }}>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Support;