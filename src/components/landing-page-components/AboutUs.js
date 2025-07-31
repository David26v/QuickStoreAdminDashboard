'use client';
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  Heart, 
  Lightbulb, 
  Shield, 
  Globe,
  Briefcase,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Mail,
  Phone,
  Rocket,
  Zap,
  Coffee,
  Sparkles
} from 'lucide-react';

const AboutUsSection = ({ isDarkMode = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const values = [
    {
      icon: Rocket,
      title: "Move Fast",
      description: "We believe in rapid iteration and quick deployment to get features into users' hands faster."
    },
    {
      icon: Heart,
      title: "User-Obsessed",
      description: "Every decision we make starts with 'How does this help our users work better?'"
    },
    {
      icon: Lightbulb,
      title: "Think Different",
      description: "We challenge conventional work management approaches to create something truly innovative."
    },
    {
      icon: Zap,
      title: "Stay Hungry",
      description: "We're always learning, always improving, and never satisfied with 'good enough'."
    }
  ];

  const founders = [
    {
      name: "David Fajardo",
      role: "Full-Stack Software Developer & UI/UX Designer",
      description: "A passionate developer from Caloocan City, Philippines, with experience from warehouse operations to enterprise software development. Currently working at Rooche Digital, building scalable solutions with modern technologies.",
      image: "👨‍💻",
      quote: "Great software should solve problems, not create them.",
      location: "Caloocan City, Philippines 🇵🇭",
      skills: ["Next.js & React.js", "Laravel & Node.js", "UI/UX Design", "MongoDB & PostgreSQL", "Docker & CI/CD"]
    }
  ];

  const timeline = [
    {
      year: "2022",
      title: "The Beginning",
      description: "Started my career working in various roles including warehouse operations at EverBilena Cosmetics, learning the importance of efficient processes and organization."
    },
    {
      year: "2023",
      title: "Tech Transformation",
      description: "Completed Full-Stack Web Development bootcamp at KodeGo and transitioned into software development. Started working at Startek and Teleperformance, gaining customer service experience while building my first web applications."
    },
    {
      year: "2023-2025",
      title: "Professional Growth",
      description: "Joined Jeonsoft Corporation as a Software Developer, working with React.js, Ruby on Rails, and modern databases. Built scalable applications while mastering UI/UX design principles."
    },
    {
      year: "2025",
      title: "Current Journey",
      description: "Now working as a Software Engineer at Rooche Digital, building enterprise solutions with Next.js, Laravel, and cutting-edge technologies. Developing Zentryx - my vision for simplified workforce management."
    }
  ];

  return (
    <section
      id="about"
      className="py-20 relative overflow-hidden transition-all duration-500"
    >

     

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            About Our{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mission
            </span>
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            I&apos;m David Fajardo, a developer from the Philippines who got tired of overly complex workforce management tools. 
            So I built something better – a simple, powerful solution that actually gets out of your way 
            and lets you focus on what matters most.
          </p>

        </div>

        {/* Our Story Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h3 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            My Story
          </h3>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Every great solution starts with a real problem. Mine started with a simple question: 
            &quot;Why is managing workforce so complicated when it should be simple?&quot;
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16 max-w-6xl mx-auto">
          <div>
            <h4 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              The Problem I&apos;m Solving
            </h4>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              From working in warehouses to customer service, then transitioning into software development, 
              I&apos;ve experienced firsthand how businesses struggle with workforce management. Complex tools, 
              multiple spreadsheets, and manual processes that consume more time than the actual work.
            </p>
            <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Through my journey at companies like Jeonsoft Corporation and Rooche Digital, building enterprise 
              applications with Next.js, Laravel, and modern tech stacks, I realized there was a gap – 
              powerful workforce management tools that are actually simple to use.
            </p>

          </div>
          <div className={`p-8 rounded-xl backdrop-blur-sm border ${
            isDarkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/30 border-white/50'
          }`}>
            <div className="text-6xl mb-4">🚀</div>
            <h5 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              My Mission
            </h5>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              To empower small businesses with enterprise-level workforce management tools that are 
              simple enough for anyone to use, yet powerful enough to grow with their business.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            What I Believe
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/30 border-white/50'
                }`}
              >
                <value.icon className="w-8 h-8 mb-4 text-blue-500" />
                <h4 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {value.title}
                </h4>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Meet the Founder
          </h3>
          
          <div className="flex justify-center">
            {founders.map((founder, index) => (
              <div
                key={index}
                className={`p-8 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 max-w-md ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/30 border-white/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{founder.image}</div>
                  <h4 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {founder.name}
                  </h4>
                  <p className="text-blue-500 font-medium mb-2">{founder.role}</p>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    📍 {founder.location}
                  </p>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {founder.description}
                  </p>
                  
                  {/* Skills */}
                  <div className="mb-4">
                    <h5 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Skills & Expertise
                    </h5>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {founder.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-blue-500/20 text-blue-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'}`}>
                    <p className={`text-sm italic ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      &quot;{founder.quote}&quot;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            My Journey
          </h3>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`flex items-start space-x-6 p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-white/30 border-white/50'
                }`}
              >
                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xs ${
                  index === timeline.length - 1 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : isDarkMode 
                      ? 'bg-slate-700 text-white' 
                      : 'bg-white text-slate-900'
                }`}>
                  {item.year}
                </div>
                <div className="flex-1">
                  <h4 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;