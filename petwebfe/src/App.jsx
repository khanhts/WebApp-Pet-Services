import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Shop from "./pages/Shop";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Header";
import Authen from "./pages/Authen";
import CartPage from "./pages/CartPage";
import MenuBar from "./components/MenuBar";
import CheckoutPage from "./pages/CheckoutPage";
import ProductManagePage from "./pages/ProductManagePage";
import ManagementPage from "./pages/ManagementPage";
import Dashboard from "./pages/Dashboard";
import AccessDenied from "./pages/AccessDenied";
import ProtectedRoute from "./routes/ProtectedRoute";
import CategoryManagePage from "./pages/CategoryManagePage";
import TagManagePage from "./pages/TagManagePage";
import Appointment from "./pages/Appointment";
import MyInvoicesPage from "./pages/MyInvoicesPage";
import InvoicePage from "./pages/InvoicePage";
import ServicePage from "./pages/ServicePage";
import ServicesManagePage from "./pages/ServicesManagePage";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <MenuBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/auth/:action" element={<Authen />} />
        <Route path="/auth" element={<Authen />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/invoices" element={<MyInvoicesPage />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management"
          element={
            <ProtectedRoute role="admin">
              <ManagementPage />
            </ProtectedRoute>
          }
        >
          <Route
            path="product-manage"
            element={
              <ProtectedRoute role="admin">
                <ProductManagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="category-manage"
            element={
              <ProtectedRoute role="admin">
                <CategoryManagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/management/tag-manage"
            element={
              <ProtectedRoute role="admin">
                <TagManagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="service-manage"
            element={
              <ProtectedRoute role="admin">
                <ServicesManagePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
