import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Heart, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { Patient } from '../types/hospital';

interface PatientRegistrationProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ patients, onAddPatient }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'ehr'>('register');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male' as const,
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    bloodType: '',
    insuranceNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...formData,
      registrationDate: new Date().toISOString().split('T')[0]
    };
    onAddPatient(newPatient);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      phoneNumber: '',
      email: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      bloodType: '',
      insuranceNumber: ''
    });
    alert('Patient registered successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Patient Registration
          </button>
          <button
            onClick={() => setActiveTab('ehr')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'ehr'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Electronic Health Records
          </button>
        </div>

        {activeTab === 'register' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="h-4 w-4 inline mr-2" />
                  Blood Type
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Number</label>
              <input
                type="text"
                name="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Register Patient
            </button>
          </form>
        )}

        {activeTab === 'ehr' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                <select
                  value={selectedPatient?.id || ''}
                  onChange={(e) => setSelectedPatient(patients.find(p => p.id === e.target.value) || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedPatient && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                    <p><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                    <p><strong>Phone:</strong> {selectedPatient.phoneNumber}</p>
                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                    <p><strong>Blood Type:</strong> {selectedPatient.bloodType}</p>
                  </div>
                  <div>
                    <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}</p>
                    <p><strong>Insurance:</strong> {selectedPatient.insuranceNumber}</p>
                    <p><strong>Registration Date:</strong> {selectedPatient.registrationDate}</p>
                    <p><strong>Address:</strong> {selectedPatient.address}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p><strong>Medical History:</strong></p>
                  <p className="text-gray-700">{selectedPatient.medicalHistory || 'No medical history recorded'}</p>
                </div>
                <div className="mt-4">
                  <p><strong>Allergies:</strong></p>
                  <p className="text-gray-700">{selectedPatient.allergies || 'No allergies recorded'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRegistration;