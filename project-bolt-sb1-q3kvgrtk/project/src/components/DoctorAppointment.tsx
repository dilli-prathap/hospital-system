import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import { Patient, Doctor, Appointment } from '../types/hospital';
import { mockDoctors } from '../data/mockData';

interface DoctorAppointmentProps {
  patients: Patient[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointment: (id: string, status: 'completed' | 'cancelled') => void;
}

const DoctorAppointment: React.FC<DoctorAppointmentProps> = ({
  patients,
  appointments,
  onAddAppointment,
  onUpdateAppointment
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'manage'>('schedule');
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: 'scheduled'
    };
    onAddAppointment(newAppointment);
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      notes: ''
    });
    alert('Appointment scheduled successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectedDoctor = mockDoctors.find(d => d.id === formData.doctorId);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Schedule Appointment
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manage'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Stethoscope className="h-4 w-4 inline mr-2" />
            Manage Appointments
          </button>
        </div>

        {activeTab === 'schedule' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Patient
                </label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Stethoscope className="h-4 w-4 inline mr-2" />
                  Doctor
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Doctor</option>
                  {mockDoctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Time</option>
                  {selectedDoctor?.availability.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Schedule Appointment
            </button>
          </form>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appointment Management</h3>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments scheduled.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
                  
                  return (
                    <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {patient?.firstName} {patient?.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            <Stethoscope className="h-4 w-4 inline mr-1" />
                            {doctor?.name} - {doctor?.specialty}
                          </p>
                          <p className="text-sm text-gray-600">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {appointment.date} at {appointment.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'scheduled' 
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status.toUpperCase()}
                          </span>
                          
                          {appointment.status === 'scheduled' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => onUpdateAppointment(appointment.id, 'completed')}
                                className="text-green-600 hover:text-green-800"
                                title="Mark as completed"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => onUpdateAppointment(appointment.id, 'cancelled')}
                                className="text-red-600 hover:text-red-800"
                                title="Cancel appointment"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;