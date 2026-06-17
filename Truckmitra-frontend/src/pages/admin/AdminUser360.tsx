import React, { useEffect, useState } from 'react';
import { 
  HiChevronLeft,
  HiChevronRight,
  HiUser, 
  HiOfficeBuilding, 
  HiPhone, 
  HiMail, 
  HiClock,
  HiCurrencyRupee,
  HiTruck,
  HiClipboardList
} from 'react-icons/hi';
import adminService from '../../services/admin.service';
import { StatCard } from '../../Components/ui/StatCard';
import { EmptyState } from '../../Components/ui/EmptyState';
import { DataGrid } from '../../Components/ui/DataGrid';
import { LogisticsHero } from '../../Components/illustrations/LogisticsHero';

interface AdminUser360Props {
  userId: number;
  onBack: () => void;
}

export const AdminUser360: React.FC<AdminUser360Props> = ({ userId, onBack }) => {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trips' | 'invoices' | 'payments' | 'timeline'>('trips');
  
  const [tabData, setTabData] = useState<any[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        setLoading(true);
        const res = await adminService.getUserFinancialSnapshot(userId);
        setSnapshot(res.data);
      } catch (e) {
        console.error("Failed to fetch user snapshot");
      } finally {
        setLoading(false);
      }
    };
    fetchSnapshot();
  }, [userId]);

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        setTabLoading(true);
        let res;
        switch (activeTab) {
          case 'trips':
            res = await adminService.getUserTrips(userId, page, size);
            break;
          case 'invoices':
            res = await adminService.getUserInvoices(userId, page, size);
            break;
          case 'payments':
            res = await adminService.getUserPayments(userId, page, size);
            break;
          case 'timeline':
            res = await adminService.getUserTimeline(userId, page, size);
            break;
        }
        if (res && res.data) {
          setTabData(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalElements(res.data.totalElements || 0);
        }
      } catch (e) {
        console.error(`Failed to fetch ${activeTab}`);
        setTabData([]);
      } finally {
        setTabLoading(false);
      }
    };
    fetchTabData();
  }, [userId, activeTab, page, size]);

  const handleTabChange = (tab: 'trips' | 'invoices' | 'payments' | 'timeline') => {
    setActiveTab(tab);
    setPage(0); // reset page on tab change
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading User 360 View...</p>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return <EmptyState icon={<HiUser />} title="User Not Found" description="Could not load the financial snapshot for this user." />;
  }

  const renderDataGrid = (columns: any[], data: any[], emptyStateIcon?: React.ReactNode) => (
    <div className="space-y-4">
      <DataGrid
        columns={columns}
        data={data}
        keyExtractor={(row: any) => row.id}
        loading={tabLoading}
        emptyMessage={`No ${activeTab} found.`}
        hidePagination={true}
        emptyStateIcon={emptyStateIcon}
      />
      {/* Pagination controls */}
      {!tabLoading && data.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-slate-500">
            Showing <span className="font-bold">{(page * size) + 1}</span> to <span className="font-bold">{Math.min((page + 1) * size, totalElements)}</span> of <span className="font-bold">{totalElements}</span> records
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={size} 
              onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
              className="px-2 py-1 border border-slate-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-1 rounded bg-white border border-slate-200 disabled:opacity-50"
              >
                <HiChevronLeft className="w-4 h-4"/>
              </button>
              <span className="text-sm">Page {page + 1} of {totalPages}</span>
              <button 
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-1 rounded bg-white border border-slate-200 disabled:opacity-50"
              >
                <HiChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-200 transition-all"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-primary-950 tracking-tight flex items-center gap-2">
              {snapshot.fullName}
              <span className="text-xs font-bold px-2 py-1 bg-primary-100 text-primary-700 rounded-full tracking-wider uppercase">
                {snapshot.role}
              </span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">User ID: {snapshot.userId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            snapshot.status === 'VERIFIED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}>
            {snapshot.status}
          </span>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HiPhone /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Mobile</p>
              <p className="text-sm font-bold text-slate-800">{snapshot.mobile}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HiMail /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Email</p>
              <p className="text-sm font-bold text-slate-800">{snapshot.email || 'Not Provided'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HiOfficeBuilding /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Company</p>
              <p className="text-sm font-bold text-slate-800">{snapshot.companyName || 'Individual'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HiClock /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Registered</p>
              <p className="text-sm font-bold text-slate-800">{new Date(snapshot.registrationDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Total Trips" 
          value={snapshot.totalTrips || 0} 
          icon={<HiTruck className="w-6 h-6" />} 
        />
        <StatCard 
          label="Active Trips" 
          value={snapshot.activeTrips || 0} 
          icon={<HiClipboardList className="w-6 h-6" />} 
          highlightColor="bg-warning"
        />
        <StatCard 
          label="Total Billed" 
          value={`₹${(snapshot.totalRevenue || 0).toLocaleString()}`} 
          icon={<HiCurrencyRupee className="w-6 h-6" />} 
          highlightColor="bg-success"
        />
        <StatCard 
          label="Pending Dues" 
          value={`₹${(snapshot.pendingBalance || 0).toLocaleString()}`} 
          icon={<HiCurrencyRupee className="w-6 h-6" />} 
          highlightColor="bg-danger"
        />
      </div>

      {/* History Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="flex border-b border-slate-200">
          {(['trips', 'invoices', 'payments', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === tab 
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6 min-h-[300px]">
          {activeTab === 'trips' && renderDataGrid([
            { header: 'Trip ID', accessor: 'id' },
            { header: 'Status', accessor: (row: any) => <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-primary-100 text-primary-700'}`}>{row.status}</span> },
            { header: 'Origin', accessor: (row: any) => row.load?.sourceCity },
            { header: 'Destination', accessor: (row: any) => row.load?.destinationCity },
            { header: 'Start Date', accessor: (row: any) => row.startedAt ? new Date(row.startedAt).toLocaleDateString() : 'N/A' },
          ], tabData)}
          
          {activeTab === 'invoices' && renderDataGrid([
            { header: 'Invoice For Trip', accessor: 'id' },
            { header: 'Amount', accessor: (row: any) => `₹${row.freightAmount || 0}` },
            { header: 'Invoice Link', accessor: (row: any) => row.finalInvoicePdfUrl ? <a href={row.finalInvoicePdfUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">View PDF</a> : 'N/A' },
            { header: 'Date', accessor: (row: any) => row.completedAt ? new Date(row.completedAt).toLocaleDateString() : 'N/A' },
          ], tabData, <LogisticsHero className="w-48 h-48 opacity-80" />)}
          
          {activeTab === 'payments' && renderDataGrid([
            { header: 'TXN ID', accessor: 'transactionId' },
            { header: 'Type', accessor: (row: any) => <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${row.transactionType === 'CREDIT' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{row.transactionType}</span> },
            { header: 'Amount', accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
            { header: 'Description', accessor: 'description' },
            { header: 'Date', accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
          ], tabData)}
          
          {activeTab === 'timeline' && renderDataGrid([
            { header: 'Action', accessor: 'action' },
            { header: 'Details', accessor: 'details' },
            { header: 'Timestamp', accessor: (row: any) => new Date(row.timestamp).toLocaleString() },
          ], tabData)}
        </div>
      </div>
    </div>
  );
};
