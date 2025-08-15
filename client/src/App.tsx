import { Switch, Route } from "wouter";
import { useAuthenticationStatus } from '@nhost/react'
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthPage from "@/pages/auth";
import ChatPage from "@/pages/chat";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black relative flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-soft">
            <i className="fas fa-robot text-white text-2xl"></i>
          </div>
          <p className="text-white text-lg font-medium">Connecting to AI...</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Switch>
      {isAuthenticated ? (
        <Route path="/" component={ChatPage} />
      ) : (
        <Route path="/" component={AuthPage} />
      )}
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="chatbot-ui-theme">
          <TooltipProvider>
            <Toaster />
            <AuthenticatedRouter />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
