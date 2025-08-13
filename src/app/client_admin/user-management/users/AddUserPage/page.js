'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle, QrCode, Key, User, Briefcase, Shield, ArrowLeftIcon, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useUser } from '@/components/providers/UserContext';
import supabase from '@/lib/helper';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

const ClientUserAdd = () => {
  const { clientId } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    // Removed department and position
    is_active: true,
    generate_code: true,
    access_code: '',
    // Biometric options
    setup_biometric: false,
    biometric_type: 'face',
    card_uid: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUserId, setCreatedUserId] = useState(null);
  const [createdUserCodeId, setCreatedUserCodeId] = useState(null);
  const [activeAuthMethods, setActiveAuthMethods] = useState([]);
  const [authMethodsLoading, setAuthMethodsLoading] = useState(true);
  const [authMethodsError, setAuthMethodsError] = useState(null);
  const router = useRouter();



  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required.';
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format.';
      if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format.';
    }
    if (step === 2) {
   
      if (activeAuthMethods.includes('access_code')) {
        if (formData.generate_code === false && formData.access_code.trim() === '') {
          newErrors.access_code = 'Access code is required if not auto-generated.';
        } else if (formData.generate_code === false && formData.access_code.length < 4) {
          newErrors.access_code = 'Access code must be at least 4 characters.';
        }
      }
     
      if (activeAuthMethods.includes('card')) {
        if (formData.setup_biometric && formData.biometric_type === 'card' && !formData.card_uid.trim()) {
          newErrors.card_uid = 'Card UID is required for card-based access.';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const generateRandomCode = (length = 6) => {
  const characters = '0123456789'; 
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


const handleSubmit = async () => {
  if (!validateStep(currentStep)) return;
  setIsSubmitting(true);

  try {
      const { data: userData, error: userError } = await supabase
          .from('clients_users')
          .insert({
              client_id: clientId,
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              is_active: formData.is_active
          })
          .select()
          .single(); 

      if (userError) throw userError;

      const newUserId = userData.id;
      setCreatedUserId(newUserId);

      if (activeAuthMethods.includes('access_code') && (formData.generate_code || (!formData.generate_code && formData.access_code.trim()))) {
          let codeToUse = formData.access_code.trim();
          if (formData.generate_code) {
              codeToUse = generateRandomCode();
              setFormData(prev => ({ ...prev, access_code: codeToUse }));
          }

          const response = await fetch('/api/create-user-credential', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  user_id: newUserId,
                  access_code: codeToUse
              }),
          });

          const result = await response.json();
          if (!response.ok) {
              throw new Error(result.error || 'Failed to create credential');
          }

          setCreatedUserCodeId(result.data.id); 
      }

      // Handle biometric setup (unchanged)
      if (formData.setup_biometric && formData.biometric_type) {
          if (activeAuthMethods.includes(formData.biometric_type)) {
              let credentialDataToInsert = {
                  user_id: newUserId,
                  method_type: formData.biometric_type,
                  credential_hash: '', 
                  is_active: true
              };

              // Handle Card UID
              if (formData.biometric_type === 'card' && formData.card_uid.trim()) {
                  const cardUidHash = btoa(formData.card_uid.trim()); 
                  credentialDataToInsert.credential_hash = cardUidHash;
              }
           
              else if (formData.biometric_type === 'face' || formData.biometric_type === 'palm') {
                 credentialDataToInsert.credential_hash = 'PENDING_DEVICE_ENROLLMENT';
              }

              const { data: biometricCredentialData, error: biometricCredentialError } = await supabase
                  .from('user_credentials')
                  .insert(credentialDataToInsert)
                  .select()
                  .single();

              if (biometricCredentialError) {
                  console.warn("Could not create biometric credential entry:", biometricCredentialError);
              }
          }
      }


  } catch (err) {
      console.error('Error creating user:', err);
      setAuthMethodsError("Failed to create user. Please try again.");
  } finally {
      setIsSubmitting(false);
  }
};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy code: ', err);
    });
  };

  useEffect(() => {
    const fetchAuthMethods = async () => {
      if (!clientId) {
        setAuthMethodsLoading(false);
        setAuthMethodsError("Client ID is required to load authentication methods.");
        console.warn("Client ID is missing for ClientUserAdd component.");
        return;
      }
      setAuthMethodsLoading(true);
      setAuthMethodsError(null);
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from('client_locker_settings')
          .select('id')
          .eq('client_id', clientId)
          .single();
        if (settingsError) {
           if (settingsError.code === 'PGRST116') {
             console.warn(`No client_locker_settings found for client ID: ${clientId}`);
             setActiveAuthMethods([]);
             setAuthMethodsLoading(false);
             return;
           }
           throw settingsError;
        }
        const clientSettingId = settingsData.id;
        const { data, error } = await supabase
          .from('client_auth_methods')
          .select(`
            auth_method_id,
            auth_methods (technical_name, is_active)
          `)
          .eq('client_setting_id', clientSettingId)
          .eq('auth_methods.is_active', true);
        if (error) throw error;
        const methodNames = data
          .filter(item => item.auth_methods?.is_active)
          .map(item => item.auth_methods?.technical_name)
          .filter(name => name);
        setActiveAuthMethods(methodNames);
      }
      catch (err) {
        console.error("Error fetching client auth methods:", err);
        const errorMessage = err.message || "Failed to load available authentication methods for this client.";
        setAuthMethodsError(errorMessage);
      } finally {
        setAuthMethodsLoading(false);
      }
    };
    fetchAuthMethods();
  }, [clientId]);

  const headerGradientFrom = "from-slate-800";
  const headerGradientTo = "to-slate-900";
  const primaryGradientFrom = "from-orange-500";
  const primaryGradientTo = "to-orange-600";
  const progressBarGradientFrom = primaryGradientFrom;
  const progressBarGradientTo = primaryGradientTo;
  const nextButtonGradientFrom = primaryGradientFrom;
  const nextButtonGradientTo = primaryGradientTo;
  const nextButtonHoverFrom = "from-orange-600";
  const nextButtonHoverTo = "to-orange-700";
  const createButtonGradientFrom = "from-green-600";
  const createButtonGradientTo = "to-emerald-600";
  const createButtonHoverFrom = "from-green-700";
  const createButtonHoverTo = "to-emerald-700";
  const cardBgClass = "bg-white/95 backdrop-blur-sm";
  const stepActiveIconBg = primaryGradientFrom;
  const stepCompletedIconBg = "bg-green-500";

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen ">

    <div className='pb-5'>
      <Button
        onClick={()=>(
          router.push('/client_admin/user-management/users/')
        )}
        variant="outline"
        className="flex items-center space-x-2 border-gray-200 text-gray-700 hover:bg-gray-50 "
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to User Management</span>
      </Button>
    </div>
      
      <Card className={`w-full shadow-xl border-0 ${cardBgClass}`}>
        <CardHeader className={`bg-gradient-to-r ${headerGradientFrom} ${headerGradientTo} text-white rounded-t-lg`}>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8" />
            Add New Client User
          </CardTitle>
          <p className="text-slate-300 mt-2">
            Create a new user account for your organization
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between mb-4">
              {[
                { step: 1, label: 'Personal Info', icon: User },
                { step: 2, label: 'Access Setup', icon: Shield }
              ].map(({ step, label, icon: Icon }) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${currentStep === step
                      ? `${stepActiveIconBg} text-black shadow-lg scale-110`
                      : currentStep > step
                        ? `${stepCompletedIconBg} text-white`
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium transition-colors ${currentStep === step ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`bg-gradient-to-r ${progressBarGradientFrom} ${progressBarGradientTo} h-3 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g., John Doe"
                      className={`h-12 text-lg ${errors.full_name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"}`}
                    />
                    {errors.full_name && <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.full_name}
                    </p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., john.doe@example.com"
                      className={`h-12 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"}`}
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., +1234567890"
                      className={`h-12 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"}`}
                    />
                    {errors.phone && <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>}
                  </div>

                </div>
              </div>
            )}
            {/* Step 2: Access Setup */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                {/* User Status */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange({ target: { id: 'is_active', type: 'checkbox', checked } })}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="is_active" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      User is Active
                    </Label>
                  </div>
                  <p className="text-xs text-blue-600 mt-2 ml-8">
                    Active users can access the system and use assigned lockers
                  </p>
                </div>


                {activeAuthMethods.includes('access_code') && (
                  <div className="p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center mb-4">
                      <div className="mr-3">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20" cy="20" r="20" fill="white" />
                          <path d="M15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5C14 10.3284 14.6716 11 15.5 11Z" fill="#F97316" />
                          <path d="M24 15.5C24 14.6716 23.3284 14 22.5 14C21.6716 14 21 14.6716 21 15.5V17H18.5C17.6716 17 17 17.6716 17 18.5C17 19.3284 17.6716 20 18.5 20H21V24.5C21 25.3284 21.6716 26 22.5 26C23.3284 26 24 25.3284 24 24.5V20H26.5C27.3284 20 28 19.3284 28 18.5C28 17.6716 27.3284 17 26.5 17H24V15.5Z" fill="#F97316" />
                          <path d="M11 21C12.6569 21 14 19.6569 14 18C14 16.3431 12.6569 15 11 15C9.34315 15 8 16.3431 8 18C8 19.6569 9.34315 21 11 21Z" fill="#F97316" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Access Code</h3>
                    </div>
                    <div className="flex items-center space-x-3 mb-6">
                      <Checkbox
                        id="generate_code"
                        checked={formData.generate_code}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({ ...prev, generate_code: checked, access_code: checked ? '' : prev.access_code }));
                          if (errors.access_code) setErrors(prev => ({ ...prev, access_code: '' }));
                        }}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="generate_code" className="text-sm font-semibold text-gray-700 cursor-pointer">
                        Automatically generate a secure access code
                      </Label>
                    </div>
                    {!formData.generate_code && (
                      <div>
                        <Label htmlFor="access_code" className="block text-sm font-semibold text-gray-700 mb-2">
                          Enter Access Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="access_code"
                          value={formData.access_code}
                          onChange={handleChange}
                          placeholder="Enter a code (min 4 characters)"
                          className={`h-12 ${errors.access_code ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"}`}
                        />
                        {errors.access_code && <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.access_code}
                        </p>}
                      </div>
                    )}
                    {/* Display Generated Code */}
                    {formData.generate_code && formData.access_code && (
                      <div className="mt-6 p-4 bg-white border-2 border-green-200 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-green-800 mb-2">Generated Access Code:</p>
                        <div className="flex items-center justify-between">
                          <code className="px-4 py-2 bg-gray-100 border rounded-lg text-xl font-mono font-bold text-gray-800">{formData.access_code}</code>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(formData.access_code)}
                            className="ml-3 border-green-300 text-green-700 hover:bg-green-50"
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="mt-3 text-xs text-green-700 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Store this code securely. It will not be shown again.
                        </p>
                      </div>
                    )}
                  </div>
                )}
            
                {(activeAuthMethods.includes('card_reader') || activeAuthMethods.includes('face_recognition') || activeAuthMethods.includes('palm_scanner')) && (
                  <div className="p-6 border-2 border-orange-200 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                    <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Biometric Access</h3>
                    </div>
                    <div className="flex items-center space-x-3 mb-6">
                      <Checkbox
                        id="setup_biometric"
                        checked={formData.setup_biometric}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({ ...prev, setup_biometric: checked, card_uid: checked ? prev.card_uid : '' }));
                          if (errors.card_uid) setErrors(prev => ({ ...prev, card_uid: '' }));
                        }}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="setup_biometric" className="text-sm font-semibold text-gray-700 cursor-pointer">
                        Set up biometric authentication
                      </Label>
                    </div>
                    {formData.setup_biometric && (
                      <div className="space-y-4">
                        <div>
                          <Label className="block text-sm font-semibold text-gray-700 mb-3">
                            Biometric Type
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                              // Updated to match database names and check if they are enabled
                              { value: 'face_recognition', label: 'Face Recognition', icon: '👤', enabled: activeAuthMethods.includes('face_recognition') },
                              { value: 'card_reader', label: 'ID Card', icon: '💳', enabled: activeAuthMethods.includes('card_reader') },
                              { value: 'palm_scanner', label: 'Palm Print', icon: '🖐️', enabled: activeAuthMethods.includes('palm_scanner') }
                            ].map((type) => (
                              type.enabled && ( // Only show buttons for enabled methods
                                <div
                                  key={type.value}
                                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.biometric_type === type.value
                                      ? 'border-orange-500 bg-orange-100'
                                      : 'border-gray-200 hover:border-orange-300'
                                    }`}
                                  onClick={() => setFormData(prev => ({ ...prev, biometric_type: type.value }))}
                                >
                                  <div className="text-center">
                                    <div className="text-2xl mb-2">{type.icon}</div>
                                    <div className="text-sm font-medium">{type.label}</div>
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                        {/* Updated conditions to match database names */}
                        {formData.biometric_type === 'card_reader' && activeAuthMethods.includes('card_reader') && (
                          <div>
                            <Label htmlFor="card_uid" className="block text-sm font-semibold text-gray-700 mb-2">
                              Card UID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="card_uid"
                              value={formData.card_uid}
                              onChange={handleChange}
                              placeholder="Enter card UID (e.g., A1B2C3D4)"
                              className={`h-12 ${errors.card_uid ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"}`}
                            />
                            {errors.card_uid && <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.card_uid}
                            </p>}
                            <p className="mt-2 text-xs text-gray-600">
                              Scan the ID card to get its unique identifier
                            </p>
                          </div>
                        )}
                        {formData.biometric_type === 'face_recognition' && activeAuthMethods.includes('face_recognition') && (
                          <div className="p-4 bg-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              Face recognition setup will be completed during the first device login. The user will be prompted to register their face.
                            </p>
                          </div>
                        )}
                        {formData.biometric_type === 'palm_scanner' && activeAuthMethods.includes('palm_scanner') && (
                          <div className="p-4 bg-purple-100 rounded-lg">
                            <p className="text-sm text-purple-800 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              Palm print registration will be done on a compatible device with palm scanning capabilities.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {!formData.setup_biometric && (
                      <div className="flex items-center text-sm text-orange-700 bg-orange-100 p-3 rounded-lg">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>Biometric setup can be done later on the device or through device enrollment.</span>
                      </div>
                    )}
                  </div>
                )}

            
                {activeAuthMethods.includes('qr_code') && (
                  <div className="p-6 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3`}>
                        <QrCode className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">QR Code Access</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      QR codes are generated per locker door. Once you assign a locker door to this user, a unique QR code will be created for that door access.
                    </p>
                    <div className="flex items-center text-sm text-purple-700 bg-purple-100 p-3 rounded-lg">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>QR code setup pending locker door assignment.</span>
                    </div>
                  </div>
                )}
                {authMethodsLoading && <p className="text-center text-gray-500 py-4">Loading authentication options...</p>}
                {authMethodsError && <p className="text-center text-red-500 py-4">Error loading auth options: {authMethodsError}</p>}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-8 bg-gray-50 rounded-b-lg">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting || authMethodsLoading}
              className={`px-8 py-3 text-lg bg-gradient-to-r ${nextButtonGradientFrom} ${nextButtonGradientTo} hover:${nextButtonHoverFrom} hover:${nextButtonHoverTo} text-white`}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || authMethodsLoading}
              className={`px-8 py-3 text-lg bg-gradient-to-r ${createButtonGradientFrom} ${createButtonGradientTo} hover:${createButtonHoverFrom} hover:${createButtonHoverTo} text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2 text-white">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create User'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      {/* Success Message Overlay */}
      {createdUserId && !isSubmitting && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) {
            setFormData({
              full_name: '', email: '', phone: '', 
              is_active: true, generate_code: true, access_code: '',
              setup_biometric: false, biometric_type: 'face', card_uid: ''
            });
            setErrors({});
            setCreatedUserId(null);
            setCreatedUserCodeId(null);
            setCurrentStep(1);
          }
        }}>
          <DialogContent className="max-w-md p-0 border-none shadow-2xl">
            <Card className="w-full border-0">
              <CardHeader className={`bg-gradient-to-r ${createButtonGradientFrom} ${createButtonGradientTo} text-white rounded-t-lg`}>
                <DialogTitle>
                  <CardTitle className="flex items-center text-white">
                    <CheckCircle className="w-6 h-6 mr-3" />
                    User Created Successfully!
                  </CardTitle>
                </DialogTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">User:</span>
                    <span>{formData.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">User ID:</span>
                    <span className="font-mono text-sm">{createdUserId}</span>
                  </div>
                </div>
                {/* Note: Changed check to 'code' and used createdUserCodeId */}
                {createdUserCodeId && activeAuthMethods.includes('access_code') && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800 mb-2">Access Code Set:</p>
                    <div className="flex items-center justify-between">
                      <code className="px-3 py-1 bg-white border rounded font-mono font-bold">{formData.access_code}</code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formData.access_code)}
                        className="ml-2 border-green-300 text-green-700"
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-green-700">Credential ID: {createdUserCodeId}</p>
                  </div>
                )}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Remember: Assign a locker door to generate a QR code for this user. Biometric setup (Face/ID/Palm) needs to be done on the device.
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <DialogClose asChild>
                  <Button
                    className={`w-full bg-gradient-to-r ${nextButtonGradientFrom} ${nextButtonGradientTo} hover:${nextButtonHoverFrom} hover:${nextButtonHoverTo} text-white`}
                  >
                    Add Another User
                  </Button>
                </DialogClose>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ClientUserAdd;
