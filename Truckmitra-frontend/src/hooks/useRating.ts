// src/hooks/useRating.ts

import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux.hook';

import { RatingRequest, ReviewRequest } from '../interfaces/rating.interface';
import toast from 'react-hot-toast';
import { fetchMyReceivedRatings,
  fetchMyGivenRatings,
  fetchMyRatingSummary,
  fetchMyStats,
  submitRating,
  addReview,
  markHelpful,
  unmarkHelpful,
  clearRatingError } from '../slices/ratingSlice';

export const useRating = () => {
  const dispatch = useAppDispatch();
  const {
    receivedRatings,
    givenRatings,
    summary,
    stats,
    loading,
    error,
    totalPages,
    currentPage
  } = useAppSelector((state) => state.rating);

  useEffect(() => {
    if (error) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        toast.error(error);
      }
      dispatch(clearRatingError());
    }
  }, [error, dispatch]);

  const loadMyReceivedRatings = useCallback(async (page = 0, size = 10) => {
    await dispatch(fetchMyReceivedRatings({ page, size }));
  }, [dispatch]);

  const loadMyGivenRatings = useCallback(async (page = 0, size = 10) => {
    await dispatch(fetchMyGivenRatings({ page, size }));
  }, [dispatch]);

  const loadMySummary = useCallback(async () => {
    await dispatch(fetchMyRatingSummary());
  }, [dispatch]);

  const loadMyStats = useCallback(async () => {
    await dispatch(fetchMyStats());
  }, [dispatch]);

  const handleSubmitRating = useCallback(async (data: RatingRequest) => {
    const result = await dispatch(submitRating(data));
    if (submitRating.fulfilled.match(result)) {
      toast.success('Rating submitted successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleAddReview = useCallback(async (data: ReviewRequest) => {
    const result = await dispatch(addReview(data));
    if (addReview.fulfilled.match(result)) {
      toast.success('Review added successfully');
      return true;
    }
    return false;
  }, [dispatch]);

  const handleMarkHelpful = useCallback(async (ratingId: number) => {
    await dispatch(markHelpful({ ratingId }));
  }, [dispatch]);

  const handleUnmarkHelpful = useCallback(async (ratingId: number) => {
    await dispatch(unmarkHelpful({ ratingId }));
  }, [dispatch]);

  return {
    // State
    receivedRatings,
    givenRatings,
    summary,
    stats,
    loading,
    totalPages,
    currentPage,

    // Actions
    loadMyReceivedRatings,
    loadMyGivenRatings,
    loadMySummary,
    loadMyStats,
    submitRating: handleSubmitRating,
    addReview: handleAddReview,
    markHelpful: handleMarkHelpful,
    unmarkHelpful: handleUnmarkHelpful,
  };
};