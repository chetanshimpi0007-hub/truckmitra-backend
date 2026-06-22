import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Dummy Firebase config. Replace with real configuration when available.
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey-1234567890abcdef",
  authDomain: "truckmitra-dummy.firebaseapp.com",
  projectId: "truckmitra-dummy",
  storageBucket: "truckmitra-dummy.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-DUMMY12345"
};

const app = initializeApp(firebaseConfig);

export const messaging = typeof window !== 'undefined' && 'Notification' in window ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' });
    if (currentToken) {
      console.log('Firebase Token:', currentToken);
      // Here you would typically send this token to your backend server
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
