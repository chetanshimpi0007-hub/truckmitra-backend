// src/pages/rating/UserRatingsPage.tsx (Updated - Handles all user ratings)

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';

import { HiArrowLeft, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ratingService from '../../services/rating/rating.service';
import RatingSummary from '../../Components/rating/RatingSummary';
import RatingCard from '../../Components/rating/RatingCard';

interface UserRatingsPageProps {
  public?: boolean;
}

const UserRatingsPage: React.FC<UserRatingsPageProps> = ({ public: isPublic }) => {
  const { userId, ratingType } = useParams<{ userId: string; ratingType?: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [ratings, setRatings] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/profile');
      return;
    }
    loadData();
  }, [userId, ratingType, page]);

 const loadData = async () => {
  // 1. Safety Check: Agar userId nahi hai toh aage mat badho
  if (!userId) {
    console.warn("User ID is missing");
    return;
  }

  setLoading(true);
  try {
    // 2. userId ko parse karne se pehle string confirm karein
    const uId = parseInt(userId);

    // Load summary from public endpoint
    const summaryData = await ratingService.getPublicRatingSummary(uId);
    setSummary(summaryData);
    setUserName(summaryData.userName || 'User');

    // Load ratings
    let response:any;
    
    // 3. ratingType undefined ho sakta hai, isliye string check zaroori hai
    if (ratingType && typeof ratingType === 'string') {
      response = await ratingService.getUserRatingsByType(uId, ratingType, page, 10);
    } else {
      response = await ratingService.getUserReceivedRatings(uId, page, 10);
    }
    
    if (page === 0) {
      setRatings(response.content);
    } else {
      setRatings(prev => [...prev, ...response.content]);
    }
    setHasMore(!response.last);
    
  } catch (error) {
    console.error('Failed to load ratings:', error);
    toast.error('Failed to load ratings');
  } finally {
    setLoading(false);
  }
};

  if (loading && page === 0) {
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
          <Link
            to={isPublic ? '/' : '/profile'}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <HiStar className="mr-2 h-6 w-6 text-yellow-400" />
            {userName}'s Ratings
          </h1>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-8">
            <RatingSummary summary={summary} showDetails={isAuthenticated} />
          </div>
        )}

        {/* Ratings List */}
        <div className="space-y-4">
          {ratings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No ratings yet</p>
            </div>
          ) : (
            <>
              {ratings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} />
              ))}

              {hasMore && (
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="w-full py-3 text-blue-600 hover:text-blue-500 font-medium"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRatingsPage;