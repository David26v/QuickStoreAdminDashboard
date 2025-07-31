'use client';
import React from 'react';
import { Rocket, PlayCircle, Sparkles } from 'lucide-react';
import ZentryxLogo from './ZentrixLogo';

const HeroSection = ({ isDarkMode, handleGetStarted, stats }) => {
  return (
    <section className="relative pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <ZentryxLogo size="lg" />
          </div>

          {/* Tagline */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-white/50 text-slate-700'
              } backdrop-blur-sm`}
            >
              <Sparkles className="w-4 h-4 mr-1 text-blue-500" />
              Built by a Solo Founder for Small Teams
            </span>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Workforce Management{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Without the Overhead
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-lg md:text-xl mb-4 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            } max-w-3xl mx-auto`}
          >
            Zentryx is a lightweight, modern solution for managing time, attendance, and HR—
            thoughtfully built by a solo founder to help small businesses and startups work smarter,
            not harder.
          </p>

          {/* Early Access Note */}
          <p className={`text-sm italic mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Zentryx is currently in early access — built from the ground up by a solo founder.
            Your feedback helps shape the future. Thank you for being part of the journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Rocket className="w-5 h-5" />
              <span>Get Started Free</span>
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-bold ${
                isDarkMode
                  ? 'bg-slate-800/50 hover:bg-slate-700/50 text-white'
                  : 'bg-white/50 hover:bg-white/70 text-slate-900'
              } backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2`}
            >
              <PlayCircle className="w-5 h-5" />
              <span>See How It Works</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <StatCounter key={index} stat={stat} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCounter = ({ stat, isDarkMode }) => (
  <div
    className={`text-center p-4 rounded-xl ${
      isDarkMode ? 'bg-slate-800/30' : 'bg-white/30'
    } backdrop-blur-sm transition-all duration-300`}
  >
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
      <stat.icon className="w-5 h-5 text-white" />
    </div>
    <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      {stat.number}
    </div>
    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
      {stat.label}
    </div>
  </div>
);

export default HeroSection;
