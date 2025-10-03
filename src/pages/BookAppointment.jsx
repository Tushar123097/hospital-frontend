import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Star,
  CheckCircle,
  Heart,
  Activity,
  Phone,
  Mail,
  Building,
  Clock,
  Loader
} from "lucide-react";
import NavBar from "../components/Navbar";
import API_BASE_URL from "../config";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("Fetching doctors...");
        console.log("Fetching doctors...");
        console.log("API URL:", `${API_BASE_URL}/api/doctors/doctors`);

        // Temporarily fetch without authentication for testing
        const response = await fetch(`${API_BASE_URL}/api/doctors/doctors`);

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Doctors response:", data);
        
        if (response.ok && data.success) {
          console.log("Doctors data:", data.data);
          setDoctors(data.data || []); // The response has doctors in 'data' field
        } else {
          console.error("Failed to fetch doctors:", data);
          setError(data.message || "Failed to load doctors");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Network error: Failed to load doctors");
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first to book an appointment");
        setLoading(false);
        return;
      }

      // Debug logging
      console.log("=== FRONTEND BOOKING REQUEST ===");
      console.log("Selected doctor:", selectedDoctor);
      console.log("Selected date:", selectedDate);
      console.log("Token exists:", !!token);
      console.log("Token preview:", token ? token.substring(0, 20) + "..." : "No token");

      const requestBody = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        symptoms: symptoms
      };

      console.log("Request body:", requestBody);
      console.log("API URL:", `${API_BASE_URL}/api/appointments/book`);

      const response = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setAppointmentData(data.appointment);
        setBookingSuccess(true);
      } else {
        console.error("Booking failed:", data);
        setError(data.error || data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setSelectedDate("");
    setSymptoms("");
    setBookingSuccess(false);
    setAppointmentData(null);
    setError("");
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-4 py-8 pt-24">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Appointment Booked!</h2>
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Doctor:</span> {selectedDoctor?.name}</p>
                <p><span className="font-medium">Date:</span> {new Date(appointmentData?.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Token Number:</span> #{appointmentData?.token}</p>
                <p><span className="font-medium">Status:</span> <span className="capitalize text-blue-600">{appointmentData?.status}</span></p>
                <p><span className="font-medium">Appointment ID:</span> {appointmentData?.id}</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <p className="text-green-800 text-sm font-medium">
                ✅ Confirmation email has been sent to your registered email address with all appointment details.
              </p>
            </div>
            <button
              onClick={resetForm}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <NavBar />

      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-500 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Simple 3-step process to book your appointment with our expert doctors
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="w-full">
          <form onSubmit={handleBookAppointment} className="w-full p-6 sm:p-8 lg:p-10">

            {/* Error Message */}
            {error && (
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-red-800 text-center font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Select Doctor */}
            <div className="mb-12">
              <div className="flex items-start justify-start gap-3 mb-8">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Select Doctor</h2>
              </div>

              {doctorsLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading doctors...</p>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No doctors available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {doctors.map((doctor, index) => (
                  <div
                    key={`${doctor.id}-${index}`}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all hover:shadow-lg ${selectedDoctor?.id === doctor.id && selectedDoctor?.name === doctor.name
                      ? "border-blue-600 bg-white shadow-xl scale-105"
                      : "border-gray-200 bg-white/70 hover:border-blue-300 hover:bg-white"
                      }`}
                  >
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                    />
                    <h3 className="font-bold text-gray-800 text-center text-lg">{doctor.name}</h3>
                    <p className="text-blue-600 text-center font-semibold">{doctor.specialty}</p>
                    <p className="text-gray-500 text-center text-sm mt-1">{doctor.experience}</p>
                    <div className="flex items-center justify-center gap-1 mt-3">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-gray-600 font-medium">4.8</span>
                    </div>
                    <p className="text-center text-green-600 font-bold text-xl mt-3">₹{doctor.fees}</p>
                  </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Select Date */}
            <div className="mb-12">
              <div className="flex items-start justify-start gap-3 mb-8">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Select Date</h2>
              </div>

              <div className="flex justify-center">
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl font-medium bg-white shadow-lg"
                />
              </div>
            </div>

            {/* Step 3: Add Symptoms */}
            <div className="mb-12">
              <div className="flex items-start justify-start gap-3 mb-8">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Describe Symptoms</h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={6}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-lg bg-white shadow-lg"
                  placeholder=""
                  required
                />
              </div>
            </div>

            {/* Summary & Book Button */}
            {selectedDoctor && selectedDate && (
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-blue-100">
                  <h3 className="font-bold text-gray-800 mb-6 text-xl text-center">Appointment Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <span className="font-semibold text-gray-700 block mb-2">Doctor:</span>
                      <p className="text-gray-900 font-bold">{selectedDoctor.name}</p>
                      <p className="text-blue-600 text-sm">{selectedDoctor.specialty}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <span className="font-semibold text-gray-700 block mb-2">Date:</span>
                      <p className="text-gray-900 font-bold">{selectedDate}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-2xl">
                      <span className="font-semibold text-gray-700 block mb-2">Fee:</span>
                      <p className="text-green-600 font-bold text-xl">₹{selectedDoctor.fees}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!selectedDoctor || !selectedDate || !symptoms.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hospital Information Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our Hospital?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We provide world-class healthcare services with state-of-the-art facilities
              and experienced medical professionals dedicated to your well-being.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Doctors</h3>
              <p className="text-gray-600">50+ experienced specialists across all medical fields</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Advanced Equipment</h3>
              <p className="text-gray-600">Latest medical technology for accurate diagnosis</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Emergency</h3>
              <p className="text-gray-600">Round-the-clock emergency services available</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Compassionate Care</h3>
              <p className="text-gray-600">Patient-centered approach with personalized treatment</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Expert Doctors</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Happy Patients</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Emergency Care</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">contact@hospital.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Building className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Health Street, City</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookAppointment;