import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, RefreshCcw, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function CalorieCalc() {
  const [image, setImage] = useState(null); // Preview URL
  const [rawFile, setRawFile] = useState(null); // Actual File object
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { token } = useAuth();

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setRawFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleCalculate = async () => {
    if (!rawFile) return;
    if (!token) {
      setError("No authentication token found. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', rawFile);

    try {
      // Replace '/analyze-food' with your full URL if necessary (e.g., http://localhost:8000/analyze-food)
      const response = await fetch('http://127.0.0.1:8000/analyze-food', {
        method: 'POST',
        // If you use Auth tokens, add them here:
        // headers: { 'Authorization': `Bearer ${token}` }
        headers: {
        'Authorization': `Bearer ${token}`,
      },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze food');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // State: Error View
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive text-center p-6 bg-destructive/10 rounded-lg">
          <p className="font-bold">Oops! Something went wrong</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  // State: Success View
  if (result) {
    return (
      <div className="w-full max-w-md mx-auto mt-12 animate-in fade-in zoom-in duration-300">
        <Card className="border-green-500/50 shadow-xl shadow-green-500/10 ml-5 mr-5">
          <CardHeader className="text-center border-b pb-4">
            <CardTitle className="text-2xl font-bold italic">Nutritional Breakdown</CardTitle>
            <p className="text-muted-foreground capitalize">{result.items}</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="font-medium">Carbohydrates</span>
                <span className="font-mono text-green-600 dark:text-green-400 font-bold">{result.carbohydrate} kcal</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                {/* Note: Backend requested 'protien' typo handling */}
                <span className="font-medium">Protein</span>
                <span className="font-mono text-green-600 dark:text-green-400 font-bold">{result.protein || result.protien} kcal</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="font-medium">Fat</span>
                <span className="font-mono text-green-600 dark:text-green-400 font-bold">{result.fat} kcal</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="font-medium">Total</span>
                <span className="font-mono text-green-600 dark:text-green-400 font-bold">{result.fat + (result.protein || result.protien) + result.carbohydrate} kcal</span>
              </li>
            </ul>
            <Button onClick={() => window.location.reload()} className="w-full mt-6 dark:bg-white dark:text-black dark:hover:bg-gray-200" variant="ghost">
              Scan Another Meal
            </Button>
            <Button 
            disabled={loading}
            className="text-2xl w-full p-6 mt-4 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-500 shadow-lg"
            >
              Log Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State: Initial Upload View
  return (
    <div className='flex flex-col gap-6 items-center w-full max-w-2xl mx-auto p-4'>
      <div className='hero mt-12'>
        <h1 className='text-4xl font-semibold italic text-center'>
          See Your Nutrition In <span className='dark:text-green-400 text-green-600'>High Definition</span>
        </h1>
      </div>

      <div className="w-full">
        <Card 
          className={`relative border-2 border-dashed transition-all duration-200 
            ${!image ? "border-muted-foreground/25 hover:border-green-500/50" : "border-green-500/50"}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
            {!image ? (
              <>
                <div className="p-4 rounded-full bg-secondary">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Drag and drop your meal photo</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG or WebP</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => handleFile(e.target.files[0])}
                  accept="image/*"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Select Image
                </Button>
              </>
            ) : (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={() => { setImage(null); setRawFile(null); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {image && (
        <Button 
          onClick={handleCalculate}
          disabled={loading}
          className="text-2xl p-8 mt-4 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-500 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Flame className="mr-2 h-6 w-6" />
              Calculate Calories
            </>
          )}
        </Button>
      )}
    </div>
  );
}