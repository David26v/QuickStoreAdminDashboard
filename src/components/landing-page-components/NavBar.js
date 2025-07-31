"use client";
import React from 'react';
import Link from 'next/link';
import { Sun, Moon, LogIn, X, Menu, Sparkles } from 'lucide-react';
import ZentryxLogo from './ZentrixLogo';
import { useTheme } from '../providers/themeProvider';

const NavBar = ({ isMenuOpen, setIsMenuOpen, navigateToLogin }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const linkClass = `${
    isDarkMode 
      ? 'text-slate-300 hover:text-blue-400' 
      : 'text-slate-700 hover:text-blue-600'
  } transition-all duration-300 text-sm font-medium relative group px-3 py-2 rounded-lg hover:bg-white/5`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-100 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/95' 
        : 'bg-gradient-to-r from-white/95 via-white/90 to-white/95'
    } backdrop-blur-xl border-b ${
      isDarkMode 
        ? 'border-slate-700/30 shadow-2xl shadow-blue-500/5' 
        : 'border-white/30 shadow-2xl shadow-slate-200/50'
    }`}>
      
      {/* Animated background gradient */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5' 
          : 'bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-cyan-100/20'
      } animate-pulse`}></div>
      
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <ZentryxLogo size="sm" />
              <div className={`absolute -inset-1 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' 
                  : 'bg-gradient-to-r from-blue-200/30 to-purple-200/30'
              } rounded-full blur-sm group-hover:blur-md transition-all duration-500 opacity-0 group-hover:opacity-100`}></div>
            </div>
            <div className="leading-tight">
              <h1 className={`text-xl font-bold ${
                isDarkMode 
                  ? 'text-white drop-shadow-lg' 
                  : 'text-slate-900'
              } group-hover:scale-105 transition-transform duration-300`}>
                Zentryx
              </h1>
              <p className={`text-xs ${
                isDarkMode 
                  ? 'text-slate-400' 
                  : 'text-slate-500'
              } group-hover:text-blue-500 transition-colors duration-300`}>
                For Small Business
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Link href="/" className={linkClass}>
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300"></div>
              </Link>
              <Link href="#about" className={linkClass}>
                <span className="relative z-10">About Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300"></div>
              </Link>
              <Link href="#features" className={linkClass}>
                <span className="relative z-10">Features</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300"></div>
              </Link>
              <Link href="#contact" className={linkClass}>
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300"></div>
              </Link>
            </div>

            {/* Separator */}
            <div className={`h-8 w-px ${
              isDarkMode 
                ? 'bg-gradient-to-b from-transparent via-slate-600 to-transparent' 
                : 'bg-gradient-to-b from-transparent via-slate-300 to-transparent'
            } mx-4`}></div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className={`relative p-3 rounded-xl ${
                isDarkMode 
                  ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30' 
                  : 'bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200/30'
              } transition-all duration-300 group overflow-hidden`}
            >
              <div className="relative z-10">
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-400 group-hover:rotate-90 transition-all duration-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 group-hover:-rotate-12 transition-all duration-500" />
                )}
              </div>
              <div className={`absolute inset-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-yellow-400/0 to-orange-400/0 group-hover:from-yellow-400/10 group-hover:to-orange-400/10' 
                  : 'bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10'
              } transition-all duration-300`}></div>
            </button>

            {/* Login Button */}
            <button 
              onClick={navigateToLogin} 
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 group overflow-hidden shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
              <LogIn className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Login</span>
              <Sparkles className="w-3 h-3 relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden p-3 rounded-xl ${
              isDarkMode 
                ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30' 
                : 'bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200/30'
            } transition-all duration-300 group`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className={`w-5 h-5 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                } group-hover:rotate-90 transition-all duration-300`} />
              ) : (
                <Menu className={`w-5 h-5 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                } group-hover:scale-110 transition-all duration-300`} />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className={`absolute bottom-0 left-0 right-0 h-px ${
        isDarkMode 
          ? 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent' 
          : 'bg-gradient-to-r from-transparent via-slate-300/50 to-transparent'
      }`}></div>
    </nav>
  );
};

export default NavBar;
