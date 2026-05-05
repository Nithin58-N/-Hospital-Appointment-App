import React, { useState, useEffect } from 'react';
import { API } from '../api';

export default function DoctorCard({ doc, onSelect }){
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (showReviews) {
      API.get(`/reviews/doctor/${doc._id}`)
        .then(r => setReviews(r.data.data || r.data))
        .catch(() => {});
    }
  }, [showReviews, doc._id]);

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating || 0));
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{doc.name}</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{doc.specialization}</p>
          {/* Rating Display */}
          {doc.averageRating > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">{renderStars(doc.averageRating)}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {doc.averageRating.toFixed(1)} ({doc.totalReviews} reviews)
              </span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{doc.experience || 'N/A'} yrs</p>
        </div>
      </div>
      
      <div className="mt-3 mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">📞 Contact: {doc.contact}</p>
        {doc.consultationFees && (
          <p className="text-xs text-gray-500 dark:text-gray-400">💰 Fees: ₹{doc.consultationFees}</p>
        )}
      </div>

      {/* Available Schedules */}
      <div className="mt-3 mb-3">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">⏰ Available Slots:</p>
        {doc.availableSlots && doc.availableSlots.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {doc.availableSlots.slice(0, 6).map((slot, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded"
              >
                {slot}
              </span>
            ))}
            {doc.availableSlots.length > 6 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{doc.availableSlots.length - 6} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-red-500 dark:text-red-400">No slots available</p>
        )}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onSelect(doc)} 
          className="flex-1 bg-primary text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
          disabled={!doc.availableSlots || doc.availableSlots.length === 0}
        >
          {doc.availableSlots && doc.availableSlots.length > 0 ? 'Book Appointment' : 'No Slots'}
        </button>
        {doc.totalReviews > 0 && (
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {showReviews ? 'Hide' : 'Reviews'}
          </button>
        )}
      </div>

      {/* Reviews Section */}
      {showReviews && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Patient Reviews</h4>
          {reviews.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {reviews.map(review => (
                <div key={review._id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{review.patientId?.name || 'Patient'}</span>
                    <span className="text-xs">{renderStars(review.rating)}</span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 dark:text-gray-300 text-xs">{review.comment}</p>
                  )}
                  {review.reply && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-300 dark:border-blue-600">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Doctor's Reply:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{review.reply}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">No reviews yet</p>
          )}
        </div>
      )}
    </div>
  )
}
