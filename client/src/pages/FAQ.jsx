import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  const faqData = {
    appointments: {
      title: "Appointments",
      icon: "📅",
      color: "blue",
      questions: [
        {
          id: "apt1",
          question: "How do I book an appointment?",
          answer: "You can book an appointment in three easy ways: 1) Online through our website by clicking 'Book Appointment' and selecting your preferred doctor and time slot, 2) Call our appointment desk at +91-1234567891, or 3) Visit the hospital reception in person. Online booking is available 24/7 and you'll receive instant confirmation."
        },
        {
          id: "apt2",
          question: "Can I reschedule or cancel my appointment?",
          answer: "Yes, you can reschedule or cancel your appointment up to 2 hours before the scheduled time. Log in to your patient dashboard, go to 'My Appointments', and click on the reschedule or cancel button. You can reschedule up to 2 times. For cancellations made less than 2 hours before the appointment, please call our helpline."
        },
        {
          id: "apt3",
          question: "Do I need a referral to see a specialist?",
          answer: "For most specialists, a referral is not required. However, for certain specialized treatments and procedures, your primary care physician's referral may be helpful for better coordination of care. You can directly book appointments with specialists through our online portal or by calling our appointment desk."
        },
        {
          id: "apt4",
          question: "What if I'm late for my appointment?",
          answer: "We understand that delays can happen. If you're running late, please call us immediately at +91-1234567891. We'll do our best to accommodate you, but if the delay is more than 15 minutes, you may need to reschedule or wait for the next available slot."
        },
        {
          id: "apt5",
          question: "Can I choose a specific doctor?",
          answer: "Absolutely! When booking an appointment, you can browse through our list of doctors, view their specializations, experience, and patient ratings, and select the doctor you prefer. You can also view their available time slots and book accordingly."
        }
      ]
    },
    emergency: {
      title: "Emergency Services",
      icon: "🚑",
      color: "red",
      questions: [
        {
          id: "emg1",
          question: "Is emergency care available 24/7?",
          answer: "Yes, our Emergency Department is open 24 hours a day, 7 days a week, including all holidays. We have a dedicated team of emergency physicians, nurses, and support staff available round-the-clock to handle all types of medical emergencies."
        },
        {
          id: "emg2",
          question: "How do I request an ambulance?",
          answer: "For immediate ambulance service, call our emergency hotline at 108 (toll-free) or +91-1234567890. You can also request an ambulance through our website's Emergency Services page by filling out the quick request form. Our ambulances are equipped with advanced life support systems and trained paramedics."
        },
        {
          id: "emg3",
          question: "What should I bring during an emergency visit?",
          answer: "If possible, bring: 1) Valid ID proof, 2) Health insurance card, 3) List of current medications, 4) Any relevant medical records or previous test reports, 5) Emergency contact information. However, in life-threatening situations, come immediately without worrying about documents - they can be arranged later."
        },
        {
          id: "emg4",
          question: "What types of emergencies do you handle?",
          answer: "We handle all types of medical emergencies including cardiac emergencies, stroke, severe injuries, accidents, breathing difficulties, severe bleeding, poisoning, burns, and any other life-threatening conditions. Our emergency department is equipped with state-of-the-art facilities and experienced trauma care specialists."
        },
        {
          id: "emg5",
          question: "How long is the wait time in emergency?",
          answer: "Wait times vary based on the severity of cases. We follow a triage system where the most critical patients are treated first. Life-threatening emergencies are attended to immediately. For non-critical cases, the average wait time is 30-60 minutes, but this can vary depending on the number of patients."
        }
      ]
    },
    billing: {
      title: "Billing & Insurance",
      icon: "💳",
      color: "green",
      questions: [
        {
          id: "bil1",
          question: "What payment methods are accepted?",
          answer: "We accept multiple payment methods for your convenience: Cash, Credit/Debit Cards (Visa, Mastercard, RuPay), UPI payments (Google Pay, PhonePe, Paytm), Net Banking, and Health Insurance. We also offer EMI options for major procedures through select banks and financial partners."
        },
        {
          id: "bil2",
          question: "Do you accept health insurance?",
          answer: "Yes, we are empaneled with most major health insurance providers in India. We offer cashless treatment facility for insured patients. Please bring your insurance card and policy documents at the time of admission. Our insurance desk will help you with the claim process and documentation."
        },
        {
          id: "bil3",
          question: "How can I access my medical bills?",
          answer: "You can access your medical bills in several ways: 1) Log in to your patient dashboard and go to 'Billing History', 2) Request a copy at the billing counter, 3) Email request to billing@citycarehospital.com with your patient ID. Digital copies are available for download, and physical copies can be collected from the billing department."
        },
        {
          id: "bil4",
          question: "Are there any hidden charges?",
          answer: "No, we maintain complete transparency in billing. All charges are clearly itemized in your bill including consultation fees, diagnostic tests, medications, room charges, and procedure costs. You'll receive a detailed estimate before any major procedure, and our billing team is available to explain any charges."
        },
        {
          id: "bil5",
          question: "Do you offer payment plans or financial assistance?",
          answer: "Yes, we understand that medical expenses can be challenging. We offer flexible payment plans for major treatments and surgeries. Additionally, we have a financial assistance program for economically disadvantaged patients. Please speak with our billing counselor to discuss available options."
        }
      ]
    },
    online: {
      title: "Online Services",
      icon: "💻",
      color: "purple",
      questions: [
        {
          id: "onl1",
          question: "Can I consult doctors online?",
          answer: "Yes, we offer online consultation services through video calls for follow-up appointments, minor health concerns, and prescription refills. To book an online consultation, log in to your patient dashboard, select 'Online Consultation', choose your doctor, and book a convenient time slot. You'll receive a video call link before your appointment."
        },
        {
          id: "onl2",
          question: "How do I access my medical reports?",
          answer: "All your medical reports, test results, and prescriptions are available in your patient dashboard under 'Medical Records'. You can view, download, or share them digitally. Lab reports are typically uploaded within 24-48 hours of sample collection. You'll receive an email notification when new reports are available."
        },
        {
          id: "onl3",
          question: "Is my health data secure?",
          answer: "Absolutely. We take data security very seriously. Your health information is protected with industry-standard encryption (256-bit SSL), secure servers, and strict access controls. We comply with all data protection regulations and HIPAA guidelines. Your data is never shared with third parties without your explicit consent."
        },
        {
          id: "onl4",
          question: "Can I book diagnostic tests online?",
          answer: "Yes, you can book diagnostic tests (blood tests, X-rays, MRI, CT scans, etc.) online through our website. Select 'Book Diagnostic Test', choose the required tests, select your preferred date and time, and make the payment. You can also opt for home sample collection for certain tests."
        },
        {
          id: "onl5",
          question: "How do I register for online services?",
          answer: "Click on 'Register' on our website, fill in your basic details (name, email, phone number), create a password, and verify your email/phone. Once registered, you can access all online services including appointment booking, medical records, online consultations, and more."
        }
      ]
    },
    facilities: {
      title: "Hospital Facilities",
      icon: "🏥",
      color: "indigo",
      questions: [
        {
          id: "fac1",
          question: "What departments are available?",
          answer: "We have 50+ specialized departments including Cardiology, Neurology, Orthopedics, Pediatrics, Obstetrics & Gynecology, General Surgery, ENT, Ophthalmology, Dermatology, Psychiatry, Oncology, Nephrology, Gastroenterology, Pulmonology, Urology, and many more. Each department is staffed with experienced specialists and equipped with modern facilities."
        },
        {
          id: "fac2",
          question: "Do you provide ICU services?",
          answer: "Yes, we have state-of-the-art Intensive Care Units (ICU) including Medical ICU, Surgical ICU, Cardiac ICU, Neonatal ICU (NICU), and Pediatric ICU (PICU). All ICUs are equipped with advanced monitoring systems, ventilators, and round-the-clock care by trained intensivists and critical care nurses."
        },
        {
          id: "fac3",
          question: "Are pharmacy services available?",
          answer: "Yes, we have a 24/7 in-house pharmacy that stocks a wide range of medications, surgical supplies, and healthcare products. You can get your prescriptions filled immediately after consultation. We also offer home delivery of medicines for discharged patients and those unable to visit in person."
        },
        {
          id: "fac4",
          question: "Do you have parking facilities?",
          answer: "Yes, we have ample parking space for both two-wheelers and four-wheelers. The parking area is well-lit, secure, and monitored by CCTV cameras. Parking is free for the first 2 hours for outpatients. Valet parking service is also available at the main entrance."
        },
        {
          id: "fac5",
          question: "Are there food and cafeteria facilities?",
          answer: "Yes, we have a multi-cuisine cafeteria on the ground floor that operates from 7 AM to 10 PM, serving breakfast, lunch, dinner, and snacks. We also have vending machines and a coffee shop. For admitted patients, we provide nutritious meals as per dietary requirements prescribed by doctors."
        },
        {
          id: "fac6",
          question: "Do you provide accommodation for patient attendants?",
          answer: "Yes, we have attendant rooms and waiting areas with comfortable seating. For long-term patients, we can arrange nearby guest house accommodation at subsidized rates. Our patient relations team can assist you with these arrangements."
        }
      ]
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        hover: "hover:bg-blue-100"
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-600",
        hover: "hover:bg-red-100"
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
        hover: "hover:bg-green-100"
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        hover: "hover:bg-purple-100"
      },
      indigo: {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-600",
        hover: "hover:bg-indigo-100"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="faq-page">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 rounded-lg shadow-2xl mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">
            Find quick answers to common hospital queries
          </p>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8 mb-12">
        {Object.entries(faqData).map(([key, category]) => {
          const colors = getColorClasses(category.color);
          
          return (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Category Header */}
              <div className={`${colors.bg} dark:bg-gray-700 ${colors.border} border-l-4 p-6`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className={`text-2xl font-bold ${colors.text} dark:text-gray-100`}>{category.title}</h2>
                </div>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.questions.map((item) => (
                  <div key={item.id} className="faq-item">
                    {/* Question Button */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-full text-left p-6 flex items-center justify-between ${colors.hover} dark:hover:bg-gray-700 transition-colors`}
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-100 pr-4">
                        {item.question}
                      </span>
                      <span className={`flex-shrink-0 text-2xl ${colors.text} dark:text-gray-300 transition-transform duration-300 ${openItem === item.id ? 'rotate-180' : ''}`}>
                        {openItem === item.id ? '−' : '+'}
                      </span>
                    </button>

                    {/* Answer */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Support Section */}
      <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white rounded-lg shadow-2xl p-8 md:p-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you. Reach out to us anytime!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              <span>📧</span>
              Contact Us
            </Link>
            <a
              href="tel:+911234567890"
              className="bg-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              <span>📞</span>
              Call Now
            </a>
            <Link
              to="/emergency"
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              <span>🚑</span>
              Emergency
            </Link>
          </div>

          {/* Quick Contact Info */}
          <div className="mt-8 pt-8 border-t border-blue-400">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-1">General Inquiries</div>
                <a href="tel:+911234567890" className="text-blue-100 hover:text-white">
                  +91-1234567890
                </a>
              </div>
              <div>
                <div className="font-semibold mb-1">Email Support</div>
                <a href="mailto:info@citycarehospital.com" className="text-blue-100 hover:text-white">
                  info@citycarehospital.com
                </a>
              </div>
              <div>
                <div className="font-semibold mb-1">Emergency Hotline</div>
                <a href="tel:108" className="text-yellow-300 hover:text-yellow-100 font-bold">
                  108 (24/7)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Help Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">💡 Helpful Tips</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>For faster service, please have your patient ID ready when calling</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Download our mobile app for easy access to all services</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Register online to save time during your first visit</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Check our website for updated visiting hours and policies</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
