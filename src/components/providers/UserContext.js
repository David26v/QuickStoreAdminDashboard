"use client";

import supabase from "@/lib/helper";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupabaseUser = async () => {
      const { data, error } = await supabase.auth.getUser();

 
   

      const { id, user_metadata } = data.user;

      setUserId(id);
      setUser(data.user);
      setLoading(false);
    };

    fetchSupabaseUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, user, loading  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
