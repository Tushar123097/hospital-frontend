import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Stethoscope,
  GraduationCap,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  Trash2
} from "lucide-react";
import NavBar from "../../components/Navbar";
import API_BASE_URL from "../../config";

function DoctorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    specialty: "",
    degree: "",
    experience: "",
    fees: "",
    availability: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        setError("No authentication found");
        setLoading(false);
        return;
      }

      // Get profile from auth controller
      const response = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data:", data);
        
        setProfile(data);
        setEditForm({
          name: data.name || "",
          email: data.email || "",
          specialty: data.specialty || "",
          degree: data.degree || "",
          experience: data.experience || "",
          fees: data.fees || "500",
          availability: data.availability || []
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAvailabilitySlot = () => {
    setEditForm(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        { day: "", from: "", to: "" }
      ]
    }));
  };

  const updateAvailabilitySlot = (index, field, value) => {
    setEditForm(prev => ({
      ...prev,
      availability: prev.availability.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeAvailabilitySlot = (index) => {
    setEditForm(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: editForm.name,
          specialty: editForm.specialty,
          degree: editForm.degree,
          experience: editForm.experience,
          fees: parseInt(editForm.fees) || 500,
          availability: editForm.availability.filter(slot => 
            slot.day && slot.from && slot.to
          )
        })
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setIsEditing(false);
        setSuccess("Profile updated successfully! You can now view your patients.");
        
        // If this was the first time completing profile, redirect to patient list after 2 seconds
        const wasIncomplete = !profile?.specialty || !profile?.degree || !profile?.experience || !profile?.fees;
        if (wasIncomplete && data.user.specialty && data.user.degree && data.user.experience && data.user.fees) {
          setTimeout(() => {
            navigate("/patient-list");
          }, 2000);
        } else {
          setTimeout(() => setSuccess(""), 3000);
        }
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: profile?.name || "",
      email: profile?.email || "",
      specialty: profile?.specialty || "",
      degree: profile?.degree || "",
      experience: profile?.experience || "",
      fees: profile?.fees || "500",
      availability: profile?.availability || []
    });
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <NavBar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Doctor Profile
            </h1>
            <p className="text-gray-600">
              Manage your professional information and availability
            </p>
            {(!profile?.specialty || !profile?.degree || !profile?.experience || !profile?.fees) && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="text-yellow-800 font-medium">
                  ⚠️ Please complete your profile to appear in patient bookings
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  Fill in your specialty, degree, experience, and consultation fee
                </p>
              </div>
            )}
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-green-800 text-center font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-800 text-center font-medium">{error}</p>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 sm:px-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl">
                  👨‍⚕️
                </div>
                <div className="text-center sm:text-left text-white">
                  <h2 className="text-2xl font-bold">{profile?.name || "Doctor"}</h2>
                  <p className="text-green-100 mb-2">{profile?.email}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-green-800">
                    <Shield className="w-4 h-4 mr-1" />
                    Doctor
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 sm:p-8">
              {!isEditing ? (
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-green-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-800 font-medium">{profile?.name || "Not set"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Email Address
                        </label>
                        <p className="text-gray-800 font-medium">{profile?.email || "Not set"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Specialty
                        </label>
                        <p className="text-gray-800 font-medium">{profile?.specialty || "Not set"}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Degree
                        </label>
                        <p className="text-gray-800 font-medium">{profile?.degree || "Not set"}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Experience
                        </label>
                        <p className="text-gray-800 font-medium">{profile?.experience || "Not set"}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Consultation Fee
                        </label>
                        <p className="text-gray-800 font-medium">₹{profile?.fees || "500"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                      Availability
                    </h3>
                    {profile?.availability && profile.availability.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.availability.map((slot, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{slot.day}</span>
                              <span className="text-gray-600">{slot.from} - {slot.to}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No availability set</p>
                      </div>
                    )}
                  </div>

                  {/* Edit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-green-600" />
                    Edit Profile
                  </h3>
                  
                  {/* Basic Info Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="Enter your full name"
                        required
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
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Professional Info Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialty *
                      </label>
                      <select
                        name="specialty"
                        value={editForm.specialty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        required
                      >
                        <option value="">Select Specialty</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                        <option value="General Practice">General Practice</option>
                        <option value="ENT Specialist">ENT Specialist</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Ophthalmologist">Ophthalmologist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={editForm.degree}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="e.g., MBBS, MD, MS"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience *
                      </label>
                      <select
                        name="experience"
                        value={editForm.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        required
                      >
                        <option value="">Select Experience</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10-15 years">10-15 years</option>
                        <option value="15+ years">15+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Fee (₹) *
                      </label>
                      <input
                        type="number"
                        name="fees"
                        value={editForm.fees}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="500"
                        min="100"
                        max="5000"
                        required
                      />
                    </div>
                  </div>

                  {/* Availability Form */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Availability Schedule
                      </label>
                      <button
                        type="button"
                        onClick={addAvailabilitySlot}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Slot
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {editForm.availability.map((slot, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <select
                            value={slot.day}
                            onChange={(e) => updateAvailabilitySlot(index, 'day', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                          <input
                            type="time"
                            value={slot.from}
                            onChange={(e) => updateAvailabilitySlot(index, 'from', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={slot.to}
                            onChange={(e) => updateAvailabilitySlot(index, 'to', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeAvailabilitySlot(index)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md"
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

export default DoctorProfile;