'use client'
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, User, Lock, Mail, Building, Phone, MapPin, UserPlus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/providers/LoadingProvider';
import supabase from '@/lib/helper';
import { useDialog } from '@/components/providers/DialogProvider';
import PrivacyTermsModal from './PrivacyTermsModal ';

const ClientRegistration = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    location: '',
    contactPerson: '',
    clientEmail: '',
    clientPhone: '',
    notes: '',
    firstName: '',
    lastName: '',
    username: '',
    adminEmail: '',
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

  const handleOpenTermsModalOpen = (e) => {
     e.preventDefault(); 
      setShowPrivacyModal(true)     
  }

  const validateForm = () => {
    const newErrors = {};
    // Client validation
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email address';
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone number is required';
    }
    // Admin user validation
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
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Admin email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email address';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    show('Registering client...');
    if (!validateForm()) {
      hide();
      return;
    }
    try {
      show('Creating client account...', 'Setting up your organization...');
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.adminEmail,
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
      show('Creating client organization...', 'Setting up your company profile...');
      // Step 2: Create the client record
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .insert([
          {
            name: formData.clientName,
            location: formData.location,
            contact_person: formData.contactPerson,
            email: formData.clientEmail,
            phone: formData.clientPhone,
            notes: formData.notes,
          },
        ])
        .select()
        .single();
      if (clientError) {
        showError(clientError.message, "Client Creation Error");
        return;
      }
      show('Setting up admin profile...', 'Finalizing your account...');
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: formData.adminEmail,
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'client_admin', 
          client_id: clientData.id, 
        },
      ]);
      if (profileError) {
        showError(profileError.message, "Profile Error");
        return;
      }
      const { error: settingsError } = await supabase
        .from("client_locker_settings")
        .insert([
          {
            client_id: clientData.id,
          },
        ]);
      if (settingsError) {
        console.warn("Client locker settings creation failed:", settingsError.message);
        // Don't fail the entire registration for this
      }
      showSuccess(
        `Client "${formData.clientName}" registered successfully! Admin account created for ${formData.firstName} ${formData.lastName}. Redirecting to login...`,
        "Registration Complete"
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-indigo-500/35 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
        {/* Main Container */}
        <div className="w-full max-w-4xl relative z-10">
          <div className="bg-gray-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Building className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  QuickStore Philippines
                </h1>
                <p className="text-slate-300 text-base font-medium">
                  Client Registration
                </p>
                <p className="text-slate-400 text-sm">
                  Register your organization and create admin account
                </p>
              </div>
            </div>
            {/* Form Content */}
            <div className="p-6 pt-0">
              <div className="p-4 bg-blue-950/30 rounded-xl border border-blue-800/30 mb-6">
                <p className="text-sm text-blue-200 text-center">
                  <span className="font-semibold">🏢 Organization Setup</span>
                  <br />
                  Register your company and create an admin account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-400" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="clientName" className="text-sm font-medium text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        Company Name
                      </label>
                      <input
                        id="clientName"
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.clientName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        disabled={isLoading}
                      />
                      {errors.clientName && (
                        <p className="text-red-400 text-sm">{errors.clientName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter company location"
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        disabled={isLoading}
                      />
                      {errors.location && (
                        <p className="text-red-400 text-sm">{errors.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="contactPerson" className="text-sm font-medium text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Contact Person
                      </label>
                      <input
                        id="contactPerson"
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="Enter contact person name"
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.contactPerson ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        disabled={isLoading}
                      />
                      {errors.contactPerson && (
                        <p className="text-red-400 text-sm">{errors.contactPerson}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="clientPhone" className="text-sm font-medium text-white flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        Phone Number
                      </label>
                      <input
                        id="clientPhone"
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.clientPhone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        disabled={isLoading}
                      />
                      {errors.clientPhone && (
                        <p className="text-red-400 text-sm">{errors.clientPhone}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="clientEmail" className="text-sm font-medium text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      Company Email
                    </label>
                    <input
                      id="clientEmail"
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="Enter company email address"
                      className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.clientEmail ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.clientEmail && (
                      <p className="text-red-400 text-sm">{errors.clientEmail}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium text-white">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional information about your company"
                      rows="3"
                      className="w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/* Admin User Section */}
                <div className="space-y-4 border-t border-slate-700/50 pt-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-purple-400" />
                    Admin Account Setup
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        disabled={isLoading}
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium text-white flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-slate-400" />
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        disabled={isLoading}
                      />
                      {errors.username && (
                        <p className="text-red-400 text-sm">{errors.username}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="adminEmail" className="text-sm font-medium text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        Admin Email
                      </label>
                      <input
                        id="adminEmail"
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        placeholder="Enter admin email address"
                        className={`w-full px-4 py-2.5 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.adminEmail ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        disabled={isLoading}
                      />
                      {errors.adminEmail && (
                        <p className="text-red-400 text-sm">{errors.adminEmail}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className={`w-full px-4 py-2.5 pr-10 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                          className={`w-full px-4 py-2.5 pr-10 bg-gray-900/50 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                </div>
                {/* Terms Agreement */}
                <div className="flex items-start space-x-3 py-4">
                  <div className="relative pt-1">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 bg-gray-700"
                      disabled={isLoading}
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
                      disabled={isLoading}
                      onClick={handleOpenTermsModalOpen}    
                    >
                      client privacy policy & terms
                    </button>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-400 text-sm">{errors.terms}</p>
                )}
                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Building className="h-5 w-5" />
                      <span>Register Client & Create Admin</span>
                    </>
                  )}
                </button>
              </form>
              {/* Login Link */}
              <div className="text-center pt-6 border-t border-slate-700/50 mt-6">
                <p className="text-slate-400">
                  Already have a client account?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
                    disabled={isLoading}
                    onClick={() => router.push('/forms/login')}
                  >
                    Login Here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
          <PrivacyTermsModal 
            isOpen={showPrivacyModal} 
            onClose={() => setShowPrivacyModal(false)}
            type="admin"
          />
    </>
  );
};

export default ClientRegistration;