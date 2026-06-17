import { protectedApi } from './protectedAndPublicAPI';

export const tripService = {
  // Transporter
  getTransporterTrips: (transporterId: number) =>
    protectedApi.get(`/api/trips/transporter/${transporterId}`),
  assignFleet: (tripId: number, driverId: number, vehicleId: number) =>
    protectedApi.post('/api/trips/assign-fleet', null, { params: { tripId, driverId, vehicleId } }),
  verifyReceipt: (tripId: number) =>
    protectedApi.patch(`/api/trips/${tripId}/verify-receipt`),
  rejectReceipt: (tripId: number, reason?: string) =>
    protectedApi.patch(`/api/trips/${tripId}/reject-receipt`, { reason }),
  downloadTripPdf: (tripId: number) =>
    protectedApi.get(`/api/trips/${tripId}/pdf`, { responseType: 'blob' }),

  // Driver
  getDriverTrips: (driverId: number) =>
    protectedApi.get(`/api/trips/driver/${driverId}`),
  acceptTrip: (tripId: number) =>
    protectedApi.post(`/api/driver/trips/${tripId}/accept`),
  rejectTrip: (tripId: number) =>
    protectedApi.post(`/api/driver/trips/${tripId}/reject`),
  startTrip: (tripId: number) =>
    protectedApi.post(`/api/driver/trips/${tripId}/start`),
  pauseTrip: (tripId: number) =>
    protectedApi.post(`/api/driver/trips/${tripId}/pause`),
  resumeTrip: (tripId: number) =>
    protectedApi.post(`/api/driver/trips/${tripId}/resume`),
  uploadPOD: (tripId: number, data: { imageUrl: string; signatureUrl?: string; remarks?: string }) =>
    protectedApi.post(`/api/driver/trips/${tripId}/pod`, data),
  markDelivered: (tripId: number) =>
    protectedApi.post(`/api/driver/trips/${tripId}/deliver`),

  // Shipper
  getShipperLoads: () => protectedApi.get('/api/loads/shipper'),
  getBidsForLoad: (loadId: number) => protectedApi.get(`/api/bids/load/${loadId}`),
  acceptBid: (bidId: number) => protectedApi.put(`/api/bids/${bidId}/accept`),
  rejectBid: (bidId: number) => protectedApi.put(`/api/bids/${bidId}/reject`),

  // Admin
  getAllTrips: () => protectedApi.get('/api/trips/admin/all'),
  getReceiptVerifications: () => protectedApi.get('/api/trips/admin/receipt-verifications'),
  getActiveTrips: () => protectedApi.get('/api/tracking/admin/active'),
  // Photos
  uploadTripPhoto: (tripId: number, photoUrl: string, type: 'PICKUP' | 'DESTINATION') =>
    protectedApi.post(`/api/trips/${tripId}/photos`, { photoUrl, type }),
  getTripPhotos: (tripId: number) =>
    protectedApi.get(`/api/trips/${tripId}/photos`),

  // Workflow
  submitDelivery: (tripId: number, data: { deliveryReceiptUrl: string; podUrl: string }) =>
    protectedApi.post(`/api/trips/${tripId}/submit-delivery`, data),
  driverResubmit: (tripId: number, data: { deliveryReceiptUrl: string; podUrl: string }) =>
    protectedApi.post(`/api/trips/${tripId}/driver-resubmit`, data),
  transporterAcceptDelivery: (tripId: number) =>
    protectedApi.post(`/api/trips/${tripId}/transporter-accept`),
  transporterRejectDelivery: (tripId: number, rejectionReason: string) =>
    protectedApi.post(`/api/trips/${tripId}/transporter-reject`, { rejectionReason }),
  getReturnLoadSuggestions: (tripId: number) =>
    protectedApi.get(`/api/trips/${tripId}/return-load-suggestions`),
};

export type TripStatus =
  | 'ASSIGNED'
  | 'DRIVER_ASSIGNED'
  | 'ACCEPTED_BY_DRIVER'
  | 'IN_TRANSIT'
  | 'PAUSED'
  | 'DELIVERED'
  | 'POD_UPLOADED'
  | 'AWAITING_TRANSPORTER_APPROVAL'
  | 'REJECTED_BY_TRANSPORTER'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export const TRIP_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ASSIGNED:                       { label: 'Assigned',        color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  DRIVER_ASSIGNED:                { label: 'Driver Assigned', color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100' },
  ACCEPTED_BY_DRIVER:             { label: 'Driver Accepted', color: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-100' },
  IN_TRANSIT:                     { label: 'In Transit',      color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
  PAUSED:                         { label: 'Paused',          color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100' },
  DELIVERED:                      { label: 'Delivered',       color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-100' },
  POD_UPLOADED:                   { label: 'POD Uploaded',    color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  AWAITING_TRANSPORTER_APPROVAL:  { label: 'Pending Approval',color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-100' },
  REJECTED_BY_TRANSPORTER:        { label: 'Rejected',        color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100' },
  COMPLETED:                      { label: 'Completed',       color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  CANCELLED:                      { label: 'Cancelled',       color: 'text-slate-500',   bg: 'bg-slate-100',  border: 'border-slate-200' },
  REJECTED:                       { label: 'Rejected',        color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100' },
};
