import { useState, useEffect } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const user = localStorage.getItem("user");
      
      if (token && (role === "patient" || role === "doctor")) {
        setIsLoggedIn(true);
        if (user) {
          try {
            setUserInfo(JSON.parse(user));
          } catch (error) {
            console.error("Error parsing user info:", error);
            setUserInfo({ 
              name: role === "doctor" ? "Doctor" : "Patient",
              role: role 
            });
          }
        } else {
          setUserInfo({ 
            name: role === "doctor" ? "Doctor" : "Patient",
            role: role 
          });
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600">HospitalMS</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Home
          </a>
          
          {isLoggedIn ? (
            <>
              {userInfo?.role === "patient" && (
                <>
                  <a
                    href="/book-appointment"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    Book Appointment
                  </a>
                  <a
                    href="/my-appointments"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    My Appointments
                  </a>
                </>
              )}
              {userInfo?.role === "doctor" && (
                <a
                  href="/patient-list"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Patient List
                </a>
              )}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {userInfo?.name || (userInfo?.role === "doctor" ? "Doctor" : "Patient")}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <a
                href="/patient-login"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Patient Login
              </a>
              <a
                href="/doctor-login"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Doctor Login
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <a
              href="/"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            
            {isLoggedIn ? (
              <>
                {userInfo?.role === "patient" && (
                  <>
                    <a
                      href="/book-appointment"
                      className="text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Book Appointment
                    </a>
                    <a
                      href="/my-appointments"
                      className="text-gray-700 hover:text-blue-600 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      My Appointments
                    </a>
                  </>
                )}
                {userInfo?.role === "doctor" && (
                  <a
                    href="/patient-list"
                    className="text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Patient List
                  </a>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center space-x-2 text-gray-700 mb-3">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {userInfo?.name || (userInfo?.role === "doctor" ? "Doctor" : "Patient")}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <a
                  href="/patient-login"
                  className="text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Patient Login
                </a>
                <a
                  href="/doctor-login"
                  className="text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Doctor Login
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
