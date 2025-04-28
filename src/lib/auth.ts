
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// Helper function to get the current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return data.session;
}

// Helper function to get the current user
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
    
    console.log("Sign-in successful for:", email);
    return data;
  } catch (error: any) {
    console.error("Error during sign in:", error.message);
    throw error;
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, userData: Record<string, any> = {}) {
  console.log("Attempting to sign up with email:", email);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
    
    console.log("Sign-up successful for:", email, "Email verification required:", !data.session);
    return data;
  } catch (error: any) {
    console.error("Error during sign up:", error.message);
    throw error;
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
    console.log("Sign-out successful");
  } catch (error: any) {
    console.error("Error during sign out:", error.message);
    throw error;
  }
}
