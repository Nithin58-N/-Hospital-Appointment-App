import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { API } from '../api';

export default function AppointmentForm({ doctor, onBooked }){
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { date: '', time: '' }
  });
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const selectedDate = watch('date');

  // Fetch booked appointments when date changes
  useEffect(() => {
    if (selectedDate && doctor._id) {
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate, doctor._id]);

  const fetchBookedSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await API.get(`/appointments/doctor/${doctor._id}/booked-slots?date=${selectedDate}`);
      const data = response.data.data || response.data;
      setBookedSlots(data.bookedSlots || []);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Backend expects doctorId, not doctor
      const res = await API.post('/appointments', { doctorId: doctor._id, ...data });
      onBooked(res.data.data || res.data);
      reset();
      setSelectedTime('');
      alert('Appointment booked successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (time) => {
    if (bookedSlots.includes(time)) {
      return; // Don't allow selecting booked slots
    }
    setSelectedTime(time);
    setValue('time', time);
  };

  const isSlotBooked = (slot) => {
    return bookedSlots.includes(slot);
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h4 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">Book with {doctor.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{doctor.specialization}</p>
      
      {/* Date Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
        <input 
          type="date" 
          {...register('date', { required: true })} 
          min={minDate}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      {/* Time Slot Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Time Slot
          {loadingSlots && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Loading availability...)</span>}
        </label>
        <input type="hidden" {...register('time', { required: true })} />
        
        {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {doctor.availableSlots.map((slot, idx) => {
              const isBooked = isSlotBooked(slot);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTimeSelect(slot)}
                  disabled={isBooked}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    isBooked
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 cursor-not-allowed line-through'
                      : selectedTime === slot
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={isBooked ? 'This slot is already booked' : 'Click to select'}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-red-500 dark:text-red-400">No available slots</p>
        )}
        
        {selectedDate && bookedSlots.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ⚠️ Red slots are already booked for this date
          </p>
        )}
      </div>

      {/* Reason */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason (Optional)</label>
        <textarea
          {...register('reason')}
          placeholder="Brief description of your concern..."
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || !selectedTime}
        className="w-full bg-primary text-white px-4 py-2 rounded font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
