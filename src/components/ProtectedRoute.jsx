import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./Shared";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until the authentication check finishes
  if (loading) {
    return <Loader label="Checking your session..." />;
  }

  // Redirect users who are not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Restrict access according to the user's role
  if (
    allowedRoles?.length &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allow authorized users to access the page
  return children;
}