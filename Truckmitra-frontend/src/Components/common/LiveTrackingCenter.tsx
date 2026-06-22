import React, { useState } from 'react';
import { HiLocationMarker, HiPhone, HiUser, HiTruck, HiX, HiClock, HiWifi } from 'react-icons/hi';
import { useLiveTracking } from '../../hooks/useLiveTracking';
import LiveTrackingMap from './LiveTrackingMap';

interface LiveTrackingCenterProps {
  trip: any;
  token?: string | null;
  onClose: () => void;
}

function formatTime(date: Date | null): string {
  if (!date) return '--';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LiveTrackingCenter({ trip, token, onClose }: LiveTrackingCenterProps) {
  const [showPanel, setShowPanel] = useState(true);
  const [googleDistance, setGoogleDistance] = useState<string | null>(null);
  const [googleDuration, setGoogleDuration] = useState<string | null>(null);

  const { location, breadcrumbs, isConnected, lastUpdated } = useLiveTracking(
    trip?.id ?? null,
    token
  );

  if (!trip) return null;

  const driver = trip.driver;
  const vehicle = trip.vehicle;
  const load = trip.load;

  const destLat = trip.destinationLatitude ?? load?.destinationLat ?? null;
  const destLng = trip.destinationLongitude ?? load?.destinationLng ?? null;
  const srcLat = trip.sourceLatitude ?? load?.sourceLat ?? null;
  const srcLng = trip.sourceLongitude ?? load?.sourceLng ?? null;

  const distanceRemaining = googleDistance || (
    location && destLat && destLng
      ? calcDistanceKm(location.latitude, location.longitude, destLat, destLng).toFixed(1) + ' km'
      : null
  );

  const destination = destLat && destLng
    ? { lat: destLat, lng: destLng, label: `📍 ${trip.destination || 'Destination'}` }
    : undefined;

  const source = srcLat && srcLng
    ? { lat: srcLat, lng: srcLng, label: `🟢 ${trip.source || 'Pickup'}` }
    : undefined;

  return (
    <div
      id="live-tracking-center"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', flexDirection: 'column',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Map fills entire background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <LiveTrackingMap
          location={location}
          breadcrumbs={breadcrumbs}
          destination={destination}
          source={source}
          className="w-full h-full"
          onDirectionsUpdate={(dist, dur) => {
            setGoogleDistance(dist);
            setGoogleDuration(dur);
          }}
        />
      </div>

      {/* Top Bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {/* Trip Badge */}
        <div style={{
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: '10px',
          pointerEvents: 'auto',
        }}>
          <HiLocationMarker style={{ color: '#6366f1', width: 22, height: 22 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#f8fafc' }}>
              Trip #{trip.tripNumber || trip.id} — Live
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: isConnected ? '#22c55e' : '#f59e0b',
                display: 'inline-block',
              }} />
              <span style={{ color: isConnected ? '#4ade80' : '#fbbf24', fontWeight: 600 }}>
                {isConnected ? 'Live GPS' : 'Reconnecting...'}
              </span>
              {lastUpdated && (
                <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                  · {formatTime(lastUpdated)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Close */}
        <button
          id="close-tracking-btn"
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: 44, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer', pointerEvents: 'auto',
          }}
        >
          <HiX style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Stats Row (top-right) */}
      {location && (
        <div style={{
          position: 'absolute', top: 80, right: 16,
          display: 'flex', flexDirection: 'column', gap: '8px',
          pointerEvents: 'none',
        }}>
          {location.speed != null && (
            <div style={{
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '8px 14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                {Math.round(location.speed)}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>KM/H</div>
            </div>
          )}
          {distanceRemaining && (
            <div style={{
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '8px 14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }}>
                {distanceRemaining.replace(' km', '')}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>KM LEFT</div>
            </div>
          )}
          {googleDuration && (
            <div style={{
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '8px 14px',
              textAlign: 'center',
              marginTop: '8px',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b' }}>
                {googleDuration}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>ETA</div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Panel Toggle */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, pointerEvents: 'auto',
      }}>
        <button
          onClick={() => setShowPanel(p => !p)}
          style={{
            background: 'rgba(99,102,241,0.9)',
            border: 'none',
            borderRadius: '99px',
            padding: '6px 20px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {showPanel ? 'Hide Details ▾' : 'Show Details ▴'}
        </button>
      </div>

      {/* Bottom Driver Panel */}
      {showPanel && (
        <div style={{
          position: 'absolute',
          bottom: 48,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(420px, calc(100vw - 32px))',
          background: 'rgba(15,23,42,0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          pointerEvents: 'auto',
          animation: 'slideUp 0.25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            {/* Driver Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: '14px',
              background: 'rgba(99,102,241,0.2)',
              border: '2px solid rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
            }}>
              {driver?.photoUrl
                ? <img src={driver.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <HiUser style={{ width: 24, height: 24, color: '#818cf8' }} />
              }
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#f8fafc' }}>
                {driver?.fullName || 'Assigned Driver'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                <HiTruck style={{ display: 'inline', marginRight: 4 }} />
                {vehicle?.vehicleNumber || 'Vehicle'}
                {vehicle?.vehicleType && ` · ${vehicle.vehicleType}`}
              </div>
            </div>

            {driver?.mobile && (
              <a
                href={`tel:${driver.mobile}`}
                id="call-driver-btn"
                style={{
                  background: '#6366f1',
                  borderRadius: '50%',
                  width: 42, height: 42,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                }}
              >
                <HiPhone style={{ width: 18, height: 18 }} />
              </a>
            )}
          </div>

          {/* Route */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            marginBottom: '12px',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>FROM</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {trip.source || load?.source || '—'}
              </div>
            </div>
            <div style={{ color: '#6366f1', fontSize: '18px' }}>→</div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>TO</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {trip.destination || load?.destination || '—'}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {distanceRemaining && (
              <div style={{
                flex: 1, background: 'rgba(99,102,241,0.1)', borderRadius: '12px',
                padding: '10px', textAlign: 'center',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#818cf8' }}>{distanceRemaining}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Distance Left</div>
              </div>
            )}
            {location?.speed != null && (
              <div style={{
                flex: 1, background: 'rgba(34,197,94,0.1)', borderRadius: '12px',
                padding: '10px', textAlign: 'center',
                border: '1px solid rgba(34,197,94,0.2)',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#4ade80' }}>
                  {Math.round(location.speed)} km/h
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Speed</div>
              </div>
            )}
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
              padding: '10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <HiWifi style={{ color: isConnected ? '#22c55e' : '#f59e0b' }} />
                {isConnected ? 'Live' : 'Offline'}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>GPS Status</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
