import { protectedApi } from './protectedAndPublicAPI';

export const voiceService = {
  parseLoadTranscript: (transcript: string) =>
    protectedApi.post('/api/voice/parse-load', { transcript }),
};
