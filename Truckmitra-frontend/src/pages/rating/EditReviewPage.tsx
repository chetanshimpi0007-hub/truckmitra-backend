// src/pages//EditReviewPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { HiArrowLeft, HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';

interface Review {
  id: number;
  ratingId: number;
  reviewerId: number;
  reviewerName: string;
  reviewerRole: string;
  content: string;
  isVerified: boolean;
  isHelpful: boolean;
  createdAt: string;
}

const EditReviewPage: React.FC = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [review, ] = useState<Review | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [] = useState<any>(null);

  useEffect(() => {
    if (reviewId) {
      loadReview();
    }
  }, [reviewId]);

  const loadReview = async () => {
    try {
      // First, get the that contains this review
      // Note: There's no direct endpoint to get a single review
      // So we need to get the first
      
      // Since we don't have reviewId endpoint, we'll simulate for demo
      // In real app, you'd need a backend endpoint like GET /api/ratings/reviews/{reviewId}
      
      // For demo, we'll show a message
      toast.error('Direct review editing not available in demo. Please implement backend endpoint.');
      navigate(-1);
      
      // Mock implementation (replace with actual API call)
      // const response = await ratingService.getReviewById(parseInt(reviewId!));
      // (response);
      // setContent(response.content);
      // (response.);
      
    } catch (error) {
      console.error('Failed to load review:', error);
      toast.error('Failed to load review');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter review content');
      return;
    }

    if (content.length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      await protectedApi.put(`/api/reviews/${reviewId}`, { content });
      
      toast.success('Review updated successfully');
      navigate(`/ratings/${review?.ratingId || ''}`);
      
    } catch (error) {
      console.error('Failed to update review:', error);
      toast.error('Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await protectedApi.delete(`/api/reviews/${reviewId}`);
      
      toast.success('Review deleted successfully');
      navigate(`/ratings/${review?.ratingId || ''}`);
      
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to={`/ratings/${review?.ratingId}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <HiArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Review</h1>
          </div>
          
          {/* Delete button (only for admin) */}
          {user?.role === 'ADMIN' && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Review
            </button>
          )}
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Review Info */}
            {review && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Review by:</span> {review.reviewerName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Rating ID:</span> #{review.ratingId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Posted on:</span>{' '}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                {review.isVerified && (
                  <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified Review
                  </span>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Review Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your review..."
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Minimum 10 characters. Your review should be helpful and respectful.
                </p>
              </div>

              {/* Guidelines */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Review Guidelines</h4>
                <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
                  <li>Be honest and constructive in your feedback</li>
                  <li>Avoid using offensive language</li>
                  <li>Focus on the experience, not personal attacks</li>
                  <li>Your review may be moderated by admins</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Link
                  to={`/ratings/${review?.ratingId}`}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <HiSave className="mr-2 h-5 w-5" />
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewPage;