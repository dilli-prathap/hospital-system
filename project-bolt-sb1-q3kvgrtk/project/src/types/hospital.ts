export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  allergies: string;
  bloodType: string;
  insuranceNumber: string;
  registrationDate: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: {
    medicationId: string;
    quantity: number;
    dosage: string;
    duration: string;
  }[];
  date: string;
  total: number;
  status: 'pending' | 'dispensed' | 'paid';
}

export interface Bill {
  id: string;
  patientId: string;
  items: {
    description: string;
    amount: number;
  }[];
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
}