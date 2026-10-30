
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FacultySignup from "./pages/FacultySignup";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthourized";

import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Subjects from "./pages/Subjects";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/faculty-signup"
        element={<FacultySignup />}
      />

      {/* Student dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Faculty dashboard */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Profile: students, faculty, and admins */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            allowedRoles={["student", "faculty", "admin"]}
          >
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Faculty attendance management */}
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
          <ProtectedRoute
            allowedRoles={["student", "faculty", "admin"]}
          >
            <Subjects />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized access */}
      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;

