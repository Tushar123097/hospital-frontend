import { useState, useEffect } from "react";
import { Menu, X, LogOut, User, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

// Profile completion indicator for doctors
function ProfileIndicator() {
  const [isIncomplete, setIsIncomplete] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        
        if (role !== "doctor" || !token || !userId) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          const incomplete = !data.specialty || !data.degree || !data.experience || !data.fees;
          setIsIncomplete(incomplete);
        }
      } catch (err) {
        console.log("Could not check profile:", err);
      }
    };

    checkProfile();
  }, []);

  if (!isIncomplete) return null;

  return (
    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Profile incomplete"></span>
  );
}

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
          } catch {
            setUserInfo({ name: role === "doctor" ? "Doctor" : "Patient", role });
          }
        } else {
          setUserInfo({ name: role === "doctor" ? "Doctor" : "Patient", role });
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
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
        <h1 className="text-xl font-bold text-blue-600">HospitalMS</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {userInfo?.role === "patient" && (
                <>
                  <Link to="/book-appointment" className="text-gray-700 hover:text-blue-600 transition font-medium">
                    Book Appointment
                  </Link>
                  <Link to="/my-appointments" className="text-gray-700 hover:text-blue-600 transition font-medium">
                    My Appointments
                  </Link>
                </>
              )}
              {userInfo?.role === "doctor" && (
                <>
                  <Link to="/doctor-profile" className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1">
                    My Profile
                    <ProfileIndicator />
                  </Link>
                  <Link to="/patient-list" className="text-gray-700 hover:text-blue-600 transition font-medium">
                    Patient List
                  </Link>
                </>
              )}
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition font-medium">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {userInfo?.name || (userInfo?.role === "doctor" ? "Doctor" : "Patient")}
                  </span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition font-medium">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/patient-login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Patient Login
              </Link>
              <Link to="/doctor-login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Doctor Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 hover:text-blue-600 transition" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                {userInfo?.role === "patient" && (
                  <>
                    <Link to="/book-appointment" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition">
                      Book Appointment
                    </Link>
                    <Link to="/my-appointments" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition">
                      My Appointments
                    </Link>
                  </>
                )}
                {userInfo?.role === "doctor" && (
                  <>
                    <Link to="/doctor-profile" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition flex items-center gap-2">
                      My Profile
                      <ProfileIndicator />
                    </Link>
                    <Link to="/patient-list" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition">
                      Patient List
                    </Link>
                  </>
                )}
                <div className="border-t pt-3 mt-3">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition mb-3">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {userInfo?.name || (userInfo?.role === "doctor" ? "Doctor" : "Patient")}
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/patient-login" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition">
                  Patient Login
                </Link>
                <Link to="/doctor-login" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition">
                  Doctor Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
