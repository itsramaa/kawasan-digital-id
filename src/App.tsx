import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import ClientsPage from "./pages/sales/ClientsPage";
import QuotationsPage from "./pages/sales/QuotationsPage";
import ContractsPage from "./pages/sales/ContractsPage";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import TasksPage from "./pages/projects/TasksPage";
import Finance from "./pages/Finance";
import PaymentsPage from "./pages/finance/PaymentsPage";
import Support from "./pages/Support";
import Infrastructure from "./pages/Infrastructure";
import SettingsPage from "./pages/Settings";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProjects from "./pages/client/ClientProjects";
import ClientContracts from "./pages/client/ClientContracts";
import ClientFinance from "./pages/client/ClientFinance";
import ClientInfrastructure from "./pages/client/ClientInfrastructure";
import ClientSupport from "./pages/client/ClientSupport";
import ClientAccount from "./pages/client/ClientAccount";
import NotFound from "./pages/NotFound";
import StorefrontHome from "./pages/store/StorefrontHome";

import TemplatesPage from "./pages/store/TemplatesPage";
import TemplateDetailPage from "./pages/store/TemplateDetailPage";
import CheckoutPage from "./pages/store/CheckoutPage";
import OrderSuccessPage from "./pages/store/OrderSuccessPage";
import CartPage from "./pages/store/CartPage";
import CustomWebsitePage from "./pages/store/CustomWebsitePage";

import HelpFAQPage from "./pages/store/HelpFAQPage";
import OrderTrackingPage from "./pages/store/OrderTrackingPage";
import PrivacyPolicyPage from "./pages/store/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/store/TermsOfServicePage";
import RefundPolicyPage from "./pages/store/RefundPolicyPage";

import LandingHome from "./pages/landing/LandingHome";
import AboutPage from "./pages/landing/AboutPage";
import ServicesPage from "./pages/landing/ServicesPage";
import PortfolioPage from "./pages/landing/PortfolioPage";
import ContactPage from "./pages/landing/ContactPage";

import ClientOrders from "./pages/client/ClientOrders";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Storefront Routes (Public) - root level */}
            <Route path="/" element={<StorefrontHome />} />


            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:id" element={<TemplateDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/custom" element={<CustomWebsitePage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/how-it-works" element={<Navigate to="/help" replace />} />
            <Route path="/help" element={<HelpFAQPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/refund" element={<RefundPolicyPage />} />

            {/* Landing / Company Profile Routes */}
            <Route path="/landing" element={<LandingHome />} />
            <Route path="/landing/about" element={<AboutPage />} />
            <Route path="/landing/services" element={<ServicesPage />} />
            <Route path="/landing/portfolio" element={<PortfolioPage />} />
            <Route path="/landing/contact" element={<ContactPage />} />


            {/* Admin/Internal Portal Routes */}
            <Route path="/admin" element={<ProtectedRoute requireInternal><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/sales" element={<ProtectedRoute requireInternal><Sales /></ProtectedRoute>} />
            <Route path="/admin/sales/clients" element={<ProtectedRoute requireInternal><ClientsPage /></ProtectedRoute>} />
            <Route path="/admin/sales/quotations" element={<ProtectedRoute requireInternal><QuotationsPage /></ProtectedRoute>} />
            <Route path="/admin/sales/contracts" element={<ProtectedRoute requireInternal><ContractsPage /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute requireInternal><Projects /></ProtectedRoute>} />
            <Route path="/admin/projects/:id" element={<ProtectedRoute requireInternal><ProjectDetails /></ProtectedRoute>} />
            <Route path="/admin/projects/tasks" element={<ProtectedRoute requireInternal><TasksPage /></ProtectedRoute>} />
            <Route path="/admin/finance" element={<ProtectedRoute requireInternal><Finance /></ProtectedRoute>} />
            <Route path="/admin/finance/payments" element={<ProtectedRoute requireInternal><PaymentsPage /></ProtectedRoute>} />
            <Route path="/admin/support" element={<ProtectedRoute requireInternal><Support /></ProtectedRoute>} />
            <Route path="/admin/infrastructure" element={<ProtectedRoute requireInternal><Infrastructure /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireInternal><SettingsPage /></ProtectedRoute>} />

            {/* Client Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/projects" element={<ProtectedRoute><ClientProjects /></ProtectedRoute>} />
            <Route path="/dashboard/contracts" element={<ProtectedRoute><ClientContracts /></ProtectedRoute>} />
            <Route path="/dashboard/invoices" element={<ProtectedRoute><ClientFinance /></ProtectedRoute>} />
            <Route path="/dashboard/payments" element={<Navigate to="/dashboard/invoices" replace />} />
            <Route path="/dashboard/infrastructure" element={<ProtectedRoute><ClientInfrastructure /></ProtectedRoute>} />
            <Route path="/dashboard/support" element={<ProtectedRoute><ClientSupport /></ProtectedRoute>} />
            <Route path="/dashboard/account" element={<ProtectedRoute><ClientAccount /></ProtectedRoute>} />
            <Route path="/dashboard/orders" element={<ProtectedRoute><ClientOrders /></ProtectedRoute>} />
            

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
