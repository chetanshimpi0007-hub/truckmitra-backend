import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HiCheckCircle, HiExclamationCircle, HiTruck, HiUser, HiLocationMarker } from 'react-icons/hi';

const VerifyLR: React.FC = () => {
    const { lrNumber } = useParams<{ lrNumber: string }>();
    const [lr, setLr] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/lr/verify/${lrNumber}`);
                setLr(res.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [lrNumber]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white p-10 rounded-[32px] shadow-2xl border border-rose-100 text-center max-w-md">
                <HiExclamationCircle className="w-20 h-20 text-rose-500 mx-auto mb-6" />
                <h1 className="text-2xl font-black text-slate-900 mb-2">Invalid Lorry Receipt</h1>
                <p className="text-slate-500 font-medium">The LR Number you scanned could not be verified in the TruckMitra system.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 p-10 text-white text-center">
                        <HiCheckCircle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-3xl font-black mb-1 tracking-tight">Verified Authentic</h1>
                        <p className="text-emerald-100 font-bold opacity-80">This Lorry Receipt is digitally signed</p>
                    </div>

                    <div className="p-10 space-y-8">
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">LR Number</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{lr.lrNumber}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <InfoBox icon={<HiTruck />} label="Vehicle" value={lr.trip?.vehicle?.vehicleNumber} />
                            <InfoBox icon={<HiUser />} label="Driver" value={lr.trip?.driver?.fullName} />
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                            <div className="flex items-start">
                                <HiLocationMarker className="w-5 h-5 text-indigo-600 mr-3 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Source</p>
                                    <p className="text-sm font-bold text-slate-700">{lr.trip?.load?.source}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <HiLocationMarker className="w-5 h-5 text-rose-500 mr-3 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Destination</p>
                                    <p className="text-sm font-bold text-slate-700">{lr.trip?.load?.destination}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 text-center">
                            <img src="/logo-transparent.png" alt="TruckMitra" className="w-32 mx-auto opacity-20" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Security Guaranteed by TruckMitra Blockchain</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoBox = ({ icon, label, value }: any) => (
    <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">{icon}</div>
        <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
            <p className="text-sm font-black text-slate-800">{value || 'N/A'}</p>
        </div>
    </div>
);

export default VerifyLR;
