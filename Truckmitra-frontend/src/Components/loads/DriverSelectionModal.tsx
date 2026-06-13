import React, { useState, useEffect } from 'react';
import { HiX, HiTruck, HiUser, HiPhone } from 'react-icons/hi';
import protectedApi from '../../services/api/protectedAndPublicAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface DriverSelectionModalProps {
  loadId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const DriverSelectionModal: React.FC<DriverSelectionModalProps> = ({ loadId, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, vehiclesRes] = await Promise.all([
          protectedApi.get('/api/fleet/drivers'),
          protectedApi.get('/api/fleet/vehicles')
        ]);
        setDrivers(driversRes.data?.data || driversRes.data || []);
        setVehicles(vehiclesRes.data?.data || vehiclesRes.data || []);
      } catch (err) {
        toast.error('Failed to load fleet data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-select vehicle if only 1 exists, or if driver has assigned vehicle
  useEffect(() => {
    if (selectedDriverId) {
      if (vehicles.length === 1) {
        setSelectedVehicleId(vehicles[0].id);
      } else {
        setSelectedVehicleId(null);
      }
    }
  }, [selectedDriverId, vehicles]);

  const handleAssign = async () => {
    if (!selectedDriverId) {
      toast.error('Please select a driver');
      return;
    }
    setSubmitting(true);
    try {
      await protectedApi.post('/api/trips/direct-assign', null, {
        params: { loadId, driverId: selectedDriverId, vehicleId: selectedVehicleId }
      });
      toast.success('Driver assigned successfully!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign driver');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Assign Driver</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Select a driver from your fleet for this load.</p>
          </div>
          <button onClick={handleSkip} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-400">
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {drivers.length === 0 ? (
            <div className="text-center py-12">
              <HiUser className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No drivers found in your fleet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-2">Available Drivers</h3>
              <div className="grid gap-4">
                {drivers.map(driver => {
                  const isAvailable = driver.isAvailable && !driver.isOnTrip;
                  const isSelected = selectedDriverId === driver.id;
                  
                  return (
                    <div 
                      key={driver.id}
                      onClick={() => isAvailable && setSelectedDriverId(driver.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-emerald-500 bg-emerald-50' :
                        !isAvailable ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' :
                        'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                            <HiUser className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900">{driver.fullName}</div>
                            <div className="flex items-center space-x-3 text-xs font-medium text-slate-500 mt-1">
                              <span className="flex items-center"><HiPhone className="mr-1" /> {driver.mobile}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {isAvailable ? (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">Available</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-wider">On Trip / Unavailable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedDriverId && vehicles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-3">Select Vehicle (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vehicles.map(vehicle => {
                      const vSelected = selectedVehicleId === vehicle.id;
                      const vAvailable = vehicle.isAvailable;
                      return (
                        <div 
                          key={vehicle.id}
                          onClick={() => vAvailable && setSelectedVehicleId(vSelected ? null : vehicle.id)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                            vSelected ? 'border-emerald-500 bg-emerald-50' : 
                            !vAvailable ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' :
                            'border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <HiTruck className={`w-5 h-5 ${vSelected ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{vehicle.vehicleNumber}</div>
                            <div className="text-[10px] text-slate-500">{vehicle.capacity}T • {vehicle.vehicleType}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex space-x-3">
          <button 
            onClick={handleSkip}
            className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-200 bg-slate-100 rounded-2xl transition-all"
          >
            Skip Assignment
          </button>
          <button 
            onClick={handleAssign}
            disabled={!selectedDriverId || submitting}
            className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-slate-900 transition-all disabled:opacity-50"
          >
            {submitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverSelectionModal;
