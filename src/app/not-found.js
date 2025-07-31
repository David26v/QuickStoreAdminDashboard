'use client'
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useEffect ,useState} from "react";

export default function NotFound() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
        setIsClient(true);
        // Generate particles only on client side
        setParticles([...Array(6)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 2
        })));
    }, []);
    
    useEffect(() => {
        if (isClient) {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/forms/login");
            }
        }
    }, [router, isClient]);

    const goHome = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>
            
            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
                {/* 404 Number with gradient effect */}
                <div className="relative">
                    <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-[#1a67fe] via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                        404
                    </h1>
                    {/* Glowing effect behind text */}
                    <div className="absolute inset-0 text-8xl md:text-9xl font-black text-[#1a67fe] opacity-20 blur-sm">
                        404
                    </div>
                </div>

                {/* Error message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
                        <span className="text-4xl">🔍</span>
                        Page Not Found
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
                        Oops! The page you&apos;re looking for seems to have wandered off into the digital void.
                    </p>

                </div>

                {/* Action button */}
                <div className="pt-4">
                    <Button 
                        onClick={goHome} 
                        className="group relative px-8 py-4 bg-gradient-to-r from-[#1a67fe] to-blue-600 hover:from-blue-600 hover:to-[#1a67fe] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back To Home
                        </span>
                        {/* Button glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#1a67fe] to-blue-600 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                    </Button>
                </div>

                {/* Custom 404 Illustration */}
                <div className="pt-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1a67fe] to-blue-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                        <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                            {/* Custom SVG Illustration */}
                            <div className="w-full max-w-md mx-auto">
                                <svg viewBox="0 0 400 300" className="w-full h-auto">
                                    {/* Background elements */}
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#1a67fe" stopOpacity="0.1"/>
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2"/>
                                        </linearGradient>
                                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#1a67fe"/>
                                            <stop offset="100%" stopColor="#3b82f6"/>
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Floating geometric shapes */}
                                    <circle cx="80" cy="80" r="30" fill="url(#grad1)" className="animate-pulse">
                                        <animateTransform attributeName="transform" type="translate" values="0,0; 10,5; 0,0" dur="4s" repeatCount="indefinite"/>
                                    </circle>
                                    <polygon points="320,60 340,40 360,60 340,80" fill="url(#grad1)" className="animate-pulse">
                                        <animateTransform attributeName="transform" type="translate" values="0,0; -5,10; 0,0" dur="3s" repeatCount="indefinite"/>
                                    </polygon>
                                    <rect x="50" y="200" width="25" height="25" fill="url(#grad1)" className="animate-pulse" transform="rotate(45 62.5 212.5)">
                                        <animateTransform attributeName="transform" type="translate" values="0,0; 8,-8; 0,0" dur="5s" repeatCount="indefinite"/>
                                    </rect>
                                    
                                    {/* Main illustration - Broken link/chain */}
                                    <g className="group-hover:scale-105 transition-transform duration-300">
                                        {/* Left chain link */}
                                        <ellipse cx="150" cy="150" rx="25" ry="15" fill="none" stroke="url(#grad2)" strokeWidth="6" transform="rotate(-30 150 150)"/>
                                        
                                        {/* Right chain link */}
                                        <ellipse cx="250" cy="150" rx="25" ry="15" fill="none" stroke="url(#grad2)" strokeWidth="6" transform="rotate(30 250 150)"/>
                                        
                                        {/* Broken pieces */}
                                        <path d="M 190 140 Q 200 135 210 140" fill="none" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round">
                                            <animateTransform attributeName="transform" type="translate" values="0,0; 2,3; 0,0" dur="2s" repeatCount="indefinite"/>
                                        </path>
                                        <path d="M 190 160 Q 200 165 210 160" fill="none" stroke="url(#grad2)" strokeWidth="4" strokeLinecap="round">
                                            <animateTransform attributeName="transform" type="translate" values="0,0; -2,-3; 0,0" dur="2s" repeatCount="indefinite"/>
                                        </path>
                                        
                                        {/* Spark effects */}
                                        <circle cx="190" cy="145" r="2" fill="#1a67fe" className="animate-ping"/>
                                        <circle cx="210" cy="155" r="2" fill="#3b82f6" className="animate-ping" style={{animationDelay: '0.5s'}}/>
                                        <circle cx="200" cy="140" r="1.5" fill="#1a67fe" className="animate-ping" style={{animationDelay: '1s'}}/>
                                    </g>
                                    
                                    {/* Floating question marks */}
                                    <text x="120" y="100" fontSize="20" fill="url(#grad2)" className="animate-bounce" style={{animationDelay: '1s'}}>?</text>
                                    <text x="280" y="120" fontSize="16" fill="url(#grad2)" className="animate-bounce" style={{animationDelay: '2s'}}>?</text>
                                    <text x="160" y="220" fontSize="18" fill="url(#grad2)" className="animate-bounce" style={{animationDelay: '0.5s'}}>?</text>
                                    
                                    {/* Bottom wavy line */}
                                    <path d="M 50 250 Q 100 240 150 250 T 250 250 T 350 250" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" opacity="0.6">
                                        <animate attributeName="d" 
                                            values="M 50 250 Q 100 240 150 250 T 250 250 T 350 250;
                                                    M 50 250 Q 100 260 150 250 T 250 250 T 350 250;
                                                    M 50 250 Q 100 240 150 250 T 250 250 T 350 250" 
                                            dur="3s" repeatCount="indefinite"/>
                                    </path>
                                </svg>
                            </div>
                            
                            {/* Additional decorative elements */}
                            <div className="flex justify-center mt-6 space-x-4">
                                <div className="w-3 h-3 bg-[#1a67fe] rounded-full animate-pulse"></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional helpful links */}
                <div className="pt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <button 
                        onClick={() => router.back()} 
                        className="text-[#1a67fe] hover:text-blue-600 font-medium transition-colors duration-200 hover:underline"
                    >
                        ← Go Back
                    </button>
                    <span className="text-slate-400">•</span>
                    <button 
                        onClick={() => router.push('/help')} 
                        className="text-[#1a67fe] hover:text-blue-600 font-medium transition-colors duration-200 hover:underline"
                    >
                        Get Help
                    </button>
                    <span className="text-slate-400">•</span>
                    <button 
                        onClick={() => router.push('/contact')} 
                        className="text-[#1a67fe] hover:text-blue-600 font-medium transition-colors duration-200 hover:underline"
                    >
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
                            className="absolute w-2 h-2 bg-[#1a67fe] rounded-full opacity-20 animate-bounce"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                                animationDelay: `${particle.delay}s`,
                                animationDuration: `${particle.duration}s`
                            }}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
}