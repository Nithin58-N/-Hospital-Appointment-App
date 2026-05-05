import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { API } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }){
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [userType, setUserType] = useState('patient');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(data){
    try {
      setLoading(true);
      const res = await API.post('/auth/login', data);
      // Backend returns { success: true, data: { token, _id, name, email, role } }
      const userData = res.data.data;
      onLogin(userData.token, userData);
      
      // Redirect based on role
      if (userData.role === 'patient') nav('/patient');
      else if (userData.role === 'doctor') nav('/doctor');
      else nav('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* User Type Selector */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setUserType('patient')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            userType === 'patient'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <div className="text-2xl mb-1">🏥</div>
          <div>Patient Login</div>
        </button>
        <button
          type="button"
          onClick={() => setUserType('doctor')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            userType === 'doctor'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
          }`}
        >
          <div className="text-2xl mb-1">👨‍⚕️</div>
          <div>Doctor Login</div>
        </button>
      </div>

      {/* Login Form */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {userType === 'patient' ? 'Patient Login' : 'Doctor Login'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {userType === 'patient' 
            ? 'Login to book appointments and manage your health' 
            : 'Login to manage your appointments and patients'}
        </p>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
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
              placeholder={userType === 'patient' ? 'patient@example.com' : 'doctor@hospital.com'}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
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
              placeholder="Enter your password"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              userType === 'patient'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => nav('/register')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Register here
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Demo Credentials:</p>
          {userType === 'patient' ? (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>📧 patient@test.com</p>
              <p>🔑 password123</p>
            </div>
          ) : (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>📧 sarah.smith@hospital.com</p>
              <p>🔑 doctor123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
