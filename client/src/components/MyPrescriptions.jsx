import React, { useState, useEffect } from 'react';
import { API } from '../api';

export default function MyPrescriptions({ patientId, onViewDetails }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadPrescriptions();
  }, [patientId]);

  async function loadPrescriptions() {
    try {
      setLoading(true);
      const response = await API.get(`/prescriptions/patient/${patientId}`);
      const data = response.data.data || response.data;
      setPrescriptions(data);
    } catch (error) {
      console.error('Load prescriptions error:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const filteredPrescriptions = filterStatus
    ? prescriptions.filter(p => p.status === filterStatus)
    : prescriptions;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Filter:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Prescriptions</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="draft">Draft</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({filteredPrescriptions.length} of {prescriptions.length})
        </span>
      </div>

      {/* Prescriptions Grid */}
      {filteredPrescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrescriptions.map(prescription => (
            <div
              key={prescription._id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewDetails(prescription)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">{prescription.prescriptionId}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(prescription.status)}`}>
                  {prescription.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="text-gray-900 dark:text-gray-100">
                  <span className="font-medium">Doctor:</span> {prescription.doctorId?.name || 'N/A'}
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  <span className="font-medium">Medicines:</span> {prescription.medicines?.length || 0}
                </div>
                {prescription.diagnosis && (
                  <div className="text-gray-600 dark:text-gray-400 truncate">
                    <span className="font-medium">Diagnosis:</span> {prescription.diagnosis}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Valid until: {new Date(prescription.validUntil).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(prescription);
                }}
                className="mt-3 w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {prescriptions.length === 0 ? (
            <p>No prescriptions yet</p>
          ) : (
            <p>No prescriptions match your filter</p>
          )}
        </div>
      )}
    </div>
  );
}
