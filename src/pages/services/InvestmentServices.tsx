import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, TrendingUp, CheckCircle, Target, PieChart, Clock, X, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import investmentServicesImage from "@/assets/investment-services.jpg";

const InvestmentServices = () => {
  // Modal state management
  const [activeModal, setActiveModal] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<any>(null);
  
  // Consultation form state
  const [consultationData, setConsultationData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    serviceInterest: '',
    message: ''
  });
  
  // Retirement Calculator state
  const [retirementData, setRetirementData] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    expectedReturn: 7,
    desiredIncome: 80000
  });
  
  // Risk Assessment state
  const [riskData, setRiskData] = useState({
    age: 30,
    investmentExperience: 'moderate',
    timeHorizon: '10-20',
    riskTolerance: 'moderate',
    financialGoals: 'retirement'
  });
  
  // Investment Goal Planner state
  const [goalData, setGoalData] = useState({
    goalAmount: 1000000,
    timeHorizon: 20,
    currentSavings: 100000,
    monthlyContribution: 2000,
    expectedReturn: 8
  });

  // Calculate retirement needs
  const calculateRetirement = () => {
    const yearsToRetirement = retirementData.retirementAge - retirementData.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = retirementData.expectedReturn / 100 / 12;
    
    // Future value of current savings
    const futureValueCurrentSavings = retirementData.currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
    
    // Future value of monthly contributions
    const futureValueContributions = retirementData.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
    
    const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions;
    
    // Calculate if this meets desired income (assuming 4% withdrawal rate)
    const annualWithdrawal = totalRetirementSavings * 0.04;
    const monthlyWithdrawal = annualWithdrawal / 12;
    
    return {
      totalSavings: totalRetirementSavings,
      annualWithdrawal,
      monthlyWithdrawal,
      meetsGoal: annualWithdrawal >= retirementData.desiredIncome
    };
  };

  // Calculate investment goal
  const calculateGoal = () => {
    const monthsToGoal = goalData.timeHorizon * 12;
    const monthlyReturn = goalData.expectedReturn / 100 / 12;
    
    // Future value of current savings
    const futureValueCurrentSavings = goalData.currentSavings * Math.pow(1 + monthlyReturn, monthsToGoal);
    
    // Future value of monthly contributions
    const futureValueContributions = goalData.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, monthsToGoal) - 1) / monthlyReturn);
    
    const totalProjectedValue = futureValueCurrentSavings + futureValueContributions;
    const shortfall = Math.max(0, goalData.goalAmount - totalProjectedValue);
    
    return {
      totalProjectedValue,
      shortfall,
      meetsGoal: totalProjectedValue >= goalData.goalAmount
    };
  };

  // Get risk profile
  const getRiskProfile = () => {
    let score = 0;
    
    // Age factor
    if (riskData.age < 30) score += 3;
    else if (riskData.age < 50) score += 2;
    else score += 1;
    
    // Experience factor
    if (riskData.investmentExperience === 'expert') score += 3;
    else if (riskData.investmentExperience === 'moderate') score += 2;
    else score += 1;
    
    // Time horizon factor
    if (riskData.timeHorizon === '20+') score += 3;
    else if (riskData.timeHorizon === '10-20') score += 2;
    else score += 1;
    
    // Risk tolerance factor
    if (riskData.riskTolerance === 'aggressive') score += 3;
    else if (riskData.riskTolerance === 'moderate') score += 2;
    else score += 1;
    
    if (score >= 10) return { level: 'Aggressive', description: 'High risk, high potential returns', allocation: '80% stocks, 20% bonds' };
    else if (score >= 7) return { level: 'Moderate', description: 'Balanced risk and return', allocation: '60% stocks, 40% bonds' };
    else return { level: 'Conservative', description: 'Lower risk, stable returns', allocation: '30% stocks, 70% bonds' };
  };

  const retirementResults = calculateRetirement();
  const goalResults = calculateGoal();
  const riskProfile = getRiskProfile();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-16 bg-gradient-to-br from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center mb-6">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2 backdrop-blur-sm">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Investment Services</h1>
                </div>
                <p className="text-xl text-white/95 mb-8 leading-relaxed drop-shadow-md">
                  Build and preserve your wealth with our comprehensive investment management and retirement planning solutions designed for your future.
                </p>
              </div>
              <div className="lg:text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/20 to-[hsl(var(--commerce-teal))]/20 rounded-lg blur-2xl"></div>
                  <img 
                    src={investmentServicesImage} 
                    alt="Investment Services" 
                    className="relative rounded-xl shadow-2xl w-full max-w-lg mx-auto border-4 border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Solutions */}
        <section className="py-16 bg-gradient-to-b from-background via-gray-50/30 to-background relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--commerce-green))/3%_20%,transparent_40%,hsl(var(--commerce-teal))/3%_60%,transparent_80%,hsl(var(--commerce-green))/2%_100%)]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))]/10 to-[hsl(var(--commerce-teal))]/10 px-6 py-2 rounded-full border border-[hsl(var(--commerce-green))]/20">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">
                    Investment Solutions
                  </h2>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive investment services designed to help you build and preserve wealth for your future
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[hsl(var(--commerce-green))]/30 group">
                <CardHeader>
                  <div className="flex items-center mb-3">
                    <div className="bg-[hsl(var(--commerce-green))]/10 p-2 rounded-lg mr-3 group-hover:bg-[hsl(var(--commerce-green))]/20 transition-colors">
                      <Target className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle className="text-xl text-[hsl(var(--commerce-green))]">Portfolio Management</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Professional portfolio management tailored to your risk tolerance and financial goals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Diversified investment strategies</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Regular portfolio rebalancing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Risk assessment and monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Quarterly performance reviews</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-5 bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-xl border border-[hsl(var(--commerce-green))]/30 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="relative">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Minimum Investment</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">$25,000</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[hsl(var(--commerce-green))]/30 group">
                <CardHeader>
                  <div className="flex items-center mb-3">
                    <div className="bg-[hsl(var(--commerce-green))]/10 p-2 rounded-lg mr-3 group-hover:bg-[hsl(var(--commerce-green))]/20 transition-colors">
                      <PieChart className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle className="text-xl text-[hsl(var(--commerce-green))]">Retirement Planning</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Comprehensive retirement planning services including 401(k) management and IRA options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Traditional and Roth IRAs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">401(k) rollover services</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Retirement income strategies</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Social Security optimization</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-5 bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-xl border border-[hsl(var(--commerce-green))]/30 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="relative">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Average Annual Return</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">8.5%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[hsl(var(--commerce-green))]/30 group">
                <CardHeader>
                  <div className="flex items-center mb-3">
                    <div className="bg-[hsl(var(--commerce-green))]/10 p-2 rounded-lg mr-3 group-hover:bg-[hsl(var(--commerce-green))]/20 transition-colors">
                      <TrendingUp className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                    </div>
                    <CardTitle className="text-xl text-[hsl(var(--commerce-green))]">Brokerage Services</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Full-service brokerage with access to stocks, bonds, mutual funds, and ETFs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Commission-free stock trades</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Research and market insights</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Options and futures trading</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--commerce-teal))] mr-3 flex-shrink-0" />
                      <span className="text-sm">Mobile trading platform</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-5 bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-xl border border-[hsl(var(--commerce-green))]/30 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="relative">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Account Minimum</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent">$0</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investment Performance & Planning Tools */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <Card className="hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-xl">Portfolio Performance</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Track the performance of our managed portfolios over time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-green))]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex-1">
                        <span className="font-semibold text-gray-900 block">Conservative Portfolio</span>
                        <span className="text-xs text-muted-foreground">Lower risk, stable returns</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent relative z-10">+6.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-green))]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex-1">
                        <span className="font-semibold text-gray-900 block">Moderate Portfolio</span>
                        <span className="text-xs text-muted-foreground">Balanced risk and return</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent relative z-10">+8.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 rounded-lg border border-gray-200 hover:border-[hsl(var(--commerce-green))]/30 hover:shadow-md transition-all relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-green))]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex-1">
                        <span className="font-semibold text-gray-900 block">Aggressive Portfolio</span>
                        <span className="text-xs text-muted-foreground">Higher risk, higher potential</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] bg-clip-text text-transparent relative z-10">+11.3%</span>
                    </div>
                    <div className="pt-4 border-t bg-blue-50/50 rounded-lg p-4 -mx-1">
                      <div className="text-sm font-medium text-gray-700 mb-1">Average returns over the past 5 years</div>
                      <div className="text-xs text-muted-foreground">
                        Past performance does not guarantee future results. All investments carry risk.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 text-[hsl(var(--commerce-green))] mr-2" />
                    <CardTitle className="text-xl">Investment Planning Tools</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Use our tools to plan your investment strategy and retirement goals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 hover:bg-[hsl(var(--commerce-green))]/5 hover:border-[hsl(var(--commerce-green))]/30 hover:text-gray-900 transition-all text-gray-900"
                      onClick={() => setActiveModal('retirement')}
                    >
                      <Target className="h-4 w-4 mr-2 text-[hsl(var(--commerce-green))]" />
                      Retirement Calculator
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 hover:bg-[hsl(var(--commerce-green))]/5 hover:border-[hsl(var(--commerce-green))]/30 hover:text-gray-900 transition-all text-gray-900"
                      onClick={() => setActiveModal('risk')}
                    >
                      <PieChart className="h-4 w-4 mr-2 text-[hsl(var(--commerce-green))]" />
                      Risk Assessment Tool
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 hover:bg-[hsl(var(--commerce-green))]/5 hover:border-[hsl(var(--commerce-green))]/30 hover:text-gray-900 transition-all text-gray-900"
                      onClick={() => setActiveModal('goal')}
                    >
                      <TrendingUp className="h-4 w-4 mr-2 text-[hsl(var(--commerce-green))]" />
                      Investment Goal Planner
                    </Button>
                    <div className="pt-4 border-t">
                      <Button 
                        variant="commerce" 
                        className="w-full h-12 text-base text-white hover:text-white"
                        onClick={() => {
                          setActiveModal('consultation');
                          setConsultationData({
                            ...consultationData,
                            serviceInterest: 'Financial Review'
                          });
                        }}
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Schedule Financial Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Why Invest With Us */}
            <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))/15] via-[hsl(var(--commerce-teal))/12] to-[hsl(var(--commerce-green))/8] rounded-2xl p-10 border border-[hsl(var(--commerce-green))]/30 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"></div>
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--commerce-green))] via-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))] bg-clip-text text-transparent mb-3">
                    Why Invest With Us?
                  </h2>
                  <p className="text-muted-foreground text-lg">Trusted by thousands of investors nationwide</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-teal))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))]/15 to-[hsl(var(--commerce-teal))]/15 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <Target className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">Expert Guidance</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our certified financial planners and investment advisors have decades of experience 
                        helping clients achieve their financial goals.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-teal))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))]/15 to-[hsl(var(--commerce-teal))]/15 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <CheckCircle className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">Transparent Fees</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        No hidden fees or surprise charges. Our fee structure is simple, transparent, 
                        and aligned with your investment success.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/60 hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--commerce-green))]/0 via-[hsl(var(--commerce-green))]/5 to-[hsl(var(--commerce-teal))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-[hsl(var(--commerce-green))]/15 to-[hsl(var(--commerce-teal))]/15 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md">
                        <TrendingUp className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">Personalized Service</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Every client receives a customized investment strategy based on their unique 
                        financial situation, goals, and risk tolerance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />

      {/* Retirement Calculator Modal */}
      {activeModal === 'retirement' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                  <h2 className="text-2xl font-bold text-gray-900">Retirement Calculator</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <Card className="form-section">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Target className="h-5 w-5 mr-2 text-[hsl(var(--commerce-green))]" />
                      Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentAge">Current Age</Label>
                        <Input
                          id="currentAge"
                          type="number"
                          value={retirementData.currentAge}
                          onChange={(e) => setRetirementData({...retirementData, currentAge: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="retirementAge">Retirement Age</Label>
                        <Input
                          id="retirementAge"
                          type="number"
                          value={retirementData.retirementAge}
                          onChange={(e) => setRetirementData({...retirementData, retirementAge: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currentSavings">Current Retirement Savings</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="currentSavings"
                          type="number"
                          value={retirementData.currentSavings}
                          onChange={(e) => setRetirementData({...retirementData, currentSavings: parseInt(e.target.value)})}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="monthlyContribution"
                          type="number"
                          value={retirementData.monthlyContribution}
                          onChange={(e) => setRetirementData({...retirementData, monthlyContribution: parseInt(e.target.value)})}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                      <Input
                        id="expectedReturn"
                        type="number"
                        step="0.1"
                        value={retirementData.expectedReturn}
                        onChange={(e) => setRetirementData({...retirementData, expectedReturn: parseFloat(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="desiredIncome">Desired Annual Retirement Income</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="desiredIncome"
                          type="number"
                          value={retirementData.desiredIncome}
                          onChange={(e) => setRetirementData({...retirementData, desiredIncome: parseInt(e.target.value)})}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Retirement Projection</h3>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Total Retirement Savings</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">
                      ${retirementResults.totalSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Annual Withdrawal (4% rule)</div>
                    <div className="text-xl font-bold text-blue-600">
                      ${retirementResults.annualWithdrawal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-gray-600">Monthly: ${retirementResults.monthlyWithdrawal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                  </div>

                  <div className={`rounded-lg p-4 ${retirementResults.meetsGoal ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <div className="text-sm text-gray-600">Goal Status</div>
                    <div className={`text-lg font-bold ${retirementResults.meetsGoal ? 'text-green-600' : 'text-yellow-600'}`}>
                      {retirementResults.meetsGoal ? '✅ Goal Achieved!' : '⚠️ Needs Adjustment'}
                    </div>
                    {!retirementResults.meetsGoal && (
                      <div className="text-sm text-gray-600 mt-2">
                        Consider increasing monthly contributions or adjusting retirement age.
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <h4 className="font-semibold mb-2">Key Insights:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Years to retirement: {retirementData.retirementAge - retirementData.currentAge}</li>
                      <li>• Total contributions: ${((retirementData.retirementAge - retirementData.currentAge) * 12 * retirementData.monthlyContribution).toLocaleString()}</li>
                      <li>• Growth from investments: ${(retirementResults.totalSavings - retirementData.currentSavings - ((retirementData.retirementAge - retirementData.currentAge) * 12 * retirementData.monthlyContribution)).toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveModal(null)}>
                    Close
                  </Button>
                  <Button 
                    variant="commerce"
                    onClick={() => {
                      setActiveModal('consultation');
                      setConsultationData({
                        ...consultationData,
                        serviceInterest: 'Retirement Planning',
                        message: `Retirement Planning Consultation Request\n\nCurrent Age: ${retirementData.currentAge}\nRetirement Age: ${retirementData.retirementAge}\nCurrent Savings: $${retirementData.currentSavings.toLocaleString()}\nMonthly Contribution: $${retirementData.monthlyContribution.toLocaleString()}\nDesired Income: $${retirementData.desiredIncome.toLocaleString()}\n\nProjected Retirement Savings: $${retirementResults.totalSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}\nGoal Status: ${retirementResults.meetsGoal ? 'Goal Achieved' : 'Needs Adjustment'}`
                      });
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Retirement Planning Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment Modal */}
      {activeModal === 'risk' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <PieChart className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                  <h2 className="text-2xl font-bold text-gray-900">Risk Assessment Tool</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Assessment Form */}
                <Card className="form-section">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-[hsl(var(--commerce-green))]" />
                      Investment Profile Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="age">Your Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={riskData.age}
                        onChange={(e) => setRiskData({...riskData, age: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label>Investment Experience</Label>
                      <div className="mt-2 space-y-2">
                        <RadioGroup value={riskData.investmentExperience} onValueChange={(value) => setRiskData({...riskData, investmentExperience: value})}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="beginner" id="beginner" />
                            <Label htmlFor="beginner" className="cursor-pointer">Beginner (0-2 years)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="moderate" id="moderate" />
                            <Label htmlFor="moderate" className="cursor-pointer">Moderate (3-10 years)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="expert" id="expert" />
                            <Label htmlFor="expert" className="cursor-pointer">Expert (10+ years)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <Label>Investment Time Horizon</Label>
                      <div className="mt-2 space-y-2">
                        <RadioGroup value={riskData.timeHorizon} onValueChange={(value) => setRiskData({...riskData, timeHorizon: value})}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-5" id="1-5" />
                            <Label htmlFor="1-5" className="cursor-pointer">1-5 years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5-10" id="5-10" />
                            <Label htmlFor="5-10" className="cursor-pointer">5-10 years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="10-20" id="10-20" />
                            <Label htmlFor="10-20" className="cursor-pointer">10-20 years</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="20+" id="20+" />
                            <Label htmlFor="20+" className="cursor-pointer">20+ years</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <Label>Risk Tolerance</Label>
                      <div className="mt-2 space-y-2">
                        <RadioGroup value={riskData.riskTolerance} onValueChange={(value) => setRiskData({...riskData, riskTolerance: value})}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="conservative" id="conservative" />
                            <Label htmlFor="conservative" className="cursor-pointer">Conservative (Low risk)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="moderate" id="moderate-risk" />
                            <Label htmlFor="moderate-risk" className="cursor-pointer">Moderate (Balanced)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="aggressive" id="aggressive" />
                            <Label htmlFor="aggressive" className="cursor-pointer">Aggressive (High risk)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <Label>Primary Financial Goal</Label>
                      <Select value={riskData.financialGoals} onValueChange={(value) => setRiskData({...riskData, financialGoals: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retirement">Retirement Planning</SelectItem>
                          <SelectItem value="education">Education Funding</SelectItem>
                          <SelectItem value="home">Home Purchase</SelectItem>
                          <SelectItem value="wealth">Wealth Building</SelectItem>
                          <SelectItem value="income">Income Generation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Profile Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Risk Profile</h3>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Recommended Risk Level</div>
                    <div className="text-2xl font-bold text-blue-600">{riskProfile.level}</div>
                    <div className="text-sm text-gray-600 mt-1">{riskProfile.description}</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Suggested Asset Allocation</div>
                    <div className="text-lg font-bold text-[hsl(var(--commerce-green))]">{riskProfile.allocation}</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Portfolio Characteristics:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {riskProfile.level === 'Conservative' && (
                        <>
                          <li>• Lower volatility and risk</li>
                          <li>• Steady, predictable returns</li>
                          <li>• Suitable for short-term goals</li>
                          <li>• Capital preservation focus</li>
                        </>
                      )}
                      {riskProfile.level === 'Moderate' && (
                        <>
                          <li>• Balanced risk and return</li>
                          <li>• Moderate growth potential</li>
                          <li>• Suitable for medium-term goals</li>
                          <li>• Diversified approach</li>
                        </>
                      )}
                      {riskProfile.level === 'Aggressive' && (
                        <>
                          <li>• Higher growth potential</li>
                          <li>• Higher volatility and risk</li>
                          <li>• Suitable for long-term goals</li>
                          <li>• Growth-focused strategy</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 text-sm">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                    <ul className="space-y-1 text-yellow-700">
                      <li>• This assessment is for educational purposes only</li>
                      <li>• Consult with a financial advisor for personalized advice</li>
                      <li>• Risk tolerance may change over time</li>
                      <li>• Past performance doesn't guarantee future results</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveModal(null)}>
                    Close
                  </Button>
                  <Button 
                    variant="commerce"
                    onClick={() => {
                      setActiveModal('consultation');
                      setConsultationData({
                        ...consultationData,
                        serviceInterest: 'Investment Strategy',
                        message: `Risk Assessment Results\n\nRisk Level: ${riskProfile.level}\nDescription: ${riskProfile.description}\nAsset Allocation: ${riskProfile.allocation}\nAge: ${riskData.age}\nExperience: ${riskData.investmentExperience}\nTime Horizon: ${riskData.timeHorizon} years\nPrimary Goal: ${riskData.financialGoals}`
                      });
                    }}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Get Personalized Investment Strategy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Goal Planner Modal */}
      {activeModal === 'goal' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                  <h2 className="text-2xl font-bold text-gray-900">Investment Goal Planner</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Goal Planning Form */}
                <Card className="form-section">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-[hsl(var(--commerce-green))]" />
                      Your Investment Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="goalAmount">Goal Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="goalAmount"
                          type="number"
                          value={goalData.goalAmount}
                          onChange={(e) => setGoalData({...goalData, goalAmount: parseInt(e.target.value)})}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timeHorizon">Time Horizon (Years)</Label>
                      <Input
                        id="timeHorizon"
                        type="number"
                        value={goalData.timeHorizon}
                        onChange={(e) => setGoalData({...goalData, timeHorizon: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="currentSavings">Current Savings</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="currentSavings"
                          type="number"
                          value={goalData.currentSavings}
                          onChange={(e) => setGoalData({...goalData, currentSavings: parseInt(e.target.value)})}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="monthlyContribution"
                          type="number"
                          value={goalData.monthlyContribution}
                          onChange={(e) => setGoalData({...goalData, monthlyContribution: parseInt(e.target.value)})}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                      <Input
                        id="expectedReturn"
                        type="number"
                        step="0.1"
                        value={goalData.expectedReturn}
                        onChange={(e) => setGoalData({...goalData, expectedReturn: parseFloat(e.target.value)})}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Goal Analysis Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Goal Analysis</h3>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Projected Value at Goal Date</div>
                    <div className="text-2xl font-bold text-[hsl(var(--commerce-green))]">
                      ${goalResults.totalProjectedValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 ${goalResults.meetsGoal ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="text-sm text-gray-600">Goal Status</div>
                    <div className={`text-lg font-bold ${goalResults.meetsGoal ? 'text-green-600' : 'text-red-600'}`}>
                      {goalResults.meetsGoal ? '✅ Goal Achievable!' : '❌ Shortfall Detected'}
                    </div>
                    {!goalResults.meetsGoal && (
                      <div className="text-sm text-gray-600 mt-2">
                        Shortfall: ${goalResults.shortfall.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Total Contributions</div>
                    <div className="text-xl font-bold text-blue-600">
                      ${(goalData.timeHorizon * 12 * goalData.monthlyContribution).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Growth from Investments</div>
                    <div className="text-xl font-bold text-purple-600">
                      ${(goalResults.totalProjectedValue - goalData.currentSavings - (goalData.timeHorizon * 12 * goalData.monthlyContribution)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  {!goalResults.meetsGoal && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Recommendations to Meet Goal:</h4>
                      <ul className="space-y-1 text-sm text-yellow-700">
                        <li>• Increase monthly contribution by ${Math.ceil(goalResults.shortfall / (goalData.timeHorizon * 12)).toLocaleString()}</li>
                        <li>• Extend time horizon by {Math.ceil(goalResults.shortfall / (goalData.monthlyContribution * 12))} years</li>
                        <li>• Consider higher return investments (with higher risk)</li>
                        <li>• Reduce goal amount if appropriate</li>
                      </ul>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <h4 className="font-semibold mb-2">Goal Timeline:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Years to goal: {goalData.timeHorizon}</li>
                      <li>• Total months: {goalData.timeHorizon * 12}</li>
                      <li>• Monthly target: ${Math.ceil(goalData.goalAmount / (goalData.timeHorizon * 12)).toLocaleString()}</li>
                      <li>• Current monthly: ${goalData.monthlyContribution.toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveModal(null)}>
                    Close
                  </Button>
                  <Button 
                    variant="commerce"
                    onClick={() => {
                      setActiveModal('consultation');
                      setConsultationData({
                        ...consultationData,
                        serviceInterest: 'Investment Planning',
                        message: `Investment Goal Planner Results\n\nGoal Amount: $${goalData.goalAmount.toLocaleString()}\nTime Horizon: ${goalData.timeHorizon} years\nCurrent Savings: $${goalData.currentSavings.toLocaleString()}\nMonthly Contribution: $${goalData.monthlyContribution.toLocaleString()}\nExpected Return: ${goalData.expectedReturn}%\nProjected Value: $${goalResults.totalProjectedValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}\nGoal Status: ${goalResults.meetsGoal ? 'Achievable' : 'Needs Adjustment'}${!goalResults.meetsGoal ? `\nShortfall: $${goalResults.shortfall.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : ''}`
                      });
                    }}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Create Investment Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Scheduling Modal */}
      {activeModal === 'consultation' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                  <h2 className="text-2xl font-bold text-gray-900">Schedule Consultation</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  setActiveModal(null);
                  setConsultationData({
                    name: '',
                    email: '',
                    phone: '',
                    preferredDate: '',
                    preferredTime: '',
                    serviceInterest: '',
                    message: ''
                  });
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form className="form-surface space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const referenceId = `CONS-${Date.now().toString().slice(-6)}`;
                setSubmissionDetails({
                  name: consultationData.name,
                  email: consultationData.email,
                  phone: consultationData.phone,
                  preferredDate: consultationData.preferredDate,
                  preferredTime: consultationData.preferredTime,
                  serviceInterest: consultationData.serviceInterest,
                  referenceId
                });
                setActiveModal(null);
                setShowSuccessModal(true);
                setConsultationData({
                  name: '',
                  email: '',
                  phone: '',
                  preferredDate: '',
                  preferredTime: '',
                  serviceInterest: '',
                  message: ''
                });
              }}>
                <Card className="form-section">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-[hsl(var(--commerce-green))]" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="consultationName">Full Name *</Label>
                        <Input
                          id="consultationName"
                          type="text"
                          required
                          value={consultationData.name}
                          onChange={(e) => setConsultationData({...consultationData, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="consultationEmail">Email Address *</Label>
                        <Input
                          id="consultationEmail"
                          type="email"
                          required
                          value={consultationData.email}
                          onChange={(e) => setConsultationData({...consultationData, email: e.target.value})}
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="consultationPhone">Phone Number *</Label>
                      <Input
                        id="consultationPhone"
                        type="tel"
                        required
                        value={consultationData.phone}
                        onChange={(e) => setConsultationData({...consultationData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="form-section">
                  <CardHeader>
                    <CardTitle className="text-lg">Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="serviceInterest">Service Interest *</Label>
                        <Select 
                          required
                          value={consultationData.serviceInterest} 
                          onValueChange={(value) => setConsultationData({...consultationData, serviceInterest: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Consultation">General Consultation</SelectItem>
                            <SelectItem value="Portfolio Management">Portfolio Management</SelectItem>
                            <SelectItem value="Retirement Planning">Retirement Planning</SelectItem>
                            <SelectItem value="Investment Strategy">Investment Strategy</SelectItem>
                            <SelectItem value="Investment Planning">Investment Planning</SelectItem>
                            <SelectItem value="Financial Review">Financial Review</SelectItem>
                            <SelectItem value="Brokerage Services">Brokerage Services</SelectItem>
                            <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferredDate">Preferred Date *</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          required
                          value={consultationData.preferredDate}
                          onChange={(e) => setConsultationData({...consultationData, preferredDate: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferredTime">Preferred Time *</Label>
                      <Select 
                        required
                        value={consultationData.preferredTime} 
                        onValueChange={(value) => setConsultationData({...consultationData, preferredTime: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                          <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                          <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                          <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                          <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                          <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                          <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                          <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                          <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="form-section">
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="consultationMessage">Additional Information</Label>
                      <Textarea
                        id="consultationMessage"
                        value={consultationData.message}
                        onChange={(e) => setConsultationData({...consultationData, message: e.target.value})}
                        placeholder="Tell us about your investment goals, current situation, or any specific questions you have..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4 border-t">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      setActiveModal(null);
                      setConsultationData({
                        name: '',
                        email: '',
                        phone: '',
                        preferredDate: '',
                        preferredTime: '',
                        serviceInterest: '',
                        message: ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="commerce">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[hsl(var(--commerce-green))]/10 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-[hsl(var(--commerce-green))]" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center text-[hsl(var(--commerce-green))]">
              Consultation Scheduled Successfully!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Thank you for scheduling a consultation with Commerce Bank.
            </DialogDescription>
          </DialogHeader>
          
          {submissionDetails && (
            <div className="space-y-4 py-4">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[hsl(var(--commerce-green))]" />
                  Your Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{submissionDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{submissionDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{submissionDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preferred Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(submissionDetails.preferredDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preferred Time:</span>
                    <span className="font-medium text-gray-900">{submissionDetails.preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Interest:</span>
                    <span className="font-medium text-gray-900">{submissionDetails.serviceInterest}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Next Steps:</strong> A financial advisor will contact you within 24 hours to confirm your consultation appointment.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Reference ID:</span>
                  <span className="font-mono font-semibold text-[hsl(var(--commerce-green))]">{submissionDetails.referenceId}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button 
              variant="commerce" 
              onClick={() => setShowSuccessModal(false)}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Got it, thank you!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentServices;