import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const HeroSection = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const REGISTRATION_API_ENDPOINT = 'http://localhost:3001';

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    username: "",
    password: ""
  });

  // Password validation state
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);


  const handleRegistrationChange = (field: string, value: string | boolean) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate password when password field changes
    if (field === 'password' && typeof value === 'string') {
      const password = value;
      setPasswordValidation({
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)
      });
    }
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginSubmitting) return;
    setIsLoginSubmitting(true);
    
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${REGISTRATION_API_ENDPOINT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      console.log('Login response:', result);

      if (result.success) {
        // Check if OTP is required
        if (result.requiresOTP) {
          setRequiresOTP(true);
          setOtpEmail(result.email || "");
          toast({
            title: "OTP Sent",
            description: "Please check your email for the OTP code to complete login.",
          });
        } else {
          // Direct login (shouldn't happen with new flow, but handle it)
          console.log('Login successful, setting auth state...');
          login(result.user, result.token);

          toast({
            title: "Welcome back!",
            description: `Signed in as ${result.user?.name ?? result.user?.username ?? "member"}.`,
          });

          console.log('Navigating to dashboard...');
          setTimeout(() => {
            navigate('/dashboard');
            console.log('Navigation called');
          }, 400);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.message || "Please check your credentials and try again.",
        });
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast({
          variant: "destructive",
          title: "Request timed out",
          description: "The login request took too long. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: err?.message || "A network error occurred. Please try again shortly.",
        });
      }
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifyingOTP || !otpCode) return;
    setIsVerifyingOTP(true);

    try {
      const response = await fetch(`${REGISTRATION_API_ENDPOINT}/verify-login-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: otpEmail,
          otp: otpCode
        })
      });

      const result = await response.json();
      console.log('OTP verification response:', result);

      if (result.success) {
        console.log('OTP verified, completing login...');
        login(result.user, result.token);

        toast({
          title: "Welcome back!",
          description: `Signed in as ${result.user?.name ?? result.user?.username ?? "member"}.`,
        });

        // Reset OTP state
        setRequiresOTP(false);
        setOtpCode("");
        setOtpEmail("");

        console.log('Navigating to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 400);
      } else {
        toast({
          variant: "destructive",
          title: "OTP Verification Failed",
          description: result.message || "Invalid OTP. Please try again.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err?.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    // Re-submit login to get new OTP
    setOtpCode("");
    const response = await fetch(`${REGISTRATION_API_ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    if (result.success && result.requiresOTP) {
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: "Please try logging in again.",
      });
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const allRequirementsMet = Object.values(passwordValidation).every(requirement => requirement);
    if (!allRequirementsMet) {
      toast({
        variant: "destructive",
        title: "Password needs attention",
        description: "Please ensure your password meets all the listed requirements.",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${REGISTRATION_API_ENDPOINT}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();
      console.log('Registration response:', result);

      if (result.success) {
        toast({
          title: "Account created!",
          description: "Your Commerce Bank profile is ready. You can log in with your new credentials.",
        });
        setIsRegistrationOpen(false);
        setRegistrationData({
          name: "",
          email: "",
          username: "",
          password: ""
        });
        setPasswordValidation({
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false
        });
        setShowPassword(false);
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: result.message || "Please review your details and try again.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err?.message || "Something went wrong while creating your account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section 
        className="relative min-h-[600px] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://mybank.com/wp-content/uploads/iStock-1461655919.jpg')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60"></div>
        
        {/* Organic Shapes Background Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[hsl(var(--commerce-green))] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--commerce-yellow))] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-[hsl(var(--commerce-teal))] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Welcome Message */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Welcome back
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                  Log in or create your account to continue.
                </p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/30 via-white/10 to-white/30 blur-2xl opacity-80" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/95 shadow-[0_25px_60px_-20px_rgba(16,24,40,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-25px_rgba(16,24,40,0.45)]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[hsl(var(--commerce-teal))] via-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))]" />
                <div className="absolute -left-16 top-12 h-32 w-32 rounded-full bg-[hsl(var(--commerce-green)_/_0.12)] blur-3xl" />
                <div className="absolute -right-12 bottom-10 h-32 w-32 rounded-full bg-[hsl(var(--commerce-teal)_/_0.12)] blur-3xl" />

                <div className="relative z-10 p-10">
                  <div className="text-center mb-8 space-y-4 animate-in fade-in zoom-in">
                    <div className="inline-flex items-center gap-3 rounded-full border border-[hsl(var(--commerce-green))/0.2] bg-[hsl(var(--commerce-green)_/_0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--commerce-green))] shadow-sm">
                      Secure Access
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <div className="h-3 w-12 rounded-full bg-gradient-to-r from-[hsl(var(--commerce-teal))] to-[hsl(var(--commerce-green))]" />
                      <div className="h-3 w-3 rounded-full bg-[hsl(var(--commerce-green))]" />
                      <div className="h-3 w-3 rounded-full bg-[hsl(var(--commerce-teal))]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      Log in to Online Banking
                    </h2>
                    <p className="text-muted-foreground">
                      Seamless experience with enterprise-grade security
                    </p>
                  </div>

                  {!requiresOTP ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Username
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Enter your username"
                          className="w-full rounded-xl border-muted bg-white/70 py-6 text-base shadow-inner transition focus:border-[hsl(var(--commerce-green))] focus:bg-white"
                          value={loginData.username}
                          onChange={(e) => handleLoginChange('username', e.target.value)}
                          required
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[hsl(var(--commerce-green))]/70">
                          <span className="h-2 w-2 rounded-full bg-current shadow-inner" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="w-full rounded-xl border-muted bg-white/70 py-6 text-base shadow-inner transition focus:border-[hsl(var(--commerce-green))] focus:bg-white"
                          value={loginData.password}
                          onChange={(e) => handleLoginChange('password', e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-[hsl(var(--commerce-green))]"
                        >
                          {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--commerce-teal))/0.2] bg-[hsl(var(--commerce-teal)_/_0.1)] px-3 py-1 text-[hsl(var(--commerce-teal))]">
                        <Shield className="h-3.5 w-3.5" />
                        256-bit encrypted session
                      </div>
                      <button type="button" className="font-medium text-[hsl(var(--commerce-green))] hover:underline">
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      variant="commerce"
                      className="w-full h-12 text-lg font-semibold shadow-lg shadow-[hsl(var(--commerce-green))]/30"
                      disabled={isLoginSubmitting}
                    >
                      {isLoginSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging In...
                        </>
                      ) : (
                        'Log In'
                      )}
                    </Button>
                  </form>
                  ) : (
                    <form onSubmit={handleOTPVerify} className="space-y-5">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--commerce-teal))/0.2] bg-[hsl(var(--commerce-teal)_/_0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--commerce-teal))]">
                          <Shield className="h-3.5 w-3.5" />
                          Two-Factor Authentication
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          We've sent a 6-digit code to your email. Please enter it below to complete your login.
                        </p>
                        {otpEmail && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Code sent to: <span className="font-medium">{otpEmail}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Enter OTP Code
                        </label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          placeholder="000000"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full rounded-xl border-muted bg-white/70 py-6 text-center text-2xl font-mono tracking-widest shadow-inner transition focus:border-[hsl(var(--commerce-green))] focus:bg-white"
                          required
                          autoFocus
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="commerce"
                        className="w-full h-12 text-lg font-semibold shadow-lg shadow-[hsl(var(--commerce-green))]/30"
                        disabled={isVerifyingOTP || otpCode.length !== 6}
                      >
                        {isVerifyingOTP ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Login'
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="text-sm font-medium text-[hsl(var(--commerce-green))] hover:underline"
                        >
                          Didn't receive the code? Resend
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setRequiresOTP(false);
                            setOtpCode("");
                            setOtpEmail("");
                          }}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          ← Back to login
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-6 rounded-2xl bg-gradient-to-r from-[hsl(var(--commerce-green)_/_0.08)] to-transparent p-5 text-center text-sm text-muted-foreground">
                    <p>
                      New to Commerce Bank?{' '}
                      <button
                        onClick={() => setIsRegistrationOpen(true)}
                        className="font-semibold text-[hsl(var(--commerce-green))] underline-offset-4 transition hover:text-[hsl(var(--commerce-teal))] hover:underline"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">
              Create Your Commerce Bank Account
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleRegistrationSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={registrationData.name}
                    onChange={(e) => handleRegistrationChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={registrationData.email}
                    onChange={(e) => handleRegistrationChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={registrationData.username}
                    onChange={(e) => handleRegistrationChange('username', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={registrationData.password}
                      onChange={(e) => handleRegistrationChange('password', e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {passwordValidation.length ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.lowercase ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                          At least one lowercase letter (a-z)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.uppercase ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                          At least one uppercase letter (A-Z)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.number ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.number ? 'text-green-600' : 'text-red-600'}`}>
                          At least one number (0-9)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.special ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                          At least one special character (!@#$%^&*()_+-=[]{}|;':",./&lt;&gt;?~`)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                variant="commerce"
                className="px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Create Account'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroSection;