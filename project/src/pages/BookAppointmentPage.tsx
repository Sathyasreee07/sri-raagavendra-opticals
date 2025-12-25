import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, AlertCircle, Check } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientAge: '',
    patientGender: '',
    phone: user?.phone || '',
    email: user?.email || '',
    appointmentDate: '',
    appointmentTime: '',
    serviceType: '',
    notes: '',
    hasExistingPrescription: false
  });
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  
  // Service types
  const serviceTypes = [
    'Comprehensive Eye Exam',
    'Contact Lens Fitting',
    'LASIK Consultation',
    'Pediatric Eye Exam',
    'Other'
  ];
  
  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!formData.appointmentDate) return;
      
      try {
        const response = await fetch(`/api/appointments/available-slots/${formData.appointmentDate}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setAvailableTimeSlots(data.availableTimeSlots.map((time: string) => ({
          time,
          available: true
        })));
      } catch (err) {
        console.error('Failed to fetch time slots:', err);
      }
    };
    
    fetchTimeSlots();
  }, [formData.appointmentDate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/book-appointment' } });
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }
      
      setSuccess(true);
      // Reset form
      setFormData({
        patientName: user?.name || '',
        patientAge: '',
        patientGender: '',
        phone: user?.phone || '',
        email: user?.email || '',
        appointmentDate: '',
        appointmentTime: '',
        serviceType: '',
        notes: '',
        hasExistingPrescription: false
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate min and max dates for appointment
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.setMonth(today.getMonth() + 2)).toISOString().split('T')[0];
  
  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
            Book an Eye Examination
          </h1>
          <p className="text-gray-600">
            Schedule your comprehensive eye examination with our experienced optometrists
          </p>
        </div>
        
        {success ? (
          <div className="bg-success-50 text-success-900 p-6 rounded-lg mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-success-500 rounded-full p-2">
                <Check size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Appointment Booked Successfully!</h2>
            <p className="mb-4">
              We have sent a confirmation email with your appointment details.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-primary"
            >
              View My Appointments
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-card p-6">
            {error && (
              <div className="bg-error-50 text-error-900 p-4 rounded-md mb-6 flex items-center">
                <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    id="patientAge"
                    value={formData.patientAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientAge: e.target.value }))}
                    className="input"
                    min="1"
                    
                    max="120"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="patientGender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="patientGender"
                    value={formData.patientGender}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientGender: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input"
                    required
                  />
                </div>
                
                {/* Appointment Details */}
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      min={minDate}
                      max={maxDate}
                      className="input pl-10"
                      required
                    />
                    <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <select
                      id="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                      className="input pl-10"
                      required
                      disabled={!formData.appointmentDate || availableTimeSlots.length === 0}
                    >
                      <option value="">Select Time</option>
                      {availableTimeSlots.map((slot, index) => (
                        <option key={index} value={slot.time} disabled={!slot.available}>
                          {slot.time}
                        </option>
                      ))}
                    </select>
                    <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Service
                  </label>
                  <select
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Select Service</option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input min-h-[100px]"
                    placeholder="Any specific concerns or requirements..."
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.hasExistingPrescription}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hasExistingPrescription: e.target.checked
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 block text-sm text-gray-700">
                      I have an existing prescription that I would like to update
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Booking Appointment...
                    </span>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-card">
            <h3 className="text-lg font-semibold mb-2">What to Expect</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Comprehensive eye examination</li>
              <li>• Vision acuity test</li>
              <li>• Eye pressure measurement</li>
              <li>• Personalized consultation</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-card">
            <h3 className="text-lg font-semibold mb-2">Preparation</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Bring current eyewear</li>
              <li>• List current medications</li>
              <li>• Previous prescriptions</li>
              <li>• Medical history</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-card">
            <h3 className="text-lg font-semibold mb-2">Duration</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• 30-45 minutes average</li>
              <li>• Please arrive 10 minutes early</li>
              <li>• Results discussed same day</li>
              <li>• Follow-up if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;