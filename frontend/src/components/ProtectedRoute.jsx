import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps pages that require an authenticated user
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="retro-heading animate-flicker text-lg">Loading your journal...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
