import React, { useState } from 'react';
import { API } from '../api';

export default function Emergency() {
  const [ambulanceForm, setAmbulanceForm] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleAmbulanceRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/ambulance/request', ambulanceForm);
      
      alert(`✅ ${response.data.message}\n\nRequest Details:\nName: ${ambulanceForm.name}\nPhone: ${ambulanceForm.phone}\nLocation: ${ambulanceForm.location}\n\nOur emergency team will contact you immediately!`);
      
      setAmbulanceForm({ name: '', phone: '', location: '' });
    } catch (error) {
      console.error('Ambulance request error:', error);
      alert('❌ Failed to submit ambulance request. Please call 108 immediately for emergencies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emergency-page">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 px-4 rounded-lg shadow-2xl mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-full p-4 animate-pulse">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">24/7 Emergency Services</h1>
          <p className="text-xl md:text-2xl mb-6 text-red-100">Immediate care when you need it most</p>
          
          {/* Emergency Numbers */}
          <div className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-lg p-6 mb-6 inline-block">
            <div className="text-sm font-semibold mb-2">EMERGENCY HOTLINE</div>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <a href="tel:108" className="text-4xl font-bold hover:text-red-700 dark:hover:text-red-300 transition-colors">
                📞 108
              </a>
              <span className="hidden md:inline text-2xl">|</span>
              <a href="tel:+911234567890" className="text-2xl md:text-3xl font-bold hover:text-red-700 dark:hover:text-red-300 transition-colors">
                +91-1234567890
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:108" 
              className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors shadow-lg flex items-center gap-2"
            >
              <span className="text-2xl">📞</span>
              Call Now
            </a>
            <button 
              onClick={() => document.getElementById('ambulance-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-400 text-red-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg flex items-center gap-2"
            >
              <span className="text-2xl">🚑</span>
              Request Ambulance
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Services Offered */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Emergency Services We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Trauma Care */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4 text-center">🏥</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Trauma Care</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Immediate treatment for severe injuries and life-threatening conditions
            </p>
          </div>

          {/* Cardiac Emergency */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4 text-center">❤️</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Cardiac Emergency</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              24/7 cardiac care with advanced life support systems
            </p>
          </div>

          {/* Stroke Management */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4 text-center">🧠</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Stroke Management</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Rapid response stroke unit with neurological specialists
            </p>
          </div>

          {/* Accident & Injury Care */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4 text-center">🩹</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Accident & Injury Care</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Comprehensive treatment for accidents and injuries
            </p>
          </div>

          {/* Ambulance Services */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4 text-center">🚑</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Ambulance Services</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Advanced life support ambulances available 24/7
            </p>
          </div>

          {/* Critical Care */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="text-5xl mb-4 text-center">⚕️</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Critical Care</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              State-of-the-art ICU with round-the-clock monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Ambulance Request Section */}
      <div
  id="ambulance-form"
  className="bg-gradient-to-br from-red-50 to-orange-50 dark:bg-none dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 scroll-mt-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🚑</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Request Ambulance</h2>
            <p className="text-gray-600 dark:text-white">Fill in your details and we'll dispatch an ambulance immediately</p>
          </div>
          
          <form onSubmit={handleAmbulanceRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={ambulanceForm.name}
                onChange={(e) => setAmbulanceForm({...ambulanceForm, name: e.target.value})}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={ambulanceForm.phone}
                onChange={(e) => setAmbulanceForm({...ambulanceForm, phone: e.target.value})}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
                Pickup Location *
              </label>
              <textarea
                value={ambulanceForm.location}
                onChange={(e) => setAmbulanceForm({...ambulanceForm, location: e.target.value})}
                required
                rows="3"
                placeholder="Enter complete address with landmarks"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Submitting...' : '🚨 Request Ambulance Now'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Note:</strong> For life-threatening emergencies, please call 108 immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Emergency Instructions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heart Attack */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">❤️</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Heart Attack</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">1.</span>
                <span>Call 108 immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">2.</span>
                <span>Make the person sit down and rest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">3.</span>
                <span>Loosen tight clothing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">4.</span>
                <span>Give aspirin if available (unless allergic)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">5.</span>
                <span>Begin CPR if person becomes unconscious</span>
              </li>
            </ul>
          </div>

          {/* Stroke */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🧠</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Stroke (FAST)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">F:</span>
                <span><strong>Face</strong> - Ask to smile, check for drooping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">A:</span>
                <span><strong>Arms</strong> - Raise both arms, check for weakness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">S:</span>
                <span><strong>Speech</strong> - Check for slurred speech</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">T:</span>
                <span><strong>Time</strong> - Call 108 immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Note the time symptoms started</span>
              </li>
            </ul>
          </div>

          {/* Choking */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🫁</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Choking</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">1.</span>
                <span>Encourage coughing if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">2.</span>
                <span>Give 5 back blows between shoulder blades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">3.</span>
                <span>Perform 5 abdominal thrusts (Heimlich)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">4.</span>
                <span>Repeat until object is dislodged</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">5.</span>
                <span>Call 108 if unsuccessful</span>
              </li>
            </ul>
          </div>

          {/* Severe Bleeding */}
          <div className="border-2 border-red-200 dark:border-red-900 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-600 hover:shadow-xl transition-all bg-white dark:bg-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🩸</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Severe Bleeding</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">1.</span>
                <span>Call 108 immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">2.</span>
                <span>Apply direct pressure with clean cloth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">3.</span>
                <span>Maintain pressure for 10-15 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">4.</span>
                <span>Elevate the injured area if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">5.</span>
                <span>Don't remove cloth if blood soaks through</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map & Location */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Our Location</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Info */}
          <div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    CityCare Hospital<br />
                    123 Medical Center Drive<br />
                    Healthcare City, HC 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">Emergency Contact</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    <a href="tel:108" className="text-red-600 font-bold hover:text-red-700">108</a> (Toll Free)<br />
                    <a href="tel:+911234567890" className="text-red-600 font-bold hover:text-red-700">+91-1234567890</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🕐</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">Emergency Department</h3>
                  <p className="text-green-600 dark:text-gray-300 font-bold">Open 24/7</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-800 dark:text-red-400">
                  <strong>Emergency Entrance:</strong> Located at the main entrance with clear signage. Follow the red emergency signs.
                </p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-80 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-600 dark:text-gray-300 font-semibold mb-4">Google Maps Integration</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
