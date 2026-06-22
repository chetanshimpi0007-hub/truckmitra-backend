import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api';
const WS_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface LiveLocation {
  tripId: number;
  driverId: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
  timestamp: string;
}

interface UseLiveTrackingResult {
  location: LiveLocation | null;
  breadcrumbs: LiveLocation[];
  isConnected: boolean;
  lastUpdated: Date | null;
}

/**
 * Subscribe to live driver location updates via STOMP /topic/tracking/{tripId}
 * Falls back to REST polling on initial load.
 */
export function useLiveTracking(
  tripId: number | null,
  token: string | null | undefined
): UseLiveTrackingResult {
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<LiveLocation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const clientRef = useRef<Client | null>(null);

  // Initial REST fetch for latest location + history
  const fetchInitial = useCallback(async () => {
    if (!tripId || !token) return;
    try {
      const [latestRes, historyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/driver-location/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/driver-location/${tripId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (latestRes.ok) {
        const latestData = await latestRes.json();
        if (latestData.data) {
          setLocation(latestData.data);
          setLastUpdated(new Date());
        }
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (historyData.data) {
          setBreadcrumbs([...historyData.data].reverse());
        }
      }
    } catch { /* ignore */ }
  }, [tripId, token]);

  // STOMP WebSocket subscription
  useEffect(() => {
    if (!tripId || !token) return;

    fetchInitial();

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/topic/tracking/${tripId}`, (msg: IMessage) => {
          try {
            const incoming: LiveLocation = JSON.parse(msg.body);
            setLocation(incoming);
            setLastUpdated(new Date());
            setBreadcrumbs(prev => {
              const updated = [...prev, incoming];
              return updated.slice(-100); // keep last 100 breadcrumbs
            });
          } catch { /* ignore */ }
        });
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: () => setIsConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [tripId, token, fetchInitial]);

  return { location, breadcrumbs, isConnected, lastUpdated };
}
