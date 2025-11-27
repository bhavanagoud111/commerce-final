import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  applicationType: string;
}

const ApplicationForm = ({ isOpen, onClose, applicationType }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    
    // Address Information
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Employment Information
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    annualIncome: "",
    
    // Account Preferences
    initialDeposit: "",
    accountPurpose: "",
    
    
    // Additional Information
    hasExistingAccount: false,
    additionalInfo: "",
    
    // Terms and Conditions
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [creditLimit, setCreditLimit] = useState<number | null>(null);
  
  // Calculate credit limit for credit card applications
  useEffect(() => {
    const isCreditCard = applicationType === 'cash_back_card' || 
                         applicationType === 'travel_rewards_card' || 
                         applicationType === 'student_credit_card';
    
    if (isCreditCard && formData.annualIncome) {
      // Convert income range string to numeric value
      let income = 0;
      switch (formData.annualIncome) {
        case 'under-25k':
          income = 20000; // Use midpoint of range
          break;
        case '25k-50k':
          income = 37500; // Use midpoint of range
          break;
        case '50k-75k':
          income = 62500; // Use midpoint of range
          break;
        case '75k-100k':
          income = 87500; // Use midpoint of range
          break;
        case '100k-150k':
          income = 125000; // Use midpoint of range
          break;
        case 'over-150k':
          income = 175000; // Use conservative estimate
          break;
        default:
          income = 0;
      }
      
      if (income > 0) {
        // Different credit limit logic based on card type and income
        let calculatedLimit;
        
        if (applicationType === 'student_credit_card') {
          // Student cards: 8% of income, max $5,000 (more generous for higher income)
          calculatedLimit = income * 0.08;
          calculatedLimit = Math.max(500, calculatedLimit);
          calculatedLimit = Math.min(5000, calculatedLimit);
        } else if (applicationType === 'cash_back_card') {
          // Cash back cards: 8% of income, max $8,000
          calculatedLimit = income * 0.08;
          calculatedLimit = Math.max(1000, calculatedLimit);
          calculatedLimit = Math.min(8000, calculatedLimit);
        } else if (applicationType === 'travel_rewards_card') {
          // Travel rewards cards: 12% of income, max $15,000
          calculatedLimit = income * 0.12;
          calculatedLimit = Math.max(1500, calculatedLimit);
          calculatedLimit = Math.min(15000, calculatedLimit);
        }
        
        setCreditLimit(Math.round(calculatedLimit / 100) * 100); // Round to nearest 100
      } else {
        setCreditLimit(null);
      }
    } else {
      setCreditLimit(null);
    }
  }, [formData.annualIncome, applicationType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.ssn) newErrors.ssn = "SSN is required";
    if (!formData.streetAddress) newErrors.streetAddress = "Street Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "ZIP Code is required";
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment Status is required";
    if (formData.employmentStatus === "employed" && !formData.employerName)
      newErrors.employerName = "Employer Name is required for employed status";
    if (formData.employmentStatus === "employed" && !formData.jobTitle)
      newErrors.jobTitle = "Job Title is required for employed status";
    if (!formData.annualIncome) newErrors.annualIncome = "Annual Income is required";
    
    // Initial deposit only required for non-credit card applications
    const isCreditCard = applicationType === 'cash_back_card' || 
                         applicationType === 'travel_rewards_card' || 
                         applicationType === 'student_credit_card';
    if (!isCreditCard && !formData.initialDeposit) {
      newErrors.initialDeposit = "Initial Deposit is required";
    }
    
    if (!formData.accountPurpose) newErrors.accountPurpose = "Account Purpose is required";
    
    // Authentication validation
    
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const isCreditCard = applicationType === 'cash_back_card' || 
                          applicationType === 'travel_rewards_card' || 
                          applicationType === 'student_credit_card';
      
      const applicationData = {
        applicationType: applicationType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        ssn: formData.ssn,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        employmentStatus: formData.employmentStatus,
        employerName: formData.employerName,
        jobTitle: formData.jobTitle,
        annualIncome: formData.annualIncome,
        initialDeposit: isCreditCard ? 0 : parseFloat(formData.initialDeposit),
        accountPurpose: formData.accountPurpose,
        hasExistingAccount: formData.hasExistingAccount,
        additionalInfo: formData.additionalInfo,
        agreeToTerms: formData.agreeToTerms,
        agreeToMarketing: formData.agreeToMarketing,
        ...((applicationType === 'cash_back_card' || 
             applicationType === 'travel_rewards_card' || 
             applicationType === 'student_credit_card') && 
             creditLimit !== null && { creditLimit: creditLimit }),
      };

      console.log('Submitting application with data:', {
        applicationType,
        creditLimit,
        isCreditCard,
        annualIncome: formData.annualIncome
      });

      const response = await fetch("http://localhost:3001/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        throw new Error(errorData.message || "Failed to submit application");
      }

      const result = await response.json();
      
      if (result.success !== false) {
        console.log("Application submitted:", applicationData);
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || "Failed to submit application");
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      const errorMessage = error.message || (error instanceof TypeError && error.message.includes('fetch') 
        ? "Unable to connect to server. Please ensure the backend is running." 
        : "An unexpected error occurred.");
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    switch (applicationType) {
      case "premium_checking":
        return "Premium Checking Account Application";
      case "student_checking":
        return "Student Checking Account Application";
      case "high_yield_savings":
        return "High-Yield Savings Account Application";
      case "money_market":
        return "Money Market Account Application";
      case "cash_back_card":
        return "Cash Back Card Application";
      case "travel_rewards_card":
        return "Travel Rewards Card Application";
      case "student_credit_card":
        return "Student Credit Card Application";
      default:
        return "Account Application";
    }
  };

  const getFormDescription = () => {
    switch (applicationType) {
      case "premium_checking":
        return "Apply for your new Premium Checking account. Enjoy enhanced features.";
      case "student_checking":
        return "Apply for your new Student Checking account. Designed for students.";
      case "high_yield_savings":
        return "Apply for a High-Yield Savings account to grow your savings faster.";
      case "money_market":
        return "Apply for a Money Market account with competitive rates.";
      case "cash_back_card":
        return "Apply for the Cash Back Card and earn rewards on every purchase.";
      case "travel_rewards_card":
        return "Apply for the Travel Rewards Card and unlock exclusive travel benefits.";
      case "student_credit_card":
        return "Apply for the Student Credit Card to build your credit history.";
      default:
        return "Fill out the details below to apply for your new account.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {getFormTitle()}
            <Button variant="ghost" onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
          <DialogDescription>{getFormDescription()}</DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="form-surface">
            {/* Personal Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={handleChange} />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={handleChange} />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number (SSN)</Label>
                  <Input id="ssn" value={formData.ssn} onChange={handleChange} placeholder="XXX-XX-XXXX" />
                  {errors.ssn && <p className="text-red-500 text-sm">{errors.ssn}</p>}
                </div>
              </CardContent>
            </Card>


            {/* Address Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Where do you live?</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input id="streetAddress" value={formData.streetAddress} onChange={handleChange} />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={handleChange} />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select onValueChange={(value) => handleSelectChange("state", value)} value={formData.state}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" value={formData.zipCode} onChange={handleChange} />
                  {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Employment Information</CardTitle>
                <CardDescription>Tell us about your employment status.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select onValueChange={(value) => handleSelectChange("employmentStatus", value)} value={formData.employmentStatus}>
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select Employment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employmentStatus && <p className="text-red-500 text-sm">{errors.employmentStatus}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input id="employerName" value={formData.employerName} onChange={handleChange} />
                  {errors.employerName && <p className="text-red-500 text-sm">{errors.employerName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                  {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Select onValueChange={(value) => handleSelectChange("annualIncome", value)} value={formData.annualIncome}>
                    <SelectTrigger id="annualIncome">
                      <SelectValue placeholder="Select Annual Income" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                      <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                      <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                      <SelectItem value="over-150k">Over $150,000</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.annualIncome && <p className="text-red-500 text-sm">{errors.annualIncome}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Account Preferences */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Tell us about your account preferences.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Initial Deposit - only show for non-credit card applications */}
                {(applicationType !== 'cash_back_card' && 
                  applicationType !== 'travel_rewards_card' && 
                  applicationType !== 'student_credit_card') && (
                  <div className="space-y-2">
                    <Label htmlFor="initialDeposit">Initial Deposit Amount</Label>
                    <Input id="initialDeposit" type="number" value={formData.initialDeposit} onChange={handleChange} placeholder="0.00" />
                    {errors.initialDeposit && <p className="text-red-500 text-sm">{errors.initialDeposit}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="accountPurpose">Account Purpose</Label>
                  <Select onValueChange={(value) => handleSelectChange("accountPurpose", value)} value={formData.accountPurpose}>
                    <SelectTrigger id="accountPurpose">
                      <SelectValue placeholder="Select Account Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {(applicationType === 'cash_back_card' || 
                        applicationType === 'travel_rewards_card' || 
                        applicationType === 'student_credit_card') ? (
                        <>
                          <SelectItem value="daily-expenses">Daily Expenses</SelectItem>
                          <SelectItem value="emergency-fund">Emergency Fund</SelectItem>
                          <SelectItem value="building-credit">Building Credit</SelectItem>
                          <SelectItem value="rewards-earning">Rewards Earning</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="daily-expenses">Daily Expenses</SelectItem>
                          <SelectItem value="bill-payments">Bill Payments</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.accountPurpose && <p className="text-red-500 text-sm">{errors.accountPurpose}</p>}
                </div>
                
                {/* Credit Limit Display for Credit Card Applications */}
                {(applicationType === 'cash_back_card' || 
                  applicationType === 'travel_rewards_card' || 
                  applicationType === 'student_credit_card') && 
                  creditLimit !== null && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="creditLimit">Calculated Credit Limit</Label>
                    <Input
                      id="creditLimit"
                      type="text"
                      value={`$${creditLimit.toLocaleString()}`}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500">Based on your annual income range: {formData.annualIncome?.replace('-', ' - ').replace('k', 'K').replace('under', 'Under').replace('over', 'Over')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Any additional information you'd like to share.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasExistingAccount" checked={formData.hasExistingAccount} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasExistingAccount: checked as boolean }))} />
                  <Label htmlFor="hasExistingAccount">I have an existing account with Commerce Bank</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea id="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Any additional information you'd like to share..." />
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="form-section form-section-accent">
              <CardHeader>
                <CardTitle>Terms and Conditions</CardTitle>
                <CardDescription>Please read and agree to the terms and conditions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Account Agreement Summary</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Account opening subject to approval and verification</li>
                    <li>• Minimum balance requirements may apply</li>
                    <li>• Monthly maintenance fees may be charged</li>
                    <li>• Overdraft protection available upon request</li>
                    <li>• Electronic banking services included</li>
                    <li>• FDIC insured up to $250,000 per depositor</li>
                  </ul>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeToTerms" 
                    checked={formData.agreeToTerms} 
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))} 
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Terms & Conditions",
                          description: "Review our standard account terms at commercebank.com/terms.",
                        })
                      }
                    >Terms and Conditions</button> and <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Privacy Policy",
                          description: "Learn how we handle your data at commercebank.com/privacy.",
                        })
                      }
                    >Privacy Policy</button> *
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeToMarketing" 
                    checked={formData.agreeToMarketing} 
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToMarketing: checked as boolean }))} 
                  />
                  <Label htmlFor="agreeToMarketing" className="text-sm">
                    I would like to receive marketing communications from Commerce Bank about products, services, and special offers
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {submissionError && (
              <div className="form-section border-red-200 bg-red-50/90">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Submission Error</span>
                </div>
                <p className="text-red-600 mt-1">{submissionError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="form-surface text-center">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Application Submitted Successfully!</h3>
            <p className="text-green-600 mb-4">
              Thank you for your application. We will review it and get back to you soon.
            </p>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;
