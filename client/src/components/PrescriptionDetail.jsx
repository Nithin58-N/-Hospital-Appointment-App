import React, { useState } from 'react';
import { API } from '../api';

export default function PrescriptionDetail({ prescription, onClose, onRefillRequest }) {
  const [loading, setLoading] = useState(false);

  async function handleDownloadPDF() {
    try {
      setLoading(true);
      const response = await API.get(`/prescriptions/${prescription._id}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${prescription.prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('PDF generation not yet implemented');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function canRequestRefill() {
    if (prescription.status !== 'active' || prescription.refillRequested) {
      return false;
    }
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return new Date(prescription.validUntil) <= threeDaysFromNow;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{prescription.prescriptionId}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Issued on {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(prescription.status)}`}>
                {prescription.status}
              </span>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl ml-2"
              >
                ×
              </button>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Doctor Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Name:</span> {prescription.doctorId?.name || 'N/A'}</div>
              <div><span className="font-medium">Specialization:</span> {prescription.doctorId?.specialization || 'N/A'}</div>
              <div><span className="font-medium">Contact:</span> {prescription.doctorId?.contact || 'N/A'}</div>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Diagnosis</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{prescription.diagnosis}</p>
            </div>
          )}

          {/* Symptoms */}
          {prescription.symptoms && prescription.symptoms.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {prescription.symptoms.map((symptom, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medicines */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Prescribed Medicines</h3>
            <div className="space-y-3">
              {prescription.medicines?.map((medicine, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <div className="font-medium text-lg mb-2">
                    {index + 1}. {medicine.medicineName}
                    {medicine.genericName && (
                      <span className="text-sm text-gray-600 ml-2">({medicine.genericName})</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div><span className="font-medium">Dosage:</span> {medicine.dosage}</div>
                    <div><span className="font-medium">Strength:</span> {medicine.strength}</div>
                    <div><span className="font-medium">Frequency:</span> {medicine.frequency}</div>
                    <div><span className="font-medium">Duration:</span> {medicine.duration}</div>
                    <div><span className="font-medium">Quantity:</span> {medicine.quantity}</div>
                  </div>
                  {medicine.instructions && (
                    <div className="mt-2 text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                      <span className="font-medium">Instructions:</span> {medicine.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {prescription.notes && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Additional Notes</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{prescription.notes}</p>
            </div>
          )}

          {/* Validity */}
          <div className="mb-6 p-3 bg-gray-50 rounded text-sm">
            <span className="font-medium">Valid Until:</span> {new Date(prescription.validUntil).toLocaleDateString()}
            {new Date(prescription.validUntil) < new Date() && (
              <span className="ml-2 text-red-600 font-medium">(Expired)</span>
            )}
          </div>

          {/* Refill Status */}
          {prescription.refillRequested && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm font-medium text-yellow-800">
                ⏳ Refill request pending approval
              </p>
              {prescription.refillNotes && (
                <p className="text-xs text-gray-600 mt-1">Notes: {prescription.refillNotes}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Generating...' : '📄 Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              🖨️ Print
            </button>
            {canRequestRefill() && (
              <button
                onClick={() => onRefillRequest(prescription)}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🔄 Request Refill
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
