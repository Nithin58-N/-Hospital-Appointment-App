import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { API } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register({ onLogin }){
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'patient' }
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  
  const selectedRole = watch('role');

  async function submit(data){
    try {
      setLoading(true);
      const res = await API.post('/auth/register', data);
      // Backend returns { success: true, data: { token, _id, name, email, role } }
      const userData = res.data.data;
      onLogin(userData.token, userData);
      
      // Redirect based on role
      if (userData.role === 'patient') nav('/patient');
      else if (userData.role === 'doctor') nav('/doctor');
      else nav('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Role Selector */}
      <div className="flex gap-2 mb-6">
        <label className={`flex-1 cursor-pointer`}>
          <input 
            type="radio" 
            {...register('role')} 
            value="patient" 
            className="hidden"
          />
          <div className={`py-4 px-6 rounded-lg font-medium text-center transition-all ${
            selectedRole === 'patient'
              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}>
            <div className="text-3xl mb-2">🏥</div>
            <div className="font-bold">Register as Patient</div>
            <div className="text-xs mt-1 opacity-90">Book appointments & manage health</div>
          </div>
        </label>

        <label className={`flex-1 cursor-pointer`}>
          <input 
            type="radio" 
            {...register('role')} 
            value="doctor" 
            className="hidden"
          />
          <div className={`py-4 px-6 rounded-lg font-medium text-center transition-all ${
            selectedRole === 'doctor'
              ? 'bg-green-600 text-white shadow-lg transform scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
          }`}>
            <div className="text-3xl mb-2">👨‍⚕️</div>
            <div className="font-bold">Register as Doctor</div>
            <div className="text-xs mt-1 opacity-90">Manage appointments & patients</div>
          </div>
        </label>
      </div>

      {/* Registration Form */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {selectedRole === 'patient' ? 'Patient Registration' : 'Doctor Registration'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {selectedRole === 'patient' 
            ? 'Create an account to book appointments with our doctors' 
            : 'Join our hospital to manage your appointments and patients'}
        </p>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input 
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })} 
              placeholder={selectedRole === 'patient' ? 'John Doe' : 'Dr. Sarah Smith'}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email address'
                }
              })} 
              type="email" 
              placeholder={selectedRole === 'patient' ? 'patient@example.com' : 'doctor@hospital.com'}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password *
            </label>
            <input 
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })} 
              type="password" 
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Doctor-specific fields */}
          {selectedRole === 'doctor' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialization *
                  </label>
                  <select 
                    {...register('specialization', { 
                      required: selectedRole === 'doctor' ? 'Specialization is required' : false 
                    })}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="ENT">ENT</option>
                    <option value="Dentistry">Dentistry</option>
                  </select>
                  {errors.specialization && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.specialization.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience (years) *
                  </label>
                  <input 
                    {...register('experience', { 
                      required: selectedRole === 'doctor' ? 'Experience is required' : false,
                      min: {
                        value: 0,
                        message: 'Experience cannot be negative'
                      },
                      max: {
                        value: 60,
                        message: 'Experience seems invalid'
                      }
                    })} 
                    type="number" 
                    placeholder="10"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.experience && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.experience.message}</p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Number *
                </label>
                <input 
                  {...register('contact', { 
                    required: selectedRole === 'doctor' ? 'Contact is required' : false,
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Contact must be 10 digits'
                    }
                  })} 
                  type="tel" 
                  placeholder="1234567890"
                  maxLength="10"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contact && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.contact.message}</p>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              selectedRole === 'patient'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => nav('/login')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
