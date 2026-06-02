import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { put } from '../../api';
import AdminTopbar from '../../components/dashboard/AdminTopbar';
import toast from 'react-hot-toast';

function SectionCard({ title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {desc && <p className="text-gray-400 text-sm mt-0.5">{desc}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="sm:ml-4 shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-zoo-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function AdminSettingsPage() {
  const { user, login, token } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.location?.city || '',
    district: user?.location?.district || '',
    address: user?.location?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    healthAlerts: true,
    maintenanceAlerts: true,
    darkMode: false,
    compactView: false,
    autoRefresh: true,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await put('/api/users/me', {
        fullName: profile.fullName,
        phone: profile.phone,
        location: { city: profile.city, district: profile.district, address: profile.address },
      });
      if (res.user) {
        login(res.user, token);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zoo-500 bg-white text-gray-800';
  const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar title="Settings" subtitle="Manage your account and preferences" />
      <div className="p-6 space-y-5 max-w-4xl">

        {/* Profile Info */}
        <SectionCard title="Profile Information" desc="Update your personal details">
          <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input name="fullName" value={profile.fullName} onChange={handleProfileChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input name="email" value={profile.email} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input name="phone" value={profile.phone} onChange={handleProfileChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input name="city" value={profile.city} onChange={handleProfileChange} className={inputCls} placeholder="Colombo" />
            </div>
            <div>
              <label className={labelCls}>District</label>
              <input name="district" value={profile.district} onChange={handleProfileChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input name="address" value={profile.address} onChange={handleProfileChange} className={inputCls} />
            </div>

            {/* Admin Info (read-only) */}
            {user?.employeeId && (
              <div>
                <label className={labelCls}>Employee ID</label>
                <input value={user.employeeId} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
              </div>
            )}
            {user?.department && (
              <div>
                <label className={labelCls}>Department</label>
                <input value={user.department} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
              </div>
            )}

            <div className="md:col-span-2 flex justify-end pt-2">
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-zoo-600 hover:bg-zoo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notification Preferences" desc="Choose what alerts you receive">
          <SettingRow label="Email Notifications" desc="Receive system updates via email">
            <Toggle checked={prefs.emailNotifications} onChange={v => setPrefs(p => ({ ...p, emailNotifications: v }))} />
          </SettingRow>
          <SettingRow label="Health Alerts" desc="Get notified when animal health status changes">
            <Toggle checked={prefs.healthAlerts} onChange={v => setPrefs(p => ({ ...p, healthAlerts: v }))} />
          </SettingRow>
          <SettingRow label="Maintenance Alerts" desc="Receive enclosure maintenance reminders">
            <Toggle checked={prefs.maintenanceAlerts} onChange={v => setPrefs(p => ({ ...p, maintenanceAlerts: v }))} />
          </SettingRow>
        </SectionCard>

        {/* Display Preferences */}
        <SectionCard title="Display Preferences" desc="Customize how the dashboard looks">
          <SettingRow label="Compact View" desc="Show more content with reduced spacing">
            <Toggle checked={prefs.compactView} onChange={v => setPrefs(p => ({ ...p, compactView: v }))} />
          </SettingRow>
          <SettingRow label="Auto Refresh" desc="Automatically refresh dashboard data every 60s">
            <Toggle checked={prefs.autoRefresh} onChange={v => setPrefs(p => ({ ...p, autoRefresh: v }))} />
          </SettingRow>
        </SectionCard>

        {/* Account Info */}
        <SectionCard title="Account Information" desc="Your account details and permissions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Account Role</p>
              <p className="font-semibold text-gray-800 flex items-center gap-2">
                🛡️ Admin
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Verification Status</p>
              <p className={`font-semibold flex items-center gap-2 ${user?.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                {user?.isVerified ? '✓ Verified' : '⚠ Not Verified'}
              </p>
            </div>
            {user?.permissions && user.permissions.length > 0 && (
              <div className="md:col-span-2 bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map(p => (
                    <span key={p} className="px-2.5 py-0.5 bg-zoo-100 text-zoo-700 text-xs rounded-full font-medium capitalize">
                      {p.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard title="Danger Zone" desc="Irreversible account actions">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-100 rounded-xl bg-red-50">
            <div>
              <p className="text-sm font-semibold text-red-700">Delete Account</p>
              <p className="text-xs text-red-400 mt-0.5">Permanently delete your account and all associated data.</p>
            </div>
            <button
              onClick={() => toast.error('Contact a super-admin to delete admin accounts.')}
              className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors shrink-0"
            >
              Delete Account
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
