import React, { useEffect, useState } from 'react';
import { API } from '../api';
import DoctorCard from '../components/DoctorCard';
import { useNavigate } from 'react-router-dom';

export default function PatientHome(){
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const nav = useNavigate();
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    API.get('/doctors').then(r => {
      const doctorData = r.data.data || r.data;
      setDoctors(doctorData);
      setFilteredDoctors(doctorData);
      
      // Extract unique specializations
      const specs = [...new Set(doctorData.map(d => d.specialization))];
      setSpecializations(specs);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    // Filter doctors based on specialization and search term
    let filtered = doctors;
    
    if (selectedSpecialization) {
      filtered = filtered.filter(d => d.specialization === selectedSpecialization);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDoctors(filtered);
  }, [selectedSpecialization, searchTerm, doctors]);

  function handleSelect(doc){
    const token = localStorage.getItem('token');
    if (!token) return nav('/login');
    nav('/patient', { state: { openDoctor: doc } });
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg shadow-xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to CityCare Hospital
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-blue-50">
            Compassionate Care, Advanced Medicine
          </p>
          <p className="text-lg mb-8 text-blue-100">
            Find experienced doctors, book appointments instantly, and manage your healthcare journey with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Find a Doctor
            </button>
            {!user && (
              <button 
                onClick={() => nav('/register')}
                className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all">
          <div className="text-4xl mb-3">🏥</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Expert Doctors</h3>
          <p className="text-gray-600 dark:text-gray-400">Access to highly qualified specialists across multiple departments</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Easy Booking</h3>
          <p className="text-gray-600 dark:text-gray-400">Book appointments online with real-time slot availability</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all">
          <div className="text-4xl mb-3">💊</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Digital Prescriptions</h3>
          <p className="text-gray-600 dark:text-gray-400">Receive and manage your prescriptions digitally</p>
        </div>
      </div>

      {/* Doctors Section */}
      <div id="doctors-section" className="scroll-mt-4">
        {/* Header */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded shadow mb-6 transition-colors">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Find a Doctor & Book an Appointment</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Search by specialization, view availability and book slots easily.</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Doctor</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Specialization</label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, idx) => (
                  <option key={idx} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </p>
            {(selectedSpecialization || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedSpecialization('');
                  setSearchTerm('');
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredDoctors.map(d => (
              <DoctorCard key={d._id} doc={d} onSelect={handleSelect} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded shadow p-8 text-center">
            <p className="text-gray-500">No doctors found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedSpecialization('');
                setSearchTerm('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear filters and show all doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
