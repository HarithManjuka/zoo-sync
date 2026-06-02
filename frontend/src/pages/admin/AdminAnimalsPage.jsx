import React, { useEffect, useState, useCallback } from 'react';
import { get, del, post, put } from '../../api';
import AdminTopbar from '../../components/dashboard/AdminTopbar';
import toast from 'react-hot-toast';

function Badge({ status }) {
  const map = {
    Active: 'bg-emerald-100 text-emerald-700',
    Healthy: 'bg-emerald-100 text-emerald-700',
    'Under Treatment': 'bg-amber-100 text-amber-700',
    Critical: 'bg-red-100 text-red-700',
    Recovering: 'bg-blue-100 text-blue-700',
    Quarantine: 'bg-orange-100 text-orange-700',
    Deceased: 'bg-gray-100 text-gray-500',
    Transferred: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function Skeleton() {
  return (
    <tr>
      {Array(6).fill(0).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function AnimalModal({ animal, enclosures, onClose, onSaved }) {
  const isEdit = !!animal;
  const [form, setForm] = useState({
    name: animal?.name || '',
    nickname: animal?.nickname || '',
    species: animal?.species || '',
    scientificName: animal?.scientificName || '',
    age: animal?.age || '',
    weight: animal?.weight || '',
    gender: animal?.gender || 'Male',
    origin: animal?.origin || '',
    birthPlace: animal?.birthPlace || 'Captive Bred',
    enclosure: animal?.enclosure?._id || animal?.enclosure || '',
    status: animal?.status || 'Active',
    healthStatus: animal?.healthStatus || 'Healthy',
    dietType: animal?.dietType || 'Omnivore',
    diet: animal?.diet || '',
    notes: animal?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await put(`/api/animals/${animal._id}`, form);
        toast.success('Animal updated!');
      } else {
        await post('/api/animals', form);
        toast.success('Animal added!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save animal');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 focus:border-transparent bg-white text-gray-800 placeholder:text-gray-300';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-bold text-gray-900 text-lg">{isEdit ? 'Edit Animal' : 'Add New Animal'}</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={save} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelCls}>Name *</label><input name="name" value={form.name} onChange={handle} required className={inputCls} placeholder="e.g. Simba" /></div>
          <div><label className={labelCls}>Nickname</label><input name="nickname" value={form.nickname} onChange={handle} className={inputCls} placeholder="Optional nickname" /></div>
          <div><label className={labelCls}>Species *</label><input name="species" value={form.species} onChange={handle} required className={inputCls} placeholder="e.g. lion" /></div>
          <div><label className={labelCls}>Scientific Name</label><input name="scientificName" value={form.scientificName} onChange={handle} className={inputCls} placeholder="e.g. Panthera leo" /></div>
          <div><label className={labelCls}>Age (years) *</label><input name="age" type="number" value={form.age} onChange={handle} required className={inputCls} placeholder="3" min="0" /></div>
          <div><label className={labelCls}>Weight (kg) *</label><input name="weight" type="number" value={form.weight} onChange={handle} required className={inputCls} placeholder="190" min="0" /></div>
          <div><label className={labelCls}>Gender *</label><select name="gender" value={form.gender} onChange={handle} className={inputCls}><option>Male</option><option>Female</option><option>Unknown</option></select></div>
          <div>
            <label className={labelCls}>Enclosure *</label>
            <select name="enclosure" value={form.enclosure} onChange={handle} required className={inputCls}>
              <option value="">-- Select enclosure --</option>
              {enclosures.map(e => <option key={e._id} value={e._id}>{e.name} ({e.enclosureId})</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Status</label><select name="status" value={form.status} onChange={handle} className={inputCls}>{['Active', 'Quarantine', 'Treatment', 'Deceased', 'Transferred'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className={labelCls}>Health Status</label><select name="healthStatus" value={form.healthStatus} onChange={handle} className={inputCls}>{['Healthy', 'Under Treatment', 'Critical', 'Recovering'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className={labelCls}>Birth Place</label><select name="birthPlace" value={form.birthPlace} onChange={handle} className={inputCls}>{['Wild', 'Captive Bred', 'Other Zoo', 'Rescue'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label className={labelCls}>Diet Type</label><select name="dietType" value={form.dietType} onChange={handle} className={inputCls}>{['Carnivore', 'Herbivore', 'Omnivore', 'Insectivore', 'Piscivore'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="md:col-span-2"><label className={labelCls}>Origin</label><input name="origin" value={form.origin} onChange={handle} className={inputCls} placeholder="Country or region of origin" /></div>
          <div className="md:col-span-2"><label className={labelCls}>Diet Description</label><textarea name="diet" value={form.diet} onChange={handle} className={`${inputCls} resize-none`} rows={2} placeholder="Describe feeding habits..." /></div>
          <div className="md:col-span-2"><label className={labelCls}>Notes</label><textarea name="notes" value={form.notes} onChange={handle} className={`${inputCls} resize-none`} rows={2} placeholder="Additional notes..." /></div>
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">{saving ? 'Saving…' : isEdit ? 'Update Animal' : 'Add Animal'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [enclosures, setEnclosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterHealth, setFilterHealth] = useState('');
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      if (filterHealth) params.set('healthStatus', filterHealth);
      const [animalsRes, encRes] = await Promise.all([get(`/api/animals?${params}`), get('/api/enclosures')]);
      setAnimals(animalsRes.data || []);
      setTotalPages(animalsRes.pages || 1);
      setTotal(animalsRes.total || 0);
      setEnclosures(encRes.data || []);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterHealth, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Archive animal "${name}"?`)) return;
    try {
      await del(`/api/animals/${id}`);
      toast.success(`${name} archived`);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar title="Animals" subtitle={`${total} total animals`} />
      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <div className="flex-1 min-w-0 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search animals by name, species…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-gray-50" />
          </div>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-white text-gray-600">
            <option value="">All Status</option>{['Active', 'Quarantine', 'Treatment', 'Deceased', 'Transferred'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterHealth} onChange={e => { setFilterHealth(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-white text-gray-600">
            <option value="">All Health</option>{['Healthy', 'Under Treatment', 'Critical', 'Recovering'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2 bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">Add Animal</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100"><th className="px-6 py-3.5 text-left font-semibold">Animal</th><th className="px-6 py-3.5 text-left font-semibold">Species</th><th className="px-6 py-3.5 text-left font-semibold">Enclosure</th><th className="px-6 py-3.5 text-left font-semibold">Status</th><th className="px-6 py-3.5 text-left font-semibold">Health</th><th className="px-6 py-3.5 text-left font-semibold">Age / Weight</th><th className="px-6 py-3.5 text-right font-semibold">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? Array(6).fill(0).map((_, i) => <Skeleton key={i} />) : animals.length === 0 ? (<tr><td colSpan={7} className="px-6 py-16 text-center text-gray-300"><p className="text-sm">No animals found</p></td></tr>) : animals.map(a => (
                  <tr key={a._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4"><p className="font-semibold text-gray-800">{a.name}</p></td>
                    <td className="px-6 py-4 capitalize text-gray-600">{a.species}</td>
                    <td className="px-6 py-4">{a.enclosure?.name || a.enclosure?.enclosureId || '—'}</td>
                    <td className="px-6 py-4"><Badge status={a.status} /></td>
                    <td className="px-6 py-4"><Badge status={a.healthStatus} /></td>
                    <td className="px-6 py-4 text-gray-600">{a.age}y · {a.weight}kg</td>
                    <td className="px-6 py-4"><div className="flex items-center justify-end gap-2"><button onClick={() => setModal(a)} className="p-1.5 text-gray-400 hover:text-zoo-600 hover:bg-zoo-50 rounded-lg transition-colors" title="Edit">Edit</button><button onClick={() => handleDelete(a._id, a.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Archive">Archive</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-50">
              <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
              <div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button><button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button></div>
            </div>
          )}
        </div>
      </div>
      {modal && <AnimalModal animal={modal === 'add' ? null : modal} enclosures={enclosures} onClose={() => setModal(null)} onSaved={fetchData} />}
    </div>
  );
}
