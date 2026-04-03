import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // Convert to form-urlencoded (required by your FastAPI OAuth2 endpoint)
    const body = new URLSearchParams();
    body.append("username", email);     // ← backend uses username = email
    body.append("password", password);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);

      login(data.access_token, data.user_id);           // ← save JWT token
      navigate("/");                      // redirect to home (change if you have dashboard)
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background py-12'>
      <Card className="w-full max-w-md mx-auto">
        
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
        </CardHeader>

        <CardDescription className="text-center -mt-2">
          Login to your existing account
        </CardDescription>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Msg */}
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-200 dark:bg-red-900 p-2 rounded-md">{error}</p>
            )}

            {/* Sign Up Button */}
            <Button type="submit" className="w-full text-lg p-5" disabled={isLoading}>
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}