import { protectedApi } from './protectedAndPublicAPI';

export const driverAvailabilityService = {
  getAvailabilitySummary: () =>
    protectedApi.get(`/drivers/availability-summary`),
    
  getAvailableDrivers: (city?: string, vehicleType?: string, page = 0, size = 20) =>
    protectedApi.get(`/drivers/available`, {
      params: { city, vehicleType, page, size }
    }),
};
