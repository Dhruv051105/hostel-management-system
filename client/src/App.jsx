
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ModulePage from "./pages/ModulePage.jsx";
import AppLayout from "./components/AppLayout.jsx";

function getSessionUser() {
  try {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (!token || !user || !user.role) return null;
    return user;
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const user = getSessionUser();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

function GuestRoute({ children }) {
  const user = getSessionUser();

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

function AppLayoutRoute({ children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function ModuleRoute({ allowedRoles }) {
  return (
    <AppLayoutRoute allowedRoles={allowedRoles}>
      <ModulePage />
    </AppLayoutRoute>
  );
}

function App() {
  const user = getSessionUser();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"}
            replace
          />
        }
      />

      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      <Route
        path="/dashboard"
        element={
          <AppLayoutRoute allowedRoles={["student"]}>
            <Dashboard />
          </AppLayoutRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AppLayoutRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </AppLayoutRoute>
        }
      />

      <Route path="/room" element={<ModuleRoute allowedRoles={["student"]} />} />
      <Route path="/profile" element={<ModuleRoute allowedRoles={["student"]} />} />
      <Route path="/students" element={<ModuleRoute allowedRoles={["admin"]} />} />
      <Route path="/rooms" element={<ModuleRoute allowedRoles={["admin"]} />} />
      <Route path="/settings" element={<ModuleRoute allowedRoles={["admin"]} />} />

      <Route path="/fees" element={<ModuleRoute allowedRoles={["student", "admin"]} />} />
      <Route path="/complaints" element={<ModuleRoute allowedRoles={["student", "admin"]} />} />
      <Route path="/notices" element={<ModuleRoute allowedRoles={["student", "admin"]} />} />
      <Route path="/leave" element={<ModuleRoute allowedRoles={["student", "admin"]} />} />
      <Route path="/visitors" element={<ModuleRoute allowedRoles={["student", "admin"]} />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
