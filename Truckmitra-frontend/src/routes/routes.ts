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
//     SEND_OTP: '/api/auth/send-otp',
//     REGISTER: '/api/auth/register',
//     LOGIN: '/api/auth/login',
//     LOGIN_GOOGLE: '/api/auth/login/google',
//     LOGIN_FACEBOOK: '/api/auth/login/facebook',
//     OTP_GENERATE: '/api/auth/otp/generate',
//     OTP_VERIFY: '/api/auth/otp/verify',
//     FORGOT_PASSWORD: '/api/auth/forgot-password',
//     RESET_PASSWORD: '/api/auth/reset-password',
//     REFRESH_TOKEN: '/api/auth/refresh-token',
//     LOGOUT: '/api/auth/logout',
//     VALIDATE_TOKEN: '/api/auth/validate-token',
//   },

//   // ===== USER/DRIVER ENDPOINTS =====
//   DRIVER: {
//     BASE: '/api/driver',
//     PROFILE: '/api/driver/profile',
//     UPDATE_LOCATION: '/api/driver/location',
//     TOGGLE_AVAILABILITY: '/api/driver/toggle-availability',
//     MY_TRIPS: '/api/driver/trips',
//     MY_BIDS: '/api/driver/bids',
//     EARNINGS: '/api/driver/earnings',
//   },

//   // ===== SHIPPER ENDPOINTS =====
//   SHIPPER: {
//     BASE: '/api/shipper',
//     PROFILE: '/api/shipper/profile',
//     MY_LOADS: '/api/shipper/loads',
//     CREATE_LOAD: '/api/shipper/loads',
//     LOAD_DETAILS: '/api/shipper/loads/{id}',
//     UPDATE_LOAD: '/api/shipper/loads/{id}',
//     DELETE_LOAD: '/api/shipper/loads/{id}',
//     MY_BIDS: '/api/shipper/bids',
//     ACCEPT_BID: '/api/shipper/bids/{bidId}/accept',
//     REJECT_BID: '/api/shipper/bids/{bidId}/reject',
//     PAYMENTS: '/api/shipper/payments',
//   },

//   // ===== TRANSPORTER ENDPOINTS =====
//   TRANSPORTER: {
//     BASE: '/api/transporter',
//     PROFILE: '/api/transporter/profile',
//     MY_VEHICLES: '/api/transporter/vehicles',
//     ADD_VEHICLE: '/api/transporter/vehicles',
//     UPDATE_VEHICLE: '/api/transporter/vehicles/{id}',
//     DELETE_VEHICLE: '/api/transporter/vehicles/{id}',
//     MY_DRIVERS: '/api/transporter/drivers',
//     ADD_DRIVER: '/api/transporter/drivers',
//     UPDATE_DRIVER: '/api/transporter/drivers/{id}',
//     DELETE_DRIVER: '/api/transporter/drivers/{id}',
//     MY_BIDS: '/api/transporter/bids',
//     PLACE_BID: '/api/transporter/bids',
//     EARNINGS: '/api/transporter/earnings',
//   },

//   // ===== LOAD ENDPOINTS =====
//   LOADS: {
//     PUBLIC: '/api/loads/public',
//     SEARCH: '/api/loads/search',
//     DETAILS: '/api/loads/{id}',
//   },

//   // ===== BID ENDPOINTS =====
//   BIDS: {
//     BASE: '/api/bids',
//     BY_LOAD: '/api/bids/load/{loadId}',
//     DETAILS: '/api/bids/{id}',
//   },

//   // ===== TRIP ENDPOINTS =====
//   TRIPS: {
//     BASE: '/api/trips',
//     DETAILS: '/api/trips/{id}',
//     START: '/api/trips/{id}/start',
//     COMPLETE: '/api/trips/{id}/complete',
//     CANCEL: '/api/trips/{id}/cancel',
//     LOCATION: '/api/trips/{id}/location',
//   },

