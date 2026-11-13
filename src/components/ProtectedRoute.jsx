
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Loader } from "./Shared";

export default function ProtectedRoute({ children, allowedRoles }) {
  const {
    user,
    loading,
    activeWorkspace,
    availableWorkspaces,
  } = useAuth();

  const location = useLocation();

  // Wait until authentication restoration finishes.
  if (loading) {
    return <Loader label="Checking your session..." />;
  }

  // Redirect unauthenticated users.
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Check whether the user has any permitted workspace.
  const permittedRoles =
    Array.isArray(allowedRoles) && allowedRoles.length > 0
      ? allowedRoles
      : [user.role];

  const hasPermittedWorkspace = availableWorkspaces.some(
    (workspace) => permittedRoles.includes(workspace)
  );

  if (!hasPermittedWorkspace) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If multiple workspaces exist but none is selected,
  // ask the user to choose one.
  if (!activeWorkspace) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          requiresWorkspaceSelection: true,
        }}
      />
    );
  }

  // The selected workspace must match the requested route.
  if (!permittedRoles.includes(activeWorkspace)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Confirm the selected workspace is actually available.
  if (!availableWorkspaces.includes(activeWorkspace)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
