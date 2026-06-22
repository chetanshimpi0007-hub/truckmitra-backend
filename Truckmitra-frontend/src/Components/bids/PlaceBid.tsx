import React, { useState } from 'react';
import protectedApi from '../../services/protectedApi';
import toast from 'react-hot-toast';

interface PlaceBidProps {
  loadId?: number | null;
  onSuccess?: (data: any) => void;
}

const PlaceBid = ({ loadId, onSuccess }: PlaceBidProps) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return; // prevent duplicate submissions
    if (!loadId) return toast.error('Invalid load');
    if (!amount || Number(amount) <= 0) return toast.error('Amount must be > 0');

    const payload = { loadId, amount: Number(amount), remarks };

    setLoading(true);
    try {
      const res = await protectedApi.post('/api/bids', payload);
      toast.success(res?.data?.message || 'Bid placed');
      if (typeof onSuccess === 'function') onSuccess(res?.data);
    } catch (err: any) {
      const responseData = err?.response?.data;
      const messageStr = typeof responseData === 'string' ? responseData : responseData?.message;
      const msg = messageStr || err?.message || 'Failed to place bid.';
      toast.error(msg);
      console.error('PlaceBid error:', err);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <input aria-label="bid-amount" type="number" value={amount as any} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Amount" />
      <input aria-label="bid-remarks" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Remarks (optional)" />
      <button onClick={submit} disabled={loading || !loadId}>{loading ? 'Placing...' : 'Place Bid'}</button>
    </div>
  );
};

export default PlaceBid;
