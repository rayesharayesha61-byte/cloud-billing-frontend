// import React from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // PUBLIC
// import Home from "./pages/public/Home";
// import About from "./pages/public/About";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

// // APP

// import Dashboard from "./pages/dashboard/Dashboard";


// import Pricing from "./pages/public/Pricing";
// import DashboardLayout from "./pages/dashboard/DashboardLayout";
// import Customers from "./pages/customers/Customers";
// import SmallBusiness from "./components/solutions/SmallBusiness";
// import Retail from "./components/solutions/Retail";
// import BusinessServices from "./components/solutions/BusinessServices";
// import Contact from "./components/public/Contact";
// import Features from "./components/public/Features";
// import FAQ from "./components/public/FAQ";
// // import InvoiceList from "./pages/billing/InvoiceList";
// import Invoices from "./pages/billing/Invoices";
// import CreateInvoice from "./pages/billing/CreateInvoice";
// import Reports from "./pages/reports/Reports";
//  import AdminPanel from "./pages/AdminPanel";
// import Subscription from "./pages/subscription/Subscription";
// import Settings from "./pages/settings/Settings";
// import BusinessDetails from "./pages/BusinessDetails";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Expenses from "./pages/expenses/Expenses";
// import Products from "./pages/products/Products";
// function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* ================= PUBLIC WEBSITE ================= */}

//         <Route
//           path="/"
//           element={<Home />}
//         />
//         <Route
//           path="/about"
//           element={<About />
          
//           }
//         />
//         <Route
//   path="/business-details"
//   element={<BusinessDetails />}
// />

//         <Route path="/pricing" element={<Pricing />} />
      
//         <Route path="/solutions/small-business" element={<SmallBusiness />} />
//         <Route path="/solutions/retail" element={<Retail />} />
//         <Route path="/solutions/business-services" element={<BusinessServices />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/faq" element={<FAQ />} />
//         <Route path="/features" element={<Features />} />
//         <Route
//           path="/login"
//           element={<Login />}
//         />

//         <Route
//           path="/register"
//           element={<Register />}
//         />

//         {/* ================= PROTECTED APP ================= */}
//  <Route element={<DashboardLayout />}>
//         <Route
//           path="/dashboard"
//           element={<Dashboard />}
//         />
//   <Route
//   path="/products"
//   element={<Products />}
// />
//   <Route path="/customers" element={<Customers />} />
//     <Route path="/expenses" element={<Expenses />} />
//   <Route path="/invoices" element={<Invoices />} />
//         <Route
//           path="/products"
//           element={
//             <ProtectedRoute>
//               <Products />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/customers"
//           element={
//             <ProtectedRoute>
//               <Customers />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/billing/create"
//           element={<CreateInvoice />}
//         />

//         <Route
//           path="/create-invoice"
//           element={
//             <ProtectedRoute>
//               <CreateInvoice />
//             </ProtectedRoute>
//           }
//         />

//        <Route path="/reports" element={<Reports />} />
     


// <Route path="/admin" element={<AdminPanel />} />

// // Inside your existing Routes:
// <Route path="/subscription" element={<Subscription />} />
// <Route path="/settings" element={<Settings />} />
//         <Route
//           path="/expenses"
//           element={
//             <ProtectedRoute>
//               <Expenses />
//             </ProtectedRoute>
//           }
//         />

       

      

//         {/* UNKNOWN URL */}

//         <Route
//           path="*"
//           element={<Navigate to="/" replace />}
//         />
// </Route>
//       </Routes>
 
//     </BrowserRouter>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// PUBLIC
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Pricing from "./pages/public/Pricing";
import Contact from "./components/public/Contact";
import Features from "./components/public/Features";
import FAQ from "./components/public/FAQ";

// SOLUTIONS
import SmallBusiness from "./components/solutions/SmallBusiness";
import Retail from "./components/solutions/Retail";
import BusinessServices from "./components/solutions/BusinessServices";

// DASHBOARD
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// APP PAGES
import Customers from "./pages/customers/Customers";
import Products from "./pages/products/Products";
import Invoices from "./pages/billing/Invoices";
import CreateInvoice from "./pages/billing/CreateInvoice";
import Reports from "./pages/reports/Reports";
import Expenses from "./pages/expenses/Expenses";
import Subscription from "./pages/subscription/Subscription";
import Settings from "./pages/settings/Settings";
import BusinessDetails from "./pages/BusinessDetails";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/features" element={<Features />} />

        <Route
          path="/solutions/small-business"
          element={<SmallBusiness />}
        />

        <Route
          path="/solutions/retail"
          element={<Retail />}
        />

        <Route
          path="/solutions/business-services"
          element={<BusinessServices />}
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* BUSINESS DETAILS */}
        <Route
          path="/business-details"
          element={
            <ProtectedRoute>
              <BusinessDetails />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED APP - KEEP SIDEBAR LAYOUT */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/invoices"
            element={<Invoices />}
          />

          <Route
            path="/billing/create"
            element={<CreateInvoice />}
          />

          <Route
            path="/create-invoice"
            element={<CreateInvoice />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/expenses"
            element={<Expenses />}
          />

          <Route
            path="/subscription"
            element={<Subscription />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
