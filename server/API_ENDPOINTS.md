# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

Body (Patient):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}

Body (Doctor):
{
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "password": "password123",
  "role": "doctor",
  "specialization": "Cardiology",
  "experience": 10,
  "contact": "1234567890"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "token": "eyJhbGc..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "token": "eyJhbGc..."
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

---

## Doctor Endpoints

### Get All Doctors
```http
GET /doctors
Query Parameters (optional):
  - specialization: Filter by specialization
  - search: Search by name

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "userId": {...},
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "experience": 10,
      "contact": "1234567890",
      "availableSlots": ["09:00", "10:00", "11:00"]
    }
  ]
}
```

### Get Doctor by ID
```http
GET /doctors/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": {...},
    "name": "Dr. Smith",
    "specialization": "Cardiology",
    "experience": 10,
    "contact": "1234567890",
    "availableSlots": ["09:00", "10:00", "11:00"]
  }
}
```

### Create Doctor (Admin Only)
```http
POST /doctors
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "name": "Dr. Johnson",
  "email": "johnson@example.com",
  "password": "password123",
  "specialization": "Neurology",
  "experience": 15,
  "contact": "9876543210"
}

Response: 201 Created
{
  "success": true,
  "message": "Doctor created successfully",
  "data": {...}
}
```

### Update Doctor Slots (Doctor/Admin)
```http
PUT /doctors/:id/slots
Authorization: Bearer <doctor_token>
Content-Type: application/json

Body:
{
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"]
}

Response: 200 OK
{
  "success": true,
  "message": "Available slots updated successfully",
  "data": {...}
}
```

### Delete Doctor (Admin Only)
```http
DELETE /doctors/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "Doctor deleted successfully"
}
```

---

## Appointment Endpoints

### Book Appointment (Patient)
```http
POST /appointments
Authorization: Bearer <patient_token>
Content-Type: application/json

Body:
{
  "doctorId": "doctor_id_here",
  "date": "2026-02-25",
  "time": "10:00",
  "reason": "Regular checkup"
}

Response: 201 Created
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "_id": "...",
    "patientId": {...},
    "doctorId": {...},
    "date": "2026-02-25T00:00:00.000Z",
    "time": "10:00",
    "status": "booked",
    "reason": "Regular checkup"
  }
}
```

### Get My Appointments (Patient)
```http
GET /appointments/my
Authorization: Bearer <patient_token>
Query Parameters (optional):
  - status: Filter by status (booked, completed, cancelled)

Response: 200 OK
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

### Get Doctor Appointments (Doctor)
```http
GET /appointments/doctor
Authorization: Bearer <doctor_token>
Query Parameters (optional):
  - status: Filter by status
  - date: Filter by date (YYYY-MM-DD)

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### Get All Appointments (Admin)
```http
GET /appointments
Authorization: Bearer <admin_token>
Query Parameters (optional):
  - status: Filter by status
  - doctorId: Filter by doctor
  - patientId: Filter by patient

Response: 200 OK
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### Update Appointment Status
```http
PUT /appointments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "completed"
}

Response: 200 OK
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": {...}
}

Note: Only doctors can mark as "completed"
```

### Delete Appointment (Admin)
```http
DELETE /appointments/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

## Health Check

### Server Health
```http
GET /health

Response: 200 OK
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-18T..."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Role 'patient' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Doctor not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details..."
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Token is returned on successful registration or login.

---

## Role-Based Access

| Endpoint | Admin | Doctor | Patient |
|----------|-------|--------|---------|
| POST /auth/register | ✓ | ✓ | ✓ |
| POST /auth/login | ✓ | ✓ | ✓ |
| GET /auth/me | ✓ | ✓ | ✓ |
| GET /doctors | ✓ | ✓ | ✓ |
| GET /doctors/:id | ✓ | ✓ | ✓ |
| POST /doctors | ✓ | ✗ | ✗ |
| PUT /doctors/:id/slots | ✓ | ✓* | ✗ |
| DELETE /doctors/:id | ✓ | ✗ | ✗ |
| POST /appointments | ✗ | ✗ | ✓ |
| GET /appointments/my | ✗ | ✗ | ✓ |
| GET /appointments/doctor | ✗ | ✓ | ✗ |
| GET /appointments | ✓ | ✗ | ✗ |
| PUT /appointments/:id/status | ✓ | ✓* | ✓* |
| DELETE /appointments/:id | ✓ | ✗ | ✗ |

*Only for their own resources
