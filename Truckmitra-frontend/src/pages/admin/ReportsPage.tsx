import React, { useState } from 'react';
import { 
  HiDownload, 
  HiOutlineDocumentReport,
  HiTable,
  HiFilter,
  HiCalendar,
  HiCurrencyRupee,
  HiTruck,
  HiCube,
  HiChartPie
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('TRIPS');
  const [format, setFormat] = useState('CSV');

  const handleExport = async () => {
    setLoading(true);
    try {
      // In a real app, we'd pass IDs or filters based on selection
      // For now, exporting all for the selected type
      const endpoint = reportType === 'TRIPS' ? '/reports/trips/csv' : '/reports/invoices/csv';
      
      const response = await protectedApi.post(endpoint, [], {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType.toLowerCase()}_report_${Date.now()}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      toast.success('Report generated and downloaded successfully!');
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 animate-fadeIn bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Advanced Business Reports</h1>
          <p className="text-slate-500 font-medium">Generate professional logistics and financial reports for your data.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 sticky top-28">
              <div className="flex items-center space-x-2 text-indigo-600 mb-8 font-black uppercase tracking-widest text-xs">
                <HiFilter />
                <span>Export Configuration</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">Report Data Source</label>
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 appearance-none"
                  >
                    <option value="TRIPS">Trip Lifecycle & Logistics</option>
                    <option value="INVOICES">Financial Invoices & Revenue</option>
                    <option value="SUBSCRIPTIONS">User Subscriptions</option>
                    <option value="CARBON">Carbon Footprint Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">Time Period</label>
                  <div className="relative">
                    <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 appearance-none">
                      <option>Last 30 Days</option>
                      <option>Quarter to Date</option>
                      <option>Year to Date</option>
                      <option>Custom Range...</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">Output Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setFormat('CSV')}
                      className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${format === 'CSV' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'}`}
                    >
                      CSV Data
                    </button>
                    <button 
                      onClick={() => setFormat('EXCEL')}
                      className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${format === 'EXCEL' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'}`}
                    >
                      Excel Sheet
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleExport}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <HiDownload className="text-xl" />
                        <span>Generate & Export</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
              <HiOutlineDocumentReport className="mr-2 text-indigo-600" />
              Professional Report Templates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportCard 
                title="Revenue Statement" 
                desc="Consolidated view of all transaction flows, including wallet credits/debits and subscription revenue."
                icon={<HiCurrencyRupee />}
                color="bg-emerald-500"
              />
              <ReportCard 
                title="Fleet Utilization" 
                desc="Detailed analysis of vehicle uptime, total distance traveled, and trip efficiency scores."
                icon={<HiTruck />}
                color="bg-blue-500"
              />
              <ReportCard 
                title="Carbon Compliance" 
                desc="Automated carbon footprint report based on trip distances and vehicle emission types."
                icon={<HiCube />}
                color="bg-teal-500"
              />
              <ReportCard 
                title="Load Distribution" 
                desc="Heatmap data of material types, weight trends, and popular source-destination corridors."
                icon={<HiChartPie />}
                color="bg-purple-500"
              />
            </div>

            <div className="mt-10 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black tracking-tight">Recent Exports</h3>
                  <button className="text-indigo-600 text-xs font-black uppercase">Clear History</button>
               </div>
               <div className="space-y-4">
                  {[
                    { name: 'monthly_revenue_may.csv', time: '2 hours ago', size: '1.2 MB' },
                    { name: 'fleet_util_q2.xlsx', time: 'Yesterday', size: '4.5 MB' },
                    { name: 'trip_audit_trail.csv', time: '3 days ago', size: '890 KB' }
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                             <HiTable />
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-700">{file.name}</div>
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file.time} • {file.size}</div>
                          </div>
                       </div>
                       <HiDownload className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ title, desc, icon, color }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-200 border-b-4 hover:border-indigo-600 transition-all group cursor-pointer shadow-sm">
    <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h4 className="text-xl font-black text-slate-900 mb-3">{title}</h4>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default ReportsPage;
