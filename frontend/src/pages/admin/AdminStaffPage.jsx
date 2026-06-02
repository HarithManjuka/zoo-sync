import React, { useEffect, useState, useCallback } from 'react';
import { get, post } from '../../api';
import AdminTopbar from '../../components/dashboard/AdminTopbar';
import toast from 'react-hot-toast';

const ROLE_COLORS = { Admin: 'bg-violet-100 text-violet-700', Zookeeper: 'bg-zoo-100 text-zoo-700', Veterinarian: 'bg-blue-100 text-blue-700', VisitorExperienceManager: 'bg-amber-100 text-amber-700', InventoryManager: 'bg-orange-100 text-orange-700', Visitor: 'bg-gray-100 text-gray-600' };
const ROLE_ICONS = { Admin: '🛡️', Zookeeper: '🌿', Veterinarian: '🩺', VisitorExperienceManager: '🎟️', InventoryManager: '📦', Visitor: '👤' };
const ROLES = ['Admin', 'Zookeeper', 'Veterinarian', 'VisitorExperienceManager', 'InventoryManager', 'Visitor'];

function RoleBadge({ role }) {
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-600'}`}><span>{ROLE_ICONS[role] || '👤'}</span>{role === 'VisitorExperienceManager' ? 'Visitor Exp.' : role === 'InventoryManager' ? 'Inventory Mgr' : role}</span>;
}

function StaffCard({ member }) {
  const initials = member.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      <div className="flex items-start gap-3"><div className="w-11 h-11 rounded-full bg-zoo-500 flex items-center justify-center shrink-0">{member.profileImage?.url ? <img src={member.profileImage.url} alt={member.fullName} className="w-full h-full rounded-full object-cover" /> : <span className="text-white font-bold text-sm">{initials}</span>}</div><div className="flex-1 min-w-0"><p className="font-semibold text-gray-800 truncate">{member.fullName}</p><p className="text-xs text-gray-400 truncate">{member.email}</p></div><RoleBadge role={member.role} /></div>
      <div className="flex items-center gap-2 pt-1"><span className={`flex-1 py-1 text-center text-xs rounded-lg font-medium ${member.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>{member.isVerified ? '✓ Verified' : '○ Unverified'}</span><span className="flex-1 py-1 text-center text-xs rounded-lg font-medium bg-gray-50 text-gray-500">{new Date(member.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span></div>
    </div>
  );
}

function AddStaffModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'Zookeeper', department: 'Operations', specialization: '', position: '' });
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const save = async e => {
    e.preventDefault(); setSaving(true);
    try { await post('/api/auth/register', form); toast.success(`${form.fullName} added as ${form.role}!`); onSaved(); onClose(); }
    catch (err) { toast.error(err.message || 'Failed to add staff member'); } finally { setSaving(false); }
  };
  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-white text-gray-800 placeholder:text-gray-300';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-gray-100 flex items-center justify-between"><h3 className="font-bold text-gray-900 text-lg">Add Staff Member</h3><button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">✕</button></div>
        <form onSubmit={save} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">{ROLES.filter(r => r !== 'Visitor').map(r => <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))} className={`px-2 py-2.5 rounded-xl border text-xs font-medium ${form.role === r ? 'border-zoo-500 bg-zoo-50 text-zoo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}>{r}</button>)}</div>
          <input name="fullName" value={form.fullName} onChange={handle} required className={inputCls} placeholder="Full name" />
          <input name="email" type="email" value={form.email} onChange={handle} required className={inputCls} placeholder="Email" />
          <input name="phone" value={form.phone} onChange={handle} required className={inputCls} placeholder="Phone" />
          <input name="password" type="password" value={form.password} onChange={handle} required minLength={8} className={inputCls} placeholder="Min. 8 characters" />
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">{saving ? 'Adding…' : 'Add Staff Member'}</button></div>
        </form>
      </div>
    </div>
  );
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [view, setView] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try { const res = await get('/api/users').catch(() => null); setStaff(res?.users || res?.data || []); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const filtered = staff.filter(m => (!search || m.fullName?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase())) && (!filterRole || m.role === filterRole));
  const roleGroups = staff.reduce((acc, m) => { const r = m.role || 'Unknown'; acc[r] = (acc[r] || 0) + 1; return acc; }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar title="Staff Management" subtitle={`${staff.length} registered members`} />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">{ROLES.map(role => <button key={role} onClick={() => setFilterRole(filterRole === role ? '' : role)} className={`rounded-2xl px-3 py-3 text-center shadow-sm border ${filterRole === role ? 'border-zoo-500 bg-zoo-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}><p className="text-xl mb-1">{ROLE_ICONS[role]}</p><p className="text-lg font-bold text-gray-900">{loading ? '…' : (roleGroups[role] || 0)}</p><p className="text-[10px] text-gray-400 leading-tight">{role}</p></button>)}</div>
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="flex-1 min-w-0 pl-3 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-gray-50" />
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-zoo-500"><option value="">All Roles</option>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden"><button onClick={() => setView('grid')} className={`px-3 py-2 ${view === 'grid' ? 'bg-zoo-600 text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}>Grid</button><button onClick={() => setView('table')} className={`px-3 py-2 border-l border-gray-200 ${view === 'table' ? 'bg-zoo-600 text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}>Table</button></div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">Add Staff Member</button>
        </div>
        {!loading && <p className="text-sm text-gray-400 px-1">Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{staff.length}</span> members</p>}
        {loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse border border-gray-100" />)}</div>) : filtered.length === 0 ? (<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"><p className="text-sm text-gray-300 mb-4">No staff members found</p><button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold rounded-xl transition-colors">Add First Staff Member</button></div>) : view === 'grid' ? (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(m => <StaffCard key={m._id} member={m} />)}</div>) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100"><th className="px-6 py-3.5 text-left font-semibold">Member</th><th className="px-6 py-3.5 text-left font-semibold">Role</th><th className="px-6 py-3.5 text-left font-semibold">Contact</th><th className="px-6 py-3.5 text-left font-semibold">Joined</th><th className="px-6 py-3.5 text-left font-semibold">Status</th></tr></thead><tbody className="divide-y divide-gray-50">{filtered.map(m => <tr key={m._id} className="hover:bg-gray-50/60 transition-colors"><td className="px-6 py-3"><p className="font-medium text-gray-800">{m.fullName}</p><p className="text-xs text-gray-400">{m.email}</p></td><td className="px-6 py-3"><RoleBadge role={m.role} /></td><td className="px-6 py-3 text-gray-600">{m.phone || '—'}</td><td className="px-6 py-3 text-gray-500 text-xs">{new Date(m.createdAt).toLocaleDateString('en-IN')}</td><td className="px-6 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{m.isVerified ? 'Verified' : 'Pending'}</span></td></tr>)}</tbody></table></div></div>
        )}
      </div>
      {showAddModal && <AddStaffModal onClose={() => setShowAddModal(false)} onSaved={fetchStaff} />}
    </div>
  );
}
