// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import Navbar from './Components/laouts/Navbar';
import Footer from './Components/laouts/Footer';
import { GlobalNotification } from './Components/common/GlobalNotification';
import InstallAppBanner from './Components/common/InstallAppBanner';
import NotificationPermissionModal from './Components/common/NotificationPermissionModal';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '1079158362388-ceg97m2ov9e7ngbha4efk3pgrsllka69.apps.googleusercontent.com';

function App() {
  const [isNotifModalOpen, setIsNotifModalOpen] = React.useState(false);

  React.useEffect(() => {
    // Show notification permission modal after a short delay
    const timer = setTimeout(() => {
      if (Notification.permission === 'default') {
        setIsNotifModalOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
          <GlobalNotification />
          <InstallAppBanner />
          <NotificationPermissionModal 
            isOpen={isNotifModalOpen} 
            onClose={() => setIsNotifModalOpen(false)} 
          />
        </Router>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;