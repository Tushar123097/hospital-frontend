import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
// import PatientSignup from "./page/Patient/PatientSignup";
import PatientSignup from "./pages/Patient/PatientSignup";
import PatientLogin from "./pages/Patient/PatientLogin"; // create this page next
// import DoctorSignup if you have it
// import DoctorSignup from "./pages/DoctorSignup";
import DoctorSignup from "./pages/Doctor/DoctorSignup";
import DoctorLogin from "./pages/Doctor/DoctorLogin";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import PatientList from "./pages/Doctor/PatientList";
import BookAppointment from "./pages/BookAppointment";
import MyAppointment from "./pages/MyAppointment";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        {/* Add Doctor Signup route if needed */}
        {/* <Route path="/doctor-signup" element={<DoctorSignup />} /> */}

        {/* Doctor Routes */}
        <Route path="/doctor-signup" element={<DoctorSignup />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-profile" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorProfile />
          </ProtectedRoute>
        } />
        <Route path="/patient-list" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <PatientList />
          </ProtectedRoute>
        } />
        <Route path="/book-appointment" element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <MyAppointment />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <Profile />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
