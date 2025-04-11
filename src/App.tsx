
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import History from "./pages/History";
import DashboardLayout from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          
          <Route path="/patients" element={
            <DashboardLayout>
              <Patients />
            </DashboardLayout>
          } />
          
          <Route path="/patient/:id" element={
            <DashboardLayout>
              <PatientDetail />
            </DashboardLayout>
          } />
          
          <Route path="/historique" element={
            <DashboardLayout>
              <History />
            </DashboardLayout>
          } />
          
          <Route path="/mesures" element={
            <DashboardLayout>
              <History />
            </DashboardLayout>
          } />
          
          <Route path="/rapports" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          
          <Route path="/parametres" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
