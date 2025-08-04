"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoading } from "@/components/providers/LoadingProvider";
import supabase from "@/lib/helper";
import { useRouter } from 'next/navigation';


const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading,  setIsLoading] = useState(false);
  const router = useRouter();
  const {show ,hide} = useLoading();
  

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
    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Username or Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLoading) return; 

  setErrors({});
  setIsLoading(true);
  show("Logging in...");

  if (!validateForm()) {
    hide();
    setIsLoading(false);
    return;
  }

  try {
    show("Authenticating...", "Verifying credentials");

    let emailToUse = formData.usernameOrEmail;

    // Handle username -> email lookup
    if (!emailToUse.includes("@")) {
      const { data: profileLookup, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", emailToUse)
        .single();

      if (error || !profileLookup?.email) {
        setErrors({ general: "Invalid username or account not found." });
        console.error("Username lookup error:", error);
        return;
      }

      emailToUse = profileLookup.email;
    }

    // Sign in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: formData.password,
    });

    if (loginError || !loginData?.session?.user) {
      setErrors({ general: loginError?.message || "Login failed." });
      return;
    }

    const user = loginData.session.user;

    // Get role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.role) {
      setErrors({ general: "User role not found." });
      console.error("Profile fetch error:", profileError);
      return;
    }

    const role = profile.role;

    show("Success", "Logged in successfully!");

    // Redirect once
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "employee") {
      router.push("/employees/dashboard");
    } else {
      setErrors({ general: `Unknown role: ${role}` });
    }
  } catch (err) {
    console.error("Login error:", err);
    setErrors({ general: err.message || "Unexpected error occurred." });
  } finally {
    setIsLoading(false);
    hide();
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-slate-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-slate-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-gray-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-slate-500/35 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-gray-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl"> {/* Dark Grey Card Background */}
          <CardHeader className="space-y-4 pb-6">
            {/* Logo Section */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" /> {/* White Icon */}
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"> {/* Orange Accent */}
                  <Lock className="h-2.5 w-2.5 text-white" /> {/* White Icon */}
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-white tracking-tight"> {/* White Title */}
                QuickStore Philippines
              </CardTitle>
              <CardDescription className="text-slate-300 text-base font-medium">
                Locker System
              </CardDescription>
              <p className="text-slate-400 text-sm">
                Secure Admin Access Portal
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* General Error Alert */}
            {errors.general && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-800/50 text-red-200">
                <AlertDescription>
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Username/Email Input */}
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail" className="text-white font-medium"> {/* White Label */}
                Username or Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  className={`pl-10 bg-gray-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500 ${errors.usernameOrEmail ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} // Dark Grey Input, White Text, Orange Focus
                  placeholder="Enter your username or email"
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="text-red-400 text-sm">{errors.usernameOrEmail}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium"> {/* White Label */}
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 bg-gray-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} // Dark Grey Input, White Text, Orange Focus
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-white" // White Icon on Hover
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" // Orange Checkbox
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm text-slate-300 cursor-pointer hover:text-white" // White Text on Hover
                >
                  Remember me
                </Label>
              </div>
              <Button
                variant="link" // Use link variant for consistent styling
                className="px-0 font-medium text-orange-400 hover:text-orange-300 h-auto" // Orange Link
              >
                Forgot password?
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50" // Orange Gradient Button
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign in to Dashboard
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <div className="text-center text-xs text-slate-500 space-y-1">
              <p>Secured by advanced encryption</p>
              <p>© {new Date().getFullYear()} QuickStore Philippines Locker System. All rights reserved.</p>
            </div>
          </CardFooter>
        </Card>

        {/* Security Status Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-950/50 backdrop-blur-sm rounded-full border border-emerald-800/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-emerald-300 text-xs font-medium">Secure Connection Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;