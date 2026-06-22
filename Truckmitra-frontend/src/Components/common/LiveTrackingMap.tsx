import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, DirectionsRenderer } from '@react-google-maps/api';
import { LiveLocation } from '../../hooks/useLiveTracking';

interface LiveTrackingMapProps {
  location: LiveLocation | null;
  breadcrumbs: LiveLocation[];
  destination?: { lat: number; lng: number; label?: string };
  source?: { lat: number; lng: number; label?: string };
  className?: string;
  zoom?: number;
  onDirectionsUpdate?: (distance: string, duration: string) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
  ]
};

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  location,
  breadcrumbs,
  destination,
  source,
  className,
  zoom = 14,
  onDirectionsUpdate,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  
  const defaultCenter = useMemo(() => {
    if (location) return { lat: location.latitude, lng: location.longitude };
    if (source) return { lat: source.lat, lng: source.lng };
    return { lat: 20.5937, lng: 78.9629 };
  }, [location, source]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Calculate Directions and ETA when driver moves significantly, or on first load
  useEffect(() => {
    if (!isLoaded || !destination) return;

    const originLatLng = location ? { lat: location.latitude, lng: location.longitude } : source;
    if (!originLatLng) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: originLatLng,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          
          if (onDirectionsUpdate && result.routes[0]?.legs[0]) {
            const leg = result.routes[0].legs[0];
            onDirectionsUpdate(leg.distance?.text || '', leg.duration?.text || '');
          }
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  // To avoid spamming the Directions API, we might not want to re-run this on every tiny location change.
  // For this implementation, we run it when the component mounts or destination changes.
  // Real-world: throttle or only update if location changes by > 1km.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, destination, source]);

  if (!isLoaded) return <div className={className || 'w-full h-full'} style={{ background: '#1e293b' }} />;

  const path = breadcrumbs.map(b => ({ lat: b.latitude, lng: b.longitude }));

  return (
    <div className={className || 'w-full h-full'}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Draw Route via Directions API */}
        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#6366f1',
                strokeWeight: 5,
                strokeOpacity: 0.8,
              }
            }}
          />
        )}

        {/* Fallback to Breadcrumb Polyline if Directions API isn't used */}
        {!directionsResponse && path.length > 1 && (
          <Polyline
            path={path}
            options={{ strokeColor: '#6366f1', strokeWeight: 4, strokeOpacity: 0.7 }}
          />
        )}

        {/* Source Marker */}
        {source && (
          <Marker
            position={{ lat: source.lat, lng: source.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#22c55e',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 8,
            }}
            title={source.label || 'Pickup'}
          />
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#ef4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 10,
            }}
            title={destination.label || 'Destination'}
          />
        )}

        {/* Driver Marker */}
        {location && (
          <Marker
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={{
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              fillColor: '#6366f1',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 6,
              rotation: location.heading || 0,
            }}
            title={`Driver Speed: ${location.speed != null ? Math.round(location.speed) : 0} km/h`}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(LiveTrackingMap);
