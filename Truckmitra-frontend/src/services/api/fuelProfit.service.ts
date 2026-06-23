import { protectedApi } from './protectedAndPublicAPI';

export const fuelProfitService = {
  getLoadProfitEstimate: (loadId: number) =>
    protectedApi.get(`/loads/${loadId}/profit-estimate`),
    
  getTripProfitEstimate: (tripId: number) =>
    protectedApi.get(`/trips/${tripId}/profit-estimate`),
};
