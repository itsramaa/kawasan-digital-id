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
import ClientInvoices from "./pages/client/ClientInvoices";
import ClientPayments from "./pages/client/ClientPayments";
import ClientInfrastructure from "./pages/client/ClientInfrastructure";
import ClientSupport from "./pages/client/ClientSupport";
import ClientAccount from "./pages/client/ClientAccount";
import NotFound from "./pages/NotFound";
import StorefrontHome from "./pages/store/StorefrontHome";
import ShowcasePage from "./pages/store/ShowcasePage";
import TemplatesPage from "./pages/store/TemplatesPage";
import TemplateDetailPage from "./pages/store/TemplateDetailPage";
import CheckoutPage from "./pages/store/CheckoutPage";
import OrderSuccessPage from "./pages/store/OrderSuccessPage";
import CartPage from "./pages/store/CartPage";
import CustomWebsitePage from "./pages/store/CustomWebsitePage";

import HelpFAQPage from "./pages/store/HelpFAQPage";

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
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/showcase/:id" element={<ShowcasePage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:id" element={<TemplateDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/custom" element={<CustomWebsitePage />} />
            
            <Route path="/help" element={<HelpFAQPage />} />
            

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
            <Route path="/dashboard/invoices" element={<ProtectedRoute><ClientInvoices /></ProtectedRoute>} />
            <Route path="/dashboard/payments" element={<ProtectedRoute><ClientPayments /></ProtectedRoute>} />
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
