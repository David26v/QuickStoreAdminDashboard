'use client';

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import supabase from "@/lib/helper";
import AdminSidebar from "@/components/ui/AdminSidebar;";
import QuickStoreLoading from "@/components/ui/QuickStoreLoading";

export default function AdminLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser ]= useState(null);

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
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
    return <QuickStoreLoading message="Loading Dashboard Please wait...."/>
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 border-2 bg-gray-100 ${
          openSidebar ? "w-[270px]" : "w-[90px]"
        }`}
      >
        <AdminSidebar isOpen={openSidebar} role={role} />
      </div>

      {/* Main Layout */}
      <div
        className={`flex-1 transition-all duration-300 ${
          openSidebar ? "ml-[270px]" : "ml-[90px]"
        }`}
      >
        <Navbar openSideBar={handleToggleSidebar} user = {user}/>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
