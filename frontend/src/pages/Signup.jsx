import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();                    // Stops page from reloading
    setError("");
    setIsLoading(true);
    
    // Get values from the form
    const formData = new FormData(e.target);
    const data = {
      // Match FastAPI schema
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    
    try{
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // tells fastapi this is json
        },
        body: JSON.stringify(data), // convert object to JSON
      });

      // If error occurs
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create account");
      }

      // Success
      const result = await response.json();
      navigate("/login");
    }catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.message);                        // show error to user
    } finally {
      setIsLoading(false);                          // re-enable button
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background py-12'>
      <Card className="w-full max-w-md mx-auto">
        
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Accout</CardTitle>
        </CardHeader>

        <CardDescription className="text-center -mt-2">
          Enter your details below to sign up
        </CardDescription>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="johndoe"
                required
              />
            </div>

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
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}