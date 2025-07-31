'use client';

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/AdminSidebar;";
import supabase from "@/lib/helper";
import FloatingEmployeeSidebar from "@/components/ui/FloatingEmployeeSidebar";
import EmployeeNavbar from "@/components/ui/EmployeeNavbar";

export default function AdminLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFloatingSidebarOpen, setIsFloatingSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const handleToggleFloatingSidebar = () => {
    setIsFloatingSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
  
        if (userError || !user) {
          console.error("User not authenticated", userError);
          setLoading(false);
          return;
        }
  
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("avatar, first_name, last_name, email, role") 
          .eq("id", user.id)
          .single();
  
        if (profileError) {
          console.error("Failed to fetch user profile:", profileError.message);
        } else {
          setUser(profile); 
          setRole(profile.role || "user"); 
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);
  
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // For employees, we'll use the floating sidebar instead of the regular sidebar
  const isEmployee = role === "employee";

  return (
    <div className="flex">
      {/* Regular sidebar for admins */}
      {!isEmployee && (
        <div
          className={`fixed top-0 left-0 h-full transition-all duration-300 border-r border-gray-200 bg-gray-50 dark:bg-gray-900 ${
            openSidebar ? "w-[270px]" : "w-[90px]"
          }`}
        >
          <Sidebar isOpen={openSidebar} role={role} />
        </div>
      )}

      {/* Main Layout */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isEmployee ? (openSidebar ? "ml-[270px]" : "ml-[90px]") : "ml-0"
        }`}
      >
        {/* Use employee navbar for employees, regular navbar for admins */}
        {isEmployee ? (
          <EmployeeNavbar 
            user={user} 
            onMenuToggle={handleToggleFloatingSidebar} 
          />
        ) : (
          <Navbar openSideBar={handleToggleSidebar} user={user} />
        )}
        
        <main className="p-4 relative min-h-[calc(100vh-70px)] bg-gray-50/30 dark:bg-gray-900/30">
          {children}
          
          {/* Floating sidebar for employees - positioned on the content */}
          {isEmployee && (
            <FloatingEmployeeSidebar 
              role={role} 
              isOpen={isFloatingSidebarOpen}
              onClose={() => setIsFloatingSidebarOpen(false)}
              showCloseButton={true}
              appMode={false}
              appModeStyle="windows"
            />
          )}
        </main>
      </div>
    </div>
  );
}