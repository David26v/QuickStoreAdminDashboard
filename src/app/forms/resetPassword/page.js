"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  CheckCircle,
  AlertCircle,
  Shield,
  Key,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import ZentryxLogo from "@/components/ui/Zentrix";
import CurrentTimeDisplay from "@/components/ui/timeDisplay";
import { useLoading } from "@/components/providers/LoadingProvider";
import { useAlert } from "@/components/providers/AlertProvider";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/landing-page-components/AnimateBackGround";
import supabase from "@/lib/helper";

const ResetPassword = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    }
  });

  const { show, hide, isLoading } = useLoading();
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkTokenValidity = async () => {
      const hash = window.location.hash;
      
      if (!hash) {
        if (isMounted) {
          setIsValidToken(false);
        }
        return;
      }

      const hashParams = new URLSearchParams(hash.substring(1)); 
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      console.log('Hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

      if (!accessToken || !refreshToken || type !== 'recovery') {
        if (isMounted) {
          setIsValidToken(false);
        }
        return;
      }

      try {
        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!isMounted) return;

        if (error || !data.session) {
          console.error('Session error:', error);
          setIsValidToken(false);
          return;
        }

        console.log('Session set successfully:', data.session.user.email);
        setIsValidToken(true);
      } catch (err) {
        console.error("Token validation error:", err);
        if (isMounted) {
          setIsValidToken(false);
        }
      }
    };

    // Only run once when component mounts
    if (isValidToken === null) {
      checkTokenValidity();
    }

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we're reading from window.location.hash

  const calculatePasswordStrength = useCallback((password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { score, checks };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate password strength for password field
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear errors
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (passwordStrength.score < 4) {
      newErrors.password = "Password is too weak. Please meet all requirements.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.password, formData.confirmPassword, passwordStrength.score]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    show("Updating Password...");

    try {
      show("Processing", "Updating your password securely");

      // Update the user's password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        console.error("Password update error:", error);
        show("Update Failed", error.message || "Failed to update password.");
        return;
      }

      // Success
      setIsSuccess(true);
      showAlert("Password Updated!", "Your password has been successfully updated.", "success");

    } catch (err) {
      console.error("Reset password error:", err);
      show("Unexpected Error", err.message || "Something went wrong.");
    } finally {
      hide();
    }
  }, [formData.password, show, hide, showAlert]);

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'bg-red-500';
    if (passwordStrength.score <= 2) return 'bg-orange-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getStrengthText = () => {
    if (passwordStrength.score <= 1) return 'Very Weak';
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <AnimatedBackground mousePosition={mousePosition} />
        <CurrentTimeDisplay />
        
        <div className="relative w-[60vh] max-w-xlg z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (isValidToken === false) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <AnimatedBackground mousePosition={mousePosition} />
        <CurrentTimeDisplay />
        
        <div className="relative w-[60vh] max-w-xlg z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-3xl"></div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
              <p className="text-slate-600 mb-6">This password reset link is invalid or has expired.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/forgot-password')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Request New Reset Link
                </button>
                <button
                  onClick={handleBackToLogin}
                  className="w-full py-3 px-4 border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <AnimatedBackground mousePosition={mousePosition} />
        <CurrentTimeDisplay />

        <div className="relative w-[60vh] max-w-xlg z-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-3xl"></div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Password Updated!
              </h1>
              <p className="text-slate-600 text-sm font-medium mb-4">
                Your password has been successfully changed
              </p>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <p className="text-sm text-slate-700 mb-2">
                  <span className="font-semibold text-green-600">Success!</span>
                </p>
                <p className="text-xs text-slate-600 mb-3">
                  Your password has been securely updated. You can now log in with your new password.
                </p>
                <p className="text-xs text-slate-500">
                  For security, you've been logged out of all other devices.
                </p>
              </div>
            </div>

            <button
              onClick={handleBackToLogin}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <AnimatedBackground mousePosition={mousePosition} />
      <CurrentTimeDisplay />

      <div className="relative w-[60vh] max-w-xlg z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-t-3xl"></div>

          <div className="text-center mb-8">
            <ZentryxLogo />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Create New Password
            </h1>
            <p className="text-slate-600 text-sm font-medium">
              Zentryx Workforce Management System
            </p>
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <p className="text-sm text-slate-700 mb-3">
                <span className="font-semibold text-purple-600">
                  Almost there! 🔐
                </span>
                <br />
                Create a strong new password for your account
              </p>

              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-slate-600">Secure</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                    <Key className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-slate-600">Encrypted</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-1">
                    <Lock className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-slate-600">Protected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 hover:border-slate-300"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Password Strength:</span>
                    <span className={`text-xs font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 hover:border-slate-300"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {confirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Password Requirements:</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries({
                  length: "At least 8 characters",
                  uppercase: "One uppercase letter",
                  lowercase: "One lowercase letter", 
                  number: "One number",
                  special: "One special character"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {passwordStrength.checks[key] ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-xs ${passwordStrength.checks[key] ? 'text-green-600' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Password Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || passwordStrength.score < 4}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-blue-500/50 animate-pulse z-0 rounded-xl" />
              )}
              <span className="flex items-center space-x-2 z-10">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5" />
                    <span>Update Password</span>
                  </>
                )}
              </span>
            </button>

            {/* Back to Login */}
            <button
              onClick={handleBackToLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 border-2 border-slate-200 hover:border-slate-300 disabled:border-slate-100 text-slate-600 hover:text-slate-800 disabled:text-slate-400 font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;