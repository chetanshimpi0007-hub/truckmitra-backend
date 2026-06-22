import { useState, useEffect, useCallback, useRef } from 'react';
import { protectedApi } from '../services/api/protectedAndPublicAPI';

const LOCATION_ENDPOINT = '/api/driver-location/update';
const GPS_QUEUE_KEY = 'gps_offline_queue';
const MIN_INTERVAL_MS = 5000; // min 5s between updates

export type GpsError = 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED';

interface UseGpsTrackerResult {
  isTracking: boolean;
  gpsError: GpsError | null;
  lastPosition: GeolocationCoordinates | null;
  startTracking: () => void;
  stopTracking: () => void;
}

/**
 * Production GPS tracker with:
 * - navigator.geolocation.watchPosition
 * - 5s debounce to avoid flooding
 * - Offline queue with auto-sync on reconnect
 * - Full payload: speed, heading, accuracy
 */
export const useGpsTracker = (tripId: number | null): UseGpsTrackerResult => {
  const [isTracking, setIsTracking] = useState(false);
  const [gpsError, setGpsError] = useState<GpsError | null>(null);
  const [lastPosition, setLastPosition] = useState<GeolocationCoordinates | null>(null);
  const lastSentRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);

  // Sync offline queue when internet returns
  const syncOfflineQueue = useCallback(async () => {
    const raw = localStorage.getItem(GPS_QUEUE_KEY);
    if (!raw) return;
    const queue: any[] = JSON.parse(raw);
    if (queue.length === 0) return;

    try {
      // Send only the most recent to avoid flooding
      const latest = queue[queue.length - 1];
      await protectedApi.post(LOCATION_ENDPOINT, latest);
      localStorage.setItem(GPS_QUEUE_KEY, '[]');
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    window.addEventListener('online', syncOfflineQueue);
    return () => window.removeEventListener('online', syncOfflineQueue);
  }, [syncOfflineQueue]);

  const sendLocation = useCallback(async (coords: GeolocationCoordinates, tId: number) => {
    const now = Date.now();
    if (now - lastSentRef.current < MIN_INTERVAL_MS) return; // debounce
    lastSentRef.current = now;

    const payload = {
      tripId: tId,
      latitude: coords.latitude,
      longitude: coords.longitude,
      speed: coords.speed != null ? coords.speed * 3.6 : null, // m/s → km/h
      heading: coords.heading,
      accuracy: coords.accuracy,
    };

    if (!navigator.onLine) {
      const q = JSON.parse(localStorage.getItem(GPS_QUEUE_KEY) || '[]');
      q.push(payload);
      localStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(q.slice(-20))); // keep last 20
      return;
    }

    try {
      await protectedApi.post(LOCATION_ENDPOINT, payload);
    } catch {
      // Fallback to offline queue
      const q = JSON.parse(localStorage.getItem(GPS_QUEUE_KEY) || '[]');
      q.push(payload);
      localStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(q.slice(-20)));
    }
  }, []);

  // Start/stop GPS watch
  useEffect(() => {
    if (!isTracking || !tripId) return;

    if (!('geolocation' in navigator)) {
      setGpsError('UNSUPPORTED');
      return;
    }

    setGpsError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLastPosition(pos.coords);
        setGpsError(null);
        sendLocation(pos.coords, tripId);
      },
      (err) => {
        switch (err.code) {
          case 1: setGpsError('PERMISSION_DENIED'); break;
          case 2: setGpsError('POSITION_UNAVAILABLE'); break;
          case 3: setGpsError('TIMEOUT'); break;
          default: setGpsError('POSITION_UNAVAILABLE');
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isTracking, tripId, sendLocation]);

  return {
    isTracking,
    gpsError,
    lastPosition,
    startTracking: () => setIsTracking(true),
    stopTracking: () => setIsTracking(false),
  };
};
