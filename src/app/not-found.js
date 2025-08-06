'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, Home, HelpCircle, MessageCircle, Lock, Key, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/helper';

export default function NotFound() {
    const [isClient, setIsClient] = useState(false);
    const [particles, setParticles] = useState([]);
    const [lockerStates, setLockerStates] = useState({});
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    
    useEffect(() => {
        setIsClient(true);
        fetchSessionUser();
        
        // Generate floating particles
        setParticles([...Array(8)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 2
        })));

        const initialStates = {};
        for (let i = 1; i <= 12; i++) {
            initialStates[i] = {
                isOpen: Math.random() > 0.7, 
                animationDelay: Math.random() * 2
            };
        }
        setLockerStates(initialStates);

        // Animate lockers periodically
        const interval = setInterval(() => {
            setLockerStates(prev => {
                const newStates = { ...prev };
                const randomLocker = Math.floor(Math.random() * 12) + 1;
                newStates[randomLocker] = {
                    ...newStates[randomLocker],
                    isOpen: !newStates[randomLocker].isOpen
                };
                return newStates;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const fetchSessionUser = async () => {
        try {
            
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError || !session?.user) {
                console.log("No active session");
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", session.user.id)
                .single();

            if (profileError || !profile?.role) {
                console.error("Error fetching user role:", profileError);
                return;
            }

            setUserRole(profile.role);
        
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    const goHome = async () => {
        if (isLoading) return;
        
        setIsLoading(true);

        try {
            if (userRole === "admin") {
                router.push("/admin/dashboard");
            } 
            else if (userRole === "client_admin") {
                router.push("/client_admin/dashboard");
            }
            else {
                router.push("/forms/login");
            }
        } catch (error) {
            console.error("Navigation error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        router.push('/forms/login')
    };

    const QuickStoreLogo = ({ size = "w-16 h-16" }) => (
        <div className={`relative inline-flex items-center justify-center ${size} bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg overflow-hidden`}>
            <div className="absolute inset-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-inner">
                <Shield className="h-1/2 w-1/2 text-slate-200" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <Lock className="h-2.5 w-2.5 text-white" />
            </div>
        </div>
    );

    const LockerUnit = ({ id, isOpen, delay }) => (
        <div 
            className="relative w-16 h-20 transition-all duration-500"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Locker frame */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm shadow-md">
                {/* Locker door */}
                <div 
                    className={`absolute inset-1 bg-gradient-to-b transition-all duration-500 rounded-sm shadow-inner ${
                        isOpen 
                            ? 'from-orange-400 to-orange-500 transform translate-x-2 rotate-12 origin-left' 
                            : 'from-gray-100 to-gray-200'
                    }`}
                >
                    {/* Door handle */}
                    <div className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-500 ${
                        isOpen ? 'bg-orange-600' : 'bg-gray-400'
                    }`}></div>
                    
                    {/* Lock indicator */}
                    <div className="absolute left-1 top-1 w-3 h-2 bg-gray-500 rounded-sm flex items-center justify-center">
                        {isOpen ? (
                            <Key className="w-2 h-2 text-orange-300" />
                        ) : (
                            <Lock className="w-2 h-2 text-red-400" />
                        )}
                    </div>
                </div>
                
                {/* Locker number */}
                <div className="absolute bottom-0 left-0 right-0 text-center">
                    <span className="text-xs font-bold text-gray-600">{id}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-40 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>
            
            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
                {/* QuickStore Logo */}
                <div className="flex justify-center mb-8">
                    <QuickStoreLogo size="w-20 h-20" />
                </div>

                {/* 404 Number with locker styling */}
                <div className="relative">
                    <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-orange-500 via-orange-600 to-gray-600 bg-clip-text text-transparent drop-shadow-lg">
                        404
                    </h1>
                    {/* Glowing effect behind text */}
                    <div className="absolute inset-0 text-8xl md:text-9xl font-black text-orange-500 opacity-20 blur-sm">
                        404
                    </div>
                </div>

                {/* Locker Animation */}
                <div className="relative py-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                        <h3 className="text-lg font-semibold text-gray-700 mb-6">Locker Access Denied</h3>
                        
                        {/* Locker Grid */}
                        <div className="grid grid-cols-6 gap-4 justify-center max-w-md mx-auto mb-6">
                            {Object.entries(lockerStates).map(([id, state]) => (
                                <LockerUnit 
                                    key={id}
                                    id={id}
                                    isOpen={state.isOpen}
                                    delay={state.animationDelay}
                                />
                            ))}
                        </div>

                        {/* Access panel */}
                        <div className="bg-gray-800 rounded-lg p-4 max-w-xs mx-auto">
                            <div className="text-center mb-3">
                                <div className="w-12 h-8 bg-red-500 rounded mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">ERROR</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    {[...Array(9)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-sm hover:bg-orange-500 transition-colors cursor-pointer"
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-sm">*</div>
                                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-sm">0</div>
                                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-sm">#</div>
                                </div>
                            </div>
                        </div>

                        {/* Status indicators */}
                        <div className="flex justify-center mt-6 space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-600">System Online</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-600">Access Denied</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <Lock className="text-orange-500" />
                        Locker Not Found
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                        The locker you're looking for seems to be locked away in our digital vault. Let's get you back to the main storage area!
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button 
                        onClick={goHome} 
                        disabled={isLoading}
                        className={`group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 ${
                            isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Home className="w-5 h-5" />
                                    Return to Dashboard
                                    {userRole && (
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-1">
                                            {userRole}
                                        </span>
                                    )}
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                    </button>

                    <button 
                        onClick={goBack} 
                        className="group relative px-8 py-4 bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        <span className="flex items-center gap-2">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            Go Back
                        </span>
                    </button>
                </div>

                {/* Additional helpful links */}
                <div className="pt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <button className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 hover:underline flex items-center gap-1">
                        <HelpCircle className="w-4 h-4" />
                        Get Help
                    </button>
                    <span className="text-gray-400">•</span>
                    <button className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 hover:underline flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        Contact Support
                    </button>
                </div>
            </div>

            {/* Floating particles effect - only render on client */}
            {isClient && (
                <div className="absolute inset-0 pointer-events-none">
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-20 animate-bounce"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                                animationDelay: `${particle.delay}s`,
                                animationDuration: `${particle.duration}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Floating keys animation */}
            {isClient && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <Key className="absolute top-20 left-10 w-6 h-6 text-orange-300 opacity-30 animate-bounce" style={{animationDelay: '0.5s'}} />
                    <Key className="absolute top-40 right-20 w-4 h-4 text-gray-400 opacity-40 animate-bounce" style={{animationDelay: '1.5s'}} />
                    <Key className="absolute bottom-32 left-1/3 w-5 h-5 text-orange-400 opacity-25 animate-bounce" style={{animationDelay: '2.5s'}} />
                    <Lock className="absolute top-60 right-10 w-4 h-4 text-gray-500 opacity-30 animate-pulse" />
                    <Lock className="absolute bottom-20 right-1/4 w-6 h-6 text-orange-300 opacity-20 animate-pulse" style={{animationDelay: '1s'}} />
                </div>
            )}
        </div>
    );
}