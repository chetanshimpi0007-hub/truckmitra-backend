import React, { useState, useRef, useEffect } from 'react';
import { NotificationItem, useNotifications } from '../../hooks/useNotifications';

/* ─── Icons ─── */
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

/* ─── Type icon mapping ─── */
const typeEmoji: Record<string, string> = {
  LOAD: '📦',
  BID: '💰',
  TRIP: '🚛',
  WALLET: '💳',
  SYSTEM: '🔔',
  SUBSCRIPTION: '⭐',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface Props {
  userId: number | null;
  token: string | null;
}

const NotificationBell: React.FC<Props> = ({ userId, token }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isConnected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    hasMore,
  } = useNotifications(userId, token);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBellClick = () => {
    setOpen(prev => !prev);
  };

  const handleItemClick = async (n: NotificationItem) => {
    if (!n.isRead) await markAsRead(n.id);
  };

  const loadMore = () => {
    const currentPage = Math.floor(notifications.length / 20);
    fetchNotifications(currentPage);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={handleBellClick}
        aria-label="Notifications"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: open ? 'var(--primary, #6366f1)' : 'inherit',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: '#ef4444',
            color: '#fff',
            borderRadius: '50%',
            fontSize: '10px',
            fontWeight: 700,
            width: unreadCount > 9 ? '18px' : '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            boxShadow: '0 0 0 2px #fff',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {/* Live indicator */}
        {isConnected && (
          <span style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#22c55e',
            border: '1.5px solid #fff',
          }} title="Live notifications connected" />
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          id="notification-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 'min(380px, 92vw)',
            background: '#1e1e2e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'notifSlideIn 0.2s ease',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#f8fafc' }}>
              Notifications {unreadCount > 0 && (
                <span style={{
                  background: '#6366f1',
                  color: '#fff',
                  borderRadius: '99px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  marginLeft: '6px',
                }}>{unreadCount}</span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{
            maxHeight: '420px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔔</div>
                <div style={{ fontSize: '14px' }}>You're all caught up!</div>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.06)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.15s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(99,102,241,0.06)')}
                >
                  {/* Unread indicator */}
                  {!n.isRead && (
                    <div style={{
                      position: 'absolute',
                      left: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#6366f1',
                    }} />
                  )}

                  {/* Type emoji */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}>
                    {typeEmoji[n.type] ?? '🔔'}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: n.isRead ? 500 : 700,
                      fontSize: '13.5px',
                      color: '#f1f5f9',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {n.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.55)',
                      marginTop: '2px',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {n.message}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.3)',
                      marginTop: '4px',
                    }}>
                      {timeAgo(n.createdAt)}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    id={`delete-notification-${n.id}`}
                    onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.25)',
                      padding: '4px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      transition: 'color 0.2s, background 0.2s',
                    }}
                    aria-label="Delete notification"
                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'none'; }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}

            {/* Load more */}
            {hasMore && notifications.length > 0 && (
              <button
                id="load-more-notifications-btn"
                onClick={loadMore}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  color: '#818cf8',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Load more
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
