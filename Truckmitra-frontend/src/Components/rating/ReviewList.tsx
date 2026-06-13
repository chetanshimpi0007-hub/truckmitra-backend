// src/components/rating/ReviewList.tsx

import React, { useState, useEffect } from 'react';
import { Review } from '../../interfaces/rating.interface';
import { formatDistanceToNow } from 'date-fns';
import { HiCheckCircle } from 'react-icons/hi';
import ratingService from '../../services/rating/rating.service';


interface ReviewListProps {
  ratingId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ ratingId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [ratingId, page]);

  const loadReviews = async () => {
    try {
      const response = await ratingService.getReviewsForRating(ratingId, page);
      setReviews(prev => page === 0 ? response.content : [...prev, ...response.content]);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 0) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">No reviews yet</p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-50 p-4 rounded">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {review.reviewerName}
              </span>
              {review.isVerified && (
                <HiCheckCircle className="ml-1 h-4 w-4 text-green-500" />
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-gray-700">{review.content}</p>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => setPage(prev => prev + 1)}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-500"
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
};

export default ReviewList;