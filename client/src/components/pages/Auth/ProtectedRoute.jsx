import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authUser, isInitialLoading } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const effectiveRole = authUser?.role || storedRole;

  if (isInitialLoading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffefd3]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#e39622]" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
