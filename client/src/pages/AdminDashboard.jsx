import React, { useEffect, useState } from 'react';
import { API } from '../api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (activeTab === 'overview') loadStats();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'doctors') loadTherapists();
    else if (activeTab === 'approvals') loadPendingApprovals();
    else if (activeTab === 'appointments') loadAppointments();
    else if (activeTab === 'revenue') loadRevenue();
    else if (activeTab === 'ambulance') loadAmbulanceRequests();
  }, [activeTab]);

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

  async function loadUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole) params.append('role', filterRole);
      if (filterStatus) params.append('status', filterStatus);
      const res = await API.get(`/admin/users?${params}`);
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
    setLoading(false);
  }

  async function loadTherapists() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      const res = await API.get(`/admin/therapists?${params}`);
      setTherapists(res.data.data);
    } catch (err) {
      console.error('Failed to load therapists:', err);
    }
    setLoading(false);
  }

  async function loadPendingApprovals() {
    setLoading(true);
    try {
      const res = await API.get('/admin/pending-approvals');
      setPendingApprovals(res.data.data);
    } catch (err) {
      console.error('Failed to load pending approvals:', err);
    }
    setLoading(false);
  }

  async function loadAppointments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus) params.append('status', filterStatus);
      const res = await API.get(`/admin/appointments?${params}`);
      setAppointments(res.data.data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
    setLoading(false);
  }

  async function loadRevenue() {
    setLoading(true);
    try {
      const res = await API.get('/admin/revenue');
      setRevenue(res.data.data);
    } catch (err) {
      console.error('Failed to load revenue:', err);
    }
    setLoading(false);
  }

  async function loadAmbulanceRequests() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus) params.append('status', filterStatus);
      const res = await API.get(`/ambulance/requests?${params}`);
      setAmbulanceRequests(res.data.data);
    } catch (err) {
      console.error('Failed to load ambulance requests:', err);
    }
    setLoading(false);
  }

  async function toggleUserStatus(userId, currentStatus) {
    try {
      await API.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      loadUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  }

  async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      loadUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  }

  async function approveTherapist(therapistId, approve) {
    try {
      await API.patch(`/admin/therapists/${therapistId}/approve`, { isApproved: approve });
      if (activeTab === 'approvals') loadPendingApprovals();
      else loadTherapists();
    } catch (err) {
      alert('Failed to update therapist status');
    }
  }

  async function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await API.patch(`/admin/appointments/${appointmentId}/cancel`);
      loadAppointments();
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  }

  async function updateAmbulanceStatus(requestId, status) {
    try {
      await API.patch(`/ambulance/requests/${requestId}/status`, { status });
      loadAmbulanceRequests();
    } catch (err) {
      alert('Failed to update ambulance status');
    }
  }

  async function deleteAmbulanceRequest(requestId) {
    if (!confirm('Are you sure you want to delete this ambulance request?')) return;
    try {
      await API.delete(`/ambulance/requests/${requestId}`);
      loadAmbulanceRequests();
    } catch (err) {
      alert('Failed to delete ambulance request');
    }
  }

  function exportRevenueCSV() {
    if (!revenue) return;
    const csvData = [
      ['Month', 'Revenue', 'Sessions'],
      ...revenue.monthlyRevenue.map(m => [
        `${m._id.year}-${m._id.month}`,
        m.revenue,
        m.count
      ])
    ];
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-report.csv';
    a.click();
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Manage Users' },
    { id: 'doctors', label: 'Therapists / Doctors' },
    { id: 'approvals', label: 'Pending Approvals' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'ambulance', label: 'Ambulance Requests' },
    { id: 'revenue', label: 'Revenue' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admin Dashboard</h2>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-300 dark:border-gray-600">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>}

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
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
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
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
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={loadUsers}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-700 rounded-lg">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Name</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Email</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Role</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Joined</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">{user.name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{user.email}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{user.role}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isActive 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Therapists Tab */}
      {activeTab === 'doctors' && (
        <div>
          {/* Search */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={loadTherapists}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Therapists Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-700 rounded-lg">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Name</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Email</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Specialization</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Experience</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Fee</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {therapists.map(therapist => (
                  <tr key={therapist._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.userId?.name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.userId?.email}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.specialization}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.experience} years</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">₹{therapist.consultationFees}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        therapist.isApproved 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {therapist.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      {!therapist.isApproved && (
                        <button
                          onClick={() => approveTherapist(therapist._id, true)}
                          className="mr-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Approve
                        </button>
                      )}
                      {therapist.isApproved && (
                        <button
                          onClick={() => approveTherapist(therapist._id, false)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Approvals Tab */}
      {activeTab === 'approvals' && (
        <div>
          <div className="mb-4 text-gray-700 dark:text-gray-300">
            Total Pending: <span className="font-bold">{pendingApprovals.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-700 rounded-lg">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Name</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Email</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Specialization</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Experience</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Applied</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map(therapist => (
                  <tr key={therapist._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.userId?.name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.userId?.email}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.specialization}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{therapist.experience} years</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(therapist.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => approveTherapist(therapist._id, true)}
                        className="mr-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => approveTherapist(therapist._id, false)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={loadAppointments}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-700 rounded-lg">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Patient</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Doctor</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Date</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Time</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Type</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Fee</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">{apt.patientId?.name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{apt.doctorId?.name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(apt.date).toLocaleDateString()}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{apt.time}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{apt.appointmentType || 'N/A'}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">₹{apt.doctorId?.consultationFee || 0}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        apt.status === 'booked' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                        apt.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {apt.status === 'booked' && (
                        <button
                          onClick={() => cancelAppointment(apt._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && revenue && (
        <div>
          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 dark:text-green-100">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">₹{revenue.overview.totalRevenue}</p>
            </div>
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Paid Sessions</h3>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{revenue.overview.paidSessions}</p>
            </div>
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100">Avg per Session</h3>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">₹{revenue.overview.averagePerSession.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Active Therapists</h3>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{revenue.overview.activeTherapists}</p>
            </div>
          </div>

          {/* Export Button */}
          <div className="mb-4">
            <button
              onClick={exportRevenueCSV}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Export to CSV
            </button>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 mb-6">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Monthly Revenue</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Month</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Revenue</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Sessions</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.monthlyRevenue.map((m, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 text-gray-700 dark:text-gray-300">{m._id.year}-{m._id.month}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">₹{m.revenue}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{m.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Therapists */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Top Therapists by Revenue</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Name</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Specialization</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Revenue</th>
                    <th className="text-left py-2 text-gray-900 dark:text-gray-100">Sessions</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.topTherapists.map((t, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 text-gray-700 dark:text-gray-300">{t.doctorName}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{t.specialization}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">₹{t.totalRevenue}</td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">{t.sessionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Ambulance Requests Tab */}
      {activeTab === 'ambulance' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="dispatched">Dispatched</option>
              <option value="arrived">Arrived</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={loadAmbulanceRequests}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Ambulance Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-700 rounded-lg">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Name</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Phone</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Location</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Requested At</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left p-3 text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ambulanceRequests.map(req => (
                  <tr key={req._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">{req.name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{req.phone}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{req.location}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(req.createdAt).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        req.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                        req.status === 'dispatched' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                        req.status === 'arrived' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' :
                        req.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => updateAmbulanceStatus(req._id, 'dispatched')}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Dispatch
                          </button>
                        )}
                        {req.status === 'dispatched' && (
                          <button
                            onClick={() => updateAmbulanceStatus(req._id, 'arrived')}
                            className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                          >
                            Arrived
                          </button>
                        )}
                        {req.status === 'arrived' && (
                          <button
                            onClick={() => updateAmbulanceStatus(req._id, 'completed')}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          >
                            Complete
                          </button>
                        )}
                        {(req.status === 'pending' || req.status === 'dispatched') && (
                          <button
                            onClick={() => updateAmbulanceStatus(req._id, 'cancelled')}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => deleteAmbulanceRequest(req._id)}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
