// src/components/rating/RatingSummary.tsx

import React from 'react';
import { RatingSummary as RatingSummaryType } from '../../interfaces/rating.interface';
import RatingStars from './RatingStars';
import { Link } from 'react-router-dom';

interface RatingSummaryProps {
  summary: RatingSummaryType;
  showDetails?: boolean;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ summary, showDetails = false }) => {
  const total = summary.totalRatings;
  
  const getPercentage = (count: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const StarBar = ({ stars, count }: { stars: number; count: number }) => (
    <div className="flex items-center text-sm">
      <span className="w-12 text-gray-600">{stars} stars</span>
      <div className="flex-1 mx-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: `${getPercentage(count)}%` }}
          />
        </div>
      </div>
      <span className="w-12 text-gray-600 text-right">{count}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Ratings & Reviews</h3>
      
      <div className="flex items-start space-x-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {summary.averageRating.toFixed(1)}
          </div>
          <RatingStars rating={summary.averageRating} size="sm" />
          <div className="text-sm text-gray-500 mt-1">
            {summary.totalRatings} {summary.totalRatings === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Star Distribution */}
        <div className="flex-1 space-y-1">
          <StarBar stars={5} count={summary.fiveStarCount} />
          <StarBar stars={4} count={summary.fourStarCount} />
          <StarBar stars={3} count={summary.threeStarCount} />
          <StarBar stars={2} count={summary.twoStarCount} />
          <StarBar stars={1} count={summary.oneStarCount} />
        </div>
      </div>

      {/* Detailed Stats (Visible only to logged-in users) */}
      {showDetails && summary.showDetails && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Statistics</h4>
          <div className="grid grid-cols-3 gap-4">
            {summary.asShipperCount !== undefined && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500">As Shipper</p>
                <p className="text-lg font-semibold text-gray-900">{summary.asShipperCount}</p>
                <p className="text-xs text-gray-500">{summary.asShipperAvg?.toFixed(1)} avg</p>
              </div>
            )}
            {summary.asTransporterAvg !== undefined && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500">As Transporter</p>
                <p className="text-lg font-semibold text-gray-900">-</p>
                <p className="text-xs text-gray-500">{summary.asTransporterAvg.toFixed(1)} avg</p>
              </div>
            )}
            {summary.asDriverAvg !== undefined && (
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500">As Driver</p>
                <p className="text-lg font-semibold text-gray-900">-</p>
                <p className="text-xs text-gray-500">{summary.asDriverAvg.toFixed(1)} avg</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login Prompt for Public Users */}
      {!showDetails && !summary.showDetails && summary.totalRatings > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded text-center">
          <p className="text-sm text-blue-700">
            <Link to="/login" className="font-medium underline">
              Sign in
            </Link>
            {' '}to see detailed ratings and reviews
          </p>
        </div>
      )}
    </div>
  );
};

export default RatingSummary;