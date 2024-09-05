import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission: string; // Required permission for the route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const localStorageUser = localStorage.getItem("user");
  const userPermissions = localStorageUser ? JSON.parse(localStorageUser).permissions : [];

  // Check if the user has the required permission
  if (!userPermissions.includes(permission)) {
    return <Navigate to="/forbidden" replace />; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;
