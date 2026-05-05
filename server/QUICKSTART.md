# Quick Start Guide

## Setup (5 minutes)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Update .env with your MongoDB URI**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   MongoDB Connected: ...
   Server running on port 5000
   ```

## Test the API

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register a Patient
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Patient",
    "email": "patient@test.com",
    "password": "password123",
    "role": "patient"
  }'
```

### 3. Register a Doctor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Smith",
    "email": "doctor@test.com",
    "password": "password123",
    "role": "doctor",
    "specialization": "Cardiology",
    "experience": 10,
    "contact": "1234567890"
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123"
  }'
```

Save the token from the response!

### 5. Get All Doctors
```bash
curl http://localhost:5000/api/doctors
```

### 6. Update Doctor Slots (use doctor token)
```bash
curl -X PUT http://localhost:5000/api/doctors/DOCTOR_ID/slots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN" \
  -d '{
    "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  }'
```

### 7. Book Appointment (use patient token)
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN" \
  -d '{
    "doctorId": "DOCTOR_ID",
    "date": "2026-02-25",
    "time": "10:00",
    "reason": "Regular checkup"
  }'
```

### 8. Get My Appointments (patient)
```bash
curl http://localhost:5000/api/appointments/my \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN"
```

### 9. Get Doctor Appointments (doctor)
```bash
curl http://localhost:5000/api/appointments/doctor \
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN"
```

## Common Issues

### MongoDB Connection Error
- Check your MONGO_URI in .env
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify network connectivity

### JWT Error
- Make sure JWT_SECRET is set in .env
- Check if token is properly formatted: `Bearer <token>`

### Validation Errors
- Check request body matches the required format
- Ensure all required fields are provided
- Verify data types (e.g., experience should be a number)

## Next Steps

1. Create an admin user manually in MongoDB
2. Test all endpoints with Postman or Thunder Client
3. Connect your frontend application
4. Review the full README.md for detailed documentation

## Default Test Credentials

After registration, you can use:
- **Patient**: patient@test.com / password123
- **Doctor**: doctor@test.com / password123

## API Base URL

Development: `http://localhost:5000/api`

## Available Endpoints

- **Auth**: `/api/auth` (register, login, me)
- **Doctors**: `/api/doctors` (list, get, create, update slots, delete)
- **Appointments**: `/api/appointments` (book, list, update status, delete)
- **Health**: `/api/health` (server status)
