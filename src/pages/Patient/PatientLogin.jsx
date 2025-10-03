import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar";
import API_BASE_URL from "../../config";
import { Eye, EyeOff } from "lucide-react";

function PatientLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Patient login response:", data);

      if (response.ok) {
        console.log("Login successful, user role:", data.role);
        
        // Role check: only allow patient to login
        if (data.role !== "patient") {
          console.log("Role mismatch - expected: patient, got:", data.role);
          setError("You are not authorized to login as a patient!");
          return;
        }

        console.log("Role check passed, storing data and redirecting");
        
        // Store token and role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "patient");
        localStorage.setItem("userId", data.userId);

        navigate("/book-appointment"); // Redirect to patient dashboard
      } else {
        console.log("Login failed:", data);
        setError(data.message || "Invalid email or password!");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <NavBar />
      <section className="flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Patient <span className="text-blue-600">Login</span>
        </h1>
        <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Login
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Don't have an account?{" "}
            <a href="/patient-signup" className="text-blue-600 hover:underline">
              Signup
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}

export default PatientLogin;
