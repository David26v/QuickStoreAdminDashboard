'use client';
import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Star,
  Sparkles,
  Rocket,
  Users,
  BarChart,
  Shield,
  Zap
} from 'lucide-react';

const BillingSection = ({ isDarkMode }) => {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 users',
        'Time tracking',
        'Basic attendance',
        'Shift scheduling',
        'Email support'
      ],
      popular: false,
      icon: Users,
      cta: 'Get Started Free'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 3,
      period: 'user/month',
      description: 'For startups and growing teams',
      features: [
        'Everything in Free',
        'Leave management',
        'Mobile app support',
        'Basic reporting',
        'Priority email support'
      ],
      popular: true,
      icon: BarChart,
      cta: 'Start Free Trial'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 6,
      period: 'user/month',
      description: 'For small businesses',
      features: [
        'Everything in Basic',
        'Payroll export',
        'User roles & permissions',
        'Advanced reports',
        'API access',
        'Phone support'
      ],
      popular: false,
      icon: Shield,
      cta: 'Start Free Trial'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For 100+ users or complex needs',
      features: [
        'Everything in Pro',
        'Custom onboarding',
        'SSO integration',
        'Dedicated support',
        'Custom integrations',
        'Advanced security'
      ],
      popular: false,
      icon: Rocket,
      cta: 'Contact Sales'
    }
  ];


  const handleGetStarted = (planId) => {
    console.log('Selected plan:', planId);
  };

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {/* Tagline */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-white/50 text-slate-700'
              } backdrop-blur-sm`}
            >
              <Sparkles className="w-4 h-4 mr-1 text-blue-500" />
              Simple, Transparent Pricing
            </span>
          </div>

          {/* Title */}
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-lg md:text-xl mb-8 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            } max-w-3xl mx-auto`}
          >
            Start free and scale as you grow. No hidden fees, no long-term contracts.
            Cancel anytime with just one click.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              isDarkMode={isDarkMode}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
              onGetStarted={() => handleGetStarted(plan.id)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className={`text-sm italic mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Start free forever. No credit card required. Upgrade anytime as you grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleGetStarted(selectedPlan)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Rocket className="w-5 h-5" />
              <span>Start Free Today</span>
            </button>
            <button
              className={`px-8 py-4 rounded-xl font-bold ${
                isDarkMode
                  ? 'bg-slate-800/50 hover:bg-slate-700/50 text-white'
                  : 'bg-white/50 hover:bg-white/70 text-slate-900'
              } backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Contact Sales</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const PlanCard = ({ plan, isDarkMode, isSelected, onSelect, onGetStarted }) => (
  <div
    className={`relative p-6 rounded-2xl transition-all duration-300 ${
      plan.popular
        ? 'ring-2 ring-blue-500 transform scale-105'
        : 'hover:scale-105'
    } ${
      isDarkMode ? 'bg-slate-800/30 hover:bg-slate-700/30' : 'bg-white/30 hover:bg-white/50'
    } backdrop-blur-sm cursor-pointer`}
    onClick={onSelect}
  >
    {plan.popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </span>
      </div>
    )}
    
    {/* Plan Icon */}
    <div className="flex justify-center mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <plan.icon className="w-6 h-6 text-white" />
      </div>
    </div>

    {/* Plan Name */}
    <div className="text-center mb-4">
      <h3 className={`text-xl font-bold mb-2 ${
        isDarkMode ? 'text-white' : 'text-slate-900'
      }`}>
        {plan.name}
      </h3>
      <p className={`text-sm ${
        isDarkMode ? 'text-slate-300' : 'text-slate-600'
      }`}>
        {plan.description}
      </p>
    </div>

    {/* Price */}
    <div className="text-center mb-6">
      <div className={`text-4xl font-bold mb-1 ${
        isDarkMode ? 'text-white' : 'text-slate-900'
      }`}>
        {plan.price === 0 ? 'Free' : plan.price === 'Custom' ? 'Custom' : `${plan.price}`}
      </div>
      <div className={`text-sm ${
        isDarkMode ? 'text-slate-400' : 'text-slate-500'
      }`}>
        {plan.price === 0 ? 'forever' : plan.period}
      </div>
    </div>

    {/* Features */}
    <ul className="space-y-3 mb-6">
      {plan.features.map((feature, index) => (
        <li key={index} className={`flex items-center text-sm ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          <Check className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>

    {/* CTA Button */}
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onGetStarted();
      }}
      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
        plan.popular
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          : plan.price === 0
          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
          : isDarkMode
          ? 'bg-slate-700/50 hover:bg-slate-600/50 text-white'
          : 'bg-white/50 hover:bg-white/70 text-slate-900'
      } hover:scale-105 shadow-lg`}
    >
      {plan.cta}
    </button>
  </div>
);

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

export default BillingSection;