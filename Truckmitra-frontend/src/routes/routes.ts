// // src/routes/routes.ts
// export const ROUTES = {
//   // ===== PUBLIC ROUTES =====
//   HOME: '/',
//   LOGIN: '/login',
//   REGISTER: '/register',
//   FORGOT_PASSWORD: '/forgot-password',
//   PENDING_APPROVAL: '/pending-approval',

//   // ===== PROFILE ROUTES =====
//   PROFILE: {
//     MY_PROFILE: '/profile',
//     EDIT: '/profile/edit',
//     PUBLIC: '/profile/:id',
//     EXPLORE: '/profiles',
//   },

//   // ===== LOAD/TRIP ROUTES =====
//   LOADS: {
//     LIST: '/loads',
//     DETAILS: '/loads/:id',
//     CREATE: '/loads/create',
//     SEARCH: '/loads/search',
//   },

//   // ===== BID ROUTES =====
//   BIDS: {
//     LIST: '/bids',
//     DETAILS: '/bids/:id',
//     MY_BIDS: '/bids/my-bids',
//   },

//   // ===== TRIP ROUTES =====
//   TRIPS: {
//     LIST: '/trips',
//     DETAILS: '/trips/:id',
//     ACTIVE: '/trips/active',
//     HISTORY: '/trips/history',
//   },

//   // ===== WALLET ROUTES =====
//   WALLET: {
//     MAIN: '/wallet',
//     TRANSACTIONS: '/wallet/transactions',
//     ADD_MONEY: '/wallet/add-money',
//     WITHDRAW: '/wallet/withdraw',
//   },

//   // ===== NOTIFICATION ROUTES =====
//   NOTIFICATIONS: '/notifications',

//   // ===== DRIVER ROUTES =====
//   DRIVER: {
//     DASHBOARD: '/driver/dashboard',
//     AVAILABLE_LOADS: '/driver/available-loads',
//     MY_TRIPS: '/driver/trips',
//     MY_BIDS: '/driver/bids',
//     EARNINGS: '/driver/earnings',
//     VEHICLE: '/driver/vehicle',
//     DOCUMENTS: '/driver/documents',
//   },

//   // ===== SHIPPER ROUTES =====
//   SHIPPER: {
//     DASHBOARD: '/shipper/dashboard',
//     MY_LOADS: '/shipper/loads',
//     CREATE_LOAD: '/shipper/loads/create',
//     LOAD_DETAILS: '/shipper/loads/:id',
//     MY_BIDS: '/shipper/bids',
//     PAYMENTS: '/shipper/payments',
//     TRANSPORTERS: '/shipper/transporters',
//   },

//   // ===== TRANSPORTER ROUTES =====
//   TRANSPORTER: {
//     DASHBOARD: '/transporter/dashboard',
//     AVAILABLE_LOADS: '/transporter/available-loads',
//     MY_VEHICLES: '/transporter/vehicles',
//     ADD_VEHICLE: '/transporter/vehicles/add',
//     MY_DRIVERS: '/transporter/drivers',
//     ADD_DRIVER: '/transporter/drivers/add',
//     MY_BIDS: '/transporter/bids',
//     EARNINGS: '/transporter/earnings',
//   },

//   // ===== ADMIN ROUTES =====
//   ADMIN: {
//     DASHBOARD: '/admin/dashboard',
//     USERS: '/admin/users',
//     USER_DETAILS: '/admin/users/:id',
//     LOADS: '/admin/loads',
//     LOAD_DETAILS: '/admin/loads/:id',
//     TRIPS: '/admin/trips',
//     TRANSACTIONS: '/admin/transactions',
//     VERIFICATIONS: '/admin/verifications',
//     REPORTS: '/admin/reports',
//     SETTINGS: '/admin/settings',
//   },

//   // ===== STATIC PAGES =====
//   ABOUT: '/about',
//   CONTACT: '/contact',
//   FAQ: '/faq',
//   TERMS: '/terms',
//   PRIVACY: '/privacy',
//   HELP: '/help',
// };

