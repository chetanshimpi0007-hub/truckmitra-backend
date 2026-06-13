import React, { useState, useEffect } from 'react';
import { Layout, message, Card, Form, Input, Button, Upload, ColorPicker, Typography, Divider, Tabs } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import protectedApi from '../../services/protectedApi';

const { Content } = Layout;
const { Title, Text } = Typography;

const EnterpriseSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await protectedApi.get('/api/billing/details');
      if (response.data.success) {
        const details = response.data.data;
        form.setFieldsValue(details);
        setLogoUrl(details.logoUrl);
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await protectedApi.post('/api/billing/details', {
        ...values,
        logoUrl
      });
      if (response.data.success) {
        message.success('Settings updated successfully');
      }
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content style={{ padding: '24px' }}>
      <Card title={<Title level={3}>Enterprise Settings</Title>} style={{ maxWidth: 800, margin: '0 auto' }}>
        <Text type="secondary">Manage your company branding, GST details and white-label configuration.</Text>
        <Divider />
        
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="companyName" label="Company Legal Name" rules={[{ required: true }]}>
            <Input placeholder="Enter company name" />
          </Form.Item>

          <Form.Item name="gstNumber" label="GST Number">
            <Input placeholder="Enter GSTIN" />
          </Form.Item>

          <Form.Item name="companyAddress" label="Registered Address">
            <Input.TextArea placeholder="Enter full address" rows={3} />
          </Form.Item>

          <Form.Item name="invoicePrefix" label="Invoice Number Prefix">
            <Input placeholder="e.g. TM, INV" style={{ width: 200 }} />
          </Form.Item>

          <Divider>Branding</Divider>
          
          <Form.Item label="Company Logo">
            <Upload 
              action="/api/upload" 
              listType="picture"
              maxCount={1}
              onChange={(info) => {
                if (info.file.status === 'done') {
                  setLogoUrl(info.file.response.url);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {logoUrl && <img src={logoUrl} alt="Logo" style={{ marginTop: 10, maxHeight: 50 }} />}
          </Form.Item>

          <Form.Item name="themeColors" label="Theme Color">
            <Input type="color" style={{ width: 100, height: 40, padding: 0, border: 'none' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block size="large">
              Save All Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Content>
  );
};

export default EnterpriseSettings;
