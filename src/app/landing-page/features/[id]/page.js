'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, CreditCard, Users, FolderOpen, Monitor, Brain, ArrowLeft, CheckCircle, Star } from 'lucide-react';
import NavBar from '@/components/landing-page-components/NavBar';
import Footer from '@/components/landing-page-components/Footer';
import { useTheme } from '@/components/providers/themeProvider';

export default function FeatureDetailPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  


  const featuresData = {
    'time-tracking': {
      icon: Clock,
      title: "Time In/Out System",
      description: "Web-based time tracking with real-time monitoring and automated attendance reports.",
      color: "from-blue-500 to-cyan-500",
      overview: "Complete time tracking solution for modern businesses that eliminates manual timekeeping and ensures accurate attendance records.",
      keyFeatures: [
        "Real-time clock in/out with GPS verification",
        "Automated break time tracking",
        "Overtime calculation and alerts",
        "Mobile app support for remote workers",
        "Integration with payroll systems",
        "Detailed attendance reports and analytics",
        "Facial recognition for secure check-ins",
        "Customizable work schedules and shifts"
      ],
      benefits: [
        "Reduce payroll errors by 95%",
        "Save 10+ hours per week on attendance management",
        "Ensure labor law compliance",
        "Improve employee accountability",
        "Eliminate buddy punching",
        "Generate accurate timesheets automatically"
      ],
      howItWorks: [
        "Employee clocks in using web browser or mobile app",
        "GPS location is verified for remote workers",
        "System automatically tracks work hours and breaks",
        "Overtime alerts notify managers of approaching limits",
        "Data syncs with payroll for seamless processing",
        "Generate comprehensive reports with one click"
      ]
    },
    'payroll': {
      icon: CreditCard,
      title: "Payroll Management",
      description: "Automated payroll processing with tax calculations and direct deposit integration.",
      color: "from-green-500 to-emerald-500",
      overview: "Streamlined payroll processing that handles everything from calculations to payments, ensuring accuracy and compliance.",
      keyFeatures: [
        "Automated salary and wage calculations",
        "Federal and state tax deduction management",
        "Direct deposit and check printing options",
        "Benefits administration and deductions",
        "Compliance reporting and filing",
        "Year-end tax document generation (W-2, 1099)",
        "Multi-state payroll processing",
        "Custom pay periods and schedules"
      ],
      benefits: [
        "Process payroll in under 30 minutes",
        "Eliminate calculation errors completely",
        "Ensure 100% tax compliance",
        "Reduce administrative costs by 60%",
        "Automatic tax filing and payments",
        "Employee self-service pay stubs"
      ],
      howItWorks: [
        "Import time data from attendance system",
        "System calculates gross pay and deductions",
        "Review and approve payroll before processing",
        "Direct deposits are initiated automatically",
        "Tax filings are submitted electronically",
        "Generate and distribute pay stubs digitally"
      ]
    },
    'hr-management': {
      icon: Users,
      title: "HR Management",
      description: "Complete employee records, leave management, and performance tracking system.",
      color: "from-purple-500 to-pink-500",
      overview: "Comprehensive HR solution for managing your entire workforce from hiring to retirement.",
      keyFeatures: [
        "Complete employee database and profiles",
        "Leave and vacation tracking system",
        "Performance review and evaluation tools",
        "Document management and storage",
        "Automated onboarding workflows",
        "Employee self-service portal",
        "Benefits enrollment and management",
        "Compliance tracking and reporting"
      ],
      benefits: [
        "Centralize all employee information",
        "Automate leave approval processes",
        "Track employee performance effectively",
        "Reduce HR administrative tasks by 70%",
        "Ensure compliance with labor laws",
        "Improve employee satisfaction"
      ],
      howItWorks: [
        "Create comprehensive employee profiles",
        "Set up automated workflows for common HR tasks",
        "Employees submit requests through self-service portal",
        "Managers receive notifications for approvals",
        "System tracks all HR metrics and compliance",
        "Generate reports for strategic planning"
      ]
    },
    'project-management': {
      icon: FolderOpen,
      title: "Project Management",
      description: "Task assignment, project tracking, and team collaboration tools for small businesses.",
      color: "from-orange-500 to-red-500",
      overview: "Efficient project management tools designed specifically for small business teams to deliver projects on time and within budget.",
      keyFeatures: [
        "Project timeline and milestone tracking",
        "Task assignment and progress monitoring",
        "Team collaboration workspace",
        "Resource allocation and management",
        "Client communication portal",
        "Project reporting and analytics",
        "Time tracking integration",
        "Budget and expense monitoring"
      ],
      benefits: [
        "Improve project delivery by 40%",
        "Enhance team collaboration",
        "Better resource utilization",
        "Increase client satisfaction",
        "Reduce project overruns",
        "Improve team productivity"
      ],
      howItWorks: [
        "Create project templates and timelines",
        "Assign tasks to team members",
        "Track progress through visual dashboards",
        "Collaborate using built-in communication tools",
        "Monitor budgets and resources in real-time",
        "Generate client reports automatically"
      ]
    },
    'wfh-monitoring': {
      icon: Monitor,
      title: "WFH Monitoring",
      description: "Smart work-from-home tracking with productivity insights and activity monitoring.",
      color: "from-indigo-500 to-blue-500",
      overview: "Advanced remote work monitoring that balances productivity oversight with employee privacy and trust.",
      keyFeatures: [
        "Activity level monitoring and scoring",
        "Application usage tracking and analysis",
        "Optional screenshot capture system",
        "Productivity scoring and benchmarking",
        "Remote desktop support and access",
        "Work-life balance analytics",
        "Focus time measurement",
        "Distraction identification and alerts"
      ],
      benefits: [
        "Maintain productivity while remote",
        "Ensure fair work distribution",
        "Identify productivity patterns",
        "Support employee well-being",
        "Reduce micromanagement needs",
        "Improve work-life balance"
      ],
      howItWorks: [
        "Install lightweight monitoring software",
        "Set productivity goals and benchmarks",
        "Monitor activity levels throughout the day",
        "Generate productivity insights and reports",
        "Provide feedback and coaching opportunities",
        "Adjust workflows based on data insights"
      ]
    },
    'ai-reporting': {
      icon: Brain,
      title: "AI Reporting Assistant",
      description: "Get instant insights and reports with our AI-powered analytics and recommendations.",
      color: "from-violet-500 to-purple-600",
      overview: "Intelligent reporting system that transforms your business data into actionable insights using advanced AI technology.",
      keyFeatures: [
        "Natural language report generation",
        "Predictive analytics and forecasting",
        "Automated anomaly detection",
        "Custom dashboard creation",
        "Voice-activated queries and commands",
        "Integration with all system modules",
        "Real-time data visualization",
        "Automated alert system"
      ],
      benefits: [
        "Get insights in seconds, not hours",
        "Make data-driven decisions confidently",
        "Identify trends and patterns automatically",
        "Save 20+ hours per week on reporting",
        "Predict future business outcomes",
        "Reduce analysis errors"
      ],
      howItWorks: [
        "Connect all your business data sources",
        "Ask questions in plain English",
        "AI analyzes data and generates insights",
        "Receive automated reports and alerts",
        "Visualize data through interactive dashboards",
        "Get recommendations for business improvements"
      ]
    },
    'mobile-integration': {
      icon: Monitor,
      title: "Mobile Integration",
      description: "Seamlessly use features on mobile devices anywhere.",
      color: "from-yellow-500 to-amber-500",
      overview: "Mobile-first design that allows employees and managers to access key features anytime, anywhere — boosting flexibility and productivity.",
      keyFeatures: [
        "Mobile-friendly interface for all modules",
        "Push notifications for important updates",
        "GPS-based check-in/out support",
        "Mobile access to payroll and payslips",
        "Leave requests and approvals on-the-go",
        "Real-time team communication tools",
        "Responsive dashboards and reports",
        "Offline access with auto-sync capabilities"
      ],
      benefits: [
        "Empower your team to work from anywhere",
        "Faster response times and approvals",
        "Reduce time spent on admin tasks",
        "Better accessibility for field workers",
        "Boost employee satisfaction",
        "No need for desktop access"
      ],
      howItWorks: [
        "Log in using the mobile app or responsive web portal",
        "Navigate to key modules with intuitive UI",
        "Receive push notifications for updates and requests",
        "Use mobile GPS and camera features for clock-in/out",
        "Manage HR, payroll, and projects while on the move",
        "Sync data automatically when back online"
      ]
    }
    
  };

  const handleNaviationTologin = () => {
    router.push('/login')
  }

  const feature = featuresData[params.id];

  if (!feature) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
        <NavBar
          isDarkMode={isDarkMode}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          toggleDarkMode={toggleDarkMode}
          navigateToLogin={handleNaviationTologin}
        />
        <div className="py-24 px-4 max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Feature Not Found
          </h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Features
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = feature.icon;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      <NavBar
        isDarkMode={isDarkMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="py-24 px-4 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className={`flex items-center gap-2 mb-8 ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
        >
          <ArrowLeft size={20} />
          Back to Features
        </button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
            <IconComponent size={40} className="text-white" />
          </div>
          <h1 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {feature.title}
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} max-w-3xl mx-auto`}>
            {feature.overview}
          </p>
        </div>

        {/* Key Features */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Key Features
            </h2>
            <div className="space-y-4">
              {feature.keyFeatures.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Benefits
            </h2>
            <div className="space-y-4">
              {feature.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Star className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                  <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feature.howItWorks.map((step, index) => (
              <div key={index} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center p-12 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to Get Started?
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Transform your business operations with our {feature.title.toLowerCase()} solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className={`px-8 py-3 rounded-lg bg-gradient-to-r ${feature.color} text-white font-semibold hover:opacity-90 transition-opacity`}
            >
              Start Free Trial
            </button>
            <button
              onClick={() => router.push('/')}
              className={`px-8 py-3 rounded-lg border-2 ${
                isDarkMode 
                  ? 'border-slate-600 text-slate-300 hover:border-slate-500' 
                  : 'border-slate-300 text-slate-600 hover:border-slate-400'
              } transition-colors`}
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}