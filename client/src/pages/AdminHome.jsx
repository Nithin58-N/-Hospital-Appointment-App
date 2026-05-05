import React, { useEffect, useState } from 'react';
import { API } from '../api';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentAmbulanceRequests, setRecentAmbulanceRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadRecentAppointments();
    loadRecentAmbulanceRequests();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
    setLoading(false);
  }

  async function loadRecentAppointments() {
    try {
      const res = await API.get('/admin/appointments?limit=10');
      setRecentAppointments(res.data.data);
    } catch (err) {
      console.error('Failed to load recent appointments:', err);
    }
  }

  async function loadRecentAmbulanceRequests() {
    try {
      const res = await API.get('/ambulance/requests?limit=10');
      setRecentAmbulanceRequests(res.data.data);
    } catch (err) {
      console.error('Failed to load recent ambulance requests:', err);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admin Overview</h2>
      
      {loading && <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>}

      {stats && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Users</h3>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.overview.totalUsers}</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 dark:text-green-100">Total Doctors</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.overview.totalDoctors}</p>
            </div>
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100">Appointments</h3>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.overview.totalAppointments}</p>
            </div>
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Total Revenue</h3>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">₹{stats.overview.totalRevenue}</p>
            </div>
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-red-900 dark:text-red-100">Pending Approvals</h3>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.overview.pendingApprovals}</p>
            </div>
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Online Users</h3>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.overview.onlineUsers}</p>
            </div>
          </div>

          {/* Ambulance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-orange-900 dark:text-orange-100">🚑 Total Ambulance Requests</h3>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.overview.totalAmbulanceRequests || 0}</p>
            </div>
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-red-900 dark:text-red-100">⏳ Pending Requests</h3>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.overview.pendingAmbulanceRequests || 0}</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 dark:text-green-100">🚨 Dispatched</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.overview.dispatchedAmbulanceRequests || 0}</p>
            </div>
          </div>

          {/* User Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">User Role Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Patients:</span>
                  <span className="font-medium">{stats.usersByRole.patients}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Doctors:</span>
                  <span className="font-medium">{stats.usersByRole.doctors}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Admins:</span>
                  <span className="font-medium">{stats.usersByRole.admins}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Appointment Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Booked:</span>
                  <span className="font-medium">{stats.appointmentsByStatus.booked}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Completed:</span>
                  <span className="font-medium">{stats.appointmentsByStatus.completed}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Cancelled:</span>
                  <span className="font-medium">{stats.appointmentsByStatus.cancelled}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 mb-6">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Recent Registrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Name</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Email</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Role</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRegistrations.map(user => (
                    <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 text-gray-700 dark:text-gray-300">{user.name}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{user.email}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{user.role}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Appointments and Ambulance Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Recent Appointments</h3>
              <div className="space-y-3">
                {recentAppointments.length > 0 ? (
                  recentAppointments.slice(0, 5).map(apt => (
                    <div key={apt._id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {apt.patientId?.name || 'Patient'} → {apt.doctorId?.name || 'Doctor'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(apt.date).toLocaleDateString()} at {apt.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          apt.status === 'booked' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                          apt.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent appointments</p>
                )}
              </div>
            </div>

            {/* Recent Ambulance Requests */}
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Recent Ambulance Requests</h3>
              <div className="space-y-3">
                {recentAmbulanceRequests.length > 0 ? (
                  recentAmbulanceRequests.slice(0, 5).map(req => (
                    <div key={req._id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {req.name} - {req.phone}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {req.location}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(req.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          req.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                          req.status === 'dispatched' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                          req.status === 'arrived' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' :
                          req.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent ambulance requests</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
