import React, { useEffect, useState } from 'react';
import protectedApi from '../../services/protectedApi';
import toast from 'react-hot-toast';

const BidList = ({ loadId }: any) => {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState<number | null>(null);

  const fetchBids = async () => {
    if (!loadId) return;
    setLoading(true);
    try {
      const res = await protectedApi.get(`/api/bids/load/${loadId}`);
      setBids(res.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load bids');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBids(); }, [loadId]);

  const accept = async (bidId: number) => {
    setAccepting(bidId);
    try {
      await protectedApi.put(`/api/bids/${bidId}/accept`);
      toast.success('Bid accepted');
      fetchBids();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to accept bid');
    } finally { setAccepting(null); }
  };

  if (loading) return <div>Loading bids...</div>;
  if (!bids.length) return <div>No bids yet</div>;

  return (
    <div>
      {bids.map((b: any) => (
        <div key={b.id} style={{ border: '1px solid #ccc', padding: '8px', margin: '8px 0' }}>
          <div>Transporter: {b.transporter?.name || b.transporter?.email}</div>
          <div>Amount: {b.amount}</div>
          <div>Remarks: {b.remarks}</div>
          <div>Status: {b.accepted ? 'Accepted' : 'Open'}</div>
          <div>Created: {new Date(b.createdAt).toLocaleString()}</div>
          <button onClick={() => accept(b.id)} disabled={b.accepted || accepting === b.id}>Accept</button>
        </div>
      ))}
    </div>
  );
};

export default BidList;
