import React from 'react';

interface AdminProfileFormProps {
  profile: any;
  onSave: (data: any) => void;
}

const AdminProfileForm: React.FC<AdminProfileFormProps> = ({ profile, onSave }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Admin Profile Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            readOnly
            value={profile.fullName || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            readOnly
            value={profile.email || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="text"
            readOnly
            value={profile.mobile || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organization</label>
          <input
            type="text"
            readOnly
            value={profile.companyName || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-md">
        <p className="text-sm text-indigo-800">
          <strong>Note:</strong> Admin profile details are managed centrally. To update these details, please contact the super administrator.
        </p>
      </div>
    </div>
  );
};

export default AdminProfileForm;
