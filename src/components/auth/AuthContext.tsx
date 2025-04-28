
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in:", currentSession?.user?.email);
          toast({
            title: "Signed in",
            description: "Welcome back!",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Got existing session:", currentSession?.user?.email || "No session");
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth listener subscription");
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    console.log("Signing out...");
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
