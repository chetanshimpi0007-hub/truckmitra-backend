import { useState, useEffect, useCallback } from 'react';
import { protectedApi } from '../services/api/protectedAndPublicAPI';

export const useGpsTracker = (tripId: number | null) => {
  const [isTracking, setIsTracking] = useState(false);
  
  const syncOfflineQueue = useCallback(async () => {
    const queue = JSON.parse(localStorage.getItem('gpsSyncQueue') || '[]');
    if (queue.length === 0) return;

    try {
      // Get the last location from queue
      const latestLocation = queue[queue.length - 1];
      await protectedApi.post('/api/driver/location', {
        tripId: latestLocation.tripId,
        latitude: latestLocation.latitude,
        longitude: latestLocation.longitude
      });
      // Clear queue
      localStorage.setItem('gpsSyncQueue', '[]');
    } catch (e) {
      console.error('Failed to sync offline GPS records', e);
    }
  }, []);

  useEffect(() => {
    // Listen for internet returning
    const handleOnline = () => {
      syncOfflineQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncOfflineQueue]);

  useEffect(() => {
    let watchId: number;

    if (isTracking && tripId && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const payload = {
            tripId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now()
          };

          if (navigator.onLine) {
            try {
               await protectedApi.post('/api/driver/location', payload);
            } catch (err) {
               // Fallback if request fails
               const q = JSON.parse(localStorage.getItem('gpsSyncQueue') || '[]');
               q.push(payload);
               localStorage.setItem('gpsSyncQueue', JSON.stringify(q));
            }
          } else {
            // Offline - Save to queue
            const q = JSON.parse(localStorage.getItem('gpsSyncQueue') || '[]');
            q.push(payload);
            localStorage.setItem('gpsSyncQueue', JSON.stringify(q));
          }
        },
        (error) => {
          console.error("GPS Tracking Error:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, tripId]);

  return {
    startTracking: () => setIsTracking(true),
    stopTracking: () => setIsTracking(false),
    isTracking
  };
};
