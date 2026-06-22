import React, { useState, useEffect } from 'react';
import { Table, Input, Select, DatePicker, Button, Space, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import axios from 'axios';
import { format } from 'date-fns';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Invoice {
  id: number;
  invoiceNumber: string;
  tripNumber: string;
  shipperName: string;
  transporterName: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  status: string;
  invoiceStatus: string;
  invoiceDate: string;
}

interface InvoiceTableProps {
  onViewInvoice: (id: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ onViewInvoice }) => {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInvoices = async (page = 1, pageSize = 10, search = '', status = '') => {
    setLoading(true);
    try {
      // In a real scenario we would pass search & status to the API
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: page - 1, size: pageSize }
      });
      setData(response.data.content);
      setPagination({ ...pagination, current: page, total: response.data.totalElements });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(pagination.current, pagination.pageSize, searchText, statusFilter);
  }, []);

  const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
    fetchInvoices(newPagination.current, newPagination.pageSize, searchText, statusFilter);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchInvoices(1, pagination.pageSize, value, statusFilter);
  };

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      sorter: (a: Invoice, b: Invoice) => a.invoiceNumber.localeCompare(b.invoiceNumber),
    },
    {
      title: 'Trip #',
      dataIndex: 'tripNumber',
      key: 'tripNumber',
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A',
      sorter: (a: Invoice, b: Invoice) => new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime(),
    },
    {
      title: 'Shipper',
      dataIndex: 'shipperName',
      key: 'shipperName',
    },
    {
      title: 'Transporter',
      dataIndex: 'transporterName',
      key: 'transporterName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `₹${val || 0}`,
    },
    {
      title: 'GST',
      dataIndex: 'gstAmount',
      key: 'gstAmount',
      render: (val: number) => `₹${val || 0}`,
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => `₹${val || 0}`,
      sorter: (a: Invoice, b: Invoice) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Payment',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PAID' ? 'green' : status === 'OVERDUE' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'invoiceStatus',
      key: 'invoiceStatus',
      render: (status: string) => (
        <Tag color={status === 'GENERATED' ? 'blue' : 'default'}>
          {status || 'DRAFT'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Invoice) => (
        <Button type="link" onClick={() => onViewInvoice(record.id)}>View</Button>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <Space>
          <Input.Search 
            placeholder="Search invoice or trip..." 
            onSearch={handleSearch} 
            allowClear
            style={{ width: 250 }}
          />
          <Select 
            placeholder="Filter Status" 
            style={{ width: 150 }} 
            allowClear
            onChange={(val) => {
              setStatusFilter(val);
              fetchInvoices(1, pagination.pageSize, searchText, val);
            }}
          >
            <Option value="DRAFT">Draft</Option>
            <Option value="GENERATED">Generated</Option>
            <Option value="SENT">Sent</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </Space>
        <Button type="primary">Generate New</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default InvoiceTable;
