import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLocationMarker, HiPhone, HiUser, HiTruck, HiX, HiClock } from 'react-icons/hi';
import LiveMap from './LiveMap'; // Reusing our Leaflet wrapper as the active provider

interface LiveTrackingCenterProps {
  trip: any;
  onClose: () => void;
}

export default function LiveTrackingCenter({ trip, onClose }: LiveTrackingCenterProps) {
  const [showDetails, setShowDetails] = useState(true);
  
  if (!trip) return null;

  const driver = trip.driver;
  const vehicle = trip.vehicle;
  const load = trip.load;

  const markers = [
    {
      id: trip.id,
      lat: trip.currentLat || load?.sourceLat || 28.6139,
      lng: trip.currentLng || load?.sourceLng || 77.2090,
      label: `Trip ${trip.id} (In Transit)`
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex animate-fadeIn overflow-hidden bg-black/50 backdrop-blur-sm">
      {/* MAP BACKGROUND */}
      <div className="absolute inset-0">
        <LiveMap markers={markers} zoom={14} className="w-full h-full" />
      </div>

      {/* TOP BAR / GLASS OVERLAY */}
      <div className="absolute top-0 inset-x-0 p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-start pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-3xl shadow-2xl flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center border border-brand/30">
              <HiLocationMarker className="text-brand w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Trip #{trip.id} Live</h2>
              <div className="flex items-center space-x-2 text-sm text-emerald-400 font-bold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>GPS Active</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* BOTTOM CONTROL PANEL */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-6 inset-x-6 md:bottom-10 md:inset-x-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl pointer-events-auto"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 shadow-2xl">
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Driver Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shadow-inner">
                      {driver?.photoUrl ? (
                        <img src={driver.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><HiUser className="text-slate-400 w-8 h-8" /></div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                      <HiTruck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg">{driver?.fullName || 'Assigned Driver'}</h3>
                    <p className="text-slate-500 text-sm font-bold">{vehicle?.vehicleNumber || 'Vehicle'}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300">
                    <HiClock className="w-5 h-5 text-slate-400" />
                    <span>Est. Arrival: 2 hrs</span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition">
                      Details
                    </button>
                    {driver?.mobile && (
                      <a href={`tel:${driver.mobile}`} className="px-6 py-3 bg-brand text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-brand/30 flex items-center space-x-2 hover:bg-brand/90 transition">
                        <HiPhone className="w-5 h-5" /> <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>

              {/* Progress Bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span>{load?.source || 'Origin'}</span>
                  <span>{load?.destination || 'Destination'}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand w-[65%] rounded-full relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
