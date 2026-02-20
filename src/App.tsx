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
            
            {/* Internal Portal Routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute requireInternal><Sales /></ProtectedRoute>} />
            <Route path="/sales/clients" element={<ProtectedRoute requireInternal><ClientsPage /></ProtectedRoute>} />
            <Route path="/sales/quotations" element={<ProtectedRoute requireInternal><QuotationsPage /></ProtectedRoute>} />
            <Route path="/sales/contracts" element={<ProtectedRoute requireInternal><ContractsPage /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
            <Route path="/projects/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
            <Route path="/finance/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/infrastructure" element={<ProtectedRoute requireInternal><Infrastructure /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requireInternal><SettingsPage /></ProtectedRoute>} />

            {/* Client Portal Routes */}
            <Route path="/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/client/projects" element={<ProtectedRoute><ClientProjects /></ProtectedRoute>} />
            <Route path="/client/contracts" element={<ProtectedRoute><ClientContracts /></ProtectedRoute>} />
            <Route path="/client/invoices" element={<ProtectedRoute><ClientInvoices /></ProtectedRoute>} />
            <Route path="/client/payments" element={<ProtectedRoute><ClientPayments /></ProtectedRoute>} />
            <Route path="/client/infrastructure" element={<ProtectedRoute><ClientInfrastructure /></ProtectedRoute>} />
            <Route path="/client/support" element={<ProtectedRoute><ClientSupport /></ProtectedRoute>} />
            <Route path="/client/account" element={<ProtectedRoute><ClientAccount /></ProtectedRoute>} />
            <Route path="/client/orders" element={<ProtectedRoute><ClientOrders /></ProtectedRoute>} />

            {/* Storefront Routes (Public) */}
            <Route path="/store" element={<StorefrontHome />} />
            <Route path="/store/showcase" element={<ShowcasePage />} />
            <Route path="/store/templates" element={<TemplatesPage />} />
            <Route path="/store/templates/:id" element={<TemplateDetailPage />} />
            <Route path="/store/checkout" element={<CheckoutPage />} />
            <Route path="/store/order-success" element={<OrderSuccessPage />} />
            <Route path="/store/cart" element={<CartPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
