'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle, QrCode, Key, User, Briefcase, Shield } from 'lucide-react';

const ClientUserAdd = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
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
        if (formData.generate_code === false && formData.access_code.trim() === '') {
             newErrors.access_code = 'Access code is required if not auto-generated.';
        }
         else if (formData.generate_code === false && formData.access_code.length < 4) {
             newErrors.access_code = 'Access code must be at least 4 characters.';
        }

        if (formData.setup_biometric && formData.biometric_type === 'card' && !formData.card_uid.trim()) {
            newErrors.card_uid = 'Card UID is required for card-based access.';
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
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUserId = `user_${Date.now()}`;
      setCreatedUserId(mockUserId);
      if (formData.generate_code || (!formData.generate_code && formData.access_code.trim())) {
        let codeToUse = formData.access_code.trim();
        if (formData.generate_code) {
          codeToUse = generateRandomCode();
          setFormData(prev => ({...prev, access_code: codeToUse}));
        }

        const mockCredentialId = `credential_${Date.now()}`;
        setCreatedUserCodeId(mockCredentialId);
      }
      console.log('User would be created with data:', {
        ...formData,
        id: mockUserId
      });
    } catch (err) {
      console.error('Error creating user:', err);
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

  const headerGradientFrom = "from-slate-800";
  const headerGradientTo = "to-slate-900";
  const primaryGradientFrom = "from-orange-500";
  const primaryGradientTo = "to-orange-600";
  const secondaryGradientFrom = "from-orange-400";
  const secondaryGradientTo = "to-orange-500";
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    currentStep === step
                      ? `${stepActiveIconBg} text-black shadow-lg scale-110`
                      : currentStep > step
                        ? `${stepCompletedIconBg} text-white` 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon className="w-6 h-6" /> 
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    currentStep === step ? 'text-orange-600' : 'text-gray-500' 
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
                {/* Access Code Section */}
                <div className="p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 ${primaryGradientFrom} rounded-full flex items-center justify-center mr-3`}> 
                      <Key className="w-5 h-5 text-white" /> 
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Access Code</h3>
                  </div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Checkbox
                      id="generate_code"
                      checked={formData.generate_code}
                      onCheckedChange={(checked) => {
                         setFormData(prev => ({...prev, generate_code: checked, access_code: checked ? '' : prev.access_code }));
                         if (errors.access_code) setErrors(prev => ({...prev, access_code: ''}));
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
                {/* Biometric Section */}
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
                         setFormData(prev => ({...prev, setup_biometric: checked, card_uid: checked ? prev.card_uid : '' }));
                         if (errors.card_uid) setErrors(prev => ({...prev, card_uid: ''}));
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
                            { value: 'face', label: 'Face Recognition', icon: '👤' },
                            { value: 'card', label: 'ID Card', icon: '💳' },
                            { value: 'palm', label: 'Palm Print', icon: '🖐️' }
                          ].map((type) => (
                            <div
                              key={type.value}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.biometric_type === type.value
                                  ? 'border-orange-500 bg-orange-100'
                                  : 'border-gray-200 hover:border-orange-300'
                              }`}
                              onClick={() => setFormData(prev => ({...prev, biometric_type: type.value}))}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-2">{type.icon}</div>
                                <div className="text-sm font-medium">{type.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {formData.biometric_type === 'card' && (
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
                      {formData.biometric_type === 'face' && (
                        <div className="p-4 bg-blue-100 rounded-lg">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            Face recognition setup will be completed during the first device login. The user will be prompted to register their face.
                          </p>
                        </div>
                      )}
                      {formData.biometric_type === 'palm' && (
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
                {/* QR Code Section */}
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
              disabled={isSubmitting}
              className={`px-8 py-3 text-lg bg-gradient-to-r ${nextButtonGradientFrom} ${nextButtonGradientTo} hover:${nextButtonHoverFrom} hover:${nextButtonHoverTo} text-white`} // Ensure white text on orange button
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 text-lg bg-gradient-to-r ${createButtonGradientFrom} ${createButtonGradientTo} hover:${createButtonHoverFrom} hover:${createButtonHoverTo} text-white`} // Ensure white text on green button
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
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
             <Card className="w-full max-w-md shadow-2xl border-0">
                 <CardHeader className={`bg-gradient-to-r ${createButtonGradientFrom} ${createButtonGradientTo} text-white rounded-t-lg`}>
                     <CardTitle className="flex items-center text-white">
                         <CheckCircle className="w-6 h-6 mr-3" />
                         User Created Successfully!
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6">
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
                     {createdUserCodeId && (
                         <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
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
                     <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                         <p className="text-sm text-blue-800 flex items-start">
                             <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                             <span>Remember: Assign a locker door to generate a QR code for this user. Biometric setup (Face/ID) needs to be done on the device.</span>
                         </p>
                     </div>
                 </CardContent>
                 <CardFooter className="p-6 pt-0">
                     <Button
                       onClick={() => {
                         // Reset form and state
                         setFormData({
                             full_name: '', email: '', phone: '',
                             is_active: true, generate_code: true, access_code: '',
                             setup_biometric: false, biometric_type: 'face', card_uid: ''
                         });
                         setErrors({});
                         setCreatedUserId(null);
                         setCreatedUserCodeId(null);
                         setCurrentStep(1);
                       }}
                       className={`w-full bg-gradient-to-r ${nextButtonGradientFrom} ${nextButtonGradientTo} hover:${nextButtonHoverFrom} hover:${nextButtonHoverTo} text-white`} 
                     >
                         Add Another User
                     </Button>
                 </CardFooter>
             </Card>
         </div>
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