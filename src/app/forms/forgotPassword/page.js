"use client";
import React, { useState } from "react";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Key,
  Shield,
  Clock,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import ZentryxLogo from "@/components/ui/Zentrix";
import CurrentTimeDisplay from "@/components/ui/timeDisplay";
import { useLoading } from "@/components/providers/LoadingProvider";
import { useAlert } from "@/components/providers/AlertProvider";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/landing-page-components/AnimateBackGround";
import supabase from "@/lib/helper";

const ForgotPassword = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const { show, hide, isLoading } = useLoading();
  const { showAlert } = useAlert();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    show("Sending Reset Link...");

    try {
      show("Processing Request", "Sending password reset email");

      // Check if email exists in profiles table first
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, username")
        .eq("email", formData.email)
        .single();

      if (profileError || !profile) {
        show("Email Not Found", "No account found with this email address.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/resetPassword`,
      });

      if (error) {
        console.error("Reset password error:", error);
        show("Reset Failed", error.message || "Failed to send reset email.");
        return;
      }

      // Success state
      setIsSuccess(true);
      showAlert("Reset Link Sent!", "Please check your email for password reset instructions.", "success");

    } catch (err) {
      console.error("Forgot password error:", err);
      show("Unexpected Error", err.message || "Something went wrong.");
    } finally {
      hide();
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  if (isSuccess) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background Animation */}
        <AnimatedBackground mousePosition={mousePosition} />

        {/* Current Time Display */}
        <CurrentTimeDisplay />

        {/* Success Card */}
        <div className="relative w-[60vh] max-w-xlg z-10 min-h-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
            {/* Success accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-t-3xl"></div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Email Sent Successfully!
              </h1>
              <p className="text-slate-600 text-sm font-medium mb-4">
                Password reset instructions have been sent
              </p>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <p className="text-sm text-slate-700 mb-2">
                  <span className="font-semibold text-green-600">Check your email!</span>
                </p>
                <p className="text-xs text-slate-600 mb-3">
                  We've sent password reset instructions to:
                  <br />
                  <span className="font-semibold text-blue-600">{formData.email}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Click the link in the email to reset your password. 
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleBackToLogin}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Login</span>
              </button>

              <button
                onClick={() => setIsSuccess(false)}
                className="w-full py-3 px-4 border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Send to Different Email</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Didn't receive the email?
              </h3>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Ensure {formData.email} is correct</li>
                <li>• Wait a few minutes for delivery</li>
                <li>• Contact IT support if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Animation */}
      <AnimatedBackground mousePosition={mousePosition} />

      {/* Current Time Display */}
      <CurrentTimeDisplay />

      {/* Forgot Password Card */}
      <div className="relative w-[60vh] max-w-xlg z-10 min-h-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
          {/* System features accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 via-purple-500 to-blue-500 rounded-t-3xl"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <ZentryxLogo />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-slate-600 text-sm font-medium">
              Zentryx Workforce Management System
            </p>
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <p className="text-sm text-slate-700 mb-3">
                <span className="font-semibold text-orange-600">
                  Forgot your password? 🔒
                </span>
                <br />
                No worries! We'll send you reset instructions
              </p>

              {/* Feature icons */}
              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs text-slate-600">Secure</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-1">
                    <Key className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-xs text-slate-600">Encrypted</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-slate-600">Fast Reset</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-slate-600">Email Link</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 hover:border-slate-300"
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full opacity-0 transition-opacity duration-200 animate-pulse"
                    style={{ opacity: formData.email && !errors.email ? 1 : 0 }}
                  ></div>
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Send Reset Link Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-orange-400 disabled:to-red-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-red-500/50 animate-pulse z-0 rounded-xl" />
              )}
              <span className="flex items-center space-x-2 z-10">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    <span>Send Reset Link</span>
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

            {/* Security Information */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Information:
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
                <div>• Reset links expire in 1 hour</div>
                <div>• Only works with registered email addresses</div>
                <div>• Check spam folder if not received</div>
                <div>• Contact IT support for assistance</div>
              </div>
            </div>

            {/* Additional Help */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600 mb-2">
                Need immediate assistance?
              </p>
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors text-sm"
                  disabled={isLoading}
                  onClick={() => showAlert("Contact Support", "Please contact your IT administrator or call the support hotline at (555) 123-4567", "info")}
                >
                  Contact IT Support
                </button>
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors text-sm"
                  disabled={isLoading}
                  onClick={() => showAlert("Account Recovery", "For account recovery issues, please visit your HR department with proper identification.", "info")}
                >
                  Account Recovery Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;