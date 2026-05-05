import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { API } from '../api';
import CreatePrescription from '../components/CreatePrescription';

const DoctorDashboard = forwardRef(({ user }, ref) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showSlotManager, setShowSlotManager] = useState(false);
  const [newSlot, setNewSlot] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [prescriptionModal, setPrescriptionModal] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterTimeSlot, setFilterTimeSlot] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    openProfile: () => {
      loadProfile();
      setShowProfile(true);
    }
  }));

  useEffect(() => {
    loadAppointments();
    loadDoctorProfile();
    loadReviews();
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

  function loadDoctorProfile() {
    API.get('/doctors').then(r => {
      const doctors = r.data.data || r.data;
      const myProfile = doctors.find(d => d.userId?._id === user._id || d.userId === user._id);
      if (myProfile) {
        setDoctorProfile(myProfile);
        setAvailableSlots(myProfile.availableSlots || []);
      }
    }).catch(()=>{});
  }

  function loadReviews() {
    API.get('/doctors').then(r => {
      const doctors = r.data.data || r.data;
      const myProfile = doctors.find(d => d.userId?._id === user._id || d.userId === user._id);
      if (myProfile) {
        API.get(`/reviews/doctor/${myProfile._id}`)
          .then(r => setReviews(r.data.data || r.data))
          .catch(() => {});
      }
    }).catch(()=>{});
  }

  function loadProfile() {
    if (user?._id) {
      API.get(`/auth/profile`)
        .then(r => setProfileData(r.data.data || r.data))
        .catch(()=>{});
    }
  }

  async function handleUpdateProfile(updatedData) {
    try {
      await API.put('/auth/profile', updatedData);
      alert('Profile updated successfully!');
      loadProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  }

  function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async function handleReply(reviewId, reply) {
    try {
      await API.put(`/reviews/${reviewId}/reply`, { reply });
      alert('Reply posted successfully!');
      setReplyingTo(null);
      loadReviews();
    } catch (error) {
      alert('Failed to post reply');
    }
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

  async function updateSlots() {
    if (!doctorProfile) return;
    
    try {
      await API.put(`/doctors/${doctorProfile._id}/slots`, { availableSlots });
      alert('Available slots updated successfully!');
      setShowSlotManager(false);
      loadDoctorProfile();
    } catch (err) {
      alert('Failed to update slots');
    }
  }

  function addSlot() {
    if (!newSlot) return;
    
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newSlot)) {
      alert('Invalid time format. Use HH:MM (e.g., 09:00)');
      return;
    }
    
    if (availableSlots.includes(newSlot)) {
      alert('This slot already exists');
      return;
    }
    
    setAvailableSlots([...availableSlots, newSlot].sort());
    setNewSlot('');
  }

  function removeSlot(slot) {
    setAvailableSlots(availableSlots.filter(s => s !== slot));
  }

  function addCommonSlots() {
    const common = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const merged = [...new Set([...availableSlots, ...common])].sort();
    setAvailableSlots(merged);
  }

  function clearFilters() {
    setFilterDate('');
    setFilterTimeSlot('');
    setFilterStatus('');
  }

  function getStatusColor(status) {
    switch(status) {
      case 'booked': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  // Get unique time slots from appointments for filter
  const uniqueTimeSlots = [...new Set(appointments.map(a => a.time))].sort();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Appointments</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your patient appointments and schedule</p>
            {doctorProfile && (
              <div className="mt-2 flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ⭐ Rating: {doctorProfile.averageRating?.toFixed(1) || '0.0'} ({doctorProfile.totalReviews || 0} reviews)
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showReviews ? 'Hide' : 'View'} Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setShowSlotManager(!showSlotManager)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {showSlotManager ? 'Hide' : 'Manage'} Available Slots
            </button>
          </div>
        </div>
      </div>

      {/* Slot Manager */}
      {showSlotManager && (
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Manage Available Time Slots</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Available Slots ({availableSlots.length})
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-blue-200 px-3 py-2 rounded-lg hover:bg-gray-700">
                    <span className="font-medium">{slot}</span>
                    <button
                      onClick={() => removeSlot(slot)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No slots added yet</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add New Time Slot
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addSlot}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Slot
              </button>
              <button
                onClick={addCommonSlots}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Add Common Slots
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={updateSlots}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setShowSlotManager(false);
                loadDoctorProfile();
              }}
              className="bg-red-300 text-red-700 px-6 py-2 rounded-lg hover:bg-red-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {showReviews && (
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">Patient Reviews</h3>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold dark:text-gray-300">{review.patientId?.name || 'Patient'}</span>
                        <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-grey-300 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
                  )}
                  
                  {review.reply ? (
                    <div className="mt-3 pl-4 border-l-4 border-blue-300 bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-800">Your Reply:</p>
                      <p className="text-sm text-gray-700 mt-1">{review.reply}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.repliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      {replyingTo === review._id ? (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const reply = new FormData(e.target).get('reply');
                          handleReply(review._id, reply);
                        }}>
                          <textarea
                            name="reply"
                            rows="3"
                            placeholder="Write your reply..."
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            required
                          ></textarea>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="submit"
                              className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                            >
                              Post Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="bg-gray-300 text-gray-700 px-4 py-1 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(review._id)}
                          className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Reply to this review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No reviews yet</p>
          )}
        </div>
      )}

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
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">Patient Appointments</h3>
        
        {filteredAppointments.length > 0 ? (
          <div className="space-y-3">
            {filteredAppointments.map(a => (
              <div key={a._id} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
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
                  
                  {(a.status === 'booked' || a.status === 'completed') && (
                    <button
                      onClick={() => setPrescriptionModal(a)}
                      className="ml-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      📝 Prescription
                    </button>
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

      {/* Prescription Modal */}
      {prescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Prescription</h3>
                <button
                  onClick={() => setPrescriptionModal(null)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <CreatePrescription
                patient={prescriptionModal.patientId}
                appointmentId={prescriptionModal._id}
                onSuccess={() => {
                  setPrescriptionModal(null);
                  loadAppointments();
                }}
                onCancel={() => setPrescriptionModal(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Profile</h3>
                <button
                  onClick={() => setShowProfile(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {profileData ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updatedData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    gender: formData.get('gender'),
                    bloodGroup: formData.get('bloodGroup')
                  };
                  handleUpdateProfile(updatedData);
                }}>
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name *</label>
                          <input
                            type="text"
                            name="name"
                            defaultValue={profileData.name}
                            required
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email *</label>
                          <input
                            type="email"
                            name="email"
                            defaultValue={profileData.email}
                            required
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            defaultValue={profileData.phone || ''}
                            pattern="[0-9]{10}"
                            placeholder="10-digit number"
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            defaultValue={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : ''}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                          <select
                            name="gender"
                            defaultValue={profileData.gender || ''}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Blood Group</label>
                          <select
                            name="bloodGroup"
                            defaultValue={profileData.bloodGroup || ''}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Display Calculated Age */}
                    {profileData.dateOfBirth && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
                        <span className="font-medium">Age:</span> {calculateAge(profileData.dateOfBirth)} years
                      </div>
                    )}

                    {/* Doctor Specific Info (Read-only) */}
                    {doctorProfile && (
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded border border-purple-200 dark:border-purple-800">
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Doctor Information (Read-only)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="text-gray-800 dark:text-gray-200">
                            <span className="font-medium">Specialization:</span> {doctorProfile.specialization}
                          </div>
                          <div className="text-gray-800 dark:text-gray-200">
                            <span className="font-medium">Experience:</span> {doctorProfile.experience} years
                          </div>
                          <div className="text-gray-800 dark:text-gray-200">
                            <span className="font-medium">Contact:</span> {doctorProfile.contact}
                          </div>
                          <div className="text-gray-800 dark:text-gray-200">
                            <span className="font-medium">Rating:</span> ⭐ {doctorProfile.averageRating?.toFixed(1) || '0.0'} ({doctorProfile.totalReviews || 0} reviews)
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
                      >
                        Update Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProfile(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Loading profile...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DoctorDashboard;
