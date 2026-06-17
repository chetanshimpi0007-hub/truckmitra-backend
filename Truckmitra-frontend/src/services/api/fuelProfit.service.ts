import { protectedApi } from './protectedAndPublicAPI';

export const fuelProfitService = {
  getLoadProfitEstimate: (loadId: number) =>
    protectedApi.get(`/api/loads/${loadId}/profit-estimate`),
    
  getTripProfitEstimate: (tripId: number) =>
    protectedApi.get(`/api/trips/${tripId}/profit-estimate`),
};
