import { protectedApi } from './protectedAndPublicAPI';

export const businessHealthService = {
  getHealthScore: () => protectedApi.get('/transporters/business-health'),
};
