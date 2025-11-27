import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BasicCheckingApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateApplicationId = () =>
  `CB-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

const BasicCheckingApplicationForm = ({ isOpen, onClose }: BasicCheckingApplicationFormProps) => {
  const [applicationId, setApplicationId] = useState(generateApplicationId);
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
  

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.ssn.trim()) newErrors.ssn = "SSN is required";
    else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(formData.ssn.replace(/-/g, ""))) newErrors.ssn = "Please enter a valid SSN";
    
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (formData.employmentStatus === "employed" && !formData.employerName.trim()) {
      newErrors.employerName = "Employer name is required";
    }
    if (!formData.annualIncome.trim()) newErrors.annualIncome = "Annual income is required";
    
    if (!formData.initialDeposit.trim()) newErrors.initialDeposit = "Initial deposit amount is required";
    else if (parseFloat(formData.initialDeposit) < 0) newErrors.initialDeposit = "Initial deposit must be $0 or more";
    
    // Authentication validation
    
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Prepare data for API submission
      const applicationData = {
        applicationType: 'basic_checking',
        applicationId,
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
        initialDeposit: formData.initialDeposit,
        accountPurpose: formData.accountPurpose,
        hasExistingAccount: formData.hasExistingAccount,
        additionalInfo: formData.additionalInfo,
        agreeToTerms: formData.agreeToTerms,
        agreeToMarketing: formData.agreeToMarketing
      };

      // Submit to backend API
      const response = await fetch('http://localhost:3001/applications', {
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
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();

      if (result.success !== false) {
        console.log("Application submitted successfully:", result);
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      const errorMessage = error.message || (error instanceof TypeError && error.message.includes('fetch') 
        ? "Unable to connect to server. Please ensure the backend is running on port 3001." 
        : "We couldn't process your application. Please try again.");
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: errorMessage,
      });
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
      initialDeposit: "",
      accountPurpose: "",
      hasExistingAccount: false,
      additionalInfo: "",
      agreeToTerms: false,
      agreeToMarketing: false
    });
    setErrors({});
    setIsSubmitted(false);
    setApplicationId(generateApplicationId());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in our Basic Checking account. 
              We'll review your application and contact you within 1-2 business days.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">✓</span>
            </div>
            Basic Checking Account Application
          </DialogTitle>
          <DialogDescription>
            Please fill out the form below to apply for a Basic Checking account. 
            All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

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
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ssn">Social Security Number *</Label>
                  <Input
                    id="ssn"
                    value={formData.ssn}
                    onChange={(e) => handleInputChange("ssn", e.target.value)}
                    className={errors.ssn ? "border-red-500" : ""}
                    placeholder="123-45-6789"
                  />
                  {errors.ssn && (
                    <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>
                  )}
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
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                  className={errors.streetAddress ? "border-red-500" : ""}
                />
                {errors.streetAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
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
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    className={errors.zipCode ? "border-red-500" : ""}
                    placeholder="12345"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
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
              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
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
                {errors.employmentStatus && (
                  <p className="text-red-500 text-sm mt-1">{errors.employmentStatus}</p>
                )}
              </div>

              {formData.employmentStatus === "employed" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employerName">Employer Name *</Label>
                    <Input
                      id="employerName"
                      value={formData.employerName}
                      onChange={(e) => handleInputChange("employerName", e.target.value)}
                      className={errors.employerName ? "border-red-500" : ""}
                    />
                    {errors.employerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.employerName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="annualIncome">Annual Income *</Label>
                <Select value={formData.annualIncome} onValueChange={(value) => handleInputChange("annualIncome", value)}>
                  <SelectTrigger className={errors.annualIncome ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select annual income range" />
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
                {errors.annualIncome && (
                  <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Preferences */}
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="text-lg">Account Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="initialDeposit">Initial Deposit Amount *</Label>
                <Input
                  id="initialDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialDeposit}
                  onChange={(e) => handleInputChange("initialDeposit", e.target.value)}
                  className={errors.initialDeposit ? "border-red-500" : ""}
                  placeholder="0.00"
                />
                {errors.initialDeposit && (
                  <p className="text-red-500 text-sm mt-1">{errors.initialDeposit}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Minimum initial deposit: $0 (no minimum required for Basic Checking)
                </p>
              </div>

              <div>
                <Label htmlFor="accountPurpose">Primary Use of Account</Label>
                <Select value={formData.accountPurpose} onValueChange={(value) => handleInputChange("accountPurpose", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily-expenses">Daily Expenses</SelectItem>
                    <SelectItem value="bill-payments">Bill Payments</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasExistingAccount"
                  checked={formData.hasExistingAccount}
                  onCheckedChange={(checked) => handleInputChange("hasExistingAccount", checked as boolean)}
                />
                <Label htmlFor="hasExistingAccount">I currently have an account with Commerce Bank</Label>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="form-section">
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="additionalInfo">Additional Comments (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  placeholder="Please provide any additional information that might be helpful..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="form-section form-section-accent">
            <CardHeader>
              <CardTitle className="text-lg">Terms and Conditions</CardTitle>
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
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  className={errors.agreeToTerms ? "border-red-500" : ""}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() =>
                      toast({
                        title: "Terms & Conditions",
                        description: "By opening an account, you agree to our standard banking terms including fees, transaction limits, and electronic services. Full terms at commercebank.com/terms.",
                      })
                    }
                  >Terms and Conditions</button> and 
                  <button
                    type="button"
                    className="ml-1 text-blue-600 hover:underline font-medium"
                    onClick={() =>
                      toast({
                        title: "Privacy Policy",
                        description: "We use your information to provide services, meet regulations, and improve experiences. We never sell personal data. Full policy at commercebank.com/privacy.",
                      })
                    }
                  >Privacy Policy</button> *
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
                />
                <Label htmlFor="agreeToMarketing" className="text-sm">
                  I would like to receive marketing communications from Commerce Bank about products, services, and special offers
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>By submitting this application you agree to our terms and conditions.</p>
              <p className="text-gray-500">Application ID: {applicationId}</p>
            </div>
            <Button type="submit" className="px-6 py-2" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BasicCheckingApplicationForm;