// // API Endpoints matching your backend
// export const API_ENDPOINTS = {
//   // ===== AUTH ENDPOINTS =====
//   AUTH: {
//     SEND_OTP: '/auth/send-otp',
//     REGISTER: '/auth/register',
//     LOGIN: '/auth/login',
//     LOGIN_GOOGLE: '/auth/login/google',
//     LOGIN_FACEBOOK: '/auth/login/facebook',
//     OTP_GENERATE: '/auth/otp/generate',
//     OTP_VERIFY: '/auth/otp/verify',
//     FORGOT_PASSWORD: '/auth/forgot-password',
//     RESET_PASSWORD: '/auth/reset-password',
//     REFRESH_TOKEN: '/auth/refresh-token',
//     LOGOUT: '/auth/logout',
//     VALIDATE_TOKEN: '/auth/validate-token',
//   },

//   // ===== USER/DRIVER ENDPOINTS =====
//   DRIVER: {
//     BASE: '/driver',
//     PROFILE: '/driver/profile',
//     UPDATE_LOCATION: '/driver/location',
//     TOGGLE_AVAILABILITY: '/driver/toggle-availability',
//     MY_TRIPS: '/driver/trips',
//     MY_BIDS: '/driver/bids',
//     EARNINGS: '/driver/earnings',
//   },

//   // ===== SHIPPER ENDPOINTS =====
//   SHIPPER: {
//     BASE: '/shipper',
//     PROFILE: '/shipper/profile',
//     MY_LOADS: '/shipper/loads',
//     CREATE_LOAD: '/shipper/loads',
//     LOAD_DETAILS: '/shipper/loads/{id}',
//     UPDATE_LOAD: '/shipper/loads/{id}',
//     DELETE_LOAD: '/shipper/loads/{id}',
//     MY_BIDS: '/shipper/bids',
//     ACCEPT_BID: '/shipper/bids/{bidId}/accept',
//     REJECT_BID: '/shipper/bids/{bidId}/reject',
//     PAYMENTS: '/shipper/payments',
//   },

//   // ===== TRANSPORTER ENDPOINTS =====
//   TRANSPORTER: {
//     BASE: '/transporter',
//     PROFILE: '/transporter/profile',
//     MY_VEHICLES: '/transporter/vehicles',
//     ADD_VEHICLE: '/transporter/vehicles',
//     UPDATE_VEHICLE: '/transporter/vehicles/{id}',
//     DELETE_VEHICLE: '/transporter/vehicles/{id}',
//     MY_DRIVERS: '/transporter/drivers',
//     ADD_DRIVER: '/transporter/drivers',
//     UPDATE_DRIVER: '/transporter/drivers/{id}',
//     DELETE_DRIVER: '/transporter/drivers/{id}',
//     MY_BIDS: '/transporter/bids',
//     PLACE_BID: '/transporter/bids',
//     EARNINGS: '/transporter/earnings',
//   },

//   // ===== LOAD ENDPOINTS =====
//   LOADS: {
//     PUBLIC: '/loads/public',
//     SEARCH: '/loads/search',
//     DETAILS: '/loads/{id}',
//   },

//   // ===== BID ENDPOINTS =====
//   BIDS: {
//     BASE: '/bids',
//     BY_LOAD: '/bids/load/{loadId}',
//     DETAILS: '/bids/{id}',
//   },

//   // ===== TRIP ENDPOINTS =====
//   TRIPS: {
//     BASE: '/trips',
//     DETAILS: '/trips/{id}',
//     START: '/trips/{id}/start',
//     COMPLETE: '/trips/{id}/complete',
//     CANCEL: '/trips/{id}/cancel',
//     LOCATION: '/trips/{id}/location',
//   },

//   // ===== WALLET ENDPOINTS =====
//   WALLET: {
//     BASE: '/wallet',
//     BALANCE: '/wallet/balance',
//     TRANSACTIONS: '/wallet/transactions',
//     ADD_MONEY: '/wallet/add-money',
//     WITHDRAW: '/wallet/withdraw',
//     SET_PIN: '/wallet/set-pin',
//     VERIFY_PIN: '/wallet/verify-pin',
//   },

