import React, { useState, useEffect } from 'react';
import { Button, Spin, Alert, Descriptions, Tag, Space, Divider } from 'antd';
import { DownloadOutlined, PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { format } from 'date-fns';

interface InvoiceViewerProps {
  invoiceId: number;
  onBack: () => void;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoiceId, onBack }) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoice(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/invoices/download/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center p-10"><Spin size="large" /></div>;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!invoice) return <div>No invoice found.</div>;

  return (
    <div className="bg-white p-6 md:p-10 rounded-lg shadow max-w-4xl mx-auto printable-area">
      <div className="flex justify-between items-center mb-8 no-print">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>Back to List</Button>
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>Download PDF</Button>
        </Space>
      </div>

      {/* Invoice Document Simulation */}
      <div className="border border-gray-200 p-8 rounded">
        <div className="flex justify-between items-start mb-8">
          <div>
            {/* Using a placeholder for logo as specified in prompt if missing, but we'll just text for now or icon */}
            <h1 className="text-3xl font-bold text-blue-600 mb-1">TruckMitra</h1>
            <p className="text-gray-500">Connecting Shippers and Transporters</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider mb-2">Invoice</h2>
            <p className="font-semibold text-gray-600">#{invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-500">Date: {invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'MMM dd, yyyy') : 'N/A'}</p>
            <p className="text-sm text-gray-500">Status: <Tag color="blue">{invoice.status}</Tag></p>
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Bill To (Shipper)</h3>
            <p className="font-medium text-gray-800">{invoice.shipperName || 'N/A'}</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">From (Transporter)</h3>
            <p className="font-medium text-gray-800">{invoice.transporterName || 'N/A'}</p>
          </div>
        </div>

        <Descriptions title="Trip Details" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} className="mb-8">
          <Descriptions.Item label="Trip Number">{invoice.tripNumber || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Driver">{invoice.driverName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Vehicle">{invoice.vehicleNumber || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Pickup">{invoice.source || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Destination">{invoice.destination || 'N/A'}</Descriptions.Item>
        </Descriptions>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300 text-left text-gray-600 font-semibold">
              <th className="py-3">Description</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 text-gray-800">Freight Charges for Trip {invoice.tripNumber}</td>
              <td className="py-4 text-right text-gray-800">₹{invoice.amount || 0}</td>
            </tr>
            <tr className="border-b border-gray-200 bg-gray-50">
              <td className="py-4 text-gray-800 pl-4">GST (18%)</td>
              <td className="py-4 text-right text-gray-800">₹{invoice.gstAmount || 0}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 font-semibold">Total Amount:</span>
              <span className="text-gray-800 font-bold text-lg">₹{invoice.totalAmount || 0}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="text-gray-600">₹{invoice.paidAmount || 0}</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-t border-gray-200">
              <span className="text-gray-600 font-semibold">Balance Due:</span>
              <span className="text-red-600 font-bold">₹{invoice.pendingAmount || 0}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p>TruckMitra Logistics Platform</p>
        </div>
      </div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white; }
          .printable-area { box-shadow: none; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceViewer;
