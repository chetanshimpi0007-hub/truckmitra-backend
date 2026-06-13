// src/components/profile/DocumentUpload.tsx

import React, { useState, useRef, useEffect } from 'react';
import { DocumentType, VerificationStatus } from '../../interfaces/profile.interface';
import { HiUpload, HiX, HiCheckCircle, HiClock, HiExclamationCircle, HiPhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';
import cloudinaryService from '../../services/profile/cloudinary.service';

interface DocumentUploadProps {
  onUpload: (data: any) => Promise<void>;
  existingDocuments?: Array<{
    docType: DocumentType;
    verificationStatus: VerificationStatus;
    docFrontImageUrl?: string;
    docBackImageUrl?: string;
    rejectionReason?: string;
  }>;
}

const documentTypes = [
  { value: DocumentType.AADHAAR_FRONT, label: 'Aadhaar Card (Front)', required: true },
  { value: DocumentType.AADHAAR_BACK, label: 'Aadhaar Card (Back)', required: true },
  { value: DocumentType.PAN_CARD, label: 'PAN Card', required: true },
  { value: DocumentType.DRIVING_LICENSE_FRONT, label: 'Driving License (Front)', required: true },
  { value: DocumentType.DRIVING_LICENSE_BACK, label: 'Driving License (Back)', required: true },
  { value: DocumentType.GST_CERTIFICATE, label: 'GST Certificate', required: false },
  { value: DocumentType.VEHICLE_RC, label: 'Vehicle Registration', required: false },
  { value: DocumentType.VEHICLE_INSURANCE, label: 'Vehicle Insurance', required: false },
  { value: DocumentType.BUSINESS_PROOF, label: 'Business Proof', required: false },
  { value: DocumentType.PROFILE_PICTURE, label: 'Profile Picture', required: false }
];

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload, existingDocuments = [] }) => {
  const [selectedType, setSelectedType] = useState<DocumentType | ''>('');
  const [docNumber, setDocNumber] = useState('');
  const [frontImage, setFrontImage] = useState<string>('');
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<string>('');
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // Check if document already exists
  const isDocumentUploaded = (type: DocumentType) => {
    return existingDocuments.some(doc => doc.docType === type);
  };

  const getDocumentStatus = (type: DocumentType) => {
    const doc = existingDocuments.find(d => d.docType === type);
    return doc?.verificationStatus;
  };

  const getStatusBadge = (status?: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.APPROVED:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <HiCheckCircle className="mr-1" /> Approved
        </span>;
      case VerificationStatus.REJECTED:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <HiExclamationCircle className="mr-1" /> Rejected
        </span>;
      case VerificationStatus.PENDING:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <HiClock className="mr-1" /> Pending
        </span>;
      default:
        return null;
    }
  };

  const handleFileSelect = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setFrontImageFile(file);
      handleFileSelect(file, setFrontImage);
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setBackImageFile(file);
      handleFileSelect(file, setBackImage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      setError('Please select document type');
      return;
    }

    const selectedDocType = documentTypes.find(d => d.value === selectedType);
    
    // Validate required fields
    if (!frontImageFile && selectedDocType?.required) {
      setError('Front image is required');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(10);

    try {
      let frontImageUrl = '';
      let backImageUrl = '';

      // Upload front image to Cloudinary
      if (frontImageFile) {
        setUploadProgress(30);
        frontImageUrl = await cloudinaryService.uploadImage(
          frontImageFile, 
          `truckmitra/documents/${selectedType.toLowerCase()}`
        );
        setUploadProgress(60);
      }

      // Upload back image to Cloudinary (if exists)
      if (backImageFile) {
        backImageUrl = await cloudinaryService.uploadImage(
          backImageFile,
          `truckmitra/documents/${selectedType.toLowerCase()}`
        );
        setUploadProgress(80);
      }

      // Send to backend
      await onUpload({
        docType: selectedType,
        docNumber: docNumber || undefined,
        docFrontImageUrl: frontImageUrl,
        docBackImageUrl: backImageUrl || undefined
      });

      setUploadProgress(100);
      toast.success('Document uploaded successfully');

      // Reset form
      setSelectedType('');
      setDocNumber('');
      setFrontImage('');
      setFrontImageFile(null);
      setBackImage('');
      setBackImageFile(null);
      
      // Reset file inputs
      if (frontInputRef.current) frontInputRef.current.value = '';
      if (backInputRef.current) backInputRef.current.value = '';

    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload document');
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearFrontImage = () => {
    setFrontImage('');
    setFrontImageFile(null);
    if (frontInputRef.current) frontInputRef.current.value = '';
  };

  const clearBackImage = () => {
    setBackImage('');
    setBackImageFile(null);
    if (backInputRef.current) backInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Document Upload</h3>

      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
          <div className="grid grid-cols-2 gap-3">
            {existingDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  {documentTypes.find(d => d.value === doc.docType)?.label}
                </span>
                {getStatusBadge(doc.verificationStatus)}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Document Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as DocumentType);
              setError('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={uploading}
          >
            <option value="">Choose document type</option>
            {documentTypes.map(type => (
              <option 
                key={type.value} 
                value={type.value}
                disabled={isDocumentUploaded(type.value)}
              >
                {type.label} {type.required ? '*' : ''} 
                {isDocumentUploaded(type.value) ? ' (Uploaded)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Document Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Number <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            placeholder="Enter document number if applicable"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={uploading}
          />
        </div>

        {/* Front Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Front Image {documentTypes.find(d => d.value === selectedType)?.required ? '*' : ''}
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={handleFrontImageChange}
                className="hidden"
                id="front-image"
                disabled={uploading}
              />
              <label
                htmlFor="front-image"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <HiPhotograph className="mr-2" />
                Choose File
              </label>
            </div>
            {frontImage && (
              <div className="relative">
                <img 
                  src={frontImage} 
                  alt="Front preview" 
                  className="h-16 w-16 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={clearFrontImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <HiX className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back Image Upload (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Back Image <span className="text-gray-400">(Optional)</span>
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackImageChange}
                className="hidden"
                id="back-image"
                disabled={uploading}
              />
              <label
                htmlFor="back-image"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <HiPhotograph className="mr-2" />
                Choose File
              </label>
            </div>
            {backImage && (
              <div className="relative">
                <img 
                  src={backImage} 
                  alt="Back preview" 
                  className="h-16 w-16 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={clearBackImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <HiX className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !selectedType}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <HiUpload className="mr-2" />
              Upload Document
            </>
          )}
        </button>
      </form>

      {/* Preview Mode Toggle */}
      {frontImage && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {previewMode ? 'Hide Preview' : 'Show Full Preview'}
          </button>
          
          {previewMode && (
            <div className="mt-2 grid grid-cols-2 gap-4">
              {frontImage && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Front Image</p>
                  <img src={frontImage} alt="Front" className="w-full rounded-lg border" />
                </div>
              )}
              {backImage && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Back Image</p>
                  <img src={backImage} alt="Back" className="w-full rounded-lg border" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;