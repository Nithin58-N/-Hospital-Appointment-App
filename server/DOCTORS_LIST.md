# Hospital Doctors List

## Available Doctors

The system now has 10 doctors across various specializations:

| # | Name | Specialization | Experience | Email | Contact |
|---|------|----------------|------------|-------|---------|
| 1 | Dr. Sarah Smith | Cardiology | 15 years | sarah.smith@hospital.com | 1234567890 |
| 2 | Dr. Michael Johnson | Neurology | 12 years | michael.johnson@hospital.com | 2345678901 |
| 3 | Dr. Emily Davis | Pediatrics | 8 years | emily.davis@hospital.com | 3456789012 |
| 4 | Dr. James Wilson | Orthopedics | 20 years | james.wilson@hospital.com | 4567890123 |
| 5 | Dr. Lisa Anderson | Dermatology | 10 years | lisa.anderson@hospital.com | 5678901234 |
| 6 | Dr. Robert Brown | General Medicine | 18 years | robert.brown@hospital.com | 6789012345 |
| 7 | Dr. Jennifer Martinez | Gynecology | 14 years | jennifer.martinez@hospital.com | 7890123456 |
| 8 | Dr. David Lee | Psychiatry | 11 years | david.lee@hospital.com | 8901234567 |
| 9 | Dr. Maria Garcia | Ophthalmology | 9 years | maria.garcia@hospital.com | 9012345678 |
| 10 | Dr. Thomas White | ENT | 16 years | thomas.white@hospital.com | 0123456789 |

## Available Time Slots

All doctors have the following available time slots:
- 09:00 AM
- 10:00 AM
- 11:00 AM
- 02:00 PM (14:00)
- 03:00 PM (15:00)
- 04:00 PM (16:00)
- 05:00 PM (17:00)

## Specializations Available

1. **Cardiology** - Heart and cardiovascular system
2. **Neurology** - Brain and nervous system
3. **Pediatrics** - Children's health
4. **Orthopedics** - Bones, joints, and muscles
5. **Dermatology** - Skin conditions
6. **General Medicine** - General health issues
7. **Gynecology** - Women's health
8. **Psychiatry** - Mental health
9. **Ophthalmology** - Eye care
10. **ENT** - Ear, Nose, and Throat

## How to Add More Doctors

Run the following command:
```bash
npm run add-doctors
```

Or manually register doctors through:
- POST `/api/auth/register` with role: "doctor"
- Include: name, email, password, specialization, experience, contact

## How to Update Doctor Slots

Doctors can update their available slots:
```bash
PUT /api/doctors/:id/slots
Authorization: Bearer <doctor_token>

{
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"]
}
```

## Patient Booking

Patients can:
1. View all doctors: `GET /api/doctors`
2. Filter by specialization: `GET /api/doctors?specialization=Cardiology`
3. Search by name: `GET /api/doctors?search=Smith`
4. Book appointments with available slots

## Notes

- All doctors are verified and ready to accept appointments
- Doctors can manage their own schedules
- Patients can book appointments during available slots
- Double booking is prevented by the system
