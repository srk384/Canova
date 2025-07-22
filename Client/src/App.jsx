import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Singnup from "./components/auth/Singnup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import PublicRoute from "./components/publicRoute/PublicRoute";
import ProjectsPage from "./components/projectsPage/ProjectsPage";
import HomePage from "./components/homePage/HomePage";
import FormPage from "./components/formPage/FormPage";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Auth routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Singnup />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Dashboard Routes */}
        <Route
          path="/dashboard/projects"
          element={
            <ProtectedRoute>
              <Dashboard>
                <ProjectsPage />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/homepage"
          element={
            <ProtectedRoute>
              <Dashboard>
                <HomePage />
              </Dashboard>
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/projects/:projectId/forms"
          element={
            <ProtectedRoute>
              <Dashboard>
                <FormPage />
              </Dashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
