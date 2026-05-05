import React, { useState } from 'react';
import { API } from '../api';

export default function RefillRequest({ prescription, onSuccess, onCancel }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      await API.post(`/prescriptions/${prescription._id}/refill-request`, { notes });
      alert('Refill request submitted successfully!');
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit refill request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Request Prescription Refill</h3>
          
          {/* Original Prescription Info */}
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Original Prescription</h4>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">ID:</span> {prescription.prescriptionId}</div>
              <div><span className="font-medium">Doctor:</span> {prescription.doctorId?.name}</div>
              <div><span className="font-medium">Medicines:</span> {prescription.medicines?.length}</div>
              <div><span className="font-medium">Valid Until:</span> {new Date(prescription.validUntil).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Medicines List */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-sm">Medicines to be refilled:</h4>
            <div className="space-y-1">
              {prescription.medicines?.map((med, index) => (
                <div key={index} className="text-sm text-gray-700 bg-white border border-gray-200 rounded p-2">
                  {index + 1}. {med.medicineName} - {med.dosage}, {med.frequency}, {med.duration}
                </div>
              ))}
            </div>
          </div>

          {/* Refill Request Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Any additional information for the doctor..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Refill Request'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
            ℹ️ Your refill request will be sent to the prescribing doctor for approval. You'll be notified once it's processed.
          </div>
        </div>
      </div>
    </div>
  );
}
