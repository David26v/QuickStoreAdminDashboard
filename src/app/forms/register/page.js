'use client'
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, User, Lock, Mail, Shield, UserPlus } from 'lucide-react'; 
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/providers/LoadingProvider';
import supabase from '@/lib/helper'; 
import { useDialog } from '@/components/providers/DialogProvider';

const QuickStoreRegister = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { show, hide, isLoading } = useLoading();
  const { showSuccess, showError } = useDialog();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the privacy policy & terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  console.log('is it returning')
    show('Registering account...');
  
    if (!validateForm()) return;
  
    try {
      show('On Process...', 'Creating Admin Account...');
  
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
  
      if (signUpError) {
        showError(signUpError.message);
        return;
      }
  
      if (!authData.user && !authData.session) {
        showSuccess(
          "We've sent a confirmation email to your inbox. Please verify your email before logging in.",
          "Confirm Your Email"
        );
        return;
      }
  
      const user = authData.user;
      if (!user) {
        showError("No user returned from Supabase.");
        return;
      }
  
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: formData.email,
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      ]);
  
      if (profileError) {
        showError(profileError.message, "Profile Error");
        return;
      }
  
      showSuccess(
        "Admin account registered successfully. Redirecting you to login...",
        "Success",
      );

      setTimeout(() => {
        router.push("/forms/login");
      }, 3000);


    } catch (err) {
      console.error(err);
      showError(err.message || "Something went wrong", "Unexpected Error");
    } finally {
      hide();
    }
  };

  

  return (
    // Updated background to match login page
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements - Matched from login */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-slate-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Floating Elements - Matched from login */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-slate-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-gray-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-slate-500/35 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>

      {/* Main Container - Matched structure from login */}
      <div className="w-full max-w-md relative z-10">
        {/* Updated Card styling to match login */}
        <div className="bg-gray-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden">
          {/* Header Section - Matched from login */}
          <div className="p-6 space-y-4">
            {/* Logo Section - Using QuickStore logo style */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <Lock className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
            </div>

            {/* Title and Description - Matched from login */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                QuickStore Philippines
              </h1>
              <p className="text-slate-300 text-base font-medium">
                Admin Registration
              </p>
              <p className="text-slate-400 text-sm">
                Create your secure admin account
              </p>
            </div>
          </div>

          {/* Form Content - Updated styling */}
          <div className="p-6 pt-0">
            {/* Simplified Info Box */}
            <div className="p-4 bg-orange-950/30 rounded-xl border border-orange-800/30 mb-6">
              <p className="text-sm text-orange-200 text-center">
                <span className="font-semibold">🔐 Admin Access Setup</span>
                <br />
                Create your administrator credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  Admin Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter admin username"
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter admin email address"
                  className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter secure password"
                      className={`w-full px-4 py-2.5 pr-10 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                      disabled={isLoading}
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`w-full px-4 py-2.5 pr-10 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                      disabled={isLoading}
                    >
                      {confirmPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3 py-4">
                <div className="relative pt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-slate-600 rounded focus:ring-orange-500 focus:ring-2 bg-gray-700"
                    disabled={isLoading}
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-orange-400 hover:text-orange-300 hover:underline transition-colors font-medium"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Privacy Policy and Terms of Service would be displayed here."); 
                    }}
                  >
                    admin privacy policy & terms
                  </button>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-400 text-sm">{errors.terms}</p>
              )}

              {/* Register Button - Updated styling to match login button */}
              <button
                type="submit" // Changed from onClick to type submit
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Admin Account...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Create Admin Account</span>
                  </>
                )}
              </button>
            </form> {/* End of form */}

            {/* Login Link - Updated styling */}
            <div className="text-center pt-6 border-t border-slate-700/50 mt-6">
              <p className="text-slate-400">
                Already have an admin account?{' '}
                <button
                  type="button"
                  className="text-orange-400 hover:text-orange-300 font-semibold hover:underline transition-colors"
                  disabled={isLoading}
                  onClick={() => router.push('/forms/login')} 
                >
                  Login as Admin
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStoreRegister;