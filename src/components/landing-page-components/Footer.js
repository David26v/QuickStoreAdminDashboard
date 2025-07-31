'use client';
import React from 'react';
import ZentryxLogo from './ZentrixLogo';
import { useTheme } from '../providers/themeProvider';
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube, 
  Mail, 
  Star, 
  Shield,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const { isDarkMode } = useTheme();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Integrations', href: '#integrations' },
      { name: 'Mobile App', href: '#mobile' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Contact', href: '#contact' }
    ],
    resources: [
      { name: 'Help Center', href: '#help' },
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Status', href: '#status' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: '#twitter', icon: Twitter, color: 'text-blue-400' },
    { name: 'LinkedIn', href: '#linkedin', icon: Linkedin, color: 'text-blue-600' },
    { name: 'Facebook', href: '#facebook', icon: Facebook, color: 'text-blue-500' },
    { name: 'YouTube', href: '#youtube', icon: Youtube, color: 'text-red-500' }
  ];

  return (
    <footer className={`py-12 px-4 ${isDarkMode ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-sm border-t ${isDarkMode ? 'border-slate-700/30' : 'border-white/30'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ZentryxLogo size="sm" />
              <div>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Zentryx</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Workforce Management for Small Business</p>
              </div>
            </div>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-sm`}>
              Streamline your workforce management with our comprehensive solution designed specifically for small businesses. Track time, manage schedules, and optimize productivity.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`${social.color} hover:opacity-70 transition-all duration-200 hover:scale-110`}
                    aria-label={social.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm hover:opacity-70 transition-opacity ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm hover:opacity-70 transition-opacity ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm hover:opacity-70 transition-opacity ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm hover:opacity-70 transition-opacity ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className={`border-t border-b py-8 mb-8 ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200/30'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stay updated</h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Get the latest updates on new features and workforce management tips.
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-10 pr-3 py-2 rounded-md text-sm border ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1">
                <span>Subscribe</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className={`text-sm mb-4 md:mb-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            © 2024 Zentryx. All rights reserved. Built for small businesses.
          </div>
          <div className="flex space-x-6 text-sm">
            <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Star className="text-yellow-500" size={16} />
              <span>Trusted by 500+ small businesses</span>
            </span>
            <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Shield className="text-green-500" size={16} />
              <span>SOC 2 Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;