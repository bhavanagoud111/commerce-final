import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LoanApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  loanType: string;
  onSuccess?: () => void;
}

const LoanApplicationForm = ({ isOpen, onClose, loanType, onSuccess }: LoanApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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
    workPhone: "",
    
    // Loan Information
    loanAmount: "",
    loanPurpose: "",
    downPayment: "",
    propertyValue: "", // For home equity loans
    vehicleYear: "", // For auto loans
    vehicleMake: "", // For auto loans
    vehicleModel: "", // For auto loans
    
    // Additional Information
    additionalInfo: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal Information
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.ssn.trim()) newErrors.ssn = "SSN is required";

    // Address Information
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    // Employment Information
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (!formData.annualIncome) newErrors.annualIncome = "Annual income is required";

    // Loan Information
    if (!formData.loanAmount.trim()) newErrors.loanAmount = "Loan amount is required";
    if (!formData.loanPurpose) newErrors.loanPurpose = "Loan purpose is required";

    // Loan-specific validations
    if (loanType === "Auto Loan") {
      if (!formData.vehicleYear.trim()) newErrors.vehicleYear = "Vehicle year is required";
      if (!formData.vehicleMake.trim()) newErrors.vehicleMake = "Vehicle make is required";
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = "Vehicle model is required";
    }

    if (loanType === "Home Equity Loan") {
      if (!formData.propertyValue.trim()) newErrors.propertyValue = "Property value is required";
    }

    // Terms and Conditions
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const applicationData = {
        loanType,
        ...formData,
        loanAmount: parseFloat(formData.loanAmount),
        downPayment: formData.downPayment ? parseFloat(formData.downPayment) : 0,
        propertyValue: formData.propertyValue ? parseFloat(formData.propertyValue) : 0
      };

      console.log('Submitting loan application:', applicationData);

      const response = await fetch('http://localhost:3001/loan-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        throw new Error(errorData.message || 'Failed to submit loan application');
      }

      const result = await response.json();

      if (result.success !== false) {
        setIsSubmitted(true);
        console.log('Loan application submitted successfully');
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(result.message || 'Failed to submit loan application');
      }
    } catch (error: any) {
      console.error('Error submitting loan application:', error);
      const errorMessage = error.message || (error instanceof TypeError && error.message.includes('fetch') 
        ? "Unable to connect to server. Please ensure the backend is running on port 3001." 
        : "Network error. Please try again.");
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      ssn: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      employmentStatus: "",
      employerName: "",
      jobTitle: "",
      annualIncome: "",
      workPhone: "",
      loanAmount: "",
      loanPurpose: "",
      downPayment: "",
      propertyValue: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      additionalInfo: "",
      agreeToTerms: false,
      agreeToMarketing: false
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmissionError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getLoanSpecificFields = () => {
    if (loanType === "Auto Loan") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vehicleYear">Vehicle Year *</Label>
              <Input
                id="vehicleYear"
                type="number"
                placeholder="2020"
                value={formData.vehicleYear}
                onChange={(e) => handleChange('vehicleYear', e.target.value)}
                className={errors.vehicleYear ? "border-red-500" : ""}
              />
              {errors.vehicleYear && <p className="text-red-500 text-sm">{errors.vehicleYear}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleMake">Vehicle Make *</Label>
              <Input
                id="vehicleMake"
                type="text"
                placeholder="Toyota"
                value={formData.vehicleMake}
                onChange={(e) => handleChange('vehicleMake', e.target.value)}
                className={errors.vehicleMake ? "border-red-500" : ""}
              />
              {errors.vehicleMake && <p className="text-red-500 text-sm">{errors.vehicleMake}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleModel">Vehicle Model *</Label>
              <Input
                id="vehicleModel"
                type="text"
                placeholder="Camry"
                value={formData.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
                className={errors.vehicleModel ? "border-red-500" : ""}
              />
              {errors.vehicleModel && <p className="text-red-500 text-sm">{errors.vehicleModel}</p>}
            </div>
          </div>
        </>
      );
    }

    if (loanType === "Home Equity Loan") {
      return (
        <div>
          <Label htmlFor="propertyValue">Property Value *</Label>
          <Input
            id="propertyValue"
            type="number"
            placeholder="500000"
            value={formData.propertyValue}
            onChange={(e) => handleChange('propertyValue', e.target.value)}
            className={errors.propertyValue ? "border-red-500" : ""}
          />
          {errors.propertyValue && <p className="text-red-500 text-sm">{errors.propertyValue}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            {loanType} Application
          </DialogTitle>
        </DialogHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="form-surface">
            {/* Personal Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="ssn">Social Security Number *</Label>
                    <Input
                      id="ssn"
                      type="text"
                      placeholder="123-45-6789"
                      value={formData.ssn}
                      onChange={(e) => handleChange('ssn', e.target.value)}
                      className={errors.ssn ? "border-red-500" : ""}
                    />
                    {errors.ssn && <p className="text-red-500 text-sm">{errors.ssn}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="text-lg">Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input
                    id="streetAddress"
                    type="text"
                    placeholder="123 Main Street"
                    value={formData.streetAddress}
                    onChange={(e) => handleChange('streetAddress', e.target.value)}
                    className={errors.streetAddress ? "border-red-500" : ""}
                  />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleChange('state', value)}>
                      <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select state" />
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
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="12345"
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="text-lg">Employment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentStatus">Employment Status *</Label>
                    <Select value={formData.employmentStatus} onValueChange={(value) => handleChange('employmentStatus', value)}>
                      <SelectTrigger className={errors.employmentStatus ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select employment status" />
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
                  
                  <div>
                    <Label htmlFor="annualIncome">Annual Income *</Label>
                    <Select value={formData.annualIncome} onValueChange={(value) => handleChange('annualIncome', value)}>
                      <SelectTrigger className={errors.annualIncome ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select annual income" />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input
                      id="employerName"
                      type="text"
                      placeholder="Company Name"
                      value={formData.employerName}
                      onChange={(e) => handleChange('employerName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      placeholder="Software Engineer"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Information */}
            <Card className="form-section">
              <CardHeader>
                <CardTitle className="text-lg">Loan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount *</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="25000"
                      value={formData.loanAmount}
                      onChange={(e) => handleChange('loanAmount', e.target.value)}
                      className={errors.loanAmount ? "border-red-500" : ""}
                    />
                    {errors.loanAmount && <p className="text-red-500 text-sm">{errors.loanAmount}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                    <Select value={formData.loanPurpose} onValueChange={(value) => handleChange('loanPurpose', value)}>
                      <SelectTrigger className={errors.loanPurpose ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select loan purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                        <SelectItem value="home-improvement">Home Improvement</SelectItem>
                        <SelectItem value="major-purchase">Major Purchase</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="medical-expenses">Medical Expenses</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.loanPurpose && <p className="text-red-500 text-sm">{errors.loanPurpose}</p>}
                  </div>
                </div>

                {getLoanSpecificFields()}

                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <textarea
                    id="additionalInfo"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Any additional information you'd like to share..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange('additionalInfo', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="form-section form-section-accent">
              <CardHeader>
                <CardTitle className="text-lg">Terms and Conditions</CardTitle>
                <CardDescription>
                  Please review the terms and conditions before submitting your application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Loan Agreement Summary</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Loan approval subject to credit verification and income verification</li>
                    <li>• Interest rates and terms based on creditworthiness</li>
                    <li>• Early repayment may be subject to penalties</li>
                    <li>• Property insurance required for secured loans</li>
                    <li>• Loan terms and conditions will be provided upon approval</li>
                    <li>• All loans subject to final approval and documentation</li>
                  </ul>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeToTerms" 
                    checked={formData.agreeToTerms} 
                    onCheckedChange={(checked) => handleChange('agreeToTerms', checked as boolean)} 
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Loan Terms & Conditions",
                          description: "Review interest rates, repayment terms, and lending conditions at commercebank.com/loan-terms.",
                        })
                      }
                    >Terms and Conditions</button> and <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() =>
                        toast({
                          title: "Privacy Policy",
                          description: "See how we handle your information at commercebank.com/privacy. We never sell personal data.",
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
                    onCheckedChange={(checked) => handleChange('agreeToMarketing', checked as boolean)} 
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="form-surface text-center space-y-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Loan Application Submitted Successfully!</h3>
            <p className="text-green-600 mb-4">
              Thank you for your loan application. We will review it and get back to you soon.
            </p>
            <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoanApplicationForm;
