// src/services/rating.service.ts (Updated)

import {
  Rating,
  RatingRequest,
  Review,
  ReviewRequest,
  RatingSummary,
  UserRatingStats,
  HelpfulVoteRequest,
  PageResponse
} from '../../interfaces/rating.interface';
import protectedApi, { publicApi } from '../api/protectedAndPublicAPI';

class RatingService {
  
  // ==================== PUBLIC ENDPOINTS (No Login Required) ====================
  
  async getPublicRatingSummary(userId: number): Promise<RatingSummary> {
    const response = await publicApi.get(`/api/ratings/public/summary/${userId}`);
    return response.data.data;
  }

  // ==================== RATING OPERATIONS ====================
  
  async submitRating(data: RatingRequest): Promise<Rating> {
    const response = await protectedApi.post('/api/ratings', data);
    return response.data.data;
  }
  
  async getRatingById(ratingId: number): Promise<Rating> {
    const response = await protectedApi.get(`/api/ratings/${ratingId}`);
    return response.data.data;
  }
  
  async getMyReceivedRatings(page = 0, size = 10): Promise<PageResponse<Rating>> {
    const response = await protectedApi.get(`/api/ratings/received?page=${page}&size=${size}`);
    return response.data.data;
  }
  
  async getMyGivenRatings(page = 0, size = 10): Promise<PageResponse<Rating>> {
    const response = await protectedApi.get(`/api/ratings/given?page=${page}&size=${size}`);
    return response.data.data;
  }
  
  async getUserReceivedRatings(userId: number, page = 0, size = 10): Promise<PageResponse<Rating>> {
    const response = await protectedApi.get(`/api/ratings/user/${userId}/received?page=${page}&size=${size}`);
    return response.data.data;
  }
  
  async getUserRatingsByType(userId: number, ratingType: string, page = 0, size = 10): Promise<PageResponse<Rating>> {
    const response = await protectedApi.get(`/api/ratings/user/${userId}/type/${ratingType}?page=${page}&size=${size}`);
    return response.data.data;
  }
  
  async getMyRatingSummary(): Promise<RatingSummary> {
    const response = await protectedApi.get('/api/ratings/summary/me');
    return response.data.data;
  }
  
  async getMyStats(): Promise<UserRatingStats> {
    const response = await protectedApi.get('/api/ratings/stats/me');
    return response.data.data;
  }
  
  async checkIfRated(tripId: number, ratingType: string): Promise<boolean> {
    const response = await protectedApi.get(`/api/ratings/trip/${tripId}/check/${ratingType}`);
    return response.data.data;
  }

  // ==================== REVIEW OPERATIONS ====================
  
  async addReview(data: ReviewRequest): Promise<Review> {
    const response = await protectedApi.post('/api/ratings/reviews', data);
    return response.data.data;
  }
  
  async getReviewsForRating(ratingId: number, page = 0, size = 10): Promise<PageResponse<Review>> {
    const response = await protectedApi.get(`/api/ratings/${ratingId}/reviews?page=${page}&size=${size}`);
    return response.data.data;
  }

  // ==================== HELPFUL VOTE OPERATIONS ====================
  
  async markHelpful(data: HelpfulVoteRequest): Promise<void> {
    await protectedApi.post('/api/ratings/helpful', data);
  }
  
  async unmarkHelpful(ratingId: number): Promise<void> {
    await protectedApi.delete(`/api/ratings/helpful/${ratingId}`);
  }
  
  async checkHelpful(ratingId: number): Promise<boolean> {
    const response = await protectedApi.get(`/api/ratings/${ratingId}/helpful/check`);
    return response.data.data;
  }

  // ==================== ADMIN ONLY OPERATIONS ====================
  
  async deleteRating(ratingId: number): Promise<void> {
    await protectedApi.delete(`/api/ratings/admin/${ratingId}`);
  }
  
  async deleteReview(reviewId: number): Promise<void> {
    await protectedApi.delete(`/api/ratings/admin/reviews/${reviewId}`);
  }
  
  async verifyRating(ratingId: number): Promise<void> {
    await protectedApi.put(`/api/ratings/admin/${ratingId}/verify`);
  }
  
  async verifyReview(reviewId: number): Promise<void> {
    await protectedApi.put(`/api/ratings/admin/reviews/${reviewId}/verify`);
  }
}

export default new RatingService();