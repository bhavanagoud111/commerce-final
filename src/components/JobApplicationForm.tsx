import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { X, Upload, FileText, MapPin, Briefcase, User, Mail, Phone, Calendar, GraduationCap, Award, Loader2, CheckCircle2, Clock, MessageSquare } from "lucide-react";

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    description: string;
  };
}

const JobApplicationForm = ({ isOpen, onClose, job }: JobApplicationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    linkedIn: "",
    portfolio: "",
    coverLetter: "",
    availability: "",
    salaryExpectation: "",
    education: "",
    degree: "",
    university: "",
    graduationYear: "",
    experience: "",
    skills: "",
    certifications: "",
    references: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string>("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Resume file must be less than 5MB.",
        });
        return;
      }
      if (!file.type.includes("pdf") && !file.type.includes("doc") && !file.type.includes("docx")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Personal Information - All Required
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!resumeFile) newErrors.resume = "Resume is required";
    
    // Education - All Required
    if (!formData.education.trim()) newErrors.education = "Education level is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.university.trim()) newErrors.university = "University/Institution is required";
    if (!formData.graduationYear.trim()) newErrors.graduationYear = "Graduation year is required";
    
    // Professional Information - All Required
    if (!formData.experience.trim()) newErrors.experience = "Work experience is required";
    if (!formData.skills.trim()) newErrors.skills = "Key skills are required";
    if (!formData.certifications.trim()) newErrors.certifications = "Certifications are required (enter 'None' if not applicable)";
    if (!formData.linkedIn.trim()) newErrors.linkedIn = "LinkedIn profile is required";
    if (!formData.portfolio.trim()) newErrors.portfolio = "Portfolio/Website is required (enter 'N/A' if not applicable)";
    
    // Cover Letter - Required
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required";
    
    // Additional Information - All Required
    if (!formData.availability.trim()) newErrors.availability = "Availability is required";
    if (!formData.references.trim()) newErrors.references = "References are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newApplicationId = `JOB-${job.id.toString().padStart(3, "0")}-${Date.now().toString().slice(-6)}`;
      setApplicationId(newApplicationId);
      setIsSubmitted(true);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        linkedIn: "",
        portfolio: "",
        coverLetter: "",
        availability: "",
        salaryExpectation: "",
        education: "",
        degree: "",
        university: "",
        graduationYear: "",
        experience: "",
        skills: "",
        certifications: "",
        references: "",
      });
      setResumeFile(null);
      setErrors({});
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSubmitted(false);
    setApplicationId("");
    onClose();
  };

  // Success Dialog
  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseSuccess}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-6">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-600 mb-6">
              Thank you for applying to <strong>{job.title}</strong>
            </DialogDescription>
            
            <Card className="border-2 border-l-4 border-l-[hsl(var(--commerce-green))] mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
                      <div className="text-left">
                        <p className="text-sm text-gray-600">Application ID</p>
                        <p className="text-lg font-bold text-[hsl(var(--commerce-green))]">{applicationId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Review Timeline</p>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Next Steps</p>
                        <p className="text-sm text-gray-600">We'll contact you via email</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-[hsl(var(--commerce-teal))/10] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--commerce-green))] mt-0.5 flex-shrink-0" />
                  <span>Our HR team will review your application and qualifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--commerce-green))] mt-0.5 flex-shrink-0" />
                  <span>If selected, you'll receive an email invitation for an interview</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--commerce-green))] mt-0.5 flex-shrink-0" />
                  <span>We'll keep you updated throughout the process</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleCloseSuccess}>
                Close
              </Button>
              <Button variant="commerce" onClick={handleCloseSuccess}>
                View Other Positions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[hsl(var(--commerce-green))]" />
            Application for {job.title}
          </DialogTitle>
          <DialogDescription>
            {job.department} • {job.location} • {job.type}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Description Section */}
          <Card className="border-2 border-l-4 border-l-[hsl(var(--commerce-green))]">
            <CardHeader className="bg-gradient-to-r from-[hsl(var(--commerce-green))/10] to-transparent">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>{job.experience}</span>
                  </div>
                </div>
                <p className="text-gray-700">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                Resume / CV *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[hsl(var(--commerce-green))] transition-colors">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-1">
                    {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
                </label>
              </div>
              {errors.resume && <p className="text-sm text-red-500 mt-2">{errors.resume}</p>}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                Education *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="education">Highest Level of Education *</Label>
                <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                  <SelectTrigger className={errors.education ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="associate">Associate's Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
                {errors.education && <p className="text-sm text-red-500 mt-1">{errors.education}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => handleInputChange("degree", e.target.value)}
                    placeholder="e.g., Computer Science"
                    className={errors.degree ? "border-red-500" : ""}
                  />
                  {errors.degree && <p className="text-sm text-red-500 mt-1">{errors.degree}</p>}
                </div>
                <div>
                  <Label htmlFor="university">University / Institution *</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => handleInputChange("university", e.target.value)}
                    className={errors.university ? "border-red-500" : ""}
                  />
                  {errors.university && <p className="text-sm text-red-500 mt-1">{errors.university}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                  placeholder="e.g., 2023"
                  className={errors.graduationYear ? "border-red-500" : ""}
                />
                {errors.graduationYear && <p className="text-sm text-red-500 mt-1">{errors.graduationYear}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                Professional Information *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experience">Work Experience *</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  rows={4}
                  placeholder="Describe your relevant work experience..."
                  className={errors.experience ? "border-red-500" : ""}
                />
                {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience}</p>}
              </div>
              <div>
                <Label htmlFor="skills">Key Skills *</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  rows={3}
                  placeholder="List your key skills relevant to this position..."
                  className={errors.skills ? "border-red-500" : ""}
                />
                {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills}</p>}
              </div>
              <div>
                <Label htmlFor="certifications">Certifications *</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange("certifications", e.target.value)}
                  rows={2}
                  placeholder="List any relevant certifications (enter 'None' if not applicable)..."
                  className={errors.certifications ? "border-red-500" : ""}
                />
                {errors.certifications && <p className="text-sm text-red-500 mt-1">{errors.certifications}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedIn">LinkedIn Profile *</Label>
                  <Input
                    id="linkedIn"
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={errors.linkedIn ? "border-red-500" : ""}
                  />
                  {errors.linkedIn && <p className="text-sm text-red-500 mt-1">{errors.linkedIn}</p>}
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio / Website *</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange("portfolio", e.target.value)}
                    placeholder="https://yourportfolio.com (or 'N/A')"
                    className={errors.portfolio ? "border-red-500" : ""}
                  />
                  {errors.portfolio && <p className="text-sm text-red-500 mt-1">{errors.portfolio}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[hsl(var(--commerce-green))]" />
                Cover Letter *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                rows={6}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                className={errors.coverLetter ? "border-red-500" : ""}
              />
              {errors.coverLetter && <p className="text-sm text-red-500 mt-2">{errors.coverLetter}</p>}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availability">Availability *</Label>
                  <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
                    <SelectTrigger className={errors.availability ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="2-months">Within 2 months</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.availability && <p className="text-sm text-red-500 mt-1">{errors.availability}</p>}
                </div>
                <div>
                  <Label htmlFor="salaryExpectation">Salary Expectation (Optional)</Label>
                  <Input
                    id="salaryExpectation"
                    value={formData.salaryExpectation}
                    onChange={(e) => handleInputChange("salaryExpectation", e.target.value)}
                    placeholder="e.g., $50,000 - $70,000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="references">References *</Label>
                <Textarea
                  id="references"
                  value={formData.references}
                  onChange={(e) => handleInputChange("references", e.target.value)}
                  rows={3}
                  placeholder="Name, Title, Company, Email, Phone"
                  className={errors.references ? "border-red-500" : ""}
                />
                {errors.references && <p className="text-sm text-red-500 mt-1">{errors.references}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="commerce" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;

