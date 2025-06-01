
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { AuthErrorHandler } from './AuthErrorHandler';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function AuthForm() {
  const { signUp, signIn, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // Form data
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '' 
  });
  const [resetEmail, setResetEmail] = useState('');

  const {
    validationErrors,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateFullName,
    setFieldError,
    clearFieldError,
    clearAllErrors
  } = useAuthValidation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    clearAllErrors();

    // Validate inputs
    const emailValidation = validateEmail(signInData.email);
    const passwordValidation = validatePassword(signInData.password);

    if (!emailValidation.isValid) {
      setFieldError('signInEmail', emailValidation.error);
    }
    
    if (!passwordValidation.isValid) {
      setFieldError('signInPassword', passwordValidation.error);
    }

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        setAuthError(error);
      }
    } catch (error) {
      setAuthError({ message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    clearAllErrors();

    // Validate inputs
    const emailValidation = validateEmail(signUpData.email);
    const passwordValidation = validatePassword(signUpData.password);
    const confirmPasswordValidation = validateConfirmPassword(signUpData.password, signUpData.confirmPassword);
    const fullNameValidation = validateFullName(signUpData.fullName);

    if (!emailValidation.isValid) {
      setFieldError('signUpEmail', emailValidation.error);
    }
    
    if (!passwordValidation.isValid) {
      setFieldError('signUpPassword', passwordValidation.error);
    }
    
    if (!confirmPasswordValidation.isValid) {
      setFieldError('confirmPassword', confirmPasswordValidation.error);
    }
    
    if (!fullNameValidation.isValid) {
      setFieldError('fullName', fullNameValidation.error);
    }

    if (!emailValidation.isValid || !passwordValidation.isValid || 
        !confirmPasswordValidation.isValid || !fullNameValidation.isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
      
      if (error) {
        setAuthError(error);
      } else {
        // Success - user will be redirected by AuthContext
        setSignUpData({ email: '', password: '', confirmPassword: '', fullName: '' });
      }
    } catch (error) {
      setAuthError({ message: 'An unexpected error occurred during registration' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const emailValidation = validateEmail(resetEmail);
    if (!emailValidation.isValid) {
      setFieldError('resetEmail', emailValidation.error);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        setAuthError(error);
      } else {
        setResetEmailSent(true);
        setResetEmail('');
      }
    } catch (error) {
      setAuthError({ message: 'Failed to send password reset email' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🐝 Study Bee</CardTitle>
          <CardDescription>
            Your AI-powered learning companion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthErrorHandler 
            error={authError} 
            onRetry={() => setAuthError(null)}
            onClearError={() => setAuthError(null)}
          />

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) => {
                      setSignInData(prev => ({ ...prev, email: e.target.value }));
                      clearFieldError('signInEmail');
                    }}
                    className={validationErrors.signInEmail ? 'border-red-500' : ''}
                  />
                  {validationErrors.signInEmail && (
                    <p className="text-sm text-red-500">{validationErrors.signInEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => {
                        setSignInData(prev => ({ ...prev, password: e.target.value }));
                        clearFieldError('signInPassword');
                      }}
                      className={validationErrors.signInPassword ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {validationErrors.signInPassword && (
                    <p className="text-sm text-red-500">{validationErrors.signInPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center">
                  <TabsTrigger 
                    value="reset" 
                    className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    Forgot your password?
                  </TabsTrigger>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpData.fullName}
                    onChange={(e) => {
                      setSignUpData(prev => ({ ...prev, fullName: e.target.value }));
                      clearFieldError('fullName');
                    }}
                    className={validationErrors.fullName ? 'border-red-500' : ''}
                  />
                  {validationErrors.fullName && (
                    <p className="text-sm text-red-500">{validationErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) => {
                      setSignUpData(prev => ({ ...prev, email: e.target.value }));
                      clearFieldError('signUpEmail');
                    }}
                    className={validationErrors.signUpEmail ? 'border-red-500' : ''}
                  />
                  {validationErrors.signUpEmail && (
                    <p className="text-sm text-red-500">{validationErrors.signUpEmail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData(prev => ({ ...prev, password: e.target.value }));
                        clearFieldError('signUpPassword');
                      }}
                      className={validationErrors.signUpPassword ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {validationErrors.signUpPassword && (
                    <p className="text-sm text-red-500">{validationErrors.signUpPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => {
                        setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }));
                        clearFieldError('confirmPassword');
                      }}
                      className={validationErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="reset">
              <div className="space-y-4">
                {resetEmailSent ? (
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Check your email</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a password reset link to your email address.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setResetEmailSent(false);
                        setResetEmail('');
                      }}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          clearFieldError('resetEmail');
                        }}
                        className={validationErrors.resetEmail ? 'border-red-500' : ''}
                      />
                      {validationErrors.resetEmail && (
                        <p className="text-sm text-red-500">{validationErrors.resetEmail}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending reset link...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>

                    <div className="text-center">
                      <TabsTrigger 
                        value="signin" 
                        className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        Back to Sign In
                      </TabsTrigger>
                    </div>
                  </form>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
