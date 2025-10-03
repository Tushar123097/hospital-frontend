import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Edit3, Save, X, Calendar, Clock } from "lucide-react";
import NavBar from "../components/Navbar";
import API_BASE_URL from "../config";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEditForm({
          name: userData.name,
          email: userData.email
        });
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // For now, just update localStorage (you can add PUT API later)
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
      
      // You can add actual API call here later:
      // const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      //   method: "PUT",
      //   headers: {
      //     "Authorization": `Bearer ${localStorage.getItem("token")}`,
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(editForm)
      // });
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save changes");
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
  };

  const getRoleColor = (role) => {
    return role === "doctor" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
  };

  const getRoleIcon = (role) => {
    return role === "doctor" ? "👨‍⚕️" : "🏥";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchProfile}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <NavBar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl">
                  {getRoleIcon(user?.role)}
                </div>
                <div className="text-center sm:text-left text-white">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-blue-100 mb-2">{user?.email}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role)} bg-white`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 sm:p-8">
              {!isEditing ? (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-800 font-medium">{user?.name}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Email Address
                        </label>
                        <p className="text-gray-800 font-medium">{user?.email}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Account Type
                        </label>
                        <p className="text-gray-800 font-medium capitalize">{user?.role}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          User ID
                        </label>
                        <p className="text-gray-800 font-medium font-mono text-sm">{user?._id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Account Status</p>
                            <p className="text-lg font-bold text-blue-800">Active</p>
                          </div>
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Profile Complete</p>
                            <p className="text-lg font-bold text-green-800">100%</p>
                          </div>
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                    Edit Profile
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;