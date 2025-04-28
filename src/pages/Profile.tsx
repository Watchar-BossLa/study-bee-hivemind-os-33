
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/components/auth/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
  const { profile, isLoading, updateProfile } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when profile data loads
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        full_name: fullName,
        bio,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account information and settings</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                  <CardDescription>Your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile?.avatar_url} alt={fullName} />
                    <AvatarFallback className="text-3xl">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <Button disabled={true}>Upload New</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
              <CardDescription>Your progress and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background border rounded-lg p-4 shadow-sm">
                  <p className="text-muted-foreground text-sm">Courses Enrolled</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="bg-background border rounded-lg p-4 shadow-sm">
                  <p className="text-muted-foreground text-sm">Hours Studied</p>
                  <p className="text-2xl font-bold">24.5</p>
                </div>
                <div className="bg-background border rounded-lg p-4 shadow-sm">
                  <p className="text-muted-foreground text-sm">Achievements</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
