// src/pages/rating/MyRatingsPage.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth.hook';
import { useRating } from '../../hooks/useRating';

import { Link } from 'react-router-dom';
import { HiArrowLeft, HiStar } from 'react-icons/hi';
import RatingSummary from '../../Components/rating/RatingSummary';
import RatingCard from '../../Components/rating/RatingCard';

interface MyRatingsPageProps {
  type: 'received' | 'given' | 'stats';
}

const MyRatingsPage: React.FC<MyRatingsPageProps> = ({ type }) => {
  const { user } = useAuth();
  const {
    receivedRatings,
    givenRatings,
    summary,
    stats,
    loading,
    loadMyReceivedRatings,
    loadMyGivenRatings,
    loadMySummary,
    loadMyStats
  } = useRating();

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (type === 'received') {
      loadMyReceivedRatings(page);
    } else if (type === 'given') {
      loadMyGivenRatings(page);
    } else if (type === 'stats') {
      loadMyStats();
      loadMySummary();
    }
  }, [type, page]);

  const getTitle = () => {
    switch (type) {
      case 'received': return 'Ratings Received';
      case 'given': return 'Ratings Given';
      case 'stats': return 'My Rating Statistics';
      default: return 'Ratings';
    }
  };

  if (loading && type !== 'stats') {
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
            to="/profile"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <HiArrowLeft className="mr-2 h-5 w-5" />
            Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <HiStar className="mr-2 h-6 w-6 text-yellow-400" />
            {getTitle()}
          </h1>
        </div>

        {/* Stats Summary */}
        {type === 'stats' && summary && stats && (
          <div className="mb-8">
            <RatingSummary summary={summary} showDetails />
            
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRatings}</p>
                  <p className="text-sm text-gray-500">Total Ratings</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-gray-900">{stats.ratingsGiven}</p>
                  <p className="text-sm text-gray-500">Ratings Given</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-gray-900">{stats.ratingsReceived}</p>
                  <p className="text-sm text-gray-500">Ratings Received</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ratings List */}
        {type !== 'stats' && (
          <div className="space-y-4">
            {(type === 'received' ? receivedRatings : givenRatings).map((rating) => (
              <RatingCard key={rating.id} rating={rating} />
            ))}

            {/* Load More */}
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="w-full py-3 text-blue-600 hover:text-blue-500 font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRatingsPage;