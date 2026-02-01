import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import WelcomeScreen from "./pages/WelcomeScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import FocusScreen from "./pages/FocusScreen";
import CompletionScreen from "./pages/CompletionScreen";
import HomeScreen from "./pages/HomeScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isFirstTime } = useApp();
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={isFirstTime ? <WelcomeScreen /> : <HomeScreen />} 
      />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/focus" element={<FocusScreen />} />
      <Route path="/complete" element={<CompletionScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
