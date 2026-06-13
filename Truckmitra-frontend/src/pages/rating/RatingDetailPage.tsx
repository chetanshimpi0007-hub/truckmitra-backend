// src/pages/rating/RatingDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { useRating } from '../../hooks/useRating';
import RatingCard from '../../Components/rating/RatingCard';

import { HiArrowLeft, HiPencil, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ratingService from '../../services/rating/rating.service';
import ReviewList from '../../Components/rating/ReviewList';
import ReviewForm from '../../Components/rating/ReviewForm';

interface RatingDetailPageProps {
  tab?: 'details' | 'reviews';
}

const RatingDetailPage: React.FC<RatingDetailPageProps> = ({ tab = 'details' }) => {
  const { ratingId } = useParams<{ ratingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { markHelpful, unmarkHelpful } = useRating();
  
  const [rating, setRating] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    if (ratingId) {
      loadRating();
    }
  }, [ratingId]);

  const loadRating = async () => {
    try {
      const data = await ratingService.getRatingById(parseInt(ratingId!));
      setRating(data);
    } catch (error) {
      toast.error('Failed to load rating');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulToggle = async (ratingId: number, isHelpful: boolean) => {
    if (isHelpful) {
      await markHelpful(ratingId);
    } else {
      await unmarkHelpful(ratingId);
    }
    loadRating(); // Reload to get updated count
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        await ratingService.deleteRating(parseInt(ratingId!));
        toast.success('Rating deleted successfully');
        navigate('/profile');
      } catch (error) {
        toast.error('Failed to delete rating');
      }
    }
  };

  const canEdit = user?.id === rating?.raterId || user?.role === 'ADMIN';
  const canDelete = user?.id === rating?.raterId || user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!rating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Rating not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/profile"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <HiArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Rating Details</h1>
          </div>
          
          <div className="flex space-x-2">
            {canEdit && (
              <Link
                to={`/ratings/${ratingId}/edit`}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <HiPencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <HiTrash className="mr-2 h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rating Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'details' ? (
          <RatingCard
            rating={rating}
            onHelpfulToggle={handleHelpfulToggle}
            showActions
          />
        ) : (
          <div className="space-y-6">
            {/* Add Review Button */}
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Write a Review
              </button>
            )}
            
{activeTab === 'reviews' && (
  <div className="space-y-6">
    {/* Add Review Button */}
    {!showReviewForm && (
      <button
        onClick={() => setShowReviewForm(true)}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Write a Review
      </button>
    )}

    {/* Review Form */}
    {showReviewForm && (
      <ReviewForm
        ratingId={parseInt(ratingId!)}
        onSubmit={async (data) => {
          await ratingService.addReview(data);
          setShowReviewForm(false);
          loadRating(); // Reload to show new review
        }}
        onCancel={() => setShowReviewForm(false)}
      />
    )}

    {/* Reviews List */}
    <ReviewList ratingId={parseInt(ratingId!)} />
  </div>
)}

            {/* Review Form */}
            {showReviewForm && (
              <ReviewForm
                ratingId={parseInt(ratingId!)}
                onSubmit={async (data: any) => {
                  await ratingService.addReview(data);
                  setShowReviewForm(false);
                  loadRating();
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            {/* Reviews List */}
            <ReviewList ratingId={parseInt(ratingId!)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingDetailPage;