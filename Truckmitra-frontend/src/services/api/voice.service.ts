import { protectedApi } from './protectedAndPublicAPI';

export const voiceService = {
  parseLoadTranscript: (transcript: string) =>
    protectedApi.post('/voice/parse-load', { transcript }),
};
