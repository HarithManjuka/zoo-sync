import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../api';
import AdminTopbar from '../../components/dashboard/AdminTopbar';

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color, trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
          {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className={`inline-flex items-center gap-0.5 font-semibold ${trendUp ? 'text-emerald-500' : 'text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}%
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

// ─── Mini Bar Chart ──────────────────────────────────────────────────────────
function MiniBarChart({ data, color = '#16a34a' }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{ height: `${max > 0 ? (d.value / max) * 100 : 0}%`, backgroundColor: color, opacity: 0.7 + (i / data.length) * 0.3 }}
          />
          <span className="text-[10px] text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  const r = 40, cx = 60, cy = 60, circ = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 120 120" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="18" />
        {segments.map((seg, i) => {
          const pct = total > 0 ? (seg.value / total) : 0;
          const dash = pct * circ;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ / 1}
              style={{ transform: `rotate(${offset * 360 - 90}deg)`, transformOrigin: '60px 60px' }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x={cx} y={cy + 5} textAnchor="middle" className="text-base font-bold" fill="#111827" fontSize="16" fontWeight="700">
          {total}
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-600">{seg.label}</span>
            <span className="ml-auto font-semibold text-gray-800">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
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
    available: 'bg-emerald-100 text-emerald-700',
    maintenance: 'bg-amber-100 text-amber-700',
    full: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />;
}

// ─── Recent Activity Row ──────────────────────────────────────────────────────
function ActivityItem({ icon, title, subtitle, time, color }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-gray-400 shrink-0">{time}</span>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enclosureStats, setEnclosureStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [recentAnimals, setRecentAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [animalRes, enclosureRes, animalsRes, usersRes] = await Promise.all([
          get('/api/animals/stats').catch(() => null),
          get('/api/enclosures/stats').catch(() => null),
          get('/api/animals?limit=5').catch(() => null),
          get('/api/users/stats').catch(() => null),
        ]);
        if (animalRes?.data) setStats(animalRes.data);
        if (enclosureRes?.data) setEnclosureStats(enclosureRes.data);
        if (Array.isArray(animalsRes?.data)) setRecentAnimals(animalsRes.data);
        if (usersRes) setUserStats(usersRes);
      } catch {/* silently fail */}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const healthSegments = stats ? [
    { label: 'Healthy', value: stats.byHealthStatus?.find(h => h._id === 'Healthy')?.count || 0, color: '#22c55e' },
    { label: 'Recovering', value: stats.byHealthStatus?.find(h => h._id === 'Recovering')?.count || 0, color: '#3b82f6' },
    { label: 'Under Treatment', value: stats.byHealthStatus?.find(h => h._id === 'Under Treatment')?.count || 0, color: '#f59e0b' },
    { label: 'Critical', value: stats.byHealthStatus?.find(h => h._id === 'Critical')?.count || 0, color: '#ef4444' },
  ].filter(s => s.value > 0) : [];

  const speciesBarData = stats?.bySpecies?.slice(0, 6).map(s => ({
    label: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count,
  })) || [];

  const weekActivity = [
    { label: 'Mon', value: 4 }, { label: 'Tue', value: 7 },
    { label: 'Wed', value: 3 }, { label: 'Thu', value: 9 },
    { label: 'Fri', value: 6 }, { label: 'Sat', value: 2 },
    { label: 'Sun', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-zoo-950 to-zoo-900 rounded-2xl p-6 shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zoo-400 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-zoo-600 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          </div>
          <div className="relative">
            <p className="text-zoo-300 text-sm font-medium">{greeting},</p>
            <h1 className="text-white text-2xl font-bold mt-1">{user?.fullName || 'Admin'} 👋</h1>
            <p className="text-gray-400 text-sm mt-1">
              Here's what's happening at ZooSync today —{' '}
              {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-sm font-medium">System Online</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-gray-300 text-sm">Last sync: just now</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36" />)
          ) : (
            <>
              <StatCard
                label="Total Animals"
                value={stats?.totalAnimals ?? 0}
                sub={`${stats?.activeAnimals ?? 0} active`}
                icon={<PawSVG />}
                color="bg-zoo-50 text-zoo-600"
                trend={8}
                trendUp={true}
              />
              <StatCard
                label="Enclosures"
                value={enclosureStats?.totalEnclosures ?? 0}
                sub={`${enclosureStats?.availableEnclosures ?? 0} available`}
                icon={<HouseSVG />}
                color="bg-blue-50 text-blue-600"
                trend={2}
                trendUp={true}
              />
              <StatCard
                label="Occupancy Rate"
                value={`${enclosureStats?.occupancyRate ?? 0}%`}
                sub={`${enclosureStats?.totalOccupancy ?? 0} / ${enclosureStats?.totalCapacity ?? 0} slots`}
                icon={<CapacitySVG />}
                color="bg-violet-50 text-violet-600"
              />
              <StatCard
                label="Created Users"
                value={userStats?.createdThisMonth ?? 0}
                sub={`${userStats?.createdToday ?? 0} created today`}
                icon={<UsersSVG />}
                color="bg-rose-50 text-rose-600"
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Species Distribution */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-800">Species Distribution</h3>
                <p className="text-gray-400 text-xs mt-0.5">Top species by animal count</p>
              </div>
            </div>
            {loading ? <Skeleton className="h-24" /> : (
              speciesBarData.length > 0
                ? <MiniBarChart data={speciesBarData} color="#16a34a" />
                : <EmptyState label="No species data yet" />
            )}
          </div>

          {/* Health Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Health Overview</h3>
            <p className="text-gray-400 text-xs mb-5">Animals by health status</p>
            {loading ? <Skeleton className="h-28" /> : (
              healthSegments.length > 0
                ? <DonutChart segments={healthSegments} />
                : <EmptyState label="No health data yet" />
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Animals */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Animals</h3>
              <a href="/admin/animals" className="text-zoo-600 text-sm font-medium hover:underline">View all →</a>
            </div>
            {loading ? (
              <div className="p-4 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : recentAnimals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                      <th className="px-6 py-3 text-left font-medium">Animal</th>
                      <th className="px-6 py-3 text-left font-medium">Species</th>
                      <th className="px-6 py-3 text-left font-medium">Status</th>
                      <th className="px-6 py-3 text-left font-medium">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentAnimals.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-zoo-100 flex items-center justify-center text-zoo-600 font-semibold text-xs shrink-0">
                              {a.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{a.name}</p>
                              {a.nickname && <p className="text-gray-400 text-xs">"{a.nickname}"</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-gray-600 capitalize">{a.species}</td>
                        <td className="px-6 py-3"><Badge status={a.status} /></td>
                        <td className="px-6 py-3"><Badge status={a.healthStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8"><EmptyState label="No animals added yet" /></div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Weekly Activity</h3>
            <p className="text-gray-400 text-xs mb-4">Operations this week</p>
            <MiniBarChart data={weekActivity} color="#8b5cf6" />
            <div className="mt-5 space-y-1">
              <ActivityItem
                icon={<span className="text-xs">🦁</span>}
                title="New animal registered"
                subtitle="Lion cub added to Savanna"
                time="2h ago"
                color="bg-zoo-50"
              />
              <ActivityItem
                icon={<span className="text-xs">🏥</span>}
                title="Health check completed"
                subtitle="3 animals examined"
                time="5h ago"
                color="bg-blue-50"
              />
              <ActivityItem
                icon={<span className="text-xs">🔧</span>}
                title="Enclosure maintenance"
                subtitle="Tropical Dome inspected"
                time="1d ago"
                color="bg-amber-50"
              />
              <ActivityItem
                icon={<span className="text-xs">🔀</span>}
                title="Animal transferred"
                subtitle="Moved to new enclosure"
                time="2d ago"
                color="bg-violet-50"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Species Count', value: stats?.bySpecies?.length ?? 0, emoji: '🌿' },
            { label: 'Maintenance', value: enclosureStats?.maintenanceEnclosures ?? 0, emoji: '🔧' },
            { label: 'Critical Cases', value: stats?.byHealthStatus?.find(h => h._id === 'Critical')?.count ?? 0, emoji: '🚨' },
            { label: 'Full Enclosures', value: enclosureStats?.fullEnclosures ?? 0, emoji: '📦' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="text-xl font-bold text-gray-900">{loading ? '…' : item.value}</p>
                <p className="text-gray-400 text-xs">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-300">
      <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function PawSVG() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><ellipse cx="6" cy="7.5" rx="2" ry="3" opacity=".8"/><ellipse cx="18" cy="7.5" rx="2" ry="3" opacity=".8"/><ellipse cx="9.5" cy="5" rx="1.5" ry="2.5" opacity=".8"/><ellipse cx="14.5" cy="5" rx="1.5" ry="2.5" opacity=".8"/><path d="M12 10c-3.5 0-6 2-6 5 0 2.5 1.5 4 3 4 .8 0 1.5-.3 2.1-.7.5-.3 1.2-.3 1.8 0 .6.4 1.3.7 2.1.7 1.5 0 3-1.5 3-4 0-3-2.5-5-6-5z"/></svg>;
}
function HouseSVG() {
  return <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function CapacitySVG() {
  return <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
}
function UsersSVG() {
  return <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
}
