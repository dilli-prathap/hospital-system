import React, { useState } from 'react';
import Navigation from './components/Navigation';
import PatientRegistration from './components/PatientRegistration';
import DoctorAppointment from './components/DoctorAppointment';
import PharmacyBilling from './components/PharmacyBilling';
import { Patient, Appointment, Prescription, Bill } from './types/hospital';

function App() {
  const [activeSection, setActiveSection] = useState('patient');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  const handleAddPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const handleUpdateAppointment = (id: string, status: 'completed' | 'cancelled') => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
  };

  const handleAddPrescription = (prescription: Prescription) => {
    setPrescriptions(prev => [...prev, prescription]);
  };

  const handleUpdatePrescription = (id: string, status: 'dispensed' | 'paid') => {
    setPrescriptions(prev => prev.map(pres => 
      pres.id === id ? { ...pres, status } : pres
    ));
  };

  const handleAddBill = (bill: Bill) => {
    setBills(prev => [...prev, bill]);
  };

  const handleUpdateBill = (id: string, status: 'paid') => {
    setBills(prev => prev.map(bill => 
      bill.id === id ? { ...bill, status } : bill
    ));
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'patient':
        return (
          <PatientRegistration 
            patients={patients} 
            onAddPatient={handleAddPatient} 
          />
        );
      case 'appointment':
        return (
          <DoctorAppointment 
            patients={patients}
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
          />
        );
      case 'pharmacy':
        return (
          <PharmacyBilling 
            patients={patients}
            prescriptions={prescriptions}
            bills={bills}
            onAddPrescription={handleAddPrescription}
            onAddBill={handleAddBill}
            onUpdatePrescription={handleUpdatePrescription}
            onUpdateBill={handleUpdateBill}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hospital Management System
          </h1>
          <p className="text-gray-600">
            Comprehensive healthcare management solution for patient care, appointments, and billing
          </p>
        </div>
        
        {renderActiveSection()}
      </main>
    </div>
  );
}

export default App;