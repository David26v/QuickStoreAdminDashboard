'use client'
import React, { useState } from 'react';
import { X, Shield, FileText, Eye, Lock, Database, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const PrivacyTermsModal = ({ isOpen, onClose, type = 'admin' }) => {
  const [activeTab, setActiveTab] = useState('privacy');

  if (!isOpen) return null;

  const isAdmin = type === 'admin';
  const organizationType = isAdmin ? 'Administrator' : 'Client Organization';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${isAdmin ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-lg flex items-center justify-center`}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Privacy Policy & Terms of Service</h2>
              <p className="text-sm text-slate-400">QuickStore Philippines - {organizationType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'privacy'
                ? `text-white ${isAdmin ? 'border-b-2 border-orange-500 bg-orange-500/10' : 'border-b-2 border-blue-500 bg-blue-500/10'}`
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'terms'
                ? `text-white ${isAdmin ? 'border-b-2 border-orange-500 bg-orange-500/10' : 'border-b-2 border-blue-500 bg-blue-500/10'}`
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'privacy' ? (
            <div className="space-y-6">
              {/* Privacy Policy Content */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Privacy Policy</h3>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  Effective Date: <span className="font-medium">January 1, 2025</span>
                </p>

                <div className="space-y-4">
                  <section>
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <Database className="h-4 w-4 text-green-400" />
                      <span>Information We Collect</span>
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-6">
                      <p>We collect the following types of information:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Account Information:</strong> Name, email address, username, and contact details</li>
                        {!isAdmin && (
                          <li><strong>Organization Data:</strong> Company name, location, contact person, and business information</li>
                        )}
                        <li><strong>Authentication Data:</strong> Encrypted passwords and security credentials</li>
                        <li><strong>Usage Information:</strong> System access logs, feature usage, and performance data</li>
                        <li><strong>Biometric Data:</strong> Face templates, card UIDs, and access codes (when applicable)</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span>How We Use Your Information</span>
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-6">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Provide and maintain QuickStore locker management services</li>
                        <li>Authenticate users and secure system access</li>
                        <li>Monitor system performance and security</li>
                        <li>Send important service notifications and updates</li>
                        <li>Comply with legal and regulatory requirements</li>
                        <li>Improve our services and develop new features</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-yellow-400" />
                      <span>Data Security</span>
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-6">
                      <p>We implement industry-standard security measures:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>End-to-end encryption for all sensitive data</li>
                        <li>Secure cloud infrastructure with regular backups</li>
                        <li>Multi-factor authentication and access controls</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>Compliance with Philippine data protection laws</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span>Data Sharing</span>
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-6">
                      <p>We do not sell your personal information. We may share data only in these limited circumstances:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>With your explicit consent</li>
                        <li>To comply with legal obligations</li>
                        <li>With trusted service providers under strict confidentiality agreements</li>
                        <li>To protect the rights and safety of our users</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2">Your Rights</h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-6">
                      <p>Under Philippine law, you have the right to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate information</li>
                        <li>Request data deletion (subject to legal requirements)</li>
                        <li>Data portability</li>
                        <li>Withdraw consent where applicable</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Terms of Service Content */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Terms of Service</h3>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  Effective Date: <span className="font-medium">January 1, 2025</span>
                </p>

                <div className="space-y-4">
                  <section>
                    <h4 className="font-semibold text-white mb-2">1. Acceptance of Terms</h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-4">
                      <p>
                        By creating an account and using QuickStore Philippines services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2">2. Service Description</h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-4">
                      <p>QuickStore Philippines provides smart locker management solutions including:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Digital locker access and management</li>
                        <li>User authentication and authorization systems</li>
                        <li>Real-time monitoring and reporting</li>
                        <li>{isAdmin ? 'Administrative controls and system management' : 'Client dashboard and user management tools'}</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>3. {isAdmin ? 'Administrator' : 'Client'} Responsibilities</span>
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-6">
                      <p>As a {organizationType.toLowerCase()}, you agree to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the confidentiality of your account credentials</li>
                        <li>Use the service only for authorized purposes</li>
                        <li>Comply with all applicable laws and regulations</li>
                        {isAdmin ? (
                          <>
                            <li>Properly manage system settings and user access</li>
                            <li>Monitor system usage and security</li>
                            <li>Maintain appropriate administrative oversight</li>
                          </>
                        ) : (
                          <>
                            <li>Supervise your organization's users and their access</li>
                            <li>Report any security concerns or system issues</li>
                            <li>Ensure your users comply with these terms</li>
                          </>
                        )}
                        <li>Notify us immediately of any unauthorized access</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span>4. Prohibited Uses</span>
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-6">
                      <p>You may not use our service to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Violate any laws or regulations</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Interfere with or disrupt service operations</li>
                        <li>Share access credentials with unauthorized parties</li>
                        <li>Use the service for commercial purposes outside your agreement</li>
                        <li>Reverse engineer or attempt to extract source code</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2">5. Service Availability</h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-4">
                      <p>
                        We strive to maintain high service availability but cannot guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue services with reasonable notice.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2">6. Limitation of Liability</h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-4">
                      <p>
                        QuickStore Philippines shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services, except as required by applicable law.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2">7. Termination</h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-4">
                      <p>
                        Either party may terminate this agreement with 30 days written notice. We may immediately terminate accounts that violate these terms or pose security risks.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-semibold text-white mb-2">8. Governing Law</h4>
                    <div className="text-slate-300 text-sm space-y-2 pl-4">
                      <p>
                        These terms are governed by the laws of the Republic of the Philippines. Any disputes shall be resolved in Philippine courts.
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700/50 bg-slate-900/50">
          <div className="text-sm text-slate-400">
            Last updated: January 1, 2025
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-2 ${isAdmin ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'} text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>I Understand</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTermsModal;