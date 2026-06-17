import { protectedApi } from './protectedAndPublicAPI';

export const driverAvailabilityService = {
  getAvailabilitySummary: () =>
    protectedApi.get(`/api/drivers/availability-summary`),
    
  getAvailableDrivers: (city?: string, vehicleType?: string, page = 0, size = 20) =>
    protectedApi.get(`/api/drivers/available`, {
      params: { city, vehicleType, page, size }
    }),
};
