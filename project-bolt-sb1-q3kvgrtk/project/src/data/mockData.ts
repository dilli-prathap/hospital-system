import { Doctor, Medication } from '../types/hospital';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@hospital.com'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    availability: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@hospital.com'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    availability: ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00'],
    phone: '+1 (555) 345-6789',
    email: 'emily.rodriguez@hospital.com'
  },
  {
    id: '4',
    name: 'Dr. David Wilson',
    specialty: 'Orthopedics',
    availability: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
    phone: '+1 (555) 456-7890',
    email: 'david.wilson@hospital.com'
  }
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Aspirin',
    price: 12.99,
    stock: 500,
    description: 'Pain reliever and anti-inflammatory',
    category: 'Pain Relief'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    price: 25.50,
    stock: 250,
    description: 'Antibiotic for bacterial infections',
    category: 'Antibiotics'
  },
  {
    id: '3',
    name: 'Lisinopril',
    price: 18.75,
    stock: 300,
    description: 'ACE inhibitor for high blood pressure',
    category: 'Cardiovascular'
  },
  {
    id: '4',
    name: 'Metformin',
    price: 22.00,
    stock: 400,
    description: 'Diabetes medication',
    category: 'Diabetes'
  },
  {
    id: '5',
    name: 'Ibuprofen',
    price: 15.99,
    stock: 600,
    description: 'Non-steroidal anti-inflammatory drug',
    category: 'Pain Relief'
  }
];