import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { API } from '../api';
import AppointmentForm from '../components/AppointmentForm';
import MyPrescriptions from '../components/MyPrescriptions';
import PrescriptionDetail from '../components/PrescriptionDetail';
import RefillRequest from '../components/RefillRequest';
import { useLocation } from 'react-router-dom';

const PatientDashboard = forwardRef(({ user }, ref) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { state } = useLocation();
  const [selectedDoctor, setSelectedDoctor] = useState(state?.openDoctor || null);
  const [showBooking, setShowBooking] = useState(!!state?.openDoctor);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleDoctor, setRescheduleDoctor] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [medicalRecordsModal, setMedicalRecordsModal] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [refillRequestModal, setRefillRequestModal] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    openPrescriptions: () => setShowPrescriptions(true),
    openMedicalRecords: () => setMedicalRecordsModal(true),
    openProfile: () => {
      loadProfile();
      setShowProfile(true);
    }
  }));

  useEffect(() => {
    API.get('/appointments/my').then(r => setAppointments(r.data.data || r.data)).catch(()=>{});
    API.get('/doctors').then(r => setDoctors(r.data.data || r.data)).catch(()=>{});
    loadMedicalRecords();
  }, []);

  function refresh() {
    API.get('/appointments/my').then(r => setAppointments(r.data.data || r.data)).catch(()=>{});
  }

  function loadMedicalRecords() {
    if (user?._id) {
      API.get(`/medical-records/patient/${user._id}`)
        .then(r => setMedicalRecords(r.data.data || r.data))
        .catch(()=>{});
    }
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

  async function handleReschedule(appointment, newDate, newTime) {
    try {
      await API.put(`/appointments/${appointment._id}/reschedule`, { newDate, newTime });
      alert('Appointment rescheduled successfully!');
      setRescheduleModal(null);
      setRescheduleDoctor(null);
      refresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reschedule');
    }
  }

  async function openRescheduleModal(appointment) {
    // Fetch full doctor details to get available slots
    try {
      const response = await API.get(`/doctors/${appointment.doctorId._id || appointment.doctorId}`);
      const doctorData = response.data.data || response.data;
      setRescheduleDoctor(doctorData);
      setRescheduleModal(appointment);
    } catch (error) {
      alert('Failed to load doctor details');
    }
  }

  async function handleReview(appointment, rating, comment) {
    try {
      await API.post('/reviews', {
        doctorId: appointment.doctorId._id,
        appointmentId: appointment._id,
        rating,
        comment
      });
      alert('Review submitted successfully!');
      setReviewModal(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  }

  async function handleCancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await API.put(`/appointments/${appointmentId}/status`, { status: 'cancelled' });
      alert('Appointment cancelled');
      refresh();
    } catch (error) {
      alert('Failed to cancel appointment');
    }
  }

  function handleDoctorSelect(doctor) {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  }

  function getStatusColor(status) {
    switch(status) {
      case 'booked': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Appointments List */}
      <div className="md:col-span-2 p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="font-bold text-xl mb-4 text-gray-900 dark:text-gray-100">My Appointments</h2>
        
        {appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map(a => (
              <div key={a._id} className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg dark:text-white">{a.doctorId?.name || 'Doctor'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{a.doctorId?.specialization}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-300">
                      <span>📅 {new Date(a.date).toLocaleDateString()}</span>
                      <span>⏰ {a.time}</span>
                    </div>
                    {a.reason && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {a.reason}
                      </p>
                    )}
                    {a.rescheduleCount > 0 && (
                      <p className="mt-1 text-xs text-orange-600">
                        Rescheduled {a.rescheduleCount} time(s)
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-3 flex gap-2 flex-wrap">
                  {a.status === 'booked' && (
                    <>
                      <button
                        onClick={() => openRescheduleModal(a)}
                        disabled={a.rescheduleCount >= 2}
                        className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Reschedule ({2 - (a.rescheduleCount || 0)} left)
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(a._id)}
                        className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {a.status === 'completed' && (
                    <button
                      onClick={() => setReviewModal(a)}
                      className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No appointments yet.</p>
            <p className="text-sm mt-2">Book your first appointment from the list of doctors.</p>
          </div>
        )}
      </div>

      {/* Booking Section */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Book New Appointment</h3>
        
        {!showBooking ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300 mb-2">Select a Doctor</label>
            <select 
              onChange={(e) => {
                const doctor = doctors.find(d => d._id === e.target.value);
                if (doctor) handleDoctorSelect(doctor);
              }}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose doctor...</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-200">
              💡 Select a doctor to view their available slots and book an appointment.
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setShowBooking(false);
                setSelectedDoctor(null);
              }}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              ← Change Doctor
            </button>
            <AppointmentForm doctor={selectedDoctor} onBooked={() => {
              refresh();
              setShowBooking(false);
              setSelectedDoctor(null);
            }} />
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Reschedule Appointment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Current: {new Date(rescheduleModal.date).toLocaleDateString()} at {rescheduleModal.time}
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleReschedule(rescheduleModal, formData.get('newDate'), formData.get('newTime'));
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Date</label>
                <input
                  type="date"
                  name="newDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Time</label>
                <select name="newTime" required className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="">Select time...</option>
                  {rescheduleDoctor?.availableSlots?.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Write a Review</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Dr. {reviewModal.doctorId?.name} - {reviewModal.doctorId?.specialization}
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleReview(reviewModal, parseInt(formData.get('rating')), formData.get('comment'));
            }}>
              <div className="mb-4">
                <label className="block text-sm dark:text-gray-300 font-medium mb-2">Rating</label>
                <select name="rating" required className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">Select rating...</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Very Good</option>
                  <option value="3">⭐⭐⭐ Good</option>
                  <option value="2">⭐⭐ Fair</option>
                  <option value="1">⭐ Poor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-gray-300 font-medium mb-2">Comment</label>
                <textarea
                  name="comment"
                  rows="4"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience..."
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical Records Modal */}
      {medicalRecordsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">My Medical Records</h3>
              <button
                onClick={() => setMedicalRecordsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {medicalRecords.length > 0 ? (
              <div className="space-y-3">
                {medicalRecords.map(record => (
                  <div key={record._id} className="border border-gray-200 rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{record.title}</h4>
                        <p className="text-sm text-gray-600">{record.type}</p>
                        {record.description && (
                          <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        {record.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No medical records yet</p>
            )}
          </div>
        </div>
      )}

      {/* Prescriptions Modal */}
      {showPrescriptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">My Prescriptions</h3>
                <button
                  onClick={() => setShowPrescriptions(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <MyPrescriptions
                patientId={user._id}
                onViewDetails={(prescription) => {
                  setSelectedPrescription(prescription);
                  setShowPrescriptions(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <PrescriptionDetail
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          onRefillRequest={(prescription) => {
            setSelectedPrescription(null);
            setRefillRequestModal(prescription);
          }}
        />
      )}

      {/* Refill Request Modal */}
      {refillRequestModal && (
        <RefillRequest
          prescription={refillRequestModal}
          onSuccess={() => {
            setRefillRequestModal(null);
            alert('Refill request submitted successfully!');
          }}
          onCancel={() => setRefillRequestModal(null)}
        />
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
                    bloodGroup: formData.get('bloodGroup'),
                    height: formData.get('height') ? parseFloat(formData.get('height')) : undefined,
                    weight: formData.get('weight') ? parseFloat(formData.get('weight')) : undefined
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

                    {/* Medical Information */}
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Medical Information</h4>
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
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Height (cm) - Optional</label>
                          <input
                            type="number"
                            name="height"
                            defaultValue={profileData.height || ''}
                            min="50"
                            max="300"
                            step="0.1"
                            placeholder="e.g., 170"
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Weight (kg) - Optional</label>
                          <input
                            type="number"
                            name="weight"
                            defaultValue={profileData.weight || ''}
                            min="1"
                            max="500"
                            step="0.1"
                            placeholder="e.g., 70"
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Display Calculated Age */}
                    {profileData.dateOfBirth && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
                        <span className="font-medium">Age:</span> {calculateAge(profileData.dateOfBirth)} years
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

export default PatientDashboard;
