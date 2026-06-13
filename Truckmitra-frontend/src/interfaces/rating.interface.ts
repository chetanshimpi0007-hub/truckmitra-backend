// src/interfaces/rating.interface.ts

export enum RatingType {
  SHIPPER_TO_TRANSPORTER = 'SHIPPER_TO_TRANSPORTER',
  TRANSPORTER_TO_SHIPPER = 'TRANSPORTER_TO_SHIPPER',
  SHIPPER_TO_DRIVER = 'SHIPPER_TO_DRIVER',
  DRIVER_TO_SHIPPER = 'DRIVER_TO_SHIPPER',
  TRANSPORTER_TO_DRIVER = 'TRANSPORTER_TO_DRIVER',
  DRIVER_TO_TRANSPORTER = 'DRIVER_TO_TRANSPORTER'
}

export interface Rating {
  id: number;
  raterId: number;
  raterName: string;
  raterRole: string;
  ratedId: number;
  ratedName: string;
  ratedRole: string;
  tripId: number;
  loadId?: number;
  bidId?: number;
  ratingType: RatingType;
  rating: number;
  comment?: string;
  isVerified: boolean;
  helpfulCount: number;
  isAnonymous: boolean;
  isFlagged: boolean;
  isResponseGiven: boolean;
  responseComment?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface RatingRequest {
  ratedId: number;
  tripId: number;
  loadId?: number;
  bidId?: number;
  ratingType: RatingType;
  rating: number;
  comment?: string;
  isAnonymous?: boolean;
}

export interface Review {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewerRole: string;
  content: string;
  isVerified: boolean;
  isHelpful: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  ratingId: number;
  content: string;
}

export interface RatingSummary {
  userId: number;
  userName?: string;
  userRole?: string;
  averageRating: number;
  totalRatings: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  asShipperCount?: number;
  asTransporterAvg?: number;
  asDriverAvg?: number;
  asShipperAvg?: number;
  showDetails: boolean;
}

export interface UserRatingStats {
  userId: number;
  averageRating: number;
  totalRatings: number;
  ratingsGiven: number;
  ratingsReceived: number;
  averageGiven: number;
  averageReceived: number;
}

export interface HelpfulVoteRequest {
  ratingId: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}