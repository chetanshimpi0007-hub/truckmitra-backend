// src/components/profile/DriverProfileForm.tsx

import React, { useState } from 'react';
import { DriverProfile, DriverProfileUpdateRequest, PreferredRoute } from '../../interfaces/profile.interface';
import { HiSave, HiX } from 'react-icons/hi';

interface DriverProfileFormProps {
  profile: DriverProfile;
  onSave: (data: DriverProfileUpdateRequest) => Promise<void>;
  onCancel?: () => void;
}

const DriverProfileForm: React.FC<DriverProfileFormProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<DriverProfileUpdateRequest>({
    aadharNumber: profile.aadharNumber || '',
    experienceInYears: profile.experienceInYears || 0,
    preferredRoute: profile.preferredRoute || PreferredRoute.BOTH
  });
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experienceInYears' ? parseInt(value) || 0 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhaar number must be 12 digits';
    }
    
    if (formData.experienceInYears && formData.experienceInYears < 0) {
      newErrors.experienceInYears = 'Experience cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Professional Details</h3>
        
        <div className="space-y-4">
          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aadhaar Number <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="12-digit Aadhaar number"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.aadharNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.aadharNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Driving Experience (Years)
            </label>
            <input
              type="number"
              name="experienceInYears"
              value={formData.experienceInYears}
              onChange={handleChange}
              min="0"
              max="50"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.experienceInYears ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Preferred Route */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Route Type
            </label>
            <select
              name="preferredRoute"
              value={formData.preferredRoute}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={PreferredRoute.LOCAL}>Local Routes (Within City)</option>
              <option value={PreferredRoute.LONG_HAUL}>Long Haul (Highway)</option>
              <option value={PreferredRoute.BOTH}>Both</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Stats</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Trips</p>
            <p className="text-lg font-semibold text-gray-900">{profile.totalTrips}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Earnings</p>
            <p className="text-lg font-semibold text-gray-900">₹{profile.totalEarnings}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Current Status</p>
            <p className={`text-sm font-medium ${profile.isBooked ? 'text-yellow-600' : 'text-green-600'}`}>
              {profile.isBooked ? 'On Trip' : 'Available'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <HiX className="inline mr-2" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <HiSave className="inline mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default DriverProfileForm;