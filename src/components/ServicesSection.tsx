import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CreditCard, Home, TrendingUp, Shield, PiggyBank, Briefcase, Users, Building2, DollarSign, Target } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Personal Banking",
      description: "Complete personal banking solutions including checking, savings, credit cards, and loans.",
      features: ["Checking & Savings", "Credit Cards", "Personal Loans", "Auto Loans", "Home Loans", "Online Banking"],
      route: "/personal-banking"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Wealth Management",
      description: "Comprehensive wealth management services for high-net-worth individuals and families.",
      features: ["Investment Advisory", "Retirement Planning", "Estate Planning", "Trust Services", "Private Banking", "Family Office"],
      route: "/wealth-management"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Business Banking",
      description: "Complete banking solutions for small to medium-sized businesses.",
      features: ["Business Accounts", "Business Loans", "Cash Management", "Payroll Services", "Merchant Services", "Industry Solutions"],
      route: "/business-banking"
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Corporate Banking",
      description: "Sophisticated banking solutions for large corporations and enterprises.",
      features: ["Treasury Services", "Corporate Loans", "Capital Markets", "Risk Management", "International Services", "Industry Expertise"],
      route: "/corporate-banking"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Banking & Cards",
      description: "Traditional banking services including accounts, cards, and digital banking.",
      features: ["Interest checking", "High-yield savings", "Rewards credit cards", "Debit cards", "Mobile banking"],
      route: "/services/banking-cards"
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: "Mortgages & Loans", 
      description: "Home loans, personal loans, and auto financing with competitive rates.",
      features: ["Home mortgages", "Personal loans", "Auto financing", "Refinancing", "Home equity loans"],
      route: "/services/mortgages-loans"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Investment Services",
      description: "Grow your wealth with our investment and retirement planning solutions.",
      features: ["Investment management", "Retirement planning", "Brokerage services", "Mutual funds", "ETFs", "IRAs"],
      route: "/services/investment-services"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Digital Security",
      description: "Advanced security features to protect your financial information.",
      features: ["Fraud protection", "Secure banking", "Identity monitoring", "Two-factor authentication", "Biometric login"],
      route: "/services/digital-security"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[hsl(var(--commerce-green))] mb-4">
            Comprehensive Banking Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            From personal banking to corporate solutions, we provide comprehensive financial services tailored to meet your unique needs. 
            Whether you're an individual looking to manage your finances, a business seeking growth capital, or a corporation requiring sophisticated treasury services, 
            our expert team is here to help you achieve your financial goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-border/40 bg-gradient-to-b from-background/95 via-background/80 to-background/95 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elevated)] animate-in fade-in slide-in-from-bottom-6"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[hsl(var(--commerce-teal)_/_0.08)] blur-3xl transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-[hsl(var(--commerce-green)_/_0.06)] blur-3xl transition-transform duration-700 group-hover:translate-y-2" />

              <CardHeader className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] shadow-lg flex items-center justify-center text-white mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground tracking-tight group-hover:text-[hsl(var(--commerce-green))] transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2.5 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
                    >
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--commerce-teal)_/_0.15)] text-[hsl(var(--commerce-teal))] transition-all duration-300 group-hover:bg-[hsl(var(--commerce-green)_/_0.2)] group-hover:text-[hsl(var(--commerce-green))]">
                        <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={service.route}>
                  <Button
                    variant="ghost"
                    className="group/link relative h-auto p-0 font-semibold text-[hsl(var(--commerce-green))] transition-all duration-300 hover:text-[hsl(var(--commerce-teal))]"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;