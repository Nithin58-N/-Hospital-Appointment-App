# 🧪 Testing Guide - New Features

## Overview
This guide will help you test all the new features implemented in the Hospital Appointment System.

---

## 🚀 Getting Started

### 1. Start Both Servers

**Backend (Terminal 1):**
```bash
cd server
npm run dev
```
Server should be running on: `http://localhost:5000`

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```
Client should be running on: `http://localhost:5174` (or 5173)

### 2. Access the Application
Open your browser and go to: `http://localhost:5174`

---

## 📝 Test Scenarios

### Test 1: User Registration & Login

#### Register as Patient
1. Click "Register" button
2. Select "Patient" card (blue)
3. Fill in details:
   - Name: Test Patient
   - Email: patient@test.com
   - Password: test123
4. Click "Register"
5. You should be logged in automatically

#### Register as Doctor
1. Logout (if logged in)
2. Click "Register"
3. Select "Doctor" card (green)
4. Fill in details:
   - Name: Dr. Test
   - Email: doctor@test.com
   - Password: test123
   - Specialization: General Medicine
   - Experience: 5
   - Contact: 1234567890
5. Click "Register"
6. Doctor profile is created with default slots

---

### Test 2: Book an Appointment (Patient)

1. Login as patient (patient@test.com / test123)
2. Go to "Home" or "Dashboard"
3. You should see a list of doctors
4. Click on a doctor card to view:
   - ⭐ Rating and reviews (if any)
   - Available time slots
   - Contact info
5. Click "Book Appointment"
6. Select:
   - Date (today or future)
   - Time slot from available options
   - Reason (optional)
7. Click "Book Appointment"
8. Success! Appointment should appear in your dashboard

---

### Test 3: Reschedule Appointment (Patient)

1. Go to Patient Dashboard
2. Find a booked appointment
3. Click "Reschedule" button
   - Note: Shows remaining reschedules (2 max)
4. In the modal:
   - Select new date
   - Select new time slot
5. Click "Reschedule"
6. Success! Appointment updated
7. Notice "Rescheduled X time(s)" indicator

**Test Limits:**
- Try rescheduling 3 times - should be blocked after 2
- Try rescheduling a completed appointment - should fail
- Try rescheduling to an already booked slot - should fail

---

### Test 4: Cancel Appointment (Patient)

1. Go to Patient Dashboard
2. Find a booked appointment
3. Click "Cancel" button
4. Confirm cancellation
5. Status changes to "cancelled"
6. Cancel button disappears

---

### Test 5: Write a Review (Patient)

1. Login as patient
2. Go to Dashboard
3. Find a COMPLETED appointment
4. Click "Write Review" button
5. In the modal:
   - Select rating (1-5 stars)
   - Write a comment (optional)
6. Click "Submit Review"
7. Success! Review is saved

**Test on Doctor Card:**
1. Go to Home page
2. Find the doctor you reviewed
3. Click "Reviews" button
4. Your review should appear
5. Rating should be updated on doctor card

---

### Test 6: View Medical Records (Patient)

1. Login as patient
2. Go to Dashboard
3. Click the floating "📋 Medical Records" button (bottom right)
4. Modal opens showing your medical records
5. Currently empty (no records created yet)

**Note:** Medical record creation is typically done by doctors. For testing, you can use the API directly or wait for doctor interface.

---

### Test 7: Manage Appointments (Doctor)

1. Login as doctor (doctor@test.com / test123)
2. Go to Dashboard
3. You should see:
   - Your rating and total reviews
   - List of patient appointments
   - Filter options

**Test Filters:**
1. Filter by Date:
   - Select today's date
   - Only today's appointments show
2. Filter by Time Slot:
   - Select a specific time
   - Only appointments at that time show
3. Filter by Status:
   - Select "booked"
   - Only booked appointments show
4. Click "Clear Filters" to reset

**Change Appointment Status:**
1. Find a booked appointment
2. Click "✓ Complete" to mark as completed
3. Or click "✕ Cancel" to cancel
4. Status updates immediately

---

### Test 8: Manage Available Slots (Doctor)

1. Login as doctor
2. Go to Dashboard
3. Click "Manage Available Slots"
4. You should see current slots

**Add Individual Slot:**
1. Use the time picker
2. Click "Add Slot"
3. Slot appears in the list

**Add Common Slots:**
1. Click "Add Common Slots"
2. Standard slots (9AM-5PM) are added

**Remove Slot:**
1. Click the "×" button on any slot
2. Slot is removed

**Save Changes:**
1. Click "Save Changes"
2. Slots are updated
3. Patients will see new slots when booking

---

### Test 9: View and Reply to Reviews (Doctor)

1. Login as doctor
2. Go to Dashboard
3. Click "View Reviews" button
4. Reviews section opens

**For Each Review:**
- See patient name
- See rating (stars)
- See comment
- See date

**Reply to Review:**
1. Click "Reply to this review"
2. Text area appears
3. Write your reply
4. Click "Post Reply"
5. Reply appears below the review
6. Patients can see your reply

---

### Test 10: Doctor Ratings Display

