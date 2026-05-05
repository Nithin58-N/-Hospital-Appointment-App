# Hospital Appointment System - Backend API

A production-ready RESTful API built with Node.js, Express, and MongoDB for managing hospital appointments.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for three roles - Admin, Doctor, and Patient
- **Doctor Management**: CRUD operations for doctor profiles with specializations
- **Appointment System**: Book, view, update, and cancel appointments
- **Automatic Doctor Profile Creation**: When a user registers as a doctor, their profile is automatically created
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with meaningful error messages
- **Security**: Password hashing with bcrypt, JWT token authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware

## Project Structure

```
server/src/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User model (admin, doctor, patient)
│   ├── Doctor.js            # Doctor profile model
│   └── Appointment.js       # Appointment model
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── roles.js             # Role-based authorization
│   └── validate.js          # Validation error handler
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── doctorController.js  # Doctor management logic
│   └── appointmentController.js  # Appointment logic
├── routes/
│   ├── auth.js              # Auth routes
│   ├── doctors.js           # Doctor routes
│   └── appointments.js      # Appointment routes
├── app.js                   # Express app configuration
└── index.js                 # Server entry point
```

## Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables:
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

## Running the Application

**Development Mode** (with auto-restart):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |

### Doctor Routes (`/api/doctors`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all doctors | Public |
| GET | `/:id` | Get doctor by ID | Public |
| POST | `/` | Create new doctor | Admin |
| PUT | `/:id/slots` | Update available slots | Doctor/Admin |
| DELETE | `/:id` | Delete doctor | Admin |

### Appointment Routes (`/api/appointments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Book appointment | Patient |
| GET | `/my` | Get patient appointments | Patient |
| GET | `/doctor` | Get doctor appointments | Doctor |
| GET | `/` | Get all appointments | Admin |
| PUT | `/:id/status` | Update appointment status | Doctor/Patient/Admin |
| DELETE | `/:id` | Delete appointment | Admin |

## API Usage Examples

### 1. Register a Patient

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

### 2. Register a Doctor

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "password": "password123",
  "role": "doctor",
  "specialization": "Cardiology",
  "experience": 10,
  "contact": "1234567890"
}
```

### 3. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get All Doctors

```bash
GET /api/doctors
```

### 5. Update Doctor Slots

```bash
PUT /api/doctors/:id/slots
Authorization: Bearer <token>
Content-Type: application/json

{
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"]
}
```

### 6. Book Appointment

```bash
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "doctor_id_here",
  "date": "2026-02-20",
  "time": "10:00",
  "reason": "Regular checkup"
}
```

### 7. Get My Appointments (Patient)

```bash
GET /api/appointments/my
Authorization: Bearer <token>
```

### 8. Get Doctor Appointments

```bash
GET /api/appointments/doctor
Authorization: Bearer <token>
```

### 9. Update Appointment Status

```bash
PUT /api/appointments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

## Data Models

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['admin', 'doctor', 'patient'], default: 'patient'),
  timestamps: true
}
```

### Doctor Model
```javascript
{
  userId: ObjectId (ref: User, required, unique),
  name: String (required),
  specialization: String (required),
  experience: Number (required, 0-60),
  contact: String (required, 10 digits),
  availableSlots: [String] (HH:MM format),
  timestamps: true
}
```

### Appointment Model
```javascript
{
  patientId: ObjectId (ref: User, required),
  doctorId: ObjectId (ref: Doctor, required),
  date: Date (required, not in past),
  time: String (required, HH:MM format),
  status: String (enum: ['booked', 'completed', 'cancelled'], default: 'booked'),
  reason: String (optional, max 500 chars),
  timestamps: true
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Doctor**: Can view/update their profile, manage their appointments
- **Patient**: Can view doctors, book appointments, view their appointments

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Validation Rules

- **Email**: Must be valid email format
- **Password**: Minimum 6 characters
- **Name**: 2-50 characters
- **Contact**: Exactly 10 digits
- **Time Slots**: HH:MM format (24-hour)
- **Date**: Cannot be in the past
- **Experience**: 0-60 years

## Security Features

- Password hashing using bcrypt (10 salt rounds)
- JWT token expiration (30 days)
- Input validation and sanitization
- MongoDB injection prevention
- CORS enabled
- Error messages don't expose sensitive information

## Development Notes

- The API automatically creates a Doctor profile when a user registers with role "doctor"
- Appointments cannot be double-booked (unique index on doctorId + date + time)
- Only doctors can mark appointments as "completed"
- Patients and doctors can cancel their own appointments
- Admins have full control over all resources

## Testing

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Use command line
- **Thunder Client**: VS Code extension
- **Frontend**: Connect your React/Vue/Angular app

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a strong `JWT_SECRET`
3. Enable MongoDB Atlas IP whitelist
4. Use environment-specific CORS origins
5. Enable rate limiting (recommended)
6. Set up logging (recommended)
7. Use HTTPS in production

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
