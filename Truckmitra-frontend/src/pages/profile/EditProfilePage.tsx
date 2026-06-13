// src/pages/profile/EditProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { useProfile } from '../../hooks/useProfile';

import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi';
import DriverProfileForm from '../../Components/profile/DriverProfileForm';
import ShipperProfileForm from '../../Components/profile/ShipperProfileForm';
import TransporterProfileForm from '../../Components/profile/TransporterProfileForm';

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile, profileComplete } = useProfile();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No profile data found</p>
      </div>
    );
  }

  const handleSave = async (data: any) => {
    await updateProfile(data);
    setSaveSuccess(true);
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'DRIVER': return 'Edit Driver Profile';
      case 'SHIPPER': return 'Edit Shipper Profile';
      case 'TRANSPORTER': return 'Edit Transporter Profile';
      default: return 'Edit Profile';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Back to Profile
          </button>
          
          {profileComplete && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <HiCheckCircle className="mr-1 h-4 w-4" />
              Profile Complete
            </span>
          )}
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <HiCheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{getRoleTitle()}</h1>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {user?.role === 'DRIVER' && (
            <DriverProfileForm 
              profile={profile as any} 
              onSave={handleSave}
              onCancel={() => navigate('/profile')}
            />
          )}
          
          {user?.role === 'SHIPPER' && (
            <ShipperProfileForm 
              profile={profile as any} 
              onSave={handleSave}
              onCancel={() => navigate('/profile')}
            />
          )}
          
          {user?.role === 'TRANSPORTER' && (
            <TransporterProfileForm 
              profile={profile as any} 
              onSave={handleSave}
              onCancel={() => navigate('/profile')}
            />
          )}
        </div>

        {/* Profile Completion Tips */}
        {!profileComplete && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📋 Tips to complete your profile:</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
              <li>Fill in all the required fields above</li>
              <li>Upload your documents in the Documents section</li>
              <li>Make sure all information is accurate</li>
              <li>Complete profile helps you get verified faster</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;