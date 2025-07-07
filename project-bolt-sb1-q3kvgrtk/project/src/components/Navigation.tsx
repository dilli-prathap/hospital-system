import React from 'react';
import { Users, Calendar, Pill, Activity } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'patient', label: 'Patient Registration & EHR', icon: Users },
    { id: 'appointment', label: 'Doctor Appointments', icon: Calendar },
    { id: 'pharmacy', label: 'Pharmacy & Billing', icon: Pill }
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MediCare Hospital</span>
          </div>
          
          <div className="flex space-x-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSectionChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === id
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;