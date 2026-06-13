// src/components/profile/TransporterProfileForm.tsx

import React, { useState } from 'react';
import { TransporterProfile, TransporterProfileUpdateRequest } from '../../interfaces/profile.interface';
import { HiSave, HiX } from 'react-icons/hi';

interface TransporterProfileFormProps {
  profile: TransporterProfile;
  onSave: (data: TransporterProfileUpdateRequest) => Promise<void>;
  onCancel?: () => void;
}

const TransporterProfileForm: React.FC<TransporterProfileFormProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<TransporterProfileUpdateRequest>({
    ownerName: profile.ownerName || '',
    panNumber: profile.panNumber || '',
    officeAddress: profile.officeAddress || ''
  });
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Owner Details</h3>
        
        <div className="space-y-4">
          {/* Owner Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner's Full Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Legal name of business owner"
            />
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.panNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.panNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>
            )}
          </div>

          {/* Office Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Office Address
            </label>
            <textarea
              name="officeAddress"
              value={formData.officeAddress}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Physical office address (if different)"
            />
          </div>
        </div>
      </div>

      {/* Stats Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Vehicles</p>
            <p className="text-lg font-semibold text-gray-900">{profile.totalVehicles}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Drivers</p>
            <p className="text-lg font-semibold text-gray-900">{profile.totalDrivers}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Bids Won</p>
            <p className="text-lg font-semibold text-gray-900">{profile.bidsWon}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Commission Rate</p>
            <p className="text-lg font-semibold text-gray-900">{profile.commissionRate}%</p>
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

export default TransporterProfileForm;