// src/pages/profile/ProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth.hook';
import { useProfile } from '../../hooks/useProfile';
import { useRating } from '../../hooks/useRating';
import { Link, useNavigate } from 'react-router-dom';

import { 
  HiUser, 
  HiDocumentText, 
  HiCheckCircle, 
  HiExclamationCircle, 
  HiPencil,
  HiStar,
  HiArrowRight
} from 'react-icons/hi';
import DriverProfileForm from '../../Components/profile/DriverProfileForm';
import ShipperProfileForm from '../../Components/profile/ShipperProfileForm';
import TransporterProfileForm from '../../Components/profile/TransporterProfileForm';
import DocumentUpload from '../../Components/profile/DocumentUpload';
import RatingCard from '../../Components/rating/RatingCard';
import RatingSummary from '../../Components/rating/RatingSummary';


const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const {
    profile,
    documents,
    loading,
    profileComplete,
    loadProfile,
    updateProfile,
    uploadDocument
  } = useProfile();
  
  const {
    receivedRatings,
    summary,
    loadMyReceivedRatings,
    loadMySummary,
    loading: ratingsLoading
  } = useRating();

  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'ratings'>('profile');
  const navigate = useNavigate();

  useEffect(() => {

  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

  if (!user || !token) {
    navigate('/login');
    return;
  }

  if (user.role !== 'ADMIN') {
    loadProfile();
    loadMyReceivedRatings(0, 5);
    loadMySummary();
  }

}, [user, navigate, loadProfile]);

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

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'DRIVER': return 'Driver Profile';
      case 'SHIPPER': return 'Shipper Profile';
      case 'TRANSPORTER': return 'Transporter Profile';
      default: return 'Profile';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{getRoleDisplayName()}</h1>
          <div className="space-x-3">
            <Link
              to="/profile/documents"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <HiDocumentText className="mr-2 h-4 w-4" />
              Documents
            </Link>
            <Link
              to="/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <HiPencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Completion Status */}
        <div className="mb-8">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Profile Completion:</span>
            {profileComplete ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <HiCheckCircle className="mr-1" /> Complete
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <HiExclamationCircle className="mr-1" /> Incomplete
              </span>
            )}
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: profileComplete ? '100%' : '60%' }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <HiUser className="mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <HiDocumentText className="mr-2" />
              Documents ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'ratings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <HiStar className="mr-2" />
              Ratings ({summary?.totalRatings || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            {user?.role === 'DRIVER' && (
              <DriverProfileForm
                profile={profile as any}
                onSave={updateProfile}
              />
            )}
            {user?.role === 'SHIPPER' && (
              <ShipperProfileForm
                profile={profile as any}
                onSave={updateProfile}
              />
            )}
            {user?.role === 'TRANSPORTER' && (
              <TransporterProfileForm
                profile={profile as any}
                onSave={updateProfile}
              />
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <DocumentUpload
              onUpload={uploadDocument}
              existingDocuments={documents}
            />

            {/* Document List */}
            {documents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{doc.docType}</p>
                          {doc.docNumber && (
                            <p className="text-sm text-gray-500 mt-1">Number: {doc.docNumber}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {doc.verificationStatus === 'APPROVED' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <HiCheckCircle className="mr-1" /> Approved
                            </span>
                          )}
                          {doc.verificationStatus === 'PENDING' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <HiExclamationCircle className="mr-1" /> Pending
                            </span>
                          )}
                          {doc.verificationStatus === 'REJECTED' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <HiExclamationCircle className="mr-1" /> Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="space-y-6">
            {/* Rating Summary */}
            {summary && (
              <RatingSummary summary={summary} showDetails />
            )}

            {/* Recent Ratings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Ratings</h3>
                <Link
                  to="/ratings/received"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  View All
                  <HiArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {ratingsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : receivedRatings.length > 0 ? (
                <div className="space-y-4">
                  {receivedRatings.slice(0, 3).map((rating) => (
                    <RatingCard key={rating.id} rating={rating} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No ratings yet</p>
              )}
            </div>

            {/* Rating Stats */}
            {summary && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <p className="text-2xl font-bold text-gray-900">{summary.totalRatings}</p>
                    <p className="text-sm text-gray-500">Total Ratings</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <p className="text-2xl font-bold text-gray-900">{summary.fiveStarCount}</p>
                    <p className="text-sm text-gray-500">5 Star</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <p className="text-2xl font-bold text-gray-900">{summary.fourStarCount}</p>
                    <p className="text-sm text-gray-500">4 Star</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;