// src/pages/profile/DocumentsPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { useProfile } from '../../hooks/useProfile';
import { HiArrowLeft, HiCheckCircle, HiXCircle, HiClock, HiDocumentText, HiPhotograph } from 'react-icons/hi';
import { VerificationStatus } from '../../interfaces/profile.interface';
import DocumentUpload from '../../Components/profile/DocumentUpload';

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const { documents, loading, uploadDocument, refreshProfile } = useProfile();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.APPROVED:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <HiCheckCircle className="mr-1 h-3 w-3" /> Approved
          </span>
        );
      case VerificationStatus.REJECTED:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <HiXCircle className="mr-1 h-3 w-3" /> Rejected
          </span>
        );
      case VerificationStatus.PENDING:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <HiClock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  const handleUpload = async (data: any) => {
    await uploadDocument(data);
    await refreshProfile();
  };

  const getDocumentTypeLabel = (docType: string) => {
    const types: Record<string, string> = {
      AADHAAR_FRONT: 'Aadhaar Card (Front)',
      AADHAAR_BACK: 'Aadhaar Card (Back)',
      PAN_CARD: 'PAN Card',
      DRIVING_LICENSE_FRONT: 'Driving License (Front)',
      DRIVING_LICENSE_BACK: 'Driving License (Back)',
      GST_CERTIFICATE: 'GST Certificate',
      VEHICLE_RC: 'Vehicle Registration',
      VEHICLE_INSURANCE: 'Vehicle Insurance',
      BUSINESS_PROOF: 'Business Proof',
      PROFILE_PICTURE: 'Profile Picture',
    };
    return types[docType] || docType;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        </div>

        {/* Document Upload Section */}
        <div className="mb-8">
          <DocumentUpload 
            onUpload={handleUpload}
            existingDocuments={documents}
          />
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Uploaded Documents</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <HiDocumentText className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-900">
                          {getDocumentTypeLabel(doc.docType)}
                        </h3>
                        <span className="ml-3">{getStatusBadge(doc.verificationStatus)}</span>
                      </div>
                      
                      {doc.docNumber && (
                        <p className="mt-1 text-sm text-gray-500">
                          Document No: {doc.docNumber}
                        </p>
                      )}
                      
                      <p className="mt-1 text-xs text-gray-400">
                        Uploaded on: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                      
                      {doc.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-100">
                          <p className="text-xs text-red-600">
                            <span className="font-medium">Rejection Reason:</span> {doc.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Image Previews */}
                    {(doc.docFrontImageUrl || doc.docBackImageUrl) && (
                      <div className="flex space-x-2">
                        {doc.docFrontImageUrl && (
                          <button
                            onClick={() => {
                              setSelectedDoc(doc.docFrontImageUrl);
                              setShowPreview(true);
                            }}
                            className="relative group"
                          >
                            <img 
                              src={doc.docFrontImageUrl} 
                              alt="Front" 
                              className="h-16 w-16 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                            />
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              Front
                            </span>
                          </button>
                        )}
                        {doc.docBackImageUrl && (
                          <button
                            onClick={() => {
                              setSelectedDoc(doc.docBackImageUrl);
                              setShowPreview(true);
                            }}
                            className="relative group"
                          >
                            <img 
                              src={doc.docBackImageUrl} 
                              alt="Back" 
                              className="h-16 w-16 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                            />
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              Back
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <HiPhotograph className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your first document.
            </p>
          </div>
        )}

        {/* Image Preview Modal */}
        {showPreview && selectedDoc && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <div className="relative max-w-3xl max-h-full">
              <img 
                src={selectedDoc} 
                alt="Document Preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                <HiXCircle className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;