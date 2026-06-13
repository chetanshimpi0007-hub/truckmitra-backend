// src/store/slices/ratingSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Rating,
  RatingSummary,
  UserRatingStats,
  RatingRequest,
  ReviewRequest
} from '../interfaces/rating.interface';
import ratingService from '../services/rating/rating.service';

interface RatingState {
  receivedRatings: Rating[];
  givenRatings: Rating[];
  summary: RatingSummary | null;
  stats: UserRatingStats | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: RatingState = {
  receivedRatings: [],
  givenRatings: [],
  summary: null,
  stats: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
};

// ==================== Async Thunks ====================

export const fetchMyReceivedRatings = createAsyncThunk(
  'rating/fetchMyReceivedRatings',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await ratingService.getMyReceivedRatings(page, size);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch received ratings');
    }
  }
);

export const fetchMyGivenRatings = createAsyncThunk(
  'rating/fetchMyGivenRatings',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await ratingService.getMyGivenRatings(page, size);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch given ratings');
    }
  }
);

export const fetchMyRatingSummary = createAsyncThunk(
  'rating/fetchMyRatingSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ratingService.getMyRatingSummary();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rating summary');
    }
  }
);

export const fetchMyStats = createAsyncThunk(
  'rating/fetchMyStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ratingService.getMyStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rating stats');
    }
  }
);

export const submitRating = createAsyncThunk(
  'rating/submitRating',
  async (data: RatingRequest, { rejectWithValue }) => {
    try {
      const response = await ratingService.submitRating(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit rating');
    }
  }
);

export const addReview = createAsyncThunk(
  'rating/addReview',
  async (data: ReviewRequest, { rejectWithValue }) => {
    try {
      const response = await ratingService.addReview(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

export const markHelpful = createAsyncThunk(
  'rating/markHelpful',
  async ({ ratingId }: { ratingId: number }, { rejectWithValue }) => {
    try {
      await ratingService.markHelpful({ ratingId });
      return ratingId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as helpful');
    }
  }
);

export const unmarkHelpful = createAsyncThunk(
  'rating/unmarkHelpful',
  async ({ ratingId }: { ratingId: number }, { rejectWithValue }) => {
    try {
      await ratingService.unmarkHelpful(ratingId);
      return ratingId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unmark as helpful');
    }
  }
);

// ==================== Slice ====================

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    clearRatingError: (state) => {
      state.error = null;
    },
    clearRatings: (state) => {
      state.receivedRatings = [];
      state.givenRatings = [];
      state.summary = null;
      state.stats = null;
    },
    setRatingPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Received Ratings
      .addCase(fetchMyReceivedRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReceivedRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedRatings = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchMyReceivedRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch My Given Ratings
      .addCase(fetchMyGivenRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGivenRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.givenRatings = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchMyGivenRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch My Rating Summary
      .addCase(fetchMyRatingSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRatingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchMyRatingSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch My Stats
      .addCase(fetchMyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchMyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Submit Rating
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRating.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Mark Helpful
      .addCase(markHelpful.fulfilled, (state, action) => {
        // Update helpful count in received ratings
        const rating = state.receivedRatings.find(r => r.id === action.payload);
        if (rating) {
          rating.helpfulCount += 1;
        }
      })

      // Unmark Helpful
      .addCase(unmarkHelpful.fulfilled, (state, action) => {
        const rating = state.receivedRatings.find(r => r.id === action.payload);
        if (rating && rating.helpfulCount > 0) {
          rating.helpfulCount -= 1;
        }
      });
  },
});

export const { clearRatingError, clearRatings, setRatingPage } = ratingSlice.actions;
export default ratingSlice.reducer;