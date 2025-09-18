import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader,
  Download,
  Edit3
} from "lucide-react";
import NavBar from "../components/Navbar";
import API_BASE_URL from "../config";

function MyAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please login first to view your appointments");
          setLoading(false);
          return;
        }

        console.log("Fetching appointments with token:", token ? "Present" : "Missing");

        const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          // Based on your API response, data is directly an array
          const appointmentsArray = Array.isArray(data) ? data : [];
          console.log("Appointments count:", appointmentsArray.length);

          if (appointmentsArray.length === 0) {
            setAppointments([]);
            setLoading(false);
            return;
          }

          // Transform API data to match our component structure
          const transformedAppointments = appointmentsArray.map((appointment, index) => {
            console.log(`Processing appointment ${index + 1}:`, appointment);
            console.log(`Doctor object for appointment ${index + 1}:`, appointment.doctor);
            console.log(`Doctor name:`, appointment.doctor?.name);
            
            const appointmentDate = new Date(appointment.date);
            const isValidDate = !isNaN(appointmentDate.getTime());

            // Calculate time based on token number (15 minutes per patient starting from 9:00 AM)
            let formattedTime = "Time not available";
            if (appointment.token && typeof appointment.token === 'number') {
              // Start time is 9:00 AM (9 hours, 0 minutes)
              const startHour = 9;
              const startMinute = 0;
              
              // Calculate total minutes from start time
              const totalMinutes = startMinute + ((appointment.token - 1) * 15);
              
              // Calculate final hour and minute
              const finalHour = startHour + Math.floor(totalMinutes / 60);
              const finalMinute = totalMinutes % 60;
              
              // Convert to 12-hour format
              const hour12 = finalHour === 0 ? 12 : finalHour > 12 ? finalHour - 12 : finalHour;
              const ampm = finalHour >= 12 ? 'PM' : 'AM';
              const minutesStr = finalMinute.toString().padStart(2, '0');
              
              formattedTime = `${hour12}:${minutesStr} ${ampm}`;
            }

            // Extract doctor information with multiple fallbacks
            const doctorName = appointment.doctor?.name || 
                              appointment.doctor?.doctorName || 
                              appointment.doctor?.fullName ||
                              appointment.doctorName ||
                              "Unknown Doctor";
            
            console.log(`Final doctor name for appointment ${index + 1}:`, doctorName);

            return {
              id: appointment._id,
              doctorName: doctorName,
              doctorSpecialty: appointment.doctor?.specialty || appointment.doctor?.specialization || "General Practice",
              doctorImage: appointment.doctor?.image || appointment.doctor?.profileImage || "https://randomuser.me/api/portraits/women/68.jpg",
              date: appointment.date,
              time: formattedTime,
              status: appointment.status || "pending",
              tokenNumber: appointment.token?.toString() || "N/A",
              fee: appointment.fee || 500,
              symptoms: appointment.symptoms || "General consultation",
              hospitalName: "City General Hospital",
              hospitalAddress: "123 Health Street, Medical District",
              hospitalPhone: "+91 98765 43210",
              appointmentType: "Consultation",
              bookedOn: appointment.createdAt
            };
          });

          console.log("Final transformed appointments:", transformedAppointments);
          setAppointments(transformedAppointments);
        } else {
          console.log("API Error:", data);
          setError(data.message || "Failed to fetch appointments");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "waiting":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
        <NavBar />
        
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-24">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            {/* <button
              onClick={() => setSelectedAppointment(null)}
              className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to All Appointments
            </button> */}

            {/* Appointment Details Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 lg:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Appointment Details</h1>
                    <p className="text-green-100 text-sm sm:text-base truncate">Appointment ID: {selectedAppointment.id}</p>
                  </div>
                  <div className={`px-3 sm:px-4 py-2 rounded-full border-2 ${getStatusColor(selectedAppointment.status)} bg-white self-start sm:self-auto`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedAppointment.status)}
                      <span className="font-semibold capitalize text-sm sm:text-base">{selectedAppointment.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Doctor Information */}
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-6 h-6 text-blue-600" />
                      Doctor Information
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={selectedAppointment.doctorImage}
                        alt={selectedAppointment.doctorName}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{selectedAppointment.doctorName}</h4>
                        <p className="text-blue-600 font-semibold">{selectedAppointment.doctorSpecialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-green-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-green-600" />
                      Appointment Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Date:</span>
                        <span className="text-gray-800">{new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Time:</span>
                        <span className="text-gray-800">{selectedAppointment.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Token:</span>
                        <span className="text-gray-800 font-bold">{selectedAppointment.tokenNumber}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 text-center text-gray-600">₹</span>
                        <span className="font-medium">Fee:</span>
                        <span className="text-green-600 font-bold">₹{selectedAppointment.fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hospital Information */}
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-purple-600" />
                      Hospital Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-bold text-gray-800">{selectedAppointment.hospitalName}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                        <span className="text-gray-700">{selectedAppointment.hospitalAddress}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{selectedAppointment.hospitalPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-yellow-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-yellow-600" />
                      Symptoms Described
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedAppointment.symptoms}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Appointment Type:</span>
                      <span className="ml-2 text-gray-800">{selectedAppointment.appointmentType}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Booked On:</span>
                      <span className="ml-2 text-gray-800">
                        {new Date(selectedAppointment.bookedOn).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                  <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium text-sm sm:text-base">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Download Receipt
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-green-700 transition font-medium text-sm sm:text-base">
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Reschedule
                  </button>
                  {selectedAppointment.status !== "cancelled" && (
                    <button className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-red-700 transition font-medium text-sm sm:text-base">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <NavBar />
      
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-500 mb-4">
            My Appointments
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            View and manage all your scheduled appointments
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-800 text-center font-medium">{error}</p>
            </div>
          )}

          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Appointments Found</h3>
              <p className="text-gray-500 mb-6">You haven't booked any appointments yet.</p>
              <a 
                href="/book-appointment"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium inline-block"
              >
                Book Your First Appointment
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-2 sm:px-3 py-1 rounded-full border ${getStatusColor(appointment.status)}`}>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {getStatusIcon(appointment.status)}
                          <span className="text-xs sm:text-sm font-semibold capitalize">{appointment.status}</span>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">#{appointment.id.slice(-6)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={appointment.doctorImage}
                        alt={appointment.doctorName}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{appointment.doctorName}</h3>
                        <p className="text-blue-600 font-semibold text-sm sm:text-base truncate">{appointment.doctorSpecialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">Date</p>
                          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">Time</p>
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">{appointment.time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <span className="text-xs sm:text-sm text-gray-600">Token:</span>
                        <span className="font-bold text-gray-800 text-sm sm:text-base">{appointment.tokenNumber}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-600">Fee</p>
                        <p className="font-bold text-green-600 text-base sm:text-lg">₹{appointment.fee}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-2xl sm:rounded-b-3xl">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAppointment;