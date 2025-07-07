import React, { useState } from 'react';
import { Pill, Receipt, DollarSign, ShoppingCart, Plus, Minus, CreditCard } from 'lucide-react';
import { Patient, Prescription, Bill } from '../types/hospital';
import { mockMedications, mockDoctors } from '../data/mockData';

interface PharmacyBillingProps {
  patients: Patient[];
  prescriptions: Prescription[];
  bills: Bill[];
  onAddPrescription: (prescription: Prescription) => void;
  onAddBill: (bill: Bill) => void;
  onUpdatePrescription: (id: string, status: 'dispensed' | 'paid') => void;
  onUpdateBill: (id: string, status: 'paid') => void;
}

const PharmacyBilling: React.FC<PharmacyBillingProps> = ({
  patients,
  prescriptions,
  bills,
  onAddPrescription,
  onAddBill,
  onUpdatePrescription,
  onUpdateBill
}) => {
  const [activeTab, setActiveTab] = useState<'pharmacy' | 'billing'>('pharmacy');
  const [prescriptionData, setPrescriptionData] = useState({
    patientId: '',
    doctorId: '',
    medications: [{ medicationId: '', quantity: 1, dosage: '', duration: '' }]
  });
  const [billData, setBillData] = useState({
    patientId: '',
    items: [{ description: '', amount: 0 }]
  });

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = prescriptionData.medications.reduce((sum, med) => {
      const medication = mockMedications.find(m => m.id === med.medicationId);
      return sum + (medication?.price || 0) * med.quantity;
    }, 0);

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      patientId: prescriptionData.patientId,
      doctorId: prescriptionData.doctorId,
      medications: prescriptionData.medications,
      date: new Date().toISOString().split('T')[0],
      total,
      status: 'pending'
    };

    onAddPrescription(newPrescription);
    setPrescriptionData({
      patientId: '',
      doctorId: '',
      medications: [{ medicationId: '', quantity: 1, dosage: '', duration: '' }]
    });
    alert('Prescription created successfully!');
  };

  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = billData.items.reduce((sum, item) => sum + item.amount, 0);
    const currentDate = new Date();
    const dueDate = new Date(currentDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const newBill: Bill = {
      id: Date.now().toString(),
      patientId: billData.patientId,
      items: billData.items,
      total,
      status: 'pending',
      date: currentDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0]
    };

    onAddBill(newBill);
    setBillData({
      patientId: '',
      items: [{ description: '', amount: 0 }]
    });
    alert('Bill created successfully!');
  };

  const addMedication = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: [...prev.medications, { medicationId: '', quantity: 1, dosage: '', duration: '' }]
    }));
  };

  const removeMedication = (index: number) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const addBillItem = () => {
    setBillData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: 0 }]
    }));
  };

  const removeBillItem = (index: number) => {
    setBillData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pharmacy'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Pill className="h-4 w-4 inline mr-2" />
            Pharmacy Management
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'billing'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Receipt className="h-4 w-4 inline mr-2" />
            Billing System
          </button>
        </div>

        {activeTab === 'pharmacy' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Create Prescription</h3>
                <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <select
                      value={prescriptionData.patientId}
                      onChange={(e) => setPrescriptionData(prev => ({ ...prev, patientId: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                    <select
                      value={prescriptionData.doctorId}
                      onChange={(e) => setPrescriptionData(prev => ({ ...prev, doctorId: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Doctor</option>
                      {mockDoctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Medications</label>
                      <button
                        type="button"
                        onClick={addMedication}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {prescriptionData.medications.map((med, index) => (
                      <div key={index} className="border rounded-lg p-3 mb-2">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <select
                              value={med.medicationId}
                              onChange={(e) => {
                                const newMeds = [...prescriptionData.medications];
                                newMeds[index].medicationId = e.target.value;
                                setPrescriptionData(prev => ({ ...prev, medications: newMeds }));
                              }}
                              required
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Select Medication</option>
                              {mockMedications.map(medication => (
                                <option key={medication.id} value={medication.id}>
                                  {medication.name} - ${medication.price}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              placeholder="Quantity"
                              value={med.quantity}
                              onChange={(e) => {
                                const newMeds = [...prescriptionData.medications];
                                newMeds[index].quantity = parseInt(e.target.value);
                                setPrescriptionData(prev => ({ ...prev, medications: newMeds }));
                              }}
                              required
                              min="1"
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          {prescriptionData.medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedication(index)}
                              className="text-red-600 hover:text-red-800 ml-2"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={med.dosage}
                            onChange={(e) => {
                              const newMeds = [...prescriptionData.medications];
                              newMeds[index].dosage = e.target.value;
                              setPrescriptionData(prev => ({ ...prev, medications: newMeds }));
                            }}
                            required
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={med.duration}
                            onChange={(e) => {
                              const newMeds = [...prescriptionData.medications];
                              newMeds[index].duration = e.target.value;
                              setPrescriptionData(prev => ({ ...prev, medications: newMeds }));
                            }}
                            required
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
                  >
                    Create Prescription
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Prescriptions</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {prescriptions.map(prescription => {
                    const patient = patients.find(p => p.id === prescription.patientId);
                    const doctor = mockDoctors.find(d => d.id === prescription.doctorId);
                    
                    return (
                      <div key={prescription.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm">
                              {patient?.firstName} {patient?.lastName}
                            </h4>
                            <p className="text-xs text-gray-600">Dr. {doctor?.name}</p>
                            <p className="text-xs text-gray-600">{prescription.date}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              prescription.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : prescription.status === 'dispensed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {prescription.status.toUpperCase()}
                            </span>
                            <p className="text-sm font-medium mt-1">${prescription.total.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          <strong>Medications:</strong>
                          {prescription.medications.map((med, index) => {
                            const medication = mockMedications.find(m => m.id === med.medicationId);
                            return (
                              <span key={index} className="block">
                                {medication?.name} - {med.quantity} units, {med.dosage}, {med.duration}
                              </span>
                            );
                          })}
                        </div>
                        {prescription.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onUpdatePrescription(prescription.id, 'dispensed')}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                            >
                              <ShoppingCart className="h-3 w-3 inline mr-1" />
                              Dispense
                            </button>
                            <button
                              onClick={() => onUpdatePrescription(prescription.id, 'paid')}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            >
                              <DollarSign className="h-3 w-3 inline mr-1" />
                              Mark Paid
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Create Bill</h3>
                <form onSubmit={handleBillSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <select
                      value={billData.patientId}
                      onChange={(e) => setBillData(prev => ({ ...prev, patientId: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Bill Items</label>
                      <button
                        type="button"
                        onClick={addBillItem}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {billData.items.map((item, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...billData.items];
                            newItems[index].description = e.target.value;
                            setBillData(prev => ({ ...prev, items: newItems }));
                          }}
                          required
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => {
                            const newItems = [...billData.items];
                            newItems[index].amount = parseFloat(e.target.value) || 0;
                            setBillData(prev => ({ ...prev, items: newItems }));
                          }}
                          required
                          min="0"
                          step="0.01"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        {billData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBillItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium">
                      Total: ${billData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
                  >
                    Create Bill
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Bills</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bills.map(bill => {
                    const patient = patients.find(p => p.id === bill.patientId);
                    
                    return (
                      <div key={bill.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm">
                              {patient?.firstName} {patient?.lastName}
                            </h4>
                            <p className="text-xs text-gray-600">Bill Date: {bill.date}</p>
                            <p className="text-xs text-gray-600">Due Date: {bill.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              bill.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : bill.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {bill.status.toUpperCase()}
                            </span>
                            <p className="text-sm font-medium mt-1">${bill.total.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          <strong>Items:</strong>
                          {bill.items.map((item, index) => (
                            <span key={index} className="block">
                              {item.description} - ${item.amount.toFixed(2)}
                            </span>
                          ))}
                        </div>
                        {bill.status === 'pending' && (
                          <button
                            onClick={() => onUpdateBill(bill.id, 'paid')}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                          >
                            <CreditCard className="h-3 w-3 inline mr-1" />
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyBilling;