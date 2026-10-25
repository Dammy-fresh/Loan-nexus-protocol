
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import BorrowerAuth from "./pages/BorrowerAuth";
import LenderAuth from "./pages/LenderAuth";
import LoanApplication from "./pages/LoanApplication";
import BorrowerDashboard from "./pages/BorrowerDashboard";
import LenderDashboard from "./pages/LenderDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/borrower-portal" element={<BorrowerAuth />} />
          <Route path="/lender-portal" element={<LenderAuth />} />
          <Route path="/loan-application" element={<LoanApplication />} />
          <Route path="/borrower-dashboard" element={<BorrowerDashboard />} />
          <Route path="/lender-dashboard" element={<LenderDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
