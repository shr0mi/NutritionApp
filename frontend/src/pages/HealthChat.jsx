import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function HealthChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    
    // 1. Add user message to history
    const newUserMessage = { role: 'user', parts: [userMsg] };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // 2. Call FastAPI backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages, // Sends all previous messages for context
          message: userMsg   // The current message
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      // 3. Add Gemini's response to history
      const modelMessage = { role: 'model', parts: [data.response] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      // Optional: Add an error message to the chat UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-black p-4 font-sans">
      <Card className="w-full max-w-2xl h-[650px] flex flex-col shadow-2xl border-slate-200 overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-amber-50">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            Nutrition Guide
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0 bg-slate-50/50 dark:bg-transparent">
          <ScrollArea className="h-full p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-2">
                  <Bot size={40} strokeWidth={1} />
                  <p>Hello! Ask me about calories, recipes, or meal plans.</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8 border shadow-sm">
                      <AvatarFallback className={m.role === 'user' ? 'bg-primary text-white' : 'bg-white text-slate-600'}>
                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      {m.parts[0]}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start items-center gap-3 text-slate-400 animate-pulse">
                  <div className="bg-white border p-2 rounded-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <span className="text-xs font-medium">Analyzing nutrition data...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t bg-white dark:bg-transparent">
          <form onSubmit={handleSend} className="flex w-full gap-3">
            <Input 
              placeholder="Ask about your lunch..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-primary h-11"
            />
            <Button 
              type="submit" 
              className="h-11 px-6 shadow-md dark:shadow-white/10 hover:shadow-lg transition-all"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}