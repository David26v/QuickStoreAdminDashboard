'use client';

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar"; // Make sure the path is correct
import ClientAdminSidebar from '@/components/ui/ClientAdminSidebar'; // Make sure the path is correct
import supabase from "@/lib/helper"; // Make sure the path is correct
import QuickStoreLoading from "@/components/ui/QuickStoreLoading"; // Make sure the path is correct

export default function ClientAdminLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null); 

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true); 

        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !authUser) {
          console.error("User not authenticated", userError);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, avatar, first_name, last_name, email, role, client_id") 
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          console.error("Failed to fetch user profile:", profileError.message);
        } 
        else {
          setUser(profile);
          setRole(profile.role || "user");

          if (profile.client_id) {
            const { data: clientProfile, error: clientError } = await supabase
              .from("clients")
              .select("id, name, avatar_url") 
              .eq("id", profile.client_id) 
              .single();

            if (clientError) {
              console.error('Failed to fetch client information:', clientError.message);
            } 
            else {
              setClient(clientProfile);
            }
          } else {
             console.warn("User profile does not have a client_id associated.");
          }
        }

      } catch (err) {
        console.error("Unexpected error in fetchUserProfile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); 

  if (loading) {
    return <QuickStoreLoading message="Loading Dashboard. Please wait..." />;
  }


  return (
    <div className="flex">

      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 bg-white shadow-lg border-r border-gray-200 z-30 ${
          openSidebar ? "w-[270px]" : "w-[90px]"
        }`}
      >
       
        <ClientAdminSidebar isOpen={openSidebar} role={role} clientData={client} />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${
          openSidebar ? "ml-[270px]" : "ml-[90px]"
        }`}
      >
        <Navbar openSideBar={handleToggleSidebar} user={user} />
        <main className="p-4 bg-gray-50 min-h-screen"> 
          {children}
        </main>
      </div>
    </div>
  );
}