1. Logout and login as patient
2. Go to Home page
3. Look at doctor cards:
   - ⭐ Rating displayed (e.g., ⭐⭐⭐⭐⭐ 4.5)
   - Total reviews count shown
   - Consultation fees (if set)

**View Reviews:**
1. Click "Reviews" button on doctor card
2. Reviews section expands
3. See all patient reviews
4. See doctor replies (if any)
5. Click "Hide" to collapse

---

## 🎯 Feature Checklist

### ✅ Appointment Rescheduling
- [ ] Can reschedule booked appointment
- [ ] Shows remaining reschedule count
- [ ] Blocks after 2 reschedules
- [ ] Cannot reschedule completed/cancelled
- [ ] Validates slot availability
- [ ] Shows reschedule history indicator

### ✅ Reviews & Ratings
- [ ] Can write review after completed appointment
- [ ] Rating 1-5 stars works
- [ ] Comment is optional
- [ ] Reviews appear on doctor card
- [ ] Average rating calculated correctly
- [ ] Total reviews count accurate
- [ ] Doctor can reply to reviews
- [ ] Reply appears below review

### ✅ Medical Records
- [ ] Medical records button visible
- [ ] Modal opens correctly
- [ ] Shows record count
- [ ] Records list displays properly
- [ ] Shows record type, title, date

### ✅ Enhanced Doctor Profile
- [ ] Rating displayed on card
- [ ] Total reviews shown
- [ ] Consultation fees visible (if set)
- [ ] Available slots displayed
- [ ] Reviews section expandable

### ✅ Doctor Dashboard Enhancements
- [ ] Rating and reviews count in header
- [ ] View Reviews button works
- [ ] Reviews section displays properly
- [ ] Can reply to reviews
- [ ] Reply saves successfully
- [ ] Filters work correctly

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid credentials"
**Solution:** Make sure you're using the correct email/password. Try registering a new account.

### Issue: "Cannot reschedule"
**Solution:** Check if appointment is booked status and hasn't reached reschedule limit.

### Issue: "Slot already booked"
**Solution:** Choose a different time slot or date.

### Issue: Reviews not showing
**Solution:** Make sure appointment is marked as "completed" first.

### Issue: Doctor has no slots
**Solution:** Doctor needs to add available slots in "Manage Available Slots".

---

## 📊 API Testing (Optional)

If you want to test the API directly:

### Test Reschedule API
```bash
curl -X PUT http://localhost:5000/api/appointments/APPOINTMENT_ID/reschedule \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newDate": "2024-03-25",
    "newTime": "15:00"
  }'
```

### Test Create Review API
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "DOCTOR_ID",
    "rating": 5,
    "comment": "Excellent doctor!"
  }'
```

### Test Get Doctor Reviews API
```bash
curl http://localhost:5000/api/reviews/doctor/DOCTOR_ID
```

---

## 🎬 Complete Test Flow

### Scenario: Complete Patient Journey

1. **Register as Patient**
   - patient@test.com / test123

2. **Browse Doctors**
   - View ratings and reviews
   - Check available slots

3. **Book Appointment**
   - Select doctor
   - Choose date and time
   - Add reason

4. **Reschedule Appointment**
   - Change to different date/time
   - See reschedule count

5. **Wait for Completion**
   - Doctor marks as completed

6. **Write Review**
   - Give 5-star rating
   - Write positive comment

7. **View Medical Records**
   - Check records button
   - View any records added by doctor

### Scenario: Complete Doctor Journey

1. **Register as Doctor**
   - doctor@test.com / test123
   - Add specialization and experience

2. **Manage Slots**
   - Add available time slots
   - Save changes

3. **View Appointments**
   - See patient bookings
   - Filter by date/time/status

4. **Complete Appointment**
   - Mark appointment as completed

5. **View Reviews**
   - Check patient reviews
   - Reply to reviews

6. **Monitor Rating**
   - See average rating update
   - Track total reviews

---

## ✨ Success Indicators

You'll know everything is working when:

1. ✅ Patients can reschedule appointments (up to 2 times)
2. ✅ Reviews appear on doctor cards with star ratings
3. ✅ Doctors can view and reply to reviews
4. ✅ Medical records button is visible and functional
5. ✅ Doctor ratings update automatically
6. ✅ Filters work on doctor dashboard
7. ✅ All modals open and close properly
8. ✅ No console errors in browser

---

## 📸 Screenshots to Verify

Take screenshots of:
1. Patient Dashboard with reschedule button
2. Reschedule modal
3. Review modal
4. Doctor card with ratings
5. Reviews section expanded
6. Doctor dashboard with reviews
7. Reply to review interface
8. Medical records modal

---

## 🎉 Congratulations!

If all tests pass, you've successfully implemented and tested:
- ✅ Appointment Rescheduling
- ✅ Medical Records Management
- ✅ Doctor Ratings & Reviews
- ✅ Enhanced Patient/Doctor Profiles
- ✅ Advanced Filtering
- ✅ Review Reply System

Your Hospital Appointment System is now feature-complete! 🚀

---

*Happy Testing!* 🧪
