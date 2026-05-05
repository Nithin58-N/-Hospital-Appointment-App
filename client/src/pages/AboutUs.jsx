import React from 'react';

export default function AboutUs() {
  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 px-4 rounded-lg shadow-2xl mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About CityCare Hospital</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Delivering quality healthcare with compassion
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-white text-blue-600 rounded-full p-6">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Mission */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center mb-4">
            <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-4 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            To provide accessible, affordable, and quality healthcare services to all members of our community, 
            ensuring every patient receives compassionate care and the best possible medical treatment.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center mb-4">
            <div className="inline-block bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full p-4 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Vision</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            To be the most trusted healthcare provider in the region, recognized for clinical excellence, 
            innovative treatments, and patient-centered care that sets the standard for healthcare delivery.
          </p>
        </div>

        {/* Values Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="text-center mb-4">
            <div className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full p-4 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Values</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            Guided by compassion, integrity, excellence, and innovation, we strive to deliver 
            exceptional healthcare while maintaining the highest ethical standards.
          </p>
        </div>
      </div>

      {/* Core Values Detailed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Compassion */}
          <div className="text-center p-6 border-2 border-blue-100 dark:border-blue-900 rounded-lg hover:border-blue-500 dark:hover:border-blue-600 transition-colors bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4">💙</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Compassion</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We treat every patient with empathy, kindness, and respect
            </p>
          </div>

          {/* Integrity */}
          <div className="text-center p-6 border-2 border-blue-100 dark:border-blue-900 rounded-lg hover:border-blue-500 dark:hover:border-blue-600 transition-colors bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Integrity</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We uphold the highest ethical standards in all our practices
            </p>
          </div>

          {/* Excellence */}
          <div className="text-center p-6 border-2 border-blue-100 dark:border-blue-900 rounded-lg hover:border-blue-500 dark:hover:border-blue-600 transition-colors bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Excellence</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We pursue the highest quality in medical care and service
            </p>
          </div>

          {/* Innovation */}
          <div className="text-center p-6 border-2 border-blue-100 dark:border-blue-900 rounded-lg hover:border-blue-500 dark:hover:border-blue-600 transition-colors bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-bold dark:text-gray-100 text-gray-800 mb-2">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We embrace new technologies and treatment methods
            </p>
          </div>
        </div>
      </div>

      {/* Our Facilities */}
      <div className="bg-gradient-to-br from-blue-600 to-green-500 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Our World-Class Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Modern Operation Theatres */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Modern Operation Theatres</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              State-of-the-art surgical suites equipped with advanced technology for complex procedures
            </p>
          </div>

          {/* 24/7 Emergency Services */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">24/7 Emergency Services</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Round-the-clock emergency care with rapid response teams and advanced life support
            </p>
          </div>

          {/* Advanced Diagnostic Labs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Advanced Diagnostic Labs</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Comprehensive diagnostic services with latest imaging and laboratory equipment
            </p>
          </div>

          {/* ICU & Critical Care */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">ICU & Critical Care</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Specialized intensive care units with continuous monitoring and expert medical staff
            </p>
          </div>

          {/* Pharmacy Services */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 5h-2.64l1.14-3.14L17.15 1l-1.46 4H3v2l2 6-2 6v2h18v-2l-2-6 2-6V5zm-5 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">In-House Pharmacy</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              24/7 pharmacy services with a wide range of medications and healthcare products
            </p>
          </div>

          {/* Patient Rooms */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4z"/>
                </svg>
              </div> 
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Comfortable Patient Rooms</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Private and semi-private rooms designed for patient comfort and recovery
            </p>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">Our Dedicated Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Doctors */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <span className="text-6xl">👨‍⚕️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Expert Doctors</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Highly qualified specialists across multiple medical disciplines
            </p>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">150+</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Medical Professionals</p>
          </div>

          {/* Nurses */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <span className="text-6xl">👩‍⚕️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Caring Nurses</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Compassionate nursing staff providing 24/7 patient care
            </p>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">300+</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nursing Staff</p>
          </div>

          {/* Support Staff */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <span className="text-6xl">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Support Staff</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dedicated administrative and technical support team
            </p>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">200+</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Support Personnel</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Impact in Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
            <p className="text-blue-100">Years of Service</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
            <p className="text-blue-100">Patients Treated</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
            <p className="text-blue-100">Specialties</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
            <p className="text-blue-100">Patient Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
