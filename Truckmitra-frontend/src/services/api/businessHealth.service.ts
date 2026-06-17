import { protectedApi } from './protectedAndPublicAPI';

export const businessHealthService = {
  getHealthScore: () => protectedApi.get('/api/transporters/business-health'),
};
