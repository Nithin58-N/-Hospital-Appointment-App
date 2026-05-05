import React, { useEffect, useState } from 'react';
import { API } from '../api';

export default function DoctorHome({ user }){
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  
  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterTimeSlot, setFilterTimeSlot] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = appointments;
    
    if (filterDate) {
      filtered = filtered.filter(a => {
        const appointmentDate = new Date(a.date).toISOString().split('T')[0];
        return appointmentDate === filterDate;
      });
    }
    
    if (filterTimeSlot) {
      filtered = filtered.filter(a => a.time === filterTimeSlot);
    }
    
    if (filterStatus) {
      filtered = filtered.filter(a => a.status === filterStatus);
    }
    
    setFilteredAppointments(filtered);
  }, [filterDate, filterTimeSlot, filterStatus, appointments]);

  function loadAppointments() {
    API.get('/appointments/doctor').then(r => {
      const data = r.data.data || r.data;
      setAppointments(data);
      setFilteredAppointments(data);
    }).catch(()=>{});
  }

  async function changeStatus(id, status){
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      alert('Status updated successfully');
    } catch (err) { 
      alert('Failed to update status'); 
    }
  }

  function clearFilters() {
    setFilterDate('');
    setFilterTimeSlot('');
    setFilterStatus('');
  }

  function getStatusColor(status) {
    switch(status) {
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Get unique time slots from appointments for filter
  const uniqueTimeSlots = [...new Set(appointments.map(a => a.time))].sort();

  return (
    <div>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-white">My Patient Appointments</h1>
        <p className="text-blue-100 mt-2">View and manage your scheduled patient appointments</p>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Filter Appointments</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">By Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time Slot Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">By Time Slot</label>
            <select
              value={filterTimeSlot}
              onChange={(e) => setFilterTimeSlot(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Time Slots</option>
              {uniqueTimeSlots.map((slot, idx) => (
                <option key={idx} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">By Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-800 dark:text-gray-400">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
      </div>

      {/* Appointments List */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="font-semibold text-xl dark:text-white mb-4">Patient Appointments</h3>
        
        {filteredAppointments.length > 0 ? (
          <div className="space-y-3">
            {filteredAppointments.map(a => (
              <div key={a._id} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">👤 {a.patientId?.name || 'Patient'}</h4>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>📅 {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>⏰ {a.time}</span>
                      <span>📧 {a.patientId?.email || 'N/A'}</span>
                    </div>
                    {a.reason && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Reason:</span> {a.reason}
                      </p>
                    )}
                  </div>
                  
                  {a.status === 'booked' && (
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => changeStatus(a._id, 'completed')} 
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        ✓ Complete
                      </button>
                      <button 
                        onClick={() => changeStatus(a._id, 'cancelled')} 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {appointments.length === 0 ? (
              <>
                <p>No appointments scheduled yet.</p>
                <p className="text-sm mt-2">Patients will be able to book appointments during your available slots.</p>
              </>
            ) : (
              <>
                <p>No appointments match your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
