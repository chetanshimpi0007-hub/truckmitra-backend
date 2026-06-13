import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';

// Read token from either new or legacy key
const initialToken = localStorage.getItem('accessToken') ?? localStorage.getItem('token');

/**
 * Create a central socket instance with auth token attached. We keep a single
 * socket instance and expose a helper to refresh the auth token when the user
 * logs in/out so the server can validate the connection.
 */
const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  auth: { token: initialToken }
});

/**
 * Replace the socket auth token and reconnect. Call this after login/logout.
 */
export function refreshSocketAuth(token?: string) {
  try {
    const t = token ?? (localStorage.getItem('accessToken') ?? localStorage.getItem('token'));
    socket.auth = { token: t } as any;
    if (socket.connected) socket.disconnect();
    socket.connect();
  } catch (e) {
    // silent
    console.debug('refreshSocketAuth error', e);
  }
}

export default socket;