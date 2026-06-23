// src/pages/rating/CreateRatingPage.tsx

import React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useRating } from '../../hooks/useRating';
import { HiArrowLeft } from 'react-icons/hi';
import RatingForm from './RatingForm';

interface CreateRatingPageProps {
  type?: 'rating' | 'review';
}

const CreateRatingPage: React.FC<CreateRatingPageProps> = ({ type = 'rating' }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { submitRating } = useRating();

  // Get data from URL params
  const ratedId = parseInt(searchParams.get('ratedId') || '0');
  const tripId = parseInt(searchParams.get('tripId') || '0');
  const loadId = searchParams.get('loadId') ? parseInt(searchParams.get('loadId')!) : undefined;
  const bidId = searchParams.get('bidId') ? parseInt(searchParams.get('bidId')!) : undefined;
  const ratingType = searchParams.get('type') || '';
  const ratedName = searchParams.get('name') || 'User';

  if (!ratedId || !tripId || !ratingType) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Missing required parameters</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    const success = await submitRating(data);
    if (success) {
      navigate(`/trips/${tripId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Back to Trip
          </Link>
        </div>

        {/* Rating Form */}
        <RatingForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/trips/${tripId}`)}
          ratedId={ratedId}
          ratedName={ratedName}
          tripId={tripId}
          ratingType={ratingType as any}
          loadId={loadId}
          bidId={bidId}
        />
      </div>
    </div>
  );
};

export default CreateRatingPage;