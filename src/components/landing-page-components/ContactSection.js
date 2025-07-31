'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = ({ isDarkMode }) => {
  return (
    <section id="contact" className="py-24 px-4 max-w-6xl mx-auto">
      <h2
        className={`text-4xl font-bold mb-12 text-center ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}
      >
        Contact Us
      </h2>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="text-blue-500 mt-1" />
            <div>
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                support@zentryx.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="text-blue-500 mt-1" />
            <div>
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Phone</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Available upon request
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-blue-500 mt-1" />
            <div>
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Location</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                We&apos;re fully remote and proudly serving clients across the Philippines.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="space-y-6 relative z-50">
          <div>
            <label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} block mb-2 text-sm`}>
              Your Name
            </label>
            <input
              type="text"
              autoComplete="off"
              className={`w-full px-4 py-3 rounded-lg border outline-none ${
                isDarkMode
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-white text-slate-900 border-slate-300'
              }`}
            />
          </div>
          <div>
            <label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} block mb-2 text-sm`}>
              Email Address
            </label>
            <input
              type="email"
              autoComplete="off"
              className={`w-full px-4 py-3 rounded-lg border outline-none ${
                isDarkMode
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-white text-slate-900 border-slate-300'
              }`}
            />
          </div>
          <div>
            <label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} block mb-2 text-sm`}>
              Message
            </label>
            <textarea
              rows="4"
              autoComplete="off"
              className={`w-full px-4 py-3 rounded-lg border outline-none ${
                isDarkMode
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-white text-slate-900 border-slate-300'
              }`}
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
