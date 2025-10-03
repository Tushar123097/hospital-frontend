import React, { useState } from "react";
import NavBar from "../../components/Navbar";
import API_BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";

function DoctorSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "doctor",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/doctor/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password, // ✅ include password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/doctor-login", { state: { email: formData.email } });
        }, 2000);
      } else {
        setError(data.message || "Signup failed!");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      <NavBar />

      <section className="flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
          Doctor <span className="text-green-600">Signup</span>
        </h1>

        <form
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
          onSubmit={handleSubmit}
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition cursor-pointer"
          >
            Sign Up
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?{" "}
            <a href="/doctor-login" className="text-green-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}

export default DoctorSignup;
