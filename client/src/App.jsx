import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Emergency from './pages/Emergency';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { setToken } from './api';

function App(){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch(e){ return null }
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const patientDashboardRef = useRef(null);
  const doctorDashboardRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  function handleLogin(token, userObj){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userObj));
    setToken(token);
    setUser(userObj);
  }
  function handleLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  function handleShowPrescriptions() {
    if (patientDashboardRef.current) {
      patientDashboardRef.current.openPrescriptions();
    }
  }

  function handleShowMedicalRecords() {
    if (patientDashboardRef.current) {
      patientDashboardRef.current.openMedicalRecords();
    }
  }

  function handleShowProfile() {
    if (patientDashboardRef.current) {
      patientDashboardRef.current.openProfile();
    }
  }

  function handleShowDoctorProfile() {
    if (doctorDashboardRef.current) {
      doctorDashboardRef.current.openProfile();
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar 
        user={user} 
        onLogout={handleLogout}
        onShowPrescriptions={handleShowPrescriptions}
        onShowMedicalRecords={handleShowMedicalRecords}
        onShowProfile={handleShowProfile}
        onShowDoctorProfile={handleShowDoctorProfile}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main className="container mx-auto p-4 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/patient" element={user ? (user.role === 'patient' ? <PatientDashboard ref={patientDashboardRef} user={user}/> : <Navigate to="/" />) : <Navigate to="/login" />} />
          <Route path="/doctor" element={user ? (user.role === 'doctor' ? <DoctorDashboard ref={doctorDashboardRef} user={user}/> : <Navigate to="/" />) : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? (user.role === 'admin' ? <AdminDashboard user={user}/> : <Navigate to="/" />) : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
