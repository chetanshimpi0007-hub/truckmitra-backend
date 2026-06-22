import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { useAdmin } from '../../hooks/admin.hook';
import { 
  HiUsers, 
  HiUserGroup, 
  HiCheckCircle, 
  HiBan,
  HiSearch,
  HiEye,
  HiCheck,
  HiX,
  HiUserCircle,
  HiDocumentText,
  HiExclamationCircle,
  HiChartBar,
  HiIdentification,
  HiCash,
  HiCog,
  HiLogout,
  HiDownload,
  HiTruck,
  HiShoppingCart,
  HiRefresh
} from 'react-icons/hi';
import toast from 'react-hot-toast';
// adminService imported via useAdmin hook
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import LiveMap from '../../Components/common/LiveMap';
import NotificationDropdown from '../../Components/common/NotificationDropdown';
import AdminActivityDashboard from './AdminActivityDashboard';
import { EmptyState } from '../../Components/illustrations/EmptyState';
import BillingDashboard from '../billing/BillingDashboard';
import { AdminUser360 } from './AdminUser360';
import ProfileHeader from '../../Components/dashboard/ProfileHeader';
// Recharts used in AdminAnalyticsDashboard
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';
import PredictiveDashboard from './PredictiveDashboard';

// ... other imports
// (Note: Since I'm using replace_file_content, I'll just find the exact places)

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [activeMenu, setActiveMenu] = useState<'overview' | 'activity' | 'predictive' | 'users' | 'kyc' | 'financials' | 'settings' | 'tracking' | 'trips'>(
    location.pathname.includes('/users') ? 'users' : 'overview'
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Stop background scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const [kycTab, setKycTab] = useState<'DRIVER' | 'SHIPPER' | 'TRANSPORTER'>('DRIVER');
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'>(
    searchParams.get('status') === 'pending' ? 'PENDING_VERIFICATION' : 'ALL'
  );
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [activeTrips, setActiveTrips] = useState<any[]>([]);
  const [allTrips, setAllTrips]       = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [viewing360UserId, setViewing360UserId] = useState<number | null>(null);

  const { 
    allUsers, 
    pendingUsers,
    selectedUser, 
    getStats,
    getUsers,
    getUserDetails,
    verifyUser,
    rejectUser,
    suspendUser,
    activateUser
  } = useAdmin();

  const [platformAnalytics, setPlatformAnalytics] = useState<any>({
    totalLoads: 0,
    totalTrips: 0,
    totalBids: 0,
    totalUsers: 0,
    revenueTrends: [0, 0, 0, 0, 0, 0],
    loadVolumes: [0, 0, 0, 0, 0, 0]
  });

  const fetchPlatformAnalytics = async () => {
    try {
      const res = await protectedApi.get('/api/analytics/admin');
      setPlatformAnalytics(res.data);
    } catch (e) { console.error('Failed to fetch platform analytics', e); }
  };

  useEffect(() => {
    fetchPlatformAnalytics();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
    }
    getStats();
  }, [user, navigate, getStats]);

  useEffect(() => {
    if (activeMenu === 'users') {
      getUsers({ search: searchTerm, status: userStatusFilter === 'ALL' ? undefined : userStatusFilter });
    } else if (activeMenu === 'kyc') {
      getUsers({ role: kycTab });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu, kycTab, searchTerm, userStatusFilter]);
  
  const fetchAllTrips = async () => {
    setTripsLoading(true);
    try {
      const res = await protectedApi.get('/api/trips/admin/all');
      setAllTrips(res.data || []);
    } catch {
      try {
        // Fallback: try generic trips endpoint
        const res = await protectedApi.get('/api/trips');
        setAllTrips(res.data || []);
      } catch { /* silent */ }
    } finally { setTripsLoading(false); }
  };

  const fetchActiveTrips = async () => {
    try {
      const response = await protectedApi.get('/api/tracking/admin/active');
      setActiveTrips(response.data || []);
    } catch (error) {
      // silent
    }
  };

  useEffect(() => {
    if (activeMenu === 'tracking') {
      fetchActiveTrips();
      const interval = setInterval(fetchActiveTrips, 10000);
      return () => clearInterval(interval);
    }
    if (activeMenu === 'trips') {
      fetchAllTrips();
    }
  }, [activeMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownloadPdf = async (userId: number) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/admin/users/${userId}/registration-pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registration_dossier_${userId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download PDF dossier');
    }
  };

  const refreshData = () => {
    getStats();
    if (activeMenu === 'users') getUsers({ search: searchTerm, status: userStatusFilter === 'ALL' ? undefined : userStatusFilter });
    if (activeMenu === 'kyc') getUsers({ role: kycTab });
  };

  // Sidebar Component
  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-[80vw] sm:w-80 lg:w-64 bg-slate-50 min-h-screen text-slate-600 flex flex-col border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="p-8 border-b border-slate-200 bg-white flex justify-between items-center">
          <div className="flex items-center justify-center">
            <img src="/logo-transparent.png" alt="TruckMitra" className="w-[180px] h-auto object-contain" />
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
            <HiX className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          <SidebarLink icon={<HiChartBar />} label="Overview" active={activeMenu === 'overview'} onClick={() => {setActiveMenu('overview'); setViewing360UserId(null); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiChartBar />} label="Activity Monitoring" active={activeMenu === 'activity'} onClick={() => {setActiveMenu('activity'); setViewing360UserId(null); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiChartBar />} label="Predictive Analytics" active={activeMenu === 'predictive'} onClick={() => {setActiveMenu('predictive'); setViewing360UserId(null); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiUsers />} label="User Management" active={activeMenu === 'users'} onClick={() => {setActiveMenu('users'); setViewing360UserId(null); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiIdentification />} label="KYC Verification" active={activeMenu === 'kyc'} onClick={() => {setActiveMenu('kyc'); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiTruck />} label="Live Fleet Tracking" active={activeMenu === 'tracking'} onClick={() => {setActiveMenu('tracking'); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiDocumentText />} label="Trip Verifications" active={activeMenu === 'trips'} onClick={() => {setActiveMenu('trips'); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiDocumentText />} label="Advanced Reports" onClick={() => {navigate('/admin/reports'); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiCash />} label="Financials" active={activeMenu === 'financials'} onClick={() => {setActiveMenu('financials'); setIsSidebarOpen(false);}} />
          <SidebarLink icon={<HiCog />} label="Settings" onClick={() => {navigate('/admin/settings'); setIsSidebarOpen(false);}} />
        </nav>
        
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all group">
            <HiLogout className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> Sign Out
          </button>
        </div>
      </div>
    </>
  );

  const SidebarLink = ({ icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
          : 'hover:bg-slate-100/80 hover:text-slate-900 text-slate-600'
      }`}
    >
      <span className={`text-xl mr-3 ${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
      {label}
    </button>
  );

  // Content Area
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto w-full">
        {/* Top Header */}
        <ProfileHeader
          user={user}
          roleBadgeText="Super Admin"
          roleBadgeClasses="bg-indigo-50 text-indigo-600 border-indigo-100"
          welcomeMessage={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Admin'}`}
          onMenuToggle={() => setIsSidebarOpen(true)}
          stats={[
            { label: 'Total Users', value: platformAnalytics?.totalUsers || 0, icon: <HiUsers /> },
            { label: 'Total Loads', value: platformAnalytics?.totalLoads || 0, icon: <HiShoppingCart /> },
            { label: 'Recent Revenue', value: `₹${(platformAnalytics?.revenueTrends?.[platformAnalytics?.revenueTrends?.length - 1] || 0).toLocaleString('en-IN')}`, icon: <HiCash /> },
            { label: 'Pending Approvals', value: pendingUsers.length, icon: <HiExclamationCircle /> }
          ]}
        >
          <NotificationDropdown />
          <button onClick={refreshData} className="p-2 text-slate-400 hover:text-indigo-500 transition rounded-xl hover:bg-indigo-50">
            <HiRefresh className="w-6 h-6" />
          </button>
        </ProfileHeader>

        <div className="p-10">
          {/* Overview Section */}
          {activeMenu === 'overview' && (
            <AdminAnalyticsDashboard />
          )}

          {/* Activity Monitoring Section */}
          {activeMenu === 'activity' && (
            <AdminActivityDashboard />
          )}

          {/* Predictive Analytics Section */}
          {activeMenu === 'predictive' && (
            <PredictiveDashboard />
          )}

          {/* User Management Section */}
          {activeMenu === 'users' && viewing360UserId ? (
            <AdminUser360 userId={viewing360UserId} onBack={() => setViewing360UserId(null)} />
          ) : activeMenu === 'users' && !viewing360UserId && (
            <div className="animate-fadeIn">
               {/* Status Filters */}
               <div className="mb-6 bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-2 w-fit">
                  {['ALL', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map(status => (
                     <button 
                      key={status}
                      onClick={() => setUserStatusFilter(status as any)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
                        userStatusFilter === status 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                     >
                       {status.replace('_', ' ')}
                     </button>
                  ))}
               </div>

               <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative group flex-1 max-w-md">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search users by name, mobile or email..." 
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all shadow-sm font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button onClick={refreshData} className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center">
                     Refresh Data
                  </button>
               </div>
               <UserTable 
                 users={allUsers} 
                 onView={(u: any) => setViewing360UserId(u.id)}
                 onApprove={(u: any) => { verifyUser(u.id).then(refreshData); }}
                 onReject={(u: any) => { setActionUserId(u.id); setShowRejectModal(true); }}
                 onSuspend={(u: any) => {
                   if (window.confirm(`Are you sure you want to suspend ${u.fullName}?`)) {
                     suspendUser(u.id, { reason: 'Suspended by admin' }).then(refreshData);
                   }
                 }}
                 onActivate={(u: any) => { activateUser(u.id).then(refreshData); }}
               />
            </div>
          )}

          {/* KYC Verification Section */}
          {activeMenu === 'kyc' && (
            <div className="animate-fadeIn">
              <div className="mb-8 bg-white p-2 rounded-2xl border border-slate-200 flex space-x-2 w-fit">
                {(['DRIVER', 'SHIPPER', 'TRANSPORTER'] as const).map(role => (
                   <button 
                    key={role}
                    onClick={() => setKycTab(role)}
                    className={`px-8 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                      kycTab === role 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                   >
                     {role} Verification
                   </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {allUsers.filter(u => u.role === kycTab && (u.accountStatus === 'PENDING_VERIFICATION' || u.accountStatus === 'REGISTERED' || u.accountStatus === 'PROFILE_COMPLETED')).length === 0 ? (
                  <div className="bg-white p-20 rounded-3xl border border-slate-200 text-center">
                    <HiCheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-black">All Clear!</h3>
                    <p className="text-slate-500">No pending {kycTab.toLowerCase()} KYC requests.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                     {allUsers.filter(u => u.role === kycTab && (u.accountStatus === 'PENDING_VERIFICATION' || u.accountStatus === 'REGISTERED' || u.accountStatus === 'PROFILE_COMPLETED')).map((u: any) => (
                        <KycCard 
                          key={u.id} 
                          user={u} 
                          onView={() => { getUserDetails(u.id); setShowUserModal(true); }}
                          onApprove={() => verifyUser(u.id).then(refreshData)}
                          onReject={() => { setActionUserId(u.id); setShowRejectModal(true); }}
                          onDownload={() => handleDownloadPdf(u.id)}
                        />
                     ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live Fleet Tracking Section */}
          {activeMenu === 'tracking' && (
             <div className="animate-fadeIn max-w-5xl h-[600px] flex flex-col">
                <div className="bg-white rounded-t-[32px] p-8 border-x border-t border-slate-200 shadow-sm flex items-center justify-between">
                   <div>
                      <h3 className="text-xl font-black">Live Fleet Tracking (All Platforms)</h3>
                      <p className="text-slate-500 text-sm">Monitor all ongoing platform shipments and active vehicles</p>
                   </div>
                </div>
                <div className="flex-1 rounded-b-[32px] overflow-hidden border border-slate-200 shadow-sm relative">
                   <LiveMap 
                      markers={activeTrips.map(trip => ({
                         id: trip.id,
                         lat: trip.currentLat || trip.load?.sourceLat || 28.6139,
                         lng: trip.currentLng || trip.load?.sourceLng || 77.2090,
                         label: `Trip ${trip.id}`
                      }))}
                   />
                </div>
             </div>
          )}

          {/* Trip Verifications Section */}
          {activeMenu === 'trips' && (
            <div className="animate-fadeIn space-y-10">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-b-4 border-b-rose-500">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Pending Verification</div>
                  <div className="text-4xl font-black text-rose-600">{allTrips.filter(t => t.status === 'DELIVERED').length}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-b-4 border-b-amber-500">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">In Transit</div>
                  <div className="text-4xl font-black text-amber-600">{allTrips.filter(t => t.status === 'IN_TRANSIT').length}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-b-4 border-b-emerald-500">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Completed</div>
                  <div className="text-4xl font-black text-emerald-600">{allTrips.filter(t => t.status === 'COMPLETED').length}</div>
                </div>
              </div>

              {/* Pending Receipt Verifications */}
              {allTrips.filter(t => t.status === 'DELIVERED').length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black mb-6 flex items-center space-x-3">
                    <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                    <span>Pending Receipt Verifications</span>
                  </h3>
                  <div className="space-y-4">
                    {allTrips.filter(t => t.status === 'DELIVERED').map((trip: any) => (
                      <div key={trip.id} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-rose-50 border border-rose-100 gap-4">
                        <div>
                          <div className="font-black text-slate-900">{trip.load?.source} → {trip.load?.destination}</div>
                          <div className="text-sm text-slate-500 mt-1">
                            Trip #{trip.id} · {trip.transporter?.fullName || 'Transporter'} · Driver: {trip.driver?.fullName || '–'}
                          </div>
                        </div>
                        <StatusPill status={trip.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Trips Table */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black">All Platform Trips</h3>
                  <button onClick={fetchAllTrips} className="p-2 text-slate-400 hover:text-indigo-600 transition rounded-xl hover:bg-indigo-50">
                    <HiChartBar className="w-5 h-5" />
                  </button>
                </div>
                {tripsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
                  </div>
                ) : allTrips.length === 0 ? (
                  <div className="py-16 text-center">
                    <EmptyState type="trips" className="w-32 h-32 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No trips found on platform.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50">
                          <th className="px-6 py-4">Trip ID</th>
                          <th className="px-6 py-4">Route</th>
                          <th className="px-6 py-4">Transporter</th>
                          <th className="px-6 py-4">Driver</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {allTrips.slice(0, 50).map((trip: any) => (
                          <tr key={trip.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-black text-slate-400">#{trip.id}</td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold text-slate-900">{trip.load?.source} → {trip.load?.destination}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{trip.load?.materialType} · {trip.load?.weight} T</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{trip.transporter?.fullName || '–'}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{trip.driver?.fullName || '–'}</td>
                            <td className="px-6 py-4"><StatusPill status={trip.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMenu === 'financials' && (
              <BillingDashboard rolePath="" />
          )}

          {/* Placeholders */}
          {['settings'].includes(activeMenu) && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6 border-b-4 border-slate-200">
                   {activeMenu === 'financials' ? <HiCash className="w-12 h-12" /> : <HiCog className="w-12 h-12" /> }
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Modules Under Development</h3>
                <p className="text-slate-500 font-medium">This professional section will be available in the next release.</p>
            </div>
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowUserModal(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-modalUp">
            <div className="sticky top-0 bg-white px-8 py-6 border-b border-slate-100 flex items-center justify-between z-10">
               <div>
                 <h2 className="text-2xl font-black text-slate-900">Registration Details</h2>
                 <p className="text-slate-500 text-sm font-medium">Full review of user profile and documents</p>
               </div>
               <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <HiX className="w-6 h-6 text-slate-400" />
               </button>
            </div>
            
            <div className="p-8 space-y-10">
               {/* Identity Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <DetailItem label="Full Name" value={selectedUser.fullName} />
                  <DetailItem label="Mobile" value={selectedUser.mobile} />
                  <DetailItem label="Email" value={selectedUser.email} />
                  <DetailItem label="Role" value={selectedUser.role} isBadge />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <DetailItem label="Address" value={(selectedUser as any).address || 'N/A'} span={3} />
                  <DetailItem label="Area" value={(selectedUser as any).area || 'N/A'} />
                  <DetailItem label="Landmark" value={(selectedUser as any).landmark || 'N/A'} />
                  <DetailItem label="Location" value={`${(selectedUser as any).city || 'N/A'}, ${(selectedUser as any).state || 'N/A'} - ${(selectedUser as any).pincode || 'N/A'}`} />
               </div>

               {/* Role Details */}
               {selectedUser.profileDetails && (
                 <div>
                   <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-6">Business & Registration Data</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(selectedUser.profileDetails).map(([key, value]) => {
                         if (typeof value === 'string' && value.startsWith('http')) return null;
                         return <DetailItem key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} value={String(value)} />;
                      })}
                   </div>
                   
                   {/* Documents Area */}
                   <div className="mt-10">
                     <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-6">Uploaded Documents (KYC)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(selectedUser.profileDetails)
                           .filter(([key, value]) => typeof value === 'string' && value.startsWith('http'))
                           .map(([key, value]) => (
                             <div key={key} className="group relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-indigo-600 transition-all">
                                <img src={value as string} alt={key} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <a href={value as string} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-xl text-slate-900 font-bold shadow-xl">View Original</a>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-700">
                                   {key.replace(/Url$/, '').replace(/([A-Z])/g, ' $1')}
                                </div>
                             </div>
                           ))
                        }
                     </div>
                   </div>
                 </div>
               )}
            </div>
            
            <div className="sticky bottom-0 bg-white/80 backdrop-blur px-8 py-6 border-t border-slate-100 flex justify-end space-x-4">
                <button onClick={() => handleDownloadPdf(selectedUser.id)} className="px-6 py-3 border-2 border-slate-200 rounded-xl font-bold flex items-center hover:bg-slate-50 transition">
                   <HiDownload className="mr-2" /> Download Dossier
                </button>
                {(selectedUser.accountStatus === 'PENDING_VERIFICATION' || selectedUser.accountStatus === 'REGISTERED' || selectedUser.accountStatus === 'PROFILE_COMPLETED') && (
                  <>
                    <button onClick={() => { setActionUserId(selectedUser.id); setShowRejectModal(true); }} className="px-8 py-3 bg-rose-50 text-rose-600 rounded-xl font-black hover:bg-rose-100 transition">
                       Reject
                    </button>
                    <button onClick={() => verifyUser(selectedUser.id).then(() => { setShowUserModal(false); refreshData(); })} className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition">
                       Approve Access
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-modalCenter">
            <div className="flex items-center text-rose-600 mb-6">
               <HiExclamationCircle className="w-10 h-10 mr-4" />
               <h3 className="text-2xl font-black">Rejection Reason</h3>
            </div>
            <p className="text-slate-500 text-sm mb-6 font-medium">Please provide a professional reason for rejecting this registration. This message will be sent to the user.</p>
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 min-h-[150px] outline-none focus:border-rose-600 transition-all font-medium text-slate-700" 
              placeholder="e.g. Identity document not clear, please re-upload Aadhaar back photo."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex space-x-4 mt-8">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition">Cancel</button>
              <button 
                onClick={async () => {
                  if (!rejectReason) { toast.error('Please enter a reason'); return; }
                  if (actionUserId) {
                    await rejectUser(actionUserId, { reason: rejectReason });
                    setShowRejectModal(false);
                    setShowUserModal(false);
                    setRejectReason('');
                    refreshData();
                  }
                }} 
                className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-b-4 hover:border-indigo-600 transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110`} />
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} text-white shadow-lg`}>
        {icon}
      </div>
    </div>
    <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-slate-900">{value}</div>
  </div>
);

const UserTable = ({ users, onView, onApprove, onReject, onSuspend, onActivate }: any) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[1000px]">
       <thead>
         <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
            <th className="px-6 py-5">User Profile</th>
            <th className="px-6 py-5">Contact Info</th>
            <th className="px-6 py-5">Company / Agency</th>
            <th className="px-6 py-5">Platform Role</th>
            <th className="px-6 py-5">Registered</th>
            <th className="px-6 py-5">Approval & Status</th>
            <th className="px-6 py-5 text-right">Actions</th>
         </tr>
       </thead>
       <tbody className="divide-y divide-slate-50">
          {users.map((u: any) => (
            <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors group">
               <td className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                       {u.profileImageUrl ? <img src={u.profileImageUrl} alt="" className="w-full h-full object-cover" /> : <HiUserCircle className="w-8 h-8" />}
                    </div>
                    <div>
                       <div className="text-sm font-black text-slate-900">{u.fullName}</div>
                       <div className="text-[10px] font-bold text-slate-400">ID: TM-{u.id}</div>
                    </div>
                  </div>
               </td>
               <td className="px-6 py-5">
                  <div className="text-sm font-medium text-slate-700">{u.email}</div>
                  <div className="text-xs text-slate-400 font-bold">{u.mobile}</div>
               </td>
               <td className="px-6 py-5">
                  <div className="text-sm font-bold text-slate-700">
                    {u.companyName || u.agencyName || <span className="text-slate-300 italic">N/A</span>}
                  </div>
               </td>
               <td className="px-6 py-5">
                  <RoleBadge role={u.role} />
               </td>
               <td className="px-6 py-5 text-sm font-medium text-slate-500">
                  {new Date(u.registeredAt).toLocaleDateString()}
               </td>
               <td className="px-6 py-5">
                  <div className="flex flex-col space-y-2">
                    <StatusPill status={u.accountStatus} />
                    {u.accountStatus === 'VERIFIED' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-tight bg-emerald-50 text-emerald-600 border-emerald-100 w-fit">
                        Active
                      </span>
                    )}
                    {u.accountStatus === 'SUSPENDED' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-tight bg-rose-50 text-rose-600 border-rose-100 w-fit">
                        Inactive
                      </span>
                    )}
                  </div>
               </td>
               <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => onView(u)} title="View User 360" className="p-2 text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all font-bold text-sm flex items-center gap-1 shadow-sm border border-primary-100">
                      <HiEye className="w-4 h-4" /> View 360
                    </button>
                    
                    {(u.accountStatus === 'PENDING_VERIFICATION' || u.accountStatus === 'REGISTERED' || u.accountStatus === 'PROFILE_COMPLETED') && (
                      <>
                        <button onClick={() => onApprove(u)} title="Approve" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                          <HiCheck className="w-5 h-5" />
                        </button>
                        <button onClick={() => onReject(u)} title="Reject" className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <HiX className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {u.accountStatus === 'VERIFIED' && (
                      <button onClick={() => onSuspend(u)} title="Suspend" className="p-2 text-warning hover:bg-warning/10 rounded-xl transition-all">
                        <HiBan className="w-5 h-5" />
                      </button>
                    )}
                    {u.accountStatus === 'SUSPENDED' && (
                      <button onClick={() => onActivate(u)} title="Activate" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <HiCheckCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
               </td>
            </tr>
          ))}
       </tbody>
    </table>
  </div>
);

const KycCard = ({ user, onView, onApprove, onReject, onDownload }: any) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 hover:shadow-xl transition-all border-b-4 hover:border-indigo-600 group">
    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-300 border border-slate-100 border-b-4 group-hover:border-indigo-200 overflow-hidden transition-colors">
       {user.profileImageUrl ? <img src={user.profileImageUrl} alt="" /> : (
         user.role === 'DRIVER' ? <HiTruck className="w-10 h-10" /> : 
         user.role === 'SHIPPER' ? <HiShoppingCart className="w-10 h-10" /> : <HiUserGroup className="w-10 h-10" />
       )}
    </div>
    <div className="flex-1 text-center md:text-left">
       <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-3 mb-1">
          <h4 className="text-lg font-black text-slate-900">{user.fullName}</h4>
          <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full tracking-tighter">Verification Needed</span>
       </div>
       <div className="text-slate-500 text-sm font-medium mb-1">{user.email} • {user.mobile}</div>
       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Signed up: {new Date(user.registeredAt).toLocaleDateString()}</div>
    </div>
    <div className="flex items-center space-x-2">
       <button onClick={onView} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition" title="Review Details"><HiEye className="w-5 h-5" /></button>
       <button onClick={onDownload} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition" title="Download Document"><HiDownload className="w-5 h-5" /></button>
       <button onClick={onReject} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition" title="Reject"><HiX className="w-5 h-5" /></button>
       <button onClick={onApprove} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition" title="Approve"><HiCheck className="w-5 h-5" /></button>
    </div>
  </div>
);

const DetailItem = ({ label, value, span = 1, isBadge = false }: any) => (
  <div className={span > 1 ? `col-span-${span}` : ''}>
    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{label}</div>
    {isBadge ? <RoleBadge role={value} /> : <div className="text-sm font-black text-slate-800 break-words">{value}</div>}
  </div>
);

const RoleBadge = ({ role }: any) => (
  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
    role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
    role === 'DRIVER' ? 'bg-amber-100 text-amber-700' :
    role === 'SHIPPER' ? 'bg-indigo-100 text-indigo-700' :
    'bg-sky-100 text-sky-700'
  }`}>
    {role}
  </span>
);

const StatusPill = ({ status }: any) => {
  const styles: any = {
    // User account statuses
    'REGISTERED':           'bg-blue-50 text-blue-600 border-blue-100',
    'PROFILE_COMPLETED':    'bg-amber-50 text-amber-600 border-amber-100',
    'PENDING_VERIFICATION': 'bg-amber-50 text-amber-600 border-amber-100',
    'VERIFIED':             'bg-emerald-50 text-emerald-600 border-emerald-100',
    // Trip statuses
    'ASSIGNED':             'bg-blue-50 text-blue-600 border-blue-100',
    'DRIVER_ASSIGNED':      'bg-indigo-50 text-indigo-600 border-indigo-100',
    'ACCEPTED_BY_DRIVER':   'bg-teal-50 text-teal-600 border-teal-100',
    'IN_TRANSIT':           'bg-amber-50 text-amber-600 border-amber-100',
    'PAUSED':               'bg-orange-50 text-orange-600 border-orange-100',
    'DELIVERED':            'bg-purple-50 text-purple-600 border-purple-100',
    'COMPLETED':            'bg-emerald-50 text-emerald-600 border-emerald-100',
    'CANCELLED':            'bg-slate-100 text-slate-500 border-slate-200',
    'REJECTED':             'bg-rose-50 text-rose-600 border-rose-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-tight ${styles[status] || 'bg-slate-50 text-slate-500'}`}>
       {status?.replace(/_/g, ' ')}
    </span>
  );
};


export default AdminDashboard;