//   // ===== NOTIFICATION ENDPOINTS =====
//   NOTIFICATIONS: {
//     BASE: '/notifications',
//     MARK_READ: '/notifications/{id}/read',
//     MARK_ALL_READ: '/notifications/read-all',
//     SETTINGS: '/notifications/settings',
//   },

//   // ===== PROFILE ENDPOINTS =====
//   PROFILE: {
//     ME: '/profiles/me',
//     UPDATE: '/profiles/me',
//     UPLOAD_IMAGE: '/profiles/me/profile-image',
//     ADD_EXPERIENCE: '/profiles/me/experience',
//     ADD_EDUCATION: '/profiles/me/education',
//     ADD_CERTIFICATION: '/profiles/me/certification',
//     ADD_PROJECT: '/profiles/me/project',
//     PUBLIC: '/profiles/public',
//     SEARCH: '/profiles/search',
//     COMPLETION: '/profiles/me/completion',
//     VIEW: '/profiles/{id}/view',
//   },

//   // ===== ADMIN ENDPOINTS =====
//   ADMIN: {
//     USERS: '/admin/users',
//     USER_DETAILS: '/admin/users/{id}',
//     VERIFY_USER: '/admin/users/{id}/verify',
//     REJECT_USER: '/admin/users/{id}/reject',
//     SUSPEND_USER: '/admin/users/{id}/suspend',
//     ACTIVATE_USER: '/admin/users/{id}/activate',
//     STATS_COUNT: '/admin/users/pending/count', // ✅ Use this 
//      STATS: '/admin/users/pending/count',  // ✅ Use this endpoint
//       DASHBOARD_STATS: '/admin/users/dashboard/stats', // New endpoint  /api/admin/users/dashboard/stats
//     LOADS: '/admin/loads',
//     LOAD_DETAILS: '/admin/loads/{id}',
//     TRIPS: '/admin/trips',
//     TRANSACTIONS: '/admin/transactions',
//     PROFILES: '/admin/profiles',
//     PROFILE_DETAILS: '/admin/profiles/{id}',
//     PENDING_USERS: '/admin/users/pending',
//   },

  

//   // ===== FILE UPLOAD ENDPOINTS =====
//   FILES: {
//     UPLOAD: '/files/upload',
//     GET: '/files/{filename}',
//     DELETE: '/files/{filename}',
//   },
// };

// // src/routes/routes.ts - Add these endpoints

// // export const API_ENDPOINTS = {
// //   // ... existing endpoints ...
  
// //   // ===== ADMIN ENDPOINTS =====
// //   ADMIN: {
// //     USERS: '/admin/users',
// //     USER_DETAILS: '/admin/users/{id}',
// //     PENDING_USERS: '/admin/users/pending',
// //     STATS: '/admin/users/pending/count',
// //     VERIFY_USER: '/admin/users/{id}/approve',
// //     REJECT_USER: '/admin/users/{id}/reject',
// //     SUSPEND_USER: '/admin/users/{id}/suspend',
// //     ACTIVATE_USER: '/admin/users/{id}/activate',
// //     DELETE_USER: '/admin/users/{id}',
// //     RESTORE_USER: '/admin/users/{id}/restore',
// //     BULK_APPROVE: '/admin/users/bulk/approve',
    
// //     // Status-based endpoints
// //     USERS_BY_STATUS: '/admin/users/status/{status}',
// //   },
// // };



// src/routes/routes.ts

