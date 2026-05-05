import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.role === 'admin';

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 mt-12 transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Hospital Info */}
          <div className="footer-section">
            <div 
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('info')}
            >
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">CityCare Hospital</h3>
              <span className="md:hidden text-2xl text-blue-900 dark:text-blue-300">
                {expandedSection === 'info' ? '−' : '+'}
              </span>
            </div>
            <div className={`footer-content ${expandedSection === 'info' || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                "Compassionate Care, Advanced Medicine"
              </p>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">📍</span>
                  <span>123 Medical Center Drive<br />Healthcare City, HC 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">📞</span>
                  <a href="tel:+1234567890" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    +91 8277345214
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✉️</span>
                  <a href="mailto:info@citycarehospital.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    info@citycarehospital.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 dark:text-red-400">🚨</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">Emergency: 911</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Services - Hidden for admin */}
          {!isAdmin && (
            <div className="footer-section">
              <div 
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => toggleSection('services')}
              >
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">Patient Services</h3>
                <span className="md:hidden text-2xl text-blue-900 dark:text-blue-300">
                  {expandedSection === 'services' ? '−' : '+'}
                </span>
              </div>
              <div className={`footer-content ${expandedSection === 'services' || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">🔍</span> Find a Doctor
                    </Link>
                  </li>
                  <li>
                    <Link to={user ? "/patient" : "/login"} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">📅</span> Book Appointment
                    </Link>
                  </li>
                  <li>
                    <Link to="/emergency" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">🚑</span> Emergency Services
                    </Link>
                  </li>
                  <li>
                    <a href="#checkup" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">💊</span> Health Checkup Packages
                    </a>
                  </li>
                  <li>
                    <a href="#insurance" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">💳</span> Insurance & Billing
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Departments - Hidden for admin */}
          {!isAdmin && (
            <div className="footer-section">
              <div 
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => toggleSection('departments')}
              >
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">Departments</h3>
                <span className="md:hidden text-2xl text-blue-900 dark:text-blue-300">
                  {expandedSection === 'departments' ? '−' : '+'}
                </span>
              </div>
              <div className={`footer-content ${expandedSection === 'departments' || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#cardiology" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">❤️</span> Cardiology
                    </a>
                  </li>
                  <li>
                    <a href="#orthopedics" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">🦴</span> Orthopedics
                    </a>
                  </li>
                  <li>
                    <a href="#neurology" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400">🧠</span> Neurology
                    </a>
                  </li>
                  <li>
                    <a href="#pediatrics" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">�</span> Pediatrics
                    </a>
                  </li>
                  <li>
                    <a href="#radiology" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">📡</span> Radiology
                    </a>
                  </li>
                  <li>
                    <a href="#departments" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors">
                      View All Departments →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* For Doctors & Staff - Hidden for logged-in patients */}
          {(!user || user.role !== 'patient') && (!isAdmin) && (
            <div className="footer-section">
              <div 
                className="flex items-center justify-between cursor-pointer md:cursor-default"
                onClick={() => toggleSection('doctors')}
              >
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">For Doctors & Staff</h3>
                <span className="md:hidden text-2xl text-blue-900 dark:text-blue-300">
                  {expandedSection === 'doctors' ? '−' : '+'}
                </span>
              </div>
              <div className={`footer-content ${expandedSection === 'doctors' || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">👨‍⚕️</span> Doctor Login
                    </Link>
                  </li>
                  <li>
                    <a href="#staff" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">👥</span> Staff Portal
                    </a>
                  </li>
                  <li>
                    <a href="#careers" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">💼</span> Careers
                    </a>
                  </li>
                  <li>
                    <a href="#training" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                       <span className="text-blue-600 dark:text-blue-400">📚</span> Training & Research
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="footer-section">
            <div 
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('quick')}
            >
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">Quick Links</h3>
              <span className="md:hidden text-2xl text-blue-900 dark:text-blue-300">
                {expandedSection === 'quick' ? '−' : '+'}
              </span>
            </div>
            <div className={`footer-content ${expandedSection === 'quick' || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                     <span className="text-blue-600 dark:text-blue-400">ℹ️</span> About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                     <span className="text-blue-600 dark:text-blue-400">📧</span> Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                     <span className="text-blue-600 dark:text-blue-400">❓</span> FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/emergency" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                     <span className="text-blue-600 dark:text-blue-400">🚑</span> Emergency Services
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="footer-section">
            <div 
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('connect')}
            >
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">Connect With Us</h3>
              <span className="md:hidden text-2xl text-blue-900 dark:text-blue-300">
                {expandedSection === 'connect' ? '−' : '+'}
              </span>
            </div>
            <div className={`footer-content ${expandedSection === 'connect' || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
              {/* Social Media */}
              <div className="flex gap-3 mb-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>

              {/* Newsletter - Hidden for admin */}
              {!isAdmin && (
                <form onSubmit={handleNewsletterSubmit} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subscribe to Newsletter
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Mobile App Download - Hidden for admin */}
          {!isAdmin && (
            <div className="footer-section lg:col-span-2">
            <div 
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection('app')}
            >
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">Download Our Mobile App</h3>
              <span className="md:hidden text-2xl text-blue-900 dark:text-blue-300">
                {expandedSection === 'app' ? '−' : '+'}
              </span>
            </div>
            <div className={`footer-content ${expandedSection === 'app' || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Book appointments, access medical records, and consult doctors on the go!
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="#playstore" 
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
                <a 
                  href="#appstore" 
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          )}

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-900 dark:bg-gray-950 text-white py-4 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
            <div className="text-center md:text-left">
              © 2026 CityCare Hospital. All Rights Reserved.
            </div>
            <div className="flex gap-4 text-center">
              <a href="#privacy" className="hover:text-blue-300 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#terms" className="hover:text-blue-300 dark:hover:text-blue-400 transition-colors">Terms</a>
              <span>|</span>
              <a href="#sitemap" className="hover:text-blue-300 dark:hover:text-blue-400 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
