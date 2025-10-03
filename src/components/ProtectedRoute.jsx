import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Lock } from "lucide-react";

function ProtectedRoute({ children, allowedRoles = ["patient", "doctor"] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (token && role && allowedRoles.includes(role)) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
        setUserRole(role);
      }
      setLoading(false);
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            {userRole ? 
              `You don't have permission to access this page as a ${userRole}.` :
              "You need to be logged in to access this page."
            }
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/patient-login")}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Login as Patient
            </button>
            <button
              onClick={() => navigate("/doctor-login")}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-medium"
            >
              Login as Doctor
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;