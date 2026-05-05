import React from 'react';
import PatientHome from './PatientHome';
import DoctorHome from './DoctorHome';
import AdminHome from './AdminHome';

export default function Home(){
  // Check if user is logged in and get their role
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // If doctor, show DoctorHome, otherwise show PatientHome
  if (user && user.role === 'doctor') {
    return <DoctorHome user={user} />;
  }

  if (user && user.role === 'admin') {
    return <AdminHome user={user} />;
  }
  
  return <PatientHome />;
}
