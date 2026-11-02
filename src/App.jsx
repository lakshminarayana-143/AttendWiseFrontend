import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FacultySignup from "./pages/FacultySignup";

import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Unauthorized from "./pages/Unauthourized";
import ProtectedRoute from "./components/ProtectedRoute";

import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Subjects from "./pages/Subjects";
import InitialAdminSetup from "./pages/InitialAdminSetup";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Initial OG Admin setup */}
      <Route path="/initial-admin-setup" element={<InitialAdminSetup />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/faculty-signup" element={<FacultySignup />} />

      {/* Student dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Faculty dashboard */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard - OG and temporary admins */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["student", "faculty", "admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Faculty attendance */}
      <Route
        path="/faculty/attendance"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      {/* Subjects */}
      <Route
        path="/subjects"
        element={
          <ProtectedRoute allowedRoles={["student", "faculty", "admin"]}>
            <Subjects />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
