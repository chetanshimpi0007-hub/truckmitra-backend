// src/components/rating/HelpfulButton.tsx

import React, { useState, useEffect } from 'react';
import { HiThumbUp, HiOutlineThumbUp } from 'react-icons/hi';

import { useAuth } from '../../hooks/auth.hook';
import toast from 'react-hot-toast';
import ratingService from '../../services/rating/rating.service';

interface HelpfulButtonProps {
  ratingId: number;
  initialCount: number;
  onToggle?: (isHelpful: boolean) => void;
}

const HelpfulButton: React.FC<HelpfulButtonProps> = ({
  ratingId,
  initialCount,
  onToggle
}) => {
  const { isAuthenticated } = useAuth();
  const [isHelpful, setIsHelpful] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkIfHelpful();
    }
  }, [ratingId, isAuthenticated]);

  const checkIfHelpful = async () => {
    try {
      const helpful = await ratingService.checkHelpful(ratingId);
      setIsHelpful(helpful);
    } catch (error) {
      console.error('Failed to check helpful status:', error);
    }
  };

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to mark as helpful');
      return;
    }

    setLoading(true);
    try {
      if (isHelpful) {
        await ratingService.unmarkHelpful(ratingId);
        setIsHelpful(false);
        setCount(prev => prev - 1);
        onToggle?.(false);
      } else {
        await ratingService.markHelpful({ ratingId });
        setIsHelpful(true);
        setCount(prev => prev + 1);
        onToggle?.(true);
      }
    } catch (error) {
      toast.error('Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center space-x-1 text-sm ${
        isHelpful ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {isHelpful ? (
        <HiThumbUp className="h-4 w-4" />
      ) : (
        <HiOutlineThumbUp className="h-4 w-4" />
      )}
      <span>Helpful ({count})</span>
    </button>
  );
};

export default HelpfulButton;