import { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    FileText,
    CheckCircle,
    AlertCircle,
    XCircle,
    Loader,
    Search,
    Filter,
    Eye,
    Users,
    X
} from "lucide-react";
import NavBar from "../../components/Navbar";
import API_BASE_URL from "../../config";

// Profile completion banner component
function ProfileCompletionBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                if (!token || !userId) return;

                const response = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);

                    // Show banner if profile is incomplete
                    const isIncomplete = !data.specialty || !data.degree || !data.experience || !data.fees;
                    setShowBanner(isIncomplete);
                }
            } catch (err) {
                console.log("Could not check profile:", err);
            }
        };

        checkProfile();
    }, []);

    if (!showBanner) return null;

    return (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-yellow-800">Complete Your Profile</h3>
                        <p className="text-yellow-700 text-sm">
                            Complete your profile to appear in patient bookings and receive more appointments.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <a
                        href="/doctor-profile"
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                    >
                        Complete Profile
                    </a>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="text-yellow-600 hover:text-yellow-700 p-2"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [notification, setNotification] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");

                if (!token || role !== "doctor") {
                    setError("Please login as a doctor to access this page");
                    setLoading(false);
                    return;
                }

                // Note: Doctors can view patient list even with incomplete profiles
                // They just won't appear in patient bookings until profile is complete

                console.log("Fetching patient appointments...");

                const response = await fetch(`${API_BASE_URL}/api/appointments/doctor-appointments`, {
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
                    const appointmentsArray = Array.isArray(data) ? data : [];
                    console.log("Appointments count:", appointmentsArray.length);

                    // Transform API data to patient-focused view
                    const transformedPatients = appointmentsArray.map((appointment, index) => {
                        console.log(`Processing appointment ${index + 1}:`, appointment);

                        // Calculate time based on token number (15 minutes per patient starting from 9:00 AM)
                        let formattedTime = "Time not available";
                        if (appointment.token && typeof appointment.token === 'number') {
                            const startHour = 9;
                            const startMinute = 0;
                            const totalMinutes = startMinute + ((appointment.token - 1) * 15);
                            const finalHour = startHour + Math.floor(totalMinutes / 60);
                            const finalMinute = totalMinutes % 60;
                            const hour12 = finalHour === 0 ? 12 : finalHour > 12 ? finalHour - 12 : finalHour;
                            const ampm = finalHour >= 12 ? 'PM' : 'AM';
                            const minutesStr = finalMinute.toString().padStart(2, '0');
                            formattedTime = `${hour12}:${minutesStr} ${ampm}`;
                        }

                        return {
                            appointmentId: appointment._id,
                            patientId: appointment.patient?._id || "N/A",
                            patientName: appointment.patient?.name || "Unknown Patient",
                            patientEmail: appointment.patient?.email || "No email",
                            patientPhone: appointment.patient?.phone || "No phone",
                            appointmentDate: appointment.date,
                            appointmentTime: formattedTime,
                            status: appointment.status || "waiting",
                            tokenNumber: appointment.token?.toString() || "N/A",
                            symptoms: appointment.symptoms || "General consultation",
                            bookedOn: appointment.createdAt
                        };
                    });

                    setPatients(transformedPatients);
                } else {
                    console.log("API Error:", data);
                    setError(data.message || "Failed to fetch patient appointments");
                }
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    // Debug notification state changes
    useEffect(() => {
        console.log("Notification state changed:", notification);
    }, [notification]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "waiting":
                return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
            case "confirmed":
                return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
            case "completed":
                return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "waiting":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "confirmed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // Filter patients based on search and status
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.tokenNumber.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Update appointment status
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const token = localStorage.getItem("token");

            console.log(`Updating appointment ${appointmentId} to status: ${newStatus}`);

            const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            console.log("Status update response:", data);

            if (response.ok) {
                // Update local state
                setPatients(prev => prev.map(patient =>
                    patient.appointmentId === appointmentId ? { ...patient, status: newStatus } : patient
                ));

                // Update selected patient if it's the same one
                if (selectedPatient && selectedPatient.appointmentId === appointmentId) {
                    setSelectedPatient(prev => ({ ...prev, status: newStatus }));
                }

                // Show success notification
                console.log("Looking for appointmentId:", appointmentId);
                console.log("Available patients:", patients.map(p => ({ id: p.appointmentId, name: p.patientName })));

                const patient = patients.find(p => p.appointmentId === appointmentId);
                const patientName = patient?.patientName || selectedPatient?.patientName || 'Patient';

                console.log("Found patient:", patient);
                console.log("Setting notification for patient:", patientName);

                const notificationData = {
                    type: 'success',
                    title: '✅ Status Updated Successfully!',
                    message: `Appointment status changed from "${patient?.status || 'unknown'}" to "${newStatus}". Patient will be notified.`,
                    patientName: patientName,
                    oldStatus: patient?.status,
                    newStatus: newStatus
                };

                console.log("Notification data:", notificationData);
                setNotification(notificationData);

                // Auto hide notification after 8 seconds (increased time)
                setTimeout(() => {
                    console.log("Auto-hiding notification");
                    setNotification(null);
                }, 8000);
            } else {
                console.error("Failed to update appointment status:", data);
                // Show error notification
                setNotification({
                    type: 'error',
                    title: 'Update Failed',
                    message: data.message || "Failed to update appointment status"
                });

                setTimeout(() => setNotification(null), 5000);
            }
        } catch (err) {
            console.error("Error updating status:", err);
            // Show error notification
            setNotification({
                type: 'error',
                title: 'Network Error',
                message: "Something went wrong while updating status. Please try again."
            });

            setTimeout(() => setNotification(null), 5000);
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Loading patient list...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedPatient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
                <NavBar />

                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-24">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        {/* <button
                            onClick={() => setSelectedPatient(null)}
                            className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                        >
                            Back to Patient List
                        </button> */}

                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Patient Details</h1>
                                    {/* <p className="text-gray-600 text-lg">Token: <span className="font-bold text-green-600">#{selectedPatient.tokenNumber}</span></p> */}
                                </div>
                                <div className={`px-4 py-3 rounded-xl border-2 ${getStatusColor(selectedPatient.status)} shadow-lg`}>
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(selectedPatient.status)}
                                        <span className="font-bold capitalize text-lg">{selectedPatient.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-8">
                            {/* Patient Information Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    Patient Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {selectedPatient.patientName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Patient Name</p>
                                                <p className="text-lg font-bold text-gray-800">{selectedPatient.patientName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <Mail className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email Address</p>
                                                <p className="text-base font-medium text-gray-800">{selectedPatient.patientEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <Phone className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone Number</p>
                                                <p className="text-base font-medium text-gray-800">{selectedPatient.patientPhone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <FileText className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Patient ID</p>
                                                <p className="text-base font-medium text-gray-800">{selectedPatient.patientId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Details Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-green-600" />
                                    </div>
                                    Appointment Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                                        <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-1">Appointment Date</p>
                                        <p className="font-bold text-gray-800">{new Date(selectedPatient.appointmentDate).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl text-center">
                                        <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-1">Time Slot</p>
                                        <p className="font-bold text-gray-800">{selectedPatient.appointmentTime}</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-xl text-center">
                                        <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-1">Token Number</p>
                                        <p className="font-bold text-gray-800 text-xl">#{selectedPatient.tokenNumber}</p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl text-center">
                                        <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-1">Booked On</p>
                                        <p className="font-bold text-gray-800">{new Date(selectedPatient.bookedOn).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Symptoms Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    Patient Symptoms & Concerns
                                </h2>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                                    <p className="text-gray-800 leading-relaxed text-lg">{selectedPatient.symptoms}</p>
                                </div>
                            </div>

                            {/* Status Update Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    Update Appointment Status
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                    <button
                                        onClick={() =>
                                            updateAppointmentStatus(selectedPatient.appointmentId, "waiting")
                                        }
                                        className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-6 py-4 rounded-xl hover:bg-yellow-700 transition font-medium text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        disabled={selectedPatient.status === "waiting" || updatingStatus}
                                    >
                                        {updatingStatus ? <Loader className="w-5 h-5 animate-spin" /> : <AlertCircle className="w-5 h-5" />}
                                        {updatingStatus ? "Updating..." : "Mark as Waiting"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateAppointmentStatus(selectedPatient.appointmentId, "confirmed")
                                        }
                                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition font-medium text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        disabled={selectedPatient.status === "confirmed" || updatingStatus}
                                    >
                                        {updatingStatus ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                        {updatingStatus ? "Updating..." : "Mark as Confirmed"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateAppointmentStatus(selectedPatient.appointmentId, "completed")
                                        }
                                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition font-medium text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        disabled={selectedPatient.status === "completed" || updatingStatus}
                                    >
                                        {updatingStatus ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                        {updatingStatus ? "Updating..." : "Mark as Completed"}
                                    </button>



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
            <NavBar />

            {/* Success/Error Notification */}
            {notification && (
                <div
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] w-96 max-w-[90vw]"
                    style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '10px' }}
                >
                    <div className={`w-full rounded-2xl shadow-2xl p-8 border-4 ${notification.type === 'success'
                        ? 'bg-green-200 border-green-600'
                        : 'bg-red-200 border-red-600'
                        }`} style={{ minHeight: '150px' }}>
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${notification.type === 'success'
                                ? 'bg-green-200'
                                : 'bg-red-200'
                                }`}>
                                {notification.type === 'success' ? (
                                    <CheckCircle className="w-8 h-8 text-green-700" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-700" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-2xl ${notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                    🎉 {notification.title}
                                </h4>
                                <p className="text-gray-700 mt-1 text-sm leading-relaxed">
                                    {notification.message}
                                </p>
                                {notification.patientName && (
                                    <p className="text-gray-600 mt-2 text-sm font-medium">
                                        Patient: {notification.patientName}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        {notification.type === 'success' && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm font-medium">Email notification sent successfully</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-500 mb-4">
                            Patient List
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                            View all patients who have booked appointments with you
                        </p>
                    </div>

                    {/* Profile Completion Reminder */}
                    <ProfileCompletionBanner />

                    {/* Search and Filter */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by patient name, email, or token..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="waiting">Waiting</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
                            <p className="text-gray-600">Total Patients</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                                {patients.filter(p => p.status === "waiting").length}
                            </p>
                            <p className="text-gray-600">Waiting</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                                {patients.filter(p => p.status === "confirmed").length}
                            </p>
                            <p className="text-gray-600">Confirmed</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                                {patients.filter(p => p.status === "completed").length}
                            </p>
                            <p className="text-gray-600">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                            <p className="text-red-800 text-center font-medium">{error}</p>
                        </div>
                    )}

                    {filteredPatients.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-600 mb-2">No Patients Found</h3>
                            <p className="text-gray-500">No patients match your search criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.appointmentId}
                                    className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100"
                                    onClick={() => setSelectedPatient(patient)}
                                >
                                    {/* Card Header */}
                                    <div className="p-4 sm:p-6 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`px-2 sm:px-3 py-1 rounded-full border ${getStatusColor(patient.status)}`}>
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    {getStatusIcon(patient.status)}
                                                    <span className="text-xs sm:text-sm font-semibold capitalize">{patient.status}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-500">Token #{patient.tokenNumber}</span>
                                        </div>

                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                                                {patient.patientName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{patient.patientName}</h3>
                                                <p className="text-gray-600 text-sm truncate">{patient.patientEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 sm:p-6">
                                        <div className="grid grid-cols-1 gap-3 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-600">Appointment Date</p>
                                                    <p className="font-semibold text-gray-800 text-sm truncate">
                                                        {new Date(patient.appointmentDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-600" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-600">Time</p>
                                                    <p className="font-semibold text-gray-800 text-sm">{patient.appointmentTime}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-600" />
                                                <span className="text-xs text-gray-600 truncate">{patient.patientPhone}</span>
                                            </div>
                                            <button className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm">
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-2xl sm:rounded-b-3xl">
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                            <span className="font-medium">Symptoms:</span> {patient.symptoms}
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

export default PatientList;