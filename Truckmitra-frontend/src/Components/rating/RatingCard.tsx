// src/components/rating/RatingCard.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '../../interfaces/rating.interface';
import RatingStars from './RatingStars';
import { useAuth } from '../../hooks/auth.hook';
import { HiCheckCircle, HiFlag, HiChat } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import HelpfulButton from './HelpfulButton';

interface RatingCardProps {
  rating: Rating;
  onHelpfulToggle?: (ratingId: number, isHelpful: boolean) => void;
  onResponse?: (ratingId: number, response: string) => void;
  onFlag?: (ratingId: number, reason: string) => void;
  showActions?: boolean;
}

const RatingCard: React.FC<RatingCardProps> = ({
  rating,
  onHelpfulToggle,
  onResponse,
  onFlag,
  showActions = true
}) => {
  const { user } = useAuth();
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  const isRatedUser = user?.id === rating.ratedId;
  const canRespond = isRatedUser && !rating.isResponseGiven;

  const handleResponseSubmit = () => {
    if (responseText.trim() && onResponse) {
      onResponse(rating.id, responseText);
      setShowResponseInput(false);
      setResponseText('');
    }
  };

  const handleFlagSubmit = () => {
    if (flagReason.trim() && onFlag) {
      onFlag(rating.id, flagReason);
      setShowFlagInput(false);
      setFlagReason('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Link to={`/profile/${rating.raterId}`} className="flex items-center group">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {rating.raterName.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                {rating.raterName}
                {rating.isVerified && (
                  <HiCheckCircle className="inline ml-1 h-4 w-4 text-green-500" />
                )}
              </p>
              <p className="text-xs text-gray-500">{rating.raterRole}</p>
            </div>
          </Link>
        </div>
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center justify-between mb-2">
        <RatingStars rating={rating.rating} size="md" showNumber />
        <span className="text-xs text-gray-500">
          {rating.helpfulCount} found helpful
        </span>
      </div>

      {/* Comment */}
      {rating.comment && (
        <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded">
          {rating.comment}
        </p>
      )}

      {/* Response */}
      {rating.isResponseGiven && rating.responseComment && (
        <div className="ml-6 mt-2 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
          <p className="text-xs font-medium text-blue-800 mb-1">Response from {rating.ratedName}:</p>
          <p className="text-sm text-gray-700">{rating.responseComment}</p>
          {rating.respondedAt && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(rating.respondedAt), { addSuffix: true })}
            </p>
          )}
        </div>
      )}

      {/* Response Input */}
      {showResponseInput && (
        <div className="mt-3">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setShowResponseInput(false)}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleResponseSubmit}
              disabled={!responseText.trim()}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Response
            </button>
          </div>
        </div>
      )}

      {/* Flag Input */}
      {showFlagInput && (
        <div className="mt-3">
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Reason for flagging..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setShowFlagInput(false)}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleFlagSubmit}
              disabled={!flagReason.trim()}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Submit Flag
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center space-x-4 mt-3 pt-2 border-t border-gray-100">
          <HelpfulButton
            ratingId={rating.id}
            initialCount={rating.helpfulCount}
            onToggle={(isHelpful) => onHelpfulToggle?.(rating.id, isHelpful)}
          />

          {canRespond && !rating.isResponseGiven && (
            <button
              onClick={() => setShowResponseInput(true)}
              className="flex items-center text-xs text-gray-600 hover:text-blue-600"
            >
              <HiChat className="mr-1 h-4 w-4" />
              Respond
            </button>
          )}

          {!isRatedUser && (
            <button
              onClick={() => setShowFlagInput(true)}
              className="flex items-center text-xs text-gray-600 hover:text-red-600"
            >
              <HiFlag className="mr-1 h-4 w-4" />
              Flag
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingCard;