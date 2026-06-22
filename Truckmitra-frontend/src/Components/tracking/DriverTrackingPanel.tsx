import React, { useState } from 'react';
import { useGpsTracker } from '../../hooks/useGpsTracker';

interface DriverTrackingPanelProps {
  tripId: number;
  tripNumber?: string;
  onStatusChange?: (tracking: boolean) => void;
}

const errorMessages: Record<string, string> = {
  PERMISSION_DENIED: 'GPS permission denied. Please enable location in your browser/device settings.',
  POSITION_UNAVAILABLE: 'Unable to get GPS signal. Please move to an open area.',
  TIMEOUT: 'GPS timeout. Retrying…',
  UNSUPPORTED: 'GPS is not supported on this device.',
};

/**
 * Driver-facing GPS tracking panel.
 * Shows Start/Stop tracking button and GPS status.
 * Designed for mobile (Android Chrome, Samsung Browser, iPhone Safari).
 */
const DriverTrackingPanel: React.FC<DriverTrackingPanelProps> = ({
  tripId,
  tripNumber,
  onStatusChange,
}) => {
  const { isTracking, gpsError, lastPosition, startTracking, stopTracking } = useGpsTracker(tripId);
  const [confirming, setConfirming] = useState(false);

  const handleToggle = () => {
    if (isTracking) {
      setConfirming(true);
    } else {
      startTracking();
      onStatusChange?.(true);
    }
  };

  const confirmStop = () => {
    stopTracking();
    setConfirming(false);
    onStatusChange?.(false);
  };

  return (
    <div
      id="driver-tracking-panel"
      style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #16213e 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '20px',
        color: '#f8fafc',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '12px',
          background: isTracking ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
          border: `2px solid ${isTracking ? '#22c55e' : '#6366f1'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
        }}>
          📍
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '15px' }}>Live GPS Tracking</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            Trip {tripNumber ? `#${tripNumber}` : `#${tripId}`}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: isTracking ? '#22c55e' : 'rgba(255,255,255,0.3)',
            animation: isTracking ? 'trackPulse 1.5s ease infinite' : 'none',
            display: 'inline-block',
          }} />
          <span style={{
            fontSize: '12px', fontWeight: 700,
            color: isTracking ? '#4ade80' : 'rgba(255,255,255,0.4)',
          }}>
            {isTracking ? 'Broadcasting' : 'Stopped'}
          </span>
        </div>
      </div>

      {/* GPS error */}
      {gpsError && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px',
          padding: '12px',
          fontSize: '13px',
          color: '#fca5a5',
          marginBottom: '16px',
          lineHeight: 1.5,
        }}>
          ⚠️ {errorMessages[gpsError] || 'GPS error occurred.'}
          {gpsError === 'PERMISSION_DENIED' && (
            <div style={{ marginTop: '6px' }}>
              <strong>Android:</strong> Settings → Apps → Browser → Permissions → Location<br />
              <strong>iPhone:</strong> Settings → Safari → Location → Allow
            </div>
          )}
        </div>
      )}

      {/* Current position */}
      {lastPosition && isTracking && (
        <div style={{
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>LATITUDE</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>
              {lastPosition.latitude.toFixed(6)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>LONGITUDE</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>
              {lastPosition.longitude.toFixed(6)}
            </div>
          </div>
          {lastPosition.speed != null && (
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>SPEED</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                {Math.round(lastPosition.speed * 3.6)} km/h
              </div>
            </div>
          )}
          {lastPosition.accuracy != null && (
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>ACCURACY</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                ±{Math.round(lastPosition.accuracy)} m
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirm stop dialog */}
      {confirming ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id="cancel-stop-tracking-btn"
            onClick={() => setConfirming(false)}
            style={{
              flex: 1, padding: '13px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8fafc', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            id="confirm-stop-tracking-btn"
            onClick={confirmStop}
            style={{
              flex: 1, padding: '13px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
              color: '#fca5a5', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            }}
          >
            Stop Tracking
          </button>
        </div>
      ) : (
        <button
          id={isTracking ? 'stop-gps-tracking-btn' : 'start-gps-tracking-btn'}
          onClick={handleToggle}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: isTracking
              ? 'rgba(239,68,68,0.15)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: isTracking ? '#fca5a5' : '#fff',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: isTracking ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
            letterSpacing: '0.03em',
            transition: 'all 0.2s',
          }}
        >
          {isTracking ? '⏹ Stop GPS Tracking' : '▶ Start GPS Tracking'}
        </button>
      )}

      <p style={{
        marginTop: '12px',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        lineHeight: 1.5,
      }}>
        {isTracking
          ? 'Your location is being broadcast to the shipper and transporter in real time.'
          : 'Start tracking to share your live location. Location updates every 5–10 seconds.'}
      </p>

      <style>{`
        @keyframes trackPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default DriverTrackingPanel;
