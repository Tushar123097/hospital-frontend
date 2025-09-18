import React from "react";
import { useState } from "react";
import {
  LogIn,
  CalendarCheck,
  Mail,
  Hospital,
  CheckCircle,
  History,
  Users,
  ClipboardList,
  PhoneCall,
  Activity,
  Stethoscope,
  User,
  ChevronDown,
} from "lucide-react";
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";



// Card Component
function Card({ step, title, desc, icon: Icon, color }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full text-white ${color}`}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <h4 className="mt-3 text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm text-center mt-1">{desc}</p>
    </div>
  );
}



//  Steps for Patients
const patientSteps = [
  {
    step: "01",
    title: "Login / Sign Up",
    desc: "Create your account or log in to access your dashboard.",
    icon: LogIn,
  },
  {
    step: "02",
    title: "Book Appointment",
    desc: "Choose your doctor and book an appointment online.",
    icon: CalendarCheck,
  },
  {
    step: "03",
    title: "Get Token & Email",
    desc: "Receive an email with your appointment time and token number.",
    icon: Mail,
  },
  {
    step: "04",
    title: "Visit Hospital",
    desc: "Reach the hospital on time and meet your doctor.",
    icon: Hospital,
  },
  {
    step: "05",
    title: "Completion Email",
    desc: "Get notified via email once your consultation is done.",
    icon: CheckCircle,
  },
  {
    step: "06",
    title: "Track History",
    desc: "View all your past and upcoming appointments anytime.",
    icon: History,
  },
];

// ✅ Steps for Doctors
const doctorSteps = [
  {
    step: "01",
    title: "Login / Sign Up",
    desc: "Register as a doctor or log in to your account.",
    icon: LogIn,
  },
  {
    step: "02",
    title: "View Patients",
    desc: "See the list of patients with their token numbers.",
    icon: Users,
  },
  {
    step: "03",
    title: "Call Patients",
    desc: "Attend patients one by one in the correct order.",
    icon: PhoneCall,
  },
  {
    step: "04",
    title: "Update Status",
    desc: "Change patient status from Waiting → Completed after visit.",
    icon: ClipboardList,
  },
  {
    step: "05",
    title: "Dashboard",
    desc: "Monitor appointments and statuses from your dashboard.",
    icon: Activity,
  },
  {
    step: "06",
    title: "Patient History",
    desc: "Access records of all your past patients anytime.",
    icon: History,
  },
];

// FAQs
const faqs = [
  { question: "How do I book an appointment?", answer: "Patients can book appointments by signing up, logging in, selecting a doctor, and choosing an available time slot." },
  { question: "Can I reschedule my appointment?", answer: "Yes, you can reschedule appointments directly from your dashboard up to 24 hours before the scheduled time." },
  { question: "How do doctors update patient status?", answer: "Doctors can update patient status from Waiting → Completed after the consultation in their dashboard." },
  { question: "Is my medical history secure?", answer: "Absolutely. All patient records are stored securely and can only be accessed by authorized users." },
  { question: "Do I get email notifications?", answer: "Yes, patients receive email notifications for appointments, tokens, and consultation completion." },
];

function HomePage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Welcome to{" "}
          <span className="text-blue-600">Hospital Management System</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl text-sm sm:text-base md:text-lg">
          Book appointments, track medical history, and access healthcare
          services with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/patient-signup"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            I am Patient
          </Link>

          <Link
            to="/doctor-signup"
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            I am Doctor
          </Link>
        </div>
      </section>


      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 py-12 ">
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Stethoscope className="h-10 w-10 text-blue-600" />
          <h3 className="mt-4 text-lg md:text-xl font-semibold">Appointments</h3>
          <p className="mt-2 text-gray-600 text-sm text-center">
            Schedule and manage your doctor appointments effortlessly.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <User className="h-10 w-10 text-green-600" />
          <h3 className="mt-4 text-lg md:text-xl font-semibold">Patient Access</h3>
          <p className="mt-2 text-gray-600 text-sm text-center">
            Patients can log in to view prescriptions and health records.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <History className="h-10 w-10 text-purple-600" />
          <h3 className="mt-4 text-lg md:text-xl font-semibold">History</h3>
          <p className="mt-2 text-gray-600 text-sm text-center">
            Track past visits and treatments in one secure place.
          </p>
        </div>
      </section>
      {/* ✅ Testimonials Section */}
      <section className="py-20 px-6 bg-blue-50 font-sans">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800">
          What People Say
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Hear from our patients and doctors about how our hospital management system makes healthcare easier and more efficient.
        </p>

        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Testimonial Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
            <p className="text-gray-700 text-lg mb-6">
              "This system made booking appointments and tracking my medical history effortless. Highly recommend!"
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Patient"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-gray-800 font-semibold">Sarah Johnson</h4>
                <p className="text-gray-500 text-sm">Patient</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
            <p className="text-gray-700 text-lg mb-6">
              "Managing my appointments and patient history has never been easier. A must-have for every clinic."
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="Doctor"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-gray-800 font-semibold">Dr. Michael Lee</h4>
                <p className="text-gray-500 text-sm">Doctor</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
            <p className="text-gray-700 text-lg mb-6">
              "The dashboard is intuitive and easy to use. My patients love the smooth appointment process."
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/women/72.jpg"
                alt="Patient"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-gray-800 font-semibold">Emily Davis</h4>
                <p className="text-gray-500 text-sm">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-blue-50">
        <h2 className="text-4xl font-sans font-normal text-gray-800 text-center mb-4">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              <div className="flex justify-between items-center px-6 py-5">
                <h3 className="text-lg md:text-xl font-sans font-normal text-gray-800">{faq.question}</h3>
                <span className="text-gray-500 font-bold">{openFAQ === index ? "-" : "+"}</span>
              </div>
              {openFAQ === index && (
                <div className="px-6 pb-5 text-gray-700 text-base md:text-lg font-sans font-light transition-all duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      <footer className="bg-gray-100 text-gray-700 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-600 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/patient-signup" className="hover:text-blue-600 transition">
                  Patient Signup
                </a>
              </li>
              <li>
                <a href="/doctor-signup" className="hover:text-blue-600 transition">
                  Doctor Signup
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-blue-600 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-blue-600" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                contact@hospital.com
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                123 Health Street, City, India
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600 transition">Facebook</a>
              <a href="#" className="hover:text-blue-600 transition">Twitter</a>
              <a href="#" className="hover:text-blue-600 transition">LinkedIn</a>
              <a href="#" className="hover:text-blue-600 transition">Instagram</a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Hospital Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