export const ROUTES = {
  // ===== PUBLIC ROUTES =====
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PENDING_APPROVAL: '/pending-approval',

  // ===== PROFILE ROUTES =====
  PROFILE: {
    MY_PROFILE: '/profile',
    EDIT: '/profile/edit',
    DOCUMENTS: '/profile/documents',
    PUBLIC: '/profile/:id',
    EXPLORE: '/profiles',
  },

  // Public routes
    PUBLIC_SUMMARY: '/ratings/public/:userId',
    
    // Protected routes
    MY_RATINGS_RECEIVED: '/ratings/received',
    MY_RATINGS_GIVEN: '/ratings/given',
    MY_RATING_SUMMARY: '/ratings/summary/me',
    MY_RATING_STATS: '/ratings/stats/me',
    
    // User specific
    USER_RATINGS_RECEIVED: '/ratings/user/:userId/received',
    USER_RATINGS_BY_TYPE: '/ratings/user/:userId/type/:ratingType',
    
    // Trip specific
    TRIP_RATINGS: '/ratings/trip/:tripId',
    TRIP_RATING_CHECK: '/ratings/trip/:tripId/check/:ratingType',
    
    // Single rating
    RATING_DETAIL: '/ratings/:ratingId',
    RATING_EDIT: '/ratings/:ratingId/edit',
    
    // Reviews
    RATING_REVIEWS: '/ratings/:ratingId/reviews',
    REVIEW_EDIT: '/ratings/reviews/:reviewId/edit',
    
    // Create
    CREATE_RATING: '/ratings/create',
    CREATE_REVIEW: '/ratings/reviews/create',
    
    // Admin routes
    ADMIN_RATINGS: '/admin/ratings',
    ADMIN_RATING_VERIFY: '/admin/ratings/:ratingId/verify',
    ADMIN_REVIEW_VERIFY: '/admin/reviews/:reviewId/verify',

  // ===== LOAD/TRIP ROUTES =====
  LOADS: {
    LIST: '/loads',
    DETAILS: '/loads/:id',
    CREATE: '/loads/create',
    SEARCH: '/loads/search',
  },

  // ===== BID ROUTES =====
  BIDS: {
    LIST: '/bids',
    DETAILS: '/bids/:id',
    MY_BIDS: '/bids/my-bids',
  },

  // ===== TRIP ROUTES =====
  TRIPS: {
    LIST: '/trips',
    DETAILS: '/trips/:id',
    ACTIVE: '/trips/active',
    HISTORY: '/trips/history',
  },

  // ===== WALLET ROUTES =====
  WALLET: {
    MAIN: '/wallet',
    TRANSACTIONS: '/wallet/transactions',
    ADD_MONEY: '/wallet/add-money',
    WITHDRAW: '/wallet/withdraw',
  },

  // ===== NOTIFICATION ROUTES =====
  NOTIFICATIONS: '/notifications',

  // ===== DRIVER ROUTES =====
  DRIVER: {
    DASHBOARD: '/driver/dashboard',
    AVAILABLE_LOADS: '/driver/available-loads',
    MY_TRIPS: '/driver/trips',
    MY_BIDS: '/driver/bids',
    EARNINGS: '/driver/earnings',
    VEHICLE: '/driver/vehicle',
    DOCUMENTS: '/driver/documents',
    PROFILE: '/driver/profile',
  },

  // ===== SHIPPER ROUTES =====
  SHIPPER: {
    DASHBOARD: '/shipper/dashboard',
    MY_LOADS: '/shipper/loads',
    CREATE_LOAD: '/shipper/loads/create',
    LOAD_DETAILS: '/shipper/loads/:id',
    MY_BIDS: '/shipper/bids',
    PAYMENTS: '/shipper/payments',
    TRANSPORTERS: '/shipper/transporters',
    PROFILE: '/shipper/profile',
  },

  // ===== TRANSPORTER ROUTES =====
  TRANSPORTER: {
    DASHBOARD: '/transporter/dashboard',
    AVAILABLE_LOADS: '/transporter/available-loads',
    MY_VEHICLES: '/transporter/vehicles',
    ADD_VEHICLE: '/transporter/vehicles/add',
    MY_DRIVERS: '/transporter/drivers',
    ADD_DRIVER: '/transporter/drivers/add',
    MY_BIDS: '/transporter/bids',
    EARNINGS: '/transporter/earnings',
    PROFILE: '/transporter/profile',
  },

  // ===== ADMIN ROUTES =====
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAILS: '/admin/users/:id',
    LOADS: '/admin/loads',
    LOAD_DETAILS: '/admin/loads/:id',
    TRIPS: '/admin/trips',
    TRANSACTIONS: '/admin/transactions',
    VERIFICATIONS: '/admin/verifications',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
  },

  // ===== STATIC PAGES =====
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  HELP: '/help',
};

