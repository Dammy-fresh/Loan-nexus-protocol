
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BorrowerAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save borrower session data
      const borrowerData = {
        email,
        role: "borrower",
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("borrowerAuth", JSON.stringify(borrowerData));
      console.log("Borrower authenticated:", borrowerData);
      
      toast({
        title: isSignUp ? "Account Created" : "Login Successful",
        description: `Welcome ${isSignUp ? "to DeLoan" : "back"}!`,
      });
      
      // Redirect to borrower dashboard
      navigate("/borrower-dashboard");
      
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-white hover:text-purple-200 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Borrower Portal</CardTitle>
            <p className="text-purple-200">{isSignUp ? "Create your account" : "Sign in to your account"}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex border border-white/20 rounded-lg p-1">
              <Button
                variant={!isSignUp ? "default" : "ghost"}
                className={`flex-1 ${!isSignUp ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </Button>
              <Button
                variant={isSignUp ? "default" : "ghost"}
                className={`flex-1 ${isSignUp ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-purple-300 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-3"
              >
                {isLoading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
              </Button>
            </form>

            {!isSignUp && (
              <div className="text-center">
                <Link to="#" className="text-purple-300 hover:text-white text-sm">
                  Forgot your password?
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorrowerAuth;
