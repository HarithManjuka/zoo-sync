import React, { useEffect, useState, useCallback } from 'react';
import { get, del, post, put } from '../../api';
import AdminTopbar from '../../components/dashboard/AdminTopbar';
import toast from 'react-hot-toast';

function Badge({ status }) {
  const map = { available: 'bg-emerald-100 text-emerald-700', maintenance: 'bg-amber-100 text-amber-700', full: 'bg-red-100 text-red-700', closed: 'bg-gray-100 text-gray-500' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

function OccupancyBar({ current, capacity }) {
  const pct = capacity > 0 ? Math.min((current / capacity) * 100, 100) : 0;
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} /></div>
      <span className="text-xs text-gray-500 shrink-0">{current}/{capacity}</span>
    </div>
  );
}

function EnclosureModal({ enclosure, onClose, onSaved }) {
  const isEdit = !!enclosure;
  const [form, setForm] = useState({
    name: enclosure?.name || '', type: enclosure?.type || 'Indoor', climateType: enclosure?.climateType || 'Tropical',
    capacity: enclosure?.capacity || '', status: enclosure?.status || 'available', 'location.block': enclosure?.location?.block || '',
    'location.zone': enclosure?.location?.zone || '', visitorAccessible: enclosure?.visitorAccessible ?? true, notes: enclosure?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const handle = (e) => { const { name, value, type, checked } = e.target; setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value })); };
  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { name: form.name, type: form.type, climateType: form.climateType, capacity: Number(form.capacity), status: form.status, location: { block: form['location.block'], zone: form['location.zone'] }, visitorAccessible: form.visitorAccessible, notes: form.notes };
    try { if (isEdit) { await put(`/api/enclosures/${enclosure._id}`, payload); toast.success('Enclosure updated!'); } else { await post('/api/enclosures', payload); toast.success('Enclosure created!'); } onSaved(); onClose(); }
    catch (err) { toast.error(err.message || 'Failed to save enclosure'); } finally { setSaving(false); }
  };
  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-white text-gray-800';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between"><h3 className="font-bold text-gray-900 text-lg">{isEdit ? 'Edit Enclosure' : 'New Enclosure'}</h3><button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">✕</button></div>
        <form onSubmit={save} className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className={labelCls}>Enclosure Name *</label><input name="name" value={form.name} onChange={handle} required className={inputCls} /></div>
          <div><label className={labelCls}>Type</label><select name="type" value={form.type} onChange={handle} className={inputCls}>{['Indoor', 'Outdoor', 'Semi-Outdoor', 'Aquatic'].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className={labelCls}>Climate Type</label><select name="climateType" value={form.climateType} onChange={handle} className={inputCls}>{['Tropical', 'Arid', 'Temperate', 'Arctic', 'Aquatic', 'Savanna'].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className={labelCls}>Capacity *</label><input name="capacity" type="number" value={form.capacity} onChange={handle} required className={inputCls} min="1" /></div>
          <div><label className={labelCls}>Status</label><select name="status" value={form.status} onChange={handle} className={inputCls}>{['available', 'maintenance', 'full', 'closed'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className={labelCls}>Block</label><input name="location.block" value={form['location.block']} onChange={handle} className={inputCls} /></div>
          <div><label className={labelCls}>Zone</label><input name="location.zone" value={form['location.zone']} onChange={handle} className={inputCls} /></div>
          <div className="col-span-2"><label className={labelCls}>Notes</label><textarea name="notes" value={form.notes} onChange={handle} className={`${inputCls} resize-none`} rows={2} /></div>
          <div className="col-span-2 flex items-center gap-2"><input type="checkbox" id="visitorAccess" name="visitorAccessible" checked={form.visitorAccessible} onChange={handle} className="w-4 h-4 accent-zoo-600 rounded" /><label htmlFor="visitorAccess" className="text-sm text-gray-600 select-none">Visitor Accessible</label></div>
          <div className="col-span-2 flex gap-3 pt-1"><button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">{saving ? 'Saving…' : isEdit ? 'Update' : 'Create Enclosure'}</button></div>
        </form>
      </div>
    </div>
  );
}

export default function AdminEnclosuresPage() {
  const [enclosures, setEnclosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClimate, setFilterClimate] = useState('');
  const [modal, setModal] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      if (filterClimate) params.set('climateType', filterClimate);
      const [res, statsRes] = await Promise.all([get(`/api/enclosures?${params}`), get('/api/enclosures/stats').catch(() => null)]);
      setEnclosures(res.data || []);
      if (statsRes?.data) setStats(statsRes.data);
    } finally { setLoading(false); }
  }, [search, filterStatus, filterClimate]);

  useEffect(() => { fetchData(); }, [fetchData]);
  const handleDelete = async (id, name) => { if (!window.confirm(`Delete enclosure "${name}"? Animals must be transferred first.`)) return; try { await del(`/api/enclosures/${id}`); toast.success(`${name} deleted`); fetchData(); } catch (err) { toast.error(err.message); } };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar title="Enclosures" subtitle={`${enclosures.length} enclosures`} />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ label: 'Total', value: stats?.totalEnclosures, color: 'text-gray-800', bg: 'bg-white' }, { label: 'Available', value: stats?.availableEnclosures, color: 'text-emerald-700', bg: 'bg-emerald-50' }, { label: 'Maintenance', value: stats?.maintenanceEnclosures, color: 'text-amber-700', bg: 'bg-amber-50' }, { label: 'Occupancy', value: stats ? `${stats.occupancyRate}%` : null, color: 'text-violet-700', bg: 'bg-violet-50' }].map(s => <div key={s.label} className={`${s.bg} rounded-2xl px-5 py-4 shadow-sm border border-gray-100`}><p className="text-gray-400 text-xs font-medium">{s.label}</p><p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? '—' : (s.value ?? '—')}</p></div>)}
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search enclosures…" className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-gray-50" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-zoo-500"><option value="">All Status</option>{['available', 'maintenance', 'full', 'closed'].map(s => <option key={s}>{s}</option>)}</select>
          <select value={filterClimate} onChange={e => setFilterClimate(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-zoo-500"><option value="">All Climates</option>{['Tropical', 'Arid', 'Temperate', 'Arctic', 'Aquatic', 'Savanna'].map(c => <option key={c}>{c}</option>)}</select>
          <button onClick={() => setModal('new')} className="flex items-center gap-2 px-4 py-2 bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">New Enclosure</button>
        </div>
        {loading ? (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />)}</div>) : enclosures.length === 0 ? (<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-300"><p className="text-sm">No enclosures found</p></div>) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {enclosures.map(enc => <div key={enc._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3"><div className="flex items-start justify-between gap-2"><div><p className="font-semibold text-gray-800 text-base">{enc.name}</p><p className="text-gray-400 text-xs mt-0.5">{enc.enclosureId}</p></div><Badge status={enc.status} /></div><div><div className="flex justify-between text-xs text-gray-400 mb-1"><span>Occupancy</span><span className="font-medium text-gray-600">{enc.currentOccupancy}/{enc.capacity}</span></div><OccupancyBar current={enc.currentOccupancy} capacity={enc.capacity} /></div><div className="flex gap-2 pt-1"><button onClick={() => setModal(enc)} className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Edit</button><button onClick={() => handleDelete(enc._id, enc.name)} className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">Delete</button></div></div>)}
          </div>
        )}
      </div>
      {modal && <EnclosureModal enclosure={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={fetchData} />}
    </div>
  );
}
