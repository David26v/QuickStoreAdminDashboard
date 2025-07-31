"use client";
import React from "react";
import FeatureCard from "@/components/landing-page-components/FeatureCard";
import {
  Clock,
  CreditCard,
  Users,
  FolderOpen,
  Monitor,
  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    id: "time-tracking",
    icon: Clock,
    title: "Time In/Out System",
    description: "Web-based time tracking with real-time monitoring.",
    color: "from-blue-500 to-cyan-500",
    status: null,
  },
  {
    id: "payroll",
    icon: CreditCard,
    title: "Payroll Management",
    description: "Automated payroll with direct deposit.",
    color: "from-green-500 to-emerald-500",
    status: null,
  },
  {
    id: "hr-management",
    icon: Users,
    title: "HR Management",
    description: "Complete employee records and leave tracking.",
    color: "from-purple-500 to-pink-500",
    status: null,
  },
  {
    id: "project-management",
    icon: FolderOpen,
    title: "Project Management",
    description: "Task tracking and team collaboration.",
    color: "from-orange-500 to-red-500",
    status: null,
  },
  {
    id: "mobile-integration",
    icon: Monitor,
    title: "Mobile Integration",
    description: "Seamlessly use features on mobile devices anywhere.",
    color: "from-yellow-500 to-amber-500",
    status: null,
  },
  {
    id: "wfh-monitoring",
    icon: Monitor,
    title: "WFH Monitoring",
    description: "Smart work-from-home tracking.",
    color: "from-indigo-500 to-blue-500",
    status: "in-progress",
  },
  {
    id: "ai-reporting",
    icon: Brain,
    title: "AI Reporting Assistant",
    description: "Get instant insights and reports.",
    color: "from-violet-500 to-purple-600",
    status: null,
  },
  {
    id: "coming-soon-placeholder",
    icon: null,
    title: "More Features Coming Soon",
    description:
      "Stay tuned for even more powerful tools to help your business thrive.",
    color: "from-gray-400 to-gray-500",
    status: "placeholder",
  },
];

export default function FeaturesSection({ isDarkMode }) {
  const router = useRouter();

  const handleFeatureClick = (id) => {
    if (id !== "wfh-monitoring") {
      router.push(`/landing-page/features/${id}`);
    }
  };

  return (
    <section id="features" className="py-24 px-4 max-w-6xl mx-auto">
      <h2
        className={`text-4xl font-bold mb-8 text-center ${
          isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        Features Designed to Help Your Business Grow
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {features.map((feature, index) => (
          <div key={index} className="relative h-full flex">
            {feature.status === "in-progress" && (
              <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                In Progress
              </div>
            )}
            <div
              onClick={() => {
                if (
                  feature.status !== "in-progress" &&
                  feature.status !== "placeholder"
                ) {
                  handleFeatureClick(feature.id);
                }
              }}
              className={`flex-1 ${
                feature.status === "in-progress" ||
                feature.status === "placeholder"
                  ? "cursor-not-allowed opacity-75"
                  : "cursor-pointer"
              }`}
            >
              <FeatureCard feature={feature} isDarkMode={isDarkMode} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