// API Endpoints matching your backend
export const API_ENDPOINTS = {
  // ===== AUTH ENDPOINTS =====
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGIN_GOOGLE: '/auth/login/google',
    LOGIN_FACEBOOK: '/auth/login/facebook',
    OTP_GENERATE: '/auth/otp/generate',
    OTP_VERIFY: '/auth/otp/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    VALIDATE_TOKEN: '/auth/validate-token',
  },

   // ===== RATING ENDPOINTS =====
  RATING: {
    // Public
    PUBLIC_SUMMARY: (userId: number) => `/ratings/public/summary/${userId}`,
    
    // Protected
    SUBMIT: '/ratings',
    GET_BY_ID: (ratingId: number) => `/ratings/${ratingId}`,
    MY_RECEIVED: '/ratings/received',
    MY_GIVEN: '/ratings/given',
    USER_RECEIVED: (userId: number) => `/ratings/user/${userId}/received`,
    USER_BY_TYPE: (userId: number, type: string) => `/ratings/user/${userId}/type/${type}`,
    MY_SUMMARY: '/ratings/summary/me',
    MY_STATS: '/ratings/stats/me',
    TRIP_CHECK: (tripId: number, type: string) => `/ratings/trip/${tripId}/check/${type}`,
    
    // Reviews
    ADD_REVIEW: '/ratings/reviews',
    REVIEWS_FOR_RATING: (ratingId: number) => `/ratings/${ratingId}/reviews`,
    MY_REVIEWS: '/ratings/reviews/me',
    
    // Helpful
    MARK_HELPFUL: '/ratings/helpful',
    UNMARK_HELPFUL: (ratingId: number) => `/ratings/helpful/${ratingId}`,
    CHECK_HELPFUL: (ratingId: number) => `/ratings/${ratingId}/helpful/check`,
    
    // Response
    ADD_RESPONSE: (ratingId: number) => `/ratings/${ratingId}/response`,
    
    // Admin
    VERIFY_RATING: (ratingId: number) => `/ratings/admin/${ratingId}/verify`,
    VERIFY_REVIEW: (reviewId: number) => `/ratings/admin/reviews/${reviewId}/verify`,
    DELETE_RATING: (ratingId: number) => `/ratings/admin/${ratingId}`,
    DELETE_REVIEW: (reviewId: number) => `/ratings/admin/reviews/${reviewId}`,
  },
  // ===== USER/DRIVER ENDPOINTS =====
  DRIVER: {
    BASE: '/driver',
    PROFILE: '/driver/profile',
    UPDATE_LOCATION: '/driver/location',
    TOGGLE_AVAILABILITY: '/driver/toggle-availability',
    MY_TRIPS: '/driver/trips',
    MY_BIDS: '/driver/bids',
    EARNINGS: '/driver/earnings',
  },

  // ===== SHIPPER ENDPOINTS =====
  SHIPPER: {
    BASE: '/shipper',
    PROFILE: '/shipper/profile',
    MY_LOADS: '/shipper/loads',
    CREATE_LOAD: '/shipper/loads',
    LOAD_DETAILS: '/shipper/loads/{id}',
    UPDATE_LOAD: '/shipper/loads/{id}',
    DELETE_LOAD: '/shipper/loads/{id}',
    MY_BIDS: '/shipper/bids',
    ACCEPT_BID: '/shipper/bids/{bidId}/accept',
    REJECT_BID: '/shipper/bids/{bidId}/reject',
    PAYMENTS: '/shipper/payments',
  },

  // ===== TRANSPORTER ENDPOINTS =====
  TRANSPORTER: {
    BASE: '/transporter',
    PROFILE: '/transporter/profile',
    MY_VEHICLES: '/transporter/vehicles',
    ADD_VEHICLE: '/transporter/vehicles',
    UPDATE_VEHICLE: '/transporter/vehicles/{id}',
    DELETE_VEHICLE: '/transporter/vehicles/{id}',
    MY_DRIVERS: '/transporter/drivers',
    ADD_DRIVER: '/transporter/drivers',
    UPDATE_DRIVER: '/transporter/drivers/{id}',
    DELETE_DRIVER: '/transporter/drivers/{id}',
    MY_BIDS: '/transporter/bids',
    PLACE_BID: '/transporter/bids',
    EARNINGS: '/transporter/earnings',
  },

  // ===== LOAD ENDPOINTS =====
  LOADS: {
    PUBLIC: '/loads/public',
    SEARCH: '/loads/search',
    DETAILS: '/loads/{id}',
  },

  // ===== BID ENDPOINTS =====
  BIDS: {
    BASE: '/bids',
    BY_LOAD: '/bids/load/{loadId}',
    DETAILS: '/bids/{id}',
  },

  // ===== TRIP ENDPOINTS =====
  TRIPS: {
    BASE: '/trips',
    DETAILS: '/trips/{id}',
    START: '/trips/{id}/start',
    COMPLETE: '/trips/{id}/complete',
    CANCEL: '/trips/{id}/cancel',
    LOCATION: '/trips/{id}/location',
  },

  // ===== WALLET ENDPOINTS =====
  WALLET: {
    BASE: '/wallet',
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    ADD_MONEY: '/wallet/add-money',
    WITHDRAW: '/wallet/withdraw',
    SET_PIN: '/wallet/set-pin',
    VERIFY_PIN: '/wallet/verify-pin',
  },

  // ===== NOTIFICATION ENDPOINTS =====
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: '/notifications/{id}/read',
    MARK_ALL_READ: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },

  // ===== PROFILE ENDPOINTS (NEW) =====
  PROFILE: {
    // Driver Profile
    DRIVER_GET: '/profile/driver/me',
    DRIVER_UPDATE: '/profile/driver/me',
    
    // Transporter Profile
    TRANSPORTER_GET: '/profile/transporter/me',
    TRANSPORTER_UPDATE: '/profile/transporter/me',
    
    // Shipper Profile
    SHIPPER_GET: '/profile/shipper/me',
    SHIPPER_UPDATE: '/profile/shipper/me',
    
    // Documents
    DOCUMENTS: '/profile/documents',
    DOCUMENT_BY_ID: '/profile/documents/{id}',
    
    // Location (Driver only)
    DRIVER_LOCATION: '/profile/driver/location',
    
    // Profile Completion
    COMPLETION_STATUS: '/profile/completion-status',
  },

  // ===== ADMIN ENDPOINTS =====
  ADMIN: {
    USERS: '/admin/users',
    USER_DETAILS: '/admin/users/{id}',
    VERIFY_USER: '/admin/users/{id}/verify',
    REJECT_USER: '/admin/users/{id}/reject',
    SUSPEND_USER: '/admin/users/{id}/suspend',
    ACTIVATE_USER: '/admin/users/{id}/activate',
    DELETE_USER: '/admin/users/{id}',
    RESTORE_USER: '/admin/users/{id}/restore',
    BULK_APPROVE: '/admin/users/bulk/approve',
    STATS_COUNT: '/admin/users/pending/count',
    STATS: '/admin/users/pending/count',
    DASHBOARD_STATS: '/admin/users/dashboard/stats',
    PENDING_USERS: '/admin/users/pending',
    LOADS: '/admin/loads',
    LOAD_DETAILS: '/admin/loads/{id}',
    TRIPS: '/admin/trips',
    TRANSACTIONS: '/admin/transactions',
    PROFILES: '/admin/profiles',
    PROFILE_DETAILS: '/admin/profiles/{id}',
    USERS_BY_STATUS: '/admin/users/status/{status}',
  },

  // ===== FILE UPLOAD ENDPOINTS =====
  FILES: {
    UPLOAD: '/files/upload',
    GET: '/files/{filename}',
    DELETE: '/files/{filename}',
  },
};