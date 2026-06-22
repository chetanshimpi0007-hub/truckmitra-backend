import { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../firebase';

export const usePushNotifications = () => {
  const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);
  const [isTokenFound, setTokenFound] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission === 'granted') {
      requestForToken().then((token) => {
        if (token) {
          setTokenFound(true);
        }
      });
    }
  }, [permission]);

  useEffect(() => {
    onMessageListener()
      .then((payload: any) => {
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
        console.log("Received foreground notification:", payload);
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  const requestPermission = async () => {
    const permissionResult = await Notification.requestPermission();
    setPermission(permissionResult);
    if (permissionResult === 'granted') {
      const token = await requestForToken();
      if (token) {
        setTokenFound(true);
      }
    }
  };

  return { notification, isTokenFound, permission, requestPermission };
};
