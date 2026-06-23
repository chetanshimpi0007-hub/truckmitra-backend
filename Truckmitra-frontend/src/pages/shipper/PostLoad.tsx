import React, { useState } from 'react';
import protectedApi from '../../services/protectedApi';
import toast from 'react-hot-toast';

const PostLoad = ({ refreshLoads }: any) => {
  const [refNo, setRefNo] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [pickupDate, setPickupDate] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    // client validation
    if (!refNo || !refNo.trim()) return toast.error('Ref no is required');
    if (!weight || Number(weight) <= 0) return toast.error('Weight must be > 0');
    if (!pickupDate) return toast.error('Pickup date is required');

    const payload = { refNo: String(refNo).trim(), weight: Number(weight), pickupDate };
    setLoading(true);
    try {
      const res = await protectedApi.post('/loads', payload);
      const msg = res?.data?.message || 'Load posted';
      toast.success(msg);
      // clear form
      setRefNo(''); setWeight(''); setPickupDate('');
      // refresh list if provided
      if (typeof refreshLoads === 'function') refreshLoads();
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.response?.data?.message || (err.message || 'Failed to post load');
      toast.error(message);
      console.error('PostLoad error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input value={refNo} onChange={e => setRefNo(e.target.value)} placeholder="Ref No" />
      <input value={weight as any} onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Weight" type="number" />
      <input type="datetime-local" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
      <button onClick={submit} disabled={loading}>{loading ? 'Posting...' : 'Post Load'}</button>
    </div>
  );
};

export default PostLoad;