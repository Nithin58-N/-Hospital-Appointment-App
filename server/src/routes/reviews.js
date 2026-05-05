const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const {
  createReview,
  getDoctorReviews,
  getMyReviews,
  replyToReview,
  reportReview,
  deleteReview
} = require('../controllers/reviewController');

// Public routes
router.get('/doctor/:doctorId', getDoctorReviews);

// Protected routes
router.use(protect);

// Create review (patient only)
router.post('/', authorize('patient'), createReview);

// Get my reviews
router.get('/my', getMyReviews);

// Reply to review (doctor only)
router.put('/:id/reply', authorize('doctor'), replyToReview);

// Report review
router.put('/:id/report', reportReview);

// Delete review
router.delete('/:id', deleteReview);

module.exports = router;
