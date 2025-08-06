"use client";

import supabase from "@/lib/helper";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user authentication data
  useEffect(() => {
    const fetchSupabaseUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        if (!data?.user) {
          setLoading(false);
          return;
        }

        const { id, user_metadata } = data.user;
        setUserId(id);
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          setUser(session.user);
        } else {
          setUserId(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Cleanup listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch client ID when userId changes
  useEffect(() => {
    if (!userId) {
      setClientId(null);
      return;
    }

    const fetchClientId = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('client_id')
          .eq('id', userId)
          .single(); // Use .single() for one record

        if (error) throw error;
        setClientId(data?.client_id || null);
      } catch (error) {
        console.error("Error fetching client ID:", error.message);
        setClientId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClientId();
  }, [userId]); // Dependency on userId

  return (
    <UserContext.Provider value={{ userId, user, loading, clientId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};