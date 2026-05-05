import React, { useState } from 'react';
import { API } from '../api';
import MedicineSearch from './MedicineSearch';

export default function CreatePrescription({ patient, appointmentId, onSuccess, onCancel }) {
  const [medicines, setMedicines] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [medicineType, setMedicineType] = useState(''); // Filter for medicine type
  const [medicineForm, setMedicineForm] = useState({
    dosage: '',
    strength: '',
    frequency: '',
    duration: '',
    quantity: '',
    instructions: ''
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [loading, setLoading] = useState(false);

  function handleMedicineSelect(medicine) {
    setCurrentMedicine(medicine);
    setMedicineForm({
      ...medicineForm,
      strength: medicine.strength[0] || ''
    });
  }

  function addMedicine() {
    // Validate based on medicine form
    const form = currentMedicine.form;
    const isTabletOrCapsuleOrSyrup = ['tablet', 'capsule', 'syrup'].includes(form);
    const isTopical = ['cream', 'ointment', 'gel', 'drops'].includes(form);

    // Common required fields for all types
    if (!currentMedicine || !medicineForm.frequency || !medicineForm.duration) {
      alert('Please fill all required fields (frequency and duration)');
      return;
    }

    // Additional validation for tablets, capsules, syrups
    if (isTabletOrCapsuleOrSyrup) {
      if (!medicineForm.dosage || !medicineForm.strength || !medicineForm.quantity) {
        alert('Please fill all required fields (dosage, strength, and quantity)');
        return;
      }
    }

    const newMedicine = {
      medicineId: currentMedicine._id,
      medicineName: currentMedicine.name,
      genericName: currentMedicine.genericName,
      dosage: medicineForm.dosage || 'As directed',
      strength: medicineForm.strength || 'N/A',
      frequency: medicineForm.frequency,
      duration: medicineForm.duration,
      quantity: medicineForm.quantity ? parseInt(medicineForm.quantity) : 1,
      instructions: medicineForm.instructions || ''
    };

    setMedicines([...medicines, newMedicine]);
    setCurrentMedicine(null);
    setMedicineForm({
      dosage: '',
      strength: '',
      frequency: '',
      duration: '',
      quantity: '',
      instructions: ''
    });
  }

  function removeMedicine(index) {
    setMedicines(medicines.filter((_, i) => i !== index));
  }

  async function handleSubmit(status = 'active') {
    if (medicines.length === 0) {
      alert('Please add at least one medicine');
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/prescriptions', {
        patientId: patient._id,
        appointmentId,
        medicines,
        diagnosis,
        symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean),
        notes,
        validityDays,
        status
      });

      alert(`Prescription ${status === 'draft' ? 'saved as draft' : 'created'} successfully!`);
      onSuccess(response.data.data || response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Patient Info */}
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Patient Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-800 dark:text-gray-200">
            <span className="font-medium">Name:</span> {patient.name}
          </div>
          <div className="text-gray-800 dark:text-gray-200">
            <span className="font-medium">Age:</span> {patient.age || 'Not provided'}
          </div>
          <div className="text-gray-800 dark:text-gray-200">
            <span className="font-medium">Gender:</span> {patient.gender || 'Not provided'}
          </div>
          <div className="text-gray-800 dark:text-gray-200">
            <span className="font-medium">Blood Group:</span> {patient.bloodGroup || 'Not provided'}
          </div>
        </div>
      </div>

      {/* Medicine Search and Add */}
      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded p-4">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Add Medicines</h3>
        
        <div className="space-y-3">
          {/* Medicine Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Medicine Type *</label>
            <select
              value={medicineType}
              onChange={(e) => {
                setMedicineType(e.target.value);
                setCurrentMedicine(null); // Reset selected medicine when type changes
              }}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select medicine type first</option>
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="syrup">Syrup</option>
              <option value="cream">Cream</option>
              <option value="ointment">Ointment</option>
              <option value="gel">Gel</option>
              <option value="drops">Drops</option>
              <option value="injection">Injection</option>
            </select>
          </div>

          {/* Medicine Search - Only show if type is selected */}
          {medicineType && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                Search Medicine ({medicineType})
              </label>
              <MedicineSearch onSelect={handleMedicineSelect} medicineType={medicineType} />
            </div>
          )}

          {currentMedicine && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded space-y-3 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {currentMedicine.name} ({currentMedicine.genericName})
                </div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {currentMedicine.form}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Dosage - Only for tablets, capsules, syrups */}
                {['tablet', 'capsule', 'syrup'].includes(currentMedicine.form) && (
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-gray-100">
                      {currentMedicine.form === 'syrup' ? 'Dosage (ml) *' : 'Dosage *'}
                    </label>
                    <select
                      value={medicineForm.dosage}
                      onChange={(e) => setMedicineForm({...medicineForm, dosage: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select dosage</option>
                      {currentMedicine.commonDosages?.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Strength - For tablets, capsules, syrups */}
                {['tablet', 'capsule', 'syrup'].includes(currentMedicine.form) && (
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-gray-100">Strength *</label>
                    <select
                      value={medicineForm.strength}
                      onChange={(e) => setMedicineForm({...medicineForm, strength: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {currentMedicine.strength?.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Frequency - For all types */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-gray-100">
                    {['cream', 'ointment', 'gel', 'drops'].includes(currentMedicine.form) ? 'Application Frequency *' : 'Frequency *'}
                  </label>
                  <select
                    value={medicineForm.frequency}
                    onChange={(e) => setMedicineForm({...medicineForm, frequency: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select frequency</option>
                    {currentMedicine.commonFrequencies?.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Duration - For all types */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-gray-100">Duration *</label>
                  <select
                    value={medicineForm.duration}
                    onChange={(e) => setMedicineForm({...medicineForm, duration: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select duration</option>
                    {currentMedicine.commonDurations?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity - Only for tablets, capsules, syrups */}
                {['tablet', 'capsule', 'syrup'].includes(currentMedicine.form) && (
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-gray-100">
                      {currentMedicine.form === 'syrup' ? 'Quantity (bottles) *' : 'Quantity *'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={medicineForm.quantity}
                      onChange={(e) => setMedicineForm({...medicineForm, quantity: e.target.value})}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={currentMedicine.form === 'syrup' ? 'e.g., 1' : 'e.g., 15'}
                    />
                  </div>
                )}

                {/* Instructions - For all types */}
                <div className={['cream', 'ointment', 'gel', 'drops'].includes(currentMedicine.form) ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-gray-100">
                    {['cream', 'ointment', 'gel', 'drops'].includes(currentMedicine.form) ? 'Application Instructions' : 'Instructions'}
                  </label>
                  <input
                    type="text"
                    value={medicineForm.instructions}
                    onChange={(e) => setMedicineForm({...medicineForm, instructions: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      ['cream', 'ointment', 'gel'].includes(currentMedicine.form) ? 'e.g., Apply thin layer on affected area' :
                      currentMedicine.form === 'syrup' ? 'e.g., Take after meals with water' :
                      'e.g., Take after meals'
                    }
                  />
                </div>
              </div>

              <button
                onClick={addMedicine}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
              >
                Add Medicine
              </button>
            </div>
          )}
        </div>

        {/* Added Medicines List */}
        {medicines.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Added Medicines ({medicines.length})</h4>
            {medicines.map((med, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-2 text-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1 text-gray-900 dark:text-gray-100">
                    <div className="font-medium">{med.medicineName}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {med.dosage} • {med.strength} • {med.frequency} • {med.duration} • Qty: {med.quantity}
                    </div>
                    {med.instructions && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{med.instructions}</div>
                    )}
                  </div>
                  <button
                    onClick={() => removeMedicine(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diagnosis and Notes */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm dark:text-gray-300 font-medium mb-1">Diagnosis</label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows="2"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter diagnosis..."
          />
        </div>

        <div>
          <label className="block text-sm dark:text-gray-300 font-medium mb-1">Symptoms (comma-separated)</label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., fever, headache, cough"
          />
        </div>

        <div>
          <label className="block text-sm dark:text-gray-300 font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="2"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes or instructions..."
          />
        </div>

        <div>
          <label className="block text-sm dark:text-gray-300 font-medium mb-1">Validity (days)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={validityDays}
            onChange={(e) => setValidityDays(parseInt(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleSubmit('active')}
          disabled={loading || medicines.length === 0}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
