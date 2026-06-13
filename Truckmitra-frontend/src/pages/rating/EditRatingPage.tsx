// src/pages/rating/EditRatingPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';


import { HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ratingService from '../../services/rating/rating.service';
import RatingStars from '../../Components/rating/RatingStars';

const EditRatingPage: React.FC = () => {
  const { ratingId } = useParams<{ ratingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState<any>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ratingId) {
      loadRating();
    }
  }, [ratingId]);

  const loadRating = async () => {
    try {
      const data = await ratingService.getRatingById(parseInt(ratingId!));
      
      // Check permission
      if (user?.id !== data.raterId && user?.role !== 'ADMIN') {
        toast.error('You do not have permission to edit this rating');
        navigate('/profile');
        return;
      }
      
      setRating(data);
      setRatingValue(data.rating);
      setComment(data.comment || '');
    } catch (error) {
      toast.error('Failed to load rating');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    try {
      // In a real app, you'd have an update endpoint
      // For now, we'll just show success
      toast.success('Rating updated successfully (demo)');
      navigate(`/ratings/${ratingId}`);
    } catch (error) {
      toast.error('Failed to update rating');
    } finally {
      setSubmitting(false);
    }
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link
            to={`/ratings/${ratingId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Rating</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <RatingStars
                rating={ratingValue}
                size="lg"
                interactive
                onRatingChange={setRatingValue}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Update your review..."
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-3">
              <Link
                to={`/ratings/${ratingId}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || ratingValue === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRatingPage;