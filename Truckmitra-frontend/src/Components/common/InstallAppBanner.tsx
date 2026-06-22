import React, { useState, useEffect } from 'react';

const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between">
      <div className="mb-2 sm:mb-0 flex items-center">
        <img src="/logo192.png" alt="App Icon" className="w-10 h-10 mr-3 rounded" />
        <div>
          <p className="font-semibold">Install TruckMitra App</p>
          <p className="text-sm text-blue-100">For a better experience and offline access</p>
        </div>
      </div>
      <div className="flex space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
        <button 
          onClick={handleClose}
          className="flex-1 sm:flex-none px-4 py-2 border border-white text-white rounded hover:bg-blue-700 transition"
        >
          Not now
        </button>
        <button 
          onClick={handleInstallClick}
          className="flex-1 sm:flex-none px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallAppBanner;
