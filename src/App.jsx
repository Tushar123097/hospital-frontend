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
import PatientList from "./pages/Doctor/PatientList";
import BookAppointment from "./pages/BookAppointment";
import MyAppointment from "./pages/MyAppointment";
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
        <Route path="/patient-list" element={<PatientList />} />
        <Route path="/book-appointment" element={
          <ProtectedRoute>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute>
            <MyAppointment />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
