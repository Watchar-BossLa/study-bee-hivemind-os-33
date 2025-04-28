
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthContext";
import LogoBee from "@/components/LogoBee";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log("Attempting to sign in with:", { email });
      const { user, session, error } = await signInWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      if (!session) {
        throw new Error("No session returned after sign-in");
      }
      
      console.log("Sign in successful, session:", session?.expires_at);
      navigate("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Set a more specific error message
      if (error.message.includes("Invalid login credentials")) {
        setAuthError("Invalid email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setAuthError("Please check your email and confirm your account first.");
      } else {
        setAuthError(error.message || "Failed to sign in. Please try again.");
      }
      
      toast({
        title: "Error signing in",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log("Attempting to sign up with:", { email, fullName });
      const { user, session, error } = await signUpWithEmail(email, password, { full_name: fullName });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created",
        description: "Check your email to verify your account.",
      });
      
      // If email confirmation is required
      if (!session) {
        toast({
          title: "Verification required",
          description: "Please check your email to confirm your account before signing in.",
        });
      } else {
        // If email confirmation is not required, navigate to home
        navigate("/");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Set a more specific error message
      if (error.message.includes("already registered")) {
        setAuthError("This email is already registered. Try signing in instead.");
      } else {
        setAuthError(error.message || "Failed to create account. Please try again.");
      }
      
      toast({
        title: "Error creating account",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <LogoBee className="text-6xl mx-auto" />
          <h1 className="text-3xl font-bold mt-4">Study Bee</h1>
          <p className="text-muted-foreground">The adaptive learning platform</p>
        </div>
        
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">Sign in or create an account to continue</CardDescription>
          </CardHeader>
          
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