//   // ===== WALLET ENDPOINTS =====
//   WALLET: {
//     BASE: '/api/wallet',
//     BALANCE: '/api/wallet/balance',
//     TRANSACTIONS: '/api/wallet/transactions',
//     ADD_MONEY: '/api/wallet/add-money',
//     WITHDRAW: '/api/wallet/withdraw',
//     SET_PIN: '/api/wallet/set-pin',
//     VERIFY_PIN: '/api/wallet/verify-pin',
//   },

//   // ===== NOTIFICATION ENDPOINTS =====
//   NOTIFICATIONS: {
//     BASE: '/api/notifications',
//     MARK_READ: '/api/notifications/{id}/read',
//     MARK_ALL_READ: '/api/notifications/read-all',
//     SETTINGS: '/api/notifications/settings',
//   },

//   // ===== PROFILE ENDPOINTS =====
//   PROFILE: {
//     ME: '/api/profiles/me',
//     UPDATE: '/api/profiles/me',
//     UPLOAD_IMAGE: '/api/profiles/me/profile-image',
//     ADD_EXPERIENCE: '/api/profiles/me/experience',
//     ADD_EDUCATION: '/api/profiles/me/education',
//     ADD_CERTIFICATION: '/api/profiles/me/certification',
//     ADD_PROJECT: '/api/profiles/me/project',
//     PUBLIC: '/api/profiles/public',
//     SEARCH: '/api/profiles/search',
//     COMPLETION: '/api/profiles/me/completion',
//     VIEW: '/api/profiles/{id}/view',
//   },

//   // ===== ADMIN ENDPOINTS =====
//   ADMIN: {
//     USERS: '/api/admin/users',
//     USER_DETAILS: '/api/admin/users/{id}',
//     VERIFY_USER: '/api/admin/users/{id}/verify',
//     REJECT_USER: '/api/admin/users/{id}/reject',
//     SUSPEND_USER: '/api/admin/users/{id}/suspend',
//     ACTIVATE_USER: '/api/admin/users/{id}/activate',
//     STATS_COUNT: '/api/admin/users/pending/count', // ✅ Use this 
//      STATS: '/api/admin/users/pending/count',  // ✅ Use this endpoint
//       DASHBOARD_STATS: '/api/admin/users/dashboard/stats', // New endpoint  /api/admin/users/dashboard/stats
//     LOADS: '/api/admin/loads',
//     LOAD_DETAILS: '/api/admin/loads/{id}',
//     TRIPS: '/api/admin/trips',
//     TRANSACTIONS: '/api/admin/transactions',
//     PROFILES: '/api/admin/profiles',
//     PROFILE_DETAILS: '/api/admin/profiles/{id}',
//     PENDING_USERS: '/api/admin/users/pending',
//   },

  

//   // ===== FILE UPLOAD ENDPOINTS =====
//   FILES: {
//     UPLOAD: '/api/files/upload',
//     GET: '/api/files/{filename}',
//     DELETE: '/api/files/{filename}',
//   },
// };

// // src/routes/routes.ts - Add these endpoints

// // export const API_ENDPOINTS = {
// //   // ... existing endpoints ...
  
// //   // ===== ADMIN ENDPOINTS =====
// //   ADMIN: {
// //     USERS: '/api/admin/users',
// //     USER_DETAILS: '/api/admin/users/{id}',
// //     PENDING_USERS: '/api/admin/users/pending',
// //     STATS: '/api/admin/users/pending/count',
// //     VERIFY_USER: '/api/admin/users/{id}/approve',
// //     REJECT_USER: '/api/admin/users/{id}/reject',
// //     SUSPEND_USER: '/api/admin/users/{id}/suspend',
// //     ACTIVATE_USER: '/api/admin/users/{id}/activate',
// //     DELETE_USER: '/api/admin/users/{id}',
// //     RESTORE_USER: '/api/admin/users/{id}/restore',
// //     BULK_APPROVE: '/api/admin/users/bulk/approve',
    
