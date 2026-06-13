import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Tag, Button, Space, message } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import protectedApi from '../../services/protectedApi';

const { Content } = Layout;
const { Title, Text } = Typography;

const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await protectedApi.get('/api/billing/invoices');
      if (response.data.success) {
        setInvoices(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoiceNumber: string) => {
    try {
      const response = await protectedApi.get(`/api/billing/invoices/${invoiceNumber}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      message.error('Failed to download invoice');
    }
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => <Text strong><FileTextOutlined /> {text}</Text>
    },
    {
      title: 'Plan',
      dataIndex: 'planName',
      key: 'planName',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `₹${amount.toFixed(2)}`
    },
    {
      title: 'Billing Date',
      dataIndex: 'billingDate',
      key: 'billingDate'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PAID' ? 'green' : 'orange'}>{status}</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          icon={<DownloadOutlined />} 
          onClick={() => handleDownload(record.invoiceNumber)}
        >
          Download PDF
        </Button>
      )
    }
  ];

  return (
    <Content style={{ padding: '24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Title level={2}>Billing & Invoices</Title>
        <Text type="secondary">View and download your subscription invoices.</Text>
        
        <Card style={{ marginTop: 24 }}>
          <Table 
            columns={columns} 
            dataSource={invoices} 
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </Content>
  );
};

export default BillingPage;
