import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, X, Building2, DollarSign, Users, Calendar, Phone, Mail, MapPin, Shield, AlertCircle } from 'lucide-react';

interface BusinessApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'business_checking' | 'business_savings' | 'merchant_services';
  onSuccess?: () => void;
}

const BusinessApplicationForm: React.FC<BusinessApplicationFormProps> = ({ isOpen, onClose, accountType, onSuccess }) => {
  const [formData, setFormData] = useState({
    accountType: accountType,
    businessName: '',
    businessType: '',
    ein: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    businessPhone: '',
    businessEmail: '',
    annualRevenue: '',
    numberOfEmployees: '',
    yearsInBusiness: '',
    primaryContactName: '',
    primaryContactTitle: '',
    primaryContactPhone: '',
    primaryContactEmail: '',
    accountPurpose: '',
    expectedMonthlyTransactions: '',
    expectedMonthlyVolume: '',
    initialDeposit: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, accountType }));
      setErrors({});
      setIsSubmitted(false);
      setSubmissionError(null);
    }
  }, [isOpen, accountType]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessType.trim()) newErrors.businessType = 'Business type is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!formData.businessCity.trim()) newErrors.businessCity = 'Business city is required';
    if (!formData.businessState.trim()) newErrors.businessState = 'Business state is required';
    if (!formData.businessZip.trim()) newErrors.businessZip = 'Business ZIP code is required';
    if (!formData.businessPhone.trim()) newErrors.businessPhone = 'Business phone is required';
    if (!formData.businessEmail.trim()) newErrors.businessEmail = 'Business email is required';
    if (!formData.primaryContactName.trim()) newErrors.primaryContactName = 'Primary contact name is required';
    if (!formData.primaryContactPhone.trim()) newErrors.primaryContactPhone = 'Primary contact phone is required';
    if (!formData.primaryContactEmail.trim()) newErrors.primaryContactEmail = 'Primary contact email is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.businessEmail && !emailRegex.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }
    if (formData.primaryContactEmail && !emailRegex.test(formData.primaryContactEmail)) {
      newErrors.primaryContactEmail = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (formData.businessPhone && !phoneRegex.test(formData.businessPhone)) {
      newErrors.businessPhone = 'Please enter a valid phone number';
    }
    if (formData.primaryContactPhone && !phoneRegex.test(formData.primaryContactPhone)) {
      newErrors.primaryContactPhone = 'Please enter a valid phone number';
    }

    // Numeric validation
    if (formData.annualRevenue && isNaN(Number(formData.annualRevenue))) {
      newErrors.annualRevenue = 'Annual revenue must be a number';
    }
    if (formData.numberOfEmployees && (isNaN(Number(formData.numberOfEmployees)) || Number(formData.numberOfEmployees) < 0)) {
      newErrors.numberOfEmployees = 'Number of employees must be a positive number';
    }
    if (formData.yearsInBusiness && (isNaN(Number(formData.yearsInBusiness)) || Number(formData.yearsInBusiness) < 0)) {
      newErrors.yearsInBusiness = 'Years in business must be a positive number';
    }
    if (formData.expectedMonthlyTransactions && (isNaN(Number(formData.expectedMonthlyTransactions)) || Number(formData.expectedMonthlyTransactions) < 0)) {
      newErrors.expectedMonthlyTransactions = 'Expected monthly transactions must be a positive number';
    }
    if (formData.expectedMonthlyVolume && isNaN(Number(formData.expectedMonthlyVolume))) {
      newErrors.expectedMonthlyVolume = 'Expected monthly volume must be a number';
    }
    if (formData.initialDeposit && isNaN(Number(formData.initialDeposit))) {
      newErrors.initialDeposit = 'Initial deposit must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const isValid = validateForm();
    if (!isValid) {
      console.log('Form validation failed', errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch('http://localhost:3001/business-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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

      const data = await response.json();

      if (data.success !== false) {
        setIsSubmitted(true);
        // Call onSuccess callback immediately if provided
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Business application error:', error);
      const errorMessage = error.message || (error instanceof TypeError && error.message.includes('fetch') 
        ? "Unable to connect to server. Please ensure the backend is running on port 3001." 
        : "Network error. Please try again.");
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccountTypeInfo = () => {
    switch (accountType) {
      case 'business_checking':
        return {
          title: 'Business Checking Account',
          description: 'Monthly Fee: $15 | Interest Rate: 0.01%',
          features: ['Unlimited transactions', 'Online banking & mobile app', 'Free business debit card', 'Check writing privileges', 'Monthly statements']
        };
      case 'business_savings':
        return {
          title: 'Business Savings Account',
          description: 'Monthly Fee: $0 | Interest Rate: 1.5%',
          features: ['Higher interest rates', 'Online transfers', 'Mobile deposits', 'Account alerts', 'Monthly statements']
        };
      case 'merchant_services':
        return {
          title: 'Merchant Services',
          description: 'Monthly Fee: $25 | Interest Rate: N/A',
          features: ['Credit card processing', 'Point-of-sale solutions', 'Online payment gateway', 'Mobile payment options', '24/7 support']
        };
      default:
        return { title: 'Business Account', description: '', features: [] };
    }
  };

  const accountInfo = getAccountTypeInfo();

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your {accountInfo.title} application has been submitted and is under review.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a notification once your application has been processed.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isSubmitting) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span>{accountInfo.title} Application</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="form-section form-section-accent">
            <CardHeader>
              <CardTitle className="text-lg">{accountInfo.title}</CardTitle>
              <CardDescription>{accountInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accountInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="form-surface">
            {/* Business Information */}
            <div className="form-section space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Business Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    className={errors.businessName ? 'border-red-500' : ''}
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => handleChange('businessType', value)}>
                    <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="nonprofit">Nonprofit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                </div>

                <div>
                  <Label htmlFor="ein">EIN (Employer Identification Number)</Label>
                  <Input
                    id="ein"
                    value={formData.ein}
                    onChange={(e) => handleChange('ein', e.target.value)}
                    placeholder="XX-XXXXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Input
                    id="annualRevenue"
                    type="number"
                    value={formData.annualRevenue}
                    onChange={(e) => handleChange('annualRevenue', e.target.value)}
                    placeholder="0"
                    className={errors.annualRevenue ? 'border-red-500' : ''}
                  />
                  {errors.annualRevenue && <p className="text-red-500 text-sm mt-1">{errors.annualRevenue}</p>}
                </div>

                <div>
                  <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                  <Input
                    id="numberOfEmployees"
                    type="number"
                    value={formData.numberOfEmployees}
                    onChange={(e) => handleChange('numberOfEmployees', e.target.value)}
                    placeholder="0"
                    className={errors.numberOfEmployees ? 'border-red-500' : ''}
                  />
                  {errors.numberOfEmployees && <p className="text-red-500 text-sm mt-1">{errors.numberOfEmployees}</p>}
                </div>

                <div>
                  <Label htmlFor="yearsInBusiness">Years in Business</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleChange('yearsInBusiness', e.target.value)}
                    placeholder="0"
                    className={errors.yearsInBusiness ? 'border-red-500' : ''}
                  />
                  {errors.yearsInBusiness && <p className="text-red-500 text-sm mt-1">{errors.yearsInBusiness}</p>}
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div className="form-section space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Business Address</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => handleChange('businessAddress', e.target.value)}
                    className={errors.businessAddress ? 'border-red-500' : ''}
                  />
                  {errors.businessAddress && <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>}
                </div>

                <div>
                  <Label htmlFor="businessCity">City *</Label>
                  <Input
                    id="businessCity"
                    value={formData.businessCity}
                    onChange={(e) => handleChange('businessCity', e.target.value)}
                    className={errors.businessCity ? 'border-red-500' : ''}
                  />
                  {errors.businessCity && <p className="text-red-500 text-sm mt-1">{errors.businessCity}</p>}
                </div>

                <div>
                  <Label htmlFor="businessState">State *</Label>
                  <Input
                    id="businessState"
                    value={formData.businessState}
                    onChange={(e) => handleChange('businessState', e.target.value)}
                    className={errors.businessState ? 'border-red-500' : ''}
                  />
                  {errors.businessState && <p className="text-red-500 text-sm mt-1">{errors.businessState}</p>}
                </div>

                <div>
                  <Label htmlFor="businessZip">ZIP Code *</Label>
                  <Input
                    id="businessZip"
                    value={formData.businessZip}
                    onChange={(e) => handleChange('businessZip', e.target.value)}
                    className={errors.businessZip ? 'border-red-500' : ''}
                  />
                  {errors.businessZip && <p className="text-red-500 text-sm mt-1">{errors.businessZip}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>Contact Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessPhone">Business Phone *</Label>
                  <Input
                    id="businessPhone"
                    value={formData.businessPhone}
                    onChange={(e) => handleChange('businessPhone', e.target.value)}
                    className={errors.businessPhone ? 'border-red-500' : ''}
                  />
                  {errors.businessPhone && <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => handleChange('businessEmail', e.target.value)}
                    className={errors.businessEmail ? 'border-red-500' : ''}
                  />
                  {errors.businessEmail && <p className="text-red-500 text-sm mt-1">{errors.businessEmail}</p>}
                </div>

                <div>
                  <Label htmlFor="primaryContactName">Primary Contact Name *</Label>
                  <Input
                    id="primaryContactName"
                    value={formData.primaryContactName}
                    onChange={(e) => handleChange('primaryContactName', e.target.value)}
                    className={errors.primaryContactName ? 'border-red-500' : ''}
                  />
                  {errors.primaryContactName && <p className="text-red-500 text-sm mt-1">{errors.primaryContactName}</p>}
                </div>

                <div>
                  <Label htmlFor="primaryContactTitle">Primary Contact Title</Label>
                  <Input
                    id="primaryContactTitle"
                    value={formData.primaryContactTitle}
                    onChange={(e) => handleChange('primaryContactTitle', e.target.value)}
                    placeholder="CEO, Manager, Owner, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="primaryContactPhone">Primary Contact Phone *</Label>
                  <Input
                    id="primaryContactPhone"
                    value={formData.primaryContactPhone}
                    onChange={(e) => handleChange('primaryContactPhone', e.target.value)}
                    className={errors.primaryContactPhone ? 'border-red-500' : ''}
                  />
                  {errors.primaryContactPhone && <p className="text-red-500 text-sm mt-1">{errors.primaryContactPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="primaryContactEmail">Primary Contact Email *</Label>
                  <Input
                    id="primaryContactEmail"
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => handleChange('primaryContactEmail', e.target.value)}
                    className={errors.primaryContactEmail ? 'border-red-500' : ''}
                  />
                  {errors.primaryContactEmail && <p className="text-red-500 text-sm mt-1">{errors.primaryContactEmail}</p>}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="form-section space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span>Account Details</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="accountPurpose">Account Purpose</Label>
                  <Textarea
                    id="accountPurpose"
                    value={formData.accountPurpose}
                    onChange={(e) => handleChange('accountPurpose', e.target.value)}
                    placeholder="Describe how you plan to use this account..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expectedMonthlyTransactions">Expected Monthly Transactions</Label>
                  <Input
                    id="expectedMonthlyTransactions"
                    type="number"
                    value={formData.expectedMonthlyTransactions}
                    onChange={(e) => handleChange('expectedMonthlyTransactions', e.target.value)}
                    placeholder="0"
                    className={errors.expectedMonthlyTransactions ? 'border-red-500' : ''}
                  />
                  {errors.expectedMonthlyTransactions && <p className="text-red-500 text-sm mt-1">{errors.expectedMonthlyTransactions}</p>}
                </div>

                <div>
                  <Label htmlFor="expectedMonthlyVolume">Expected Monthly Volume ($)</Label>
                  <Input
                    id="expectedMonthlyVolume"
                    type="number"
                    value={formData.expectedMonthlyVolume}
                    onChange={(e) => handleChange('expectedMonthlyVolume', e.target.value)}
                    placeholder="0"
                    className={errors.expectedMonthlyVolume ? 'border-red-500' : ''}
                  />
                  {errors.expectedMonthlyVolume && <p className="text-red-500 text-sm mt-1">{errors.expectedMonthlyVolume}</p>}
                </div>

                <div>
                  <Label htmlFor="initialDeposit">Initial Deposit ($)</Label>
                  <Input
                    id="initialDeposit"
                    type="number"
                    value={formData.initialDeposit}
                    onChange={(e) => handleChange('initialDeposit', e.target.value)}
                    placeholder="0"
                    className={errors.initialDeposit ? 'border-red-500' : ''}
                  />
                  {errors.initialDeposit && <p className="text-red-500 text-sm mt-1">{errors.initialDeposit}</p>}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="form-section space-y-4">
              <h3 className="text-lg font-semibold">Terms and Conditions</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                <p><strong>Account Agreement Summary:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Monthly fees and minimum balance requirements apply as outlined above</li>
                  <li>Account approval is subject to credit and business verification</li>
                  <li>All transactions are subject to federal regulations and bank policies</li>
                  <li>Account may be closed if terms and conditions are not met</li>
                  <li>Interest rates are subject to change without notice</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  By submitting this application, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>

            {submissionError && (
              <div className="form-section border-red-200 bg-red-50/90">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Submission Error</span>
                </div>
                <p className="text-red-600 mt-1">{submissionError}</p>
              </div>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessApplicationForm;