// //     // Status-based endpoints
// //     USERS_BY_STATUS: '/api/admin/users/status/{status}',
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
    SEND_OTP: '/api/auth/send-otp',
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGIN_GOOGLE: '/api/auth/login/google',
    LOGIN_FACEBOOK: '/api/auth/login/facebook',
    OTP_GENERATE: '/api/auth/otp/generate',
    OTP_VERIFY: '/api/auth/otp/verify',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
    VALIDATE_TOKEN: '/api/auth/validate-token',
  },

   // ===== RATING ENDPOINTS =====
  RATING: {
    // Public
    PUBLIC_SUMMARY: (userId: number) => `/api/ratings/public/summary/${userId}`,
    
    // Protected
    SUBMIT: '/api/ratings',
    GET_BY_ID: (ratingId: number) => `/api/ratings/${ratingId}`,
    MY_RECEIVED: '/api/ratings/received',
    MY_GIVEN: '/api/ratings/given',
    USER_RECEIVED: (userId: number) => `/api/ratings/user/${userId}/received`,
    USER_BY_TYPE: (userId: number, type: string) => `/api/ratings/user/${userId}/type/${type}`,
    MY_SUMMARY: '/api/ratings/summary/me',
    MY_STATS: '/api/ratings/stats/me',
    TRIP_CHECK: (tripId: number, type: string) => `/api/ratings/trip/${tripId}/check/${type}`,
    
    // Reviews
    ADD_REVIEW: '/api/ratings/reviews',
    REVIEWS_FOR_RATING: (ratingId: number) => `/api/ratings/${ratingId}/reviews`,
    MY_REVIEWS: '/api/ratings/reviews/me',
    
    // Helpful
    MARK_HELPFUL: '/api/ratings/helpful',
    UNMARK_HELPFUL: (ratingId: number) => `/api/ratings/helpful/${ratingId}`,
    CHECK_HELPFUL: (ratingId: number) => `/api/ratings/${ratingId}/helpful/check`,
    
    // Response
    ADD_RESPONSE: (ratingId: number) => `/api/ratings/${ratingId}/response`,
    
    // Admin
    VERIFY_RATING: (ratingId: number) => `/api/ratings/admin/${ratingId}/verify`,
    VERIFY_REVIEW: (reviewId: number) => `/api/ratings/admin/reviews/${reviewId}/verify`,
    DELETE_RATING: (ratingId: number) => `/api/ratings/admin/${ratingId}`,
    DELETE_REVIEW: (reviewId: number) => `/api/ratings/admin/reviews/${reviewId}`,
  },
  // ===== USER/DRIVER ENDPOINTS =====
  DRIVER: {
    BASE: '/api/driver',
    PROFILE: '/api/driver/profile',
    UPDATE_LOCATION: '/api/driver/location',
    TOGGLE_AVAILABILITY: '/api/driver/toggle-availability',
    MY_TRIPS: '/api/driver/trips',
    MY_BIDS: '/api/driver/bids',
    EARNINGS: '/api/driver/earnings',
  },

  // ===== SHIPPER ENDPOINTS =====
  SHIPPER: {
    BASE: '/api/shipper',
    PROFILE: '/api/shipper/profile',
    MY_LOADS: '/api/shipper/loads',
    CREATE_LOAD: '/api/shipper/loads',
    LOAD_DETAILS: '/api/shipper/loads/{id}',
    UPDATE_LOAD: '/api/shipper/loads/{id}',
    DELETE_LOAD: '/api/shipper/loads/{id}',
    MY_BIDS: '/api/shipper/bids',
    ACCEPT_BID: '/api/shipper/bids/{bidId}/accept',
    REJECT_BID: '/api/shipper/bids/{bidId}/reject',
    PAYMENTS: '/api/shipper/payments',
  },

  // ===== TRANSPORTER ENDPOINTS =====
  TRANSPORTER: {
    BASE: '/api/transporter',
    PROFILE: '/api/transporter/profile',
    MY_VEHICLES: '/api/transporter/vehicles',
    ADD_VEHICLE: '/api/transporter/vehicles',
    UPDATE_VEHICLE: '/api/transporter/vehicles/{id}',
    DELETE_VEHICLE: '/api/transporter/vehicles/{id}',
    MY_DRIVERS: '/api/transporter/drivers',
    ADD_DRIVER: '/api/transporter/drivers',
    UPDATE_DRIVER: '/api/transporter/drivers/{id}',
    DELETE_DRIVER: '/api/transporter/drivers/{id}',
    MY_BIDS: '/api/transporter/bids',
    PLACE_BID: '/api/transporter/bids',
    EARNINGS: '/api/transporter/earnings',
  },

  // ===== LOAD ENDPOINTS =====
  LOADS: {
    PUBLIC: '/api/loads/public',
    SEARCH: '/api/loads/search',
    DETAILS: '/api/loads/{id}',
  },

  // ===== BID ENDPOINTS =====
  BIDS: {
    BASE: '/api/bids',
    BY_LOAD: '/api/bids/load/{loadId}',
    DETAILS: '/api/bids/{id}',
  },

  // ===== TRIP ENDPOINTS =====
  TRIPS: {
    BASE: '/api/trips',
    DETAILS: '/api/trips/{id}',
    START: '/api/trips/{id}/start',
    COMPLETE: '/api/trips/{id}/complete',
    CANCEL: '/api/trips/{id}/cancel',
    LOCATION: '/api/trips/{id}/location',
  },

  // ===== WALLET ENDPOINTS =====
  WALLET: {
    BASE: '/api/wallet',
    BALANCE: '/api/wallet/balance',
    TRANSACTIONS: '/api/wallet/transactions',
    ADD_MONEY: '/api/wallet/add-money',
    WITHDRAW: '/api/wallet/withdraw',
    SET_PIN: '/api/wallet/set-pin',
    VERIFY_PIN: '/api/wallet/verify-pin',
  },

  // ===== NOTIFICATION ENDPOINTS =====
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    MARK_READ: '/api/notifications/{id}/read',
    MARK_ALL_READ: '/api/notifications/read-all',
    SETTINGS: '/api/notifications/settings',
  },

  // ===== PROFILE ENDPOINTS (NEW) =====
  PROFILE: {
    // Driver Profile
    DRIVER_GET: '/api/profile/driver/me',
    DRIVER_UPDATE: '/api/profile/driver/me',
    
    // Transporter Profile
    TRANSPORTER_GET: '/api/profile/transporter/me',
    TRANSPORTER_UPDATE: '/api/profile/transporter/me',
    
    // Shipper Profile
    SHIPPER_GET: '/api/profile/shipper/me',
    SHIPPER_UPDATE: '/api/profile/shipper/me',
    
    // Documents
    DOCUMENTS: '/api/profile/documents',
    DOCUMENT_BY_ID: '/api/profile/documents/{id}',
    
    // Location (Driver only)
    DRIVER_LOCATION: '/api/profile/driver/location',
    
    // Profile Completion
    COMPLETION_STATUS: '/api/profile/completion-status',
  },

  // ===== ADMIN ENDPOINTS =====
  ADMIN: {
    USERS: '/api/admin/users',
    USER_DETAILS: '/api/admin/users/{id}',
    VERIFY_USER: '/api/admin/users/{id}/verify',
    REJECT_USER: '/api/admin/users/{id}/reject',
    SUSPEND_USER: '/api/admin/users/{id}/suspend',
    ACTIVATE_USER: '/api/admin/users/{id}/activate',
    DELETE_USER: '/api/admin/users/{id}',
    RESTORE_USER: '/api/admin/users/{id}/restore',
    BULK_APPROVE: '/api/admin/users/bulk/approve',
    STATS_COUNT: '/api/admin/users/pending/count',
    STATS: '/api/admin/users/pending/count',
    DASHBOARD_STATS: '/api/admin/users/dashboard/stats',
    PENDING_USERS: '/api/admin/users/pending',
    LOADS: '/api/admin/loads',
    LOAD_DETAILS: '/api/admin/loads/{id}',
    TRIPS: '/api/admin/trips',
    TRANSACTIONS: '/api/admin/transactions',
    PROFILES: '/api/admin/profiles',
    PROFILE_DETAILS: '/api/admin/profiles/{id}',
    USERS_BY_STATUS: '/api/admin/users/status/{status}',
  },

  // ===== FILE UPLOAD ENDPOINTS =====
  FILES: {
    UPLOAD: '/api/files/upload',
    GET: '/api/files/{filename}',
    DELETE: '/api/files/{filename}',
  },
};