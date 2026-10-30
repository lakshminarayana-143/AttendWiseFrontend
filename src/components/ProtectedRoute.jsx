import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Loader } from "./Shared";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until session restoration finishes.
  if (loading) {
    return <Loader label="Checking your session..." />;
  }

  // Redirect unauthenticated users to login.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check whether the user's role is allowed.
  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the requested page.
  return children;
}
