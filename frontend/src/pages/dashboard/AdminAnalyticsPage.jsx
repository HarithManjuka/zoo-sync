import React, { useEffect, useState } from 'react';
import { get } from '../../api';
import AdminTopbar from '../../components/dashboard/AdminTopbar';

// ── Mini Line Sparkline (SVG) ──────────────────────────────────────────────
function Sparkline({ data, color = '#16a34a', height = 40, width = 120 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(' L ')}`;
  const areaD = `M ${pts[0]} L ${pts.join(' L ')} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#','')})`} />
      <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({ label, value, unit, data, color, change, changeUp, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-gray-400 text-sm">{unit}</span>}
          </div>
          {change !== undefined && (
            <p className={`text-xs font-semibold mt-1 ${changeUp ? 'text-emerald-500' : 'text-red-400'}`}>
              {changeUp ? '↑' : '↓'} {change}% this month
            </p>
          )}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <Sparkline data={data} color={color} />
    </div>
  );
}

function HorizontalBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-24 truncate capitalize">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{value}</span>
    </div>
  );
}

const COLORS = ['#16a34a','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6'];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [encStats, setEncStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, e] = await Promise.all([
          get('/api/animals/stats').catch(() => null),
          get('/api/enclosures/stats').catch(() => null),
        ]);
        if (a?.data) setStats(a.data);
        if (e?.data) setEncStats(e.data);
      } catch { /* silently */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const mockWeek = [12, 19, 14, 22, 18, 25, 20];
  const mockHealth = [3, 5, 2, 7, 4, 6, 5];
  const mockEnc = [8, 10, 9, 11, 12, 10, 13];
  const mockVisitors = [120, 180, 150, 200, 170, 220, 190];

  const speciesList = stats?.bySpecies || [];
  const healthList = stats?.byHealthStatus || [];
  const genderList = stats?.byGender || [];
  const climateList = encStats?.statsByClimate || [];
  const maxSpecies = Math.max(...speciesList.map(s => s.count), 1);
  const maxClimate = Math.max(...climateList.map(s => s.count), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar title="Analytics" subtitle="Overview of zoo metrics and trends" />
      <div className="p-6 space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard label="Total Animals" value={loading ? '…' : stats?.totalAnimals ?? 0} data={mockWeek} color="#16a34a" change={8} changeUp icon="🦁" />
          <MetricCard label="Active Animals" value={loading ? '…' : stats?.activeAnimals ?? 0} data={mockHealth} color="#3b82f6" change={3} changeUp icon="✅" />
          <MetricCard label="Occupancy Rate" value={loading ? '…' : `${encStats?.occupancyRate ?? 0}`} unit="%" data={mockEnc} color="#8b5cf6" change={1} changeUp={false} icon="🏠" />
          <MetricCard label="Est. Visitors" value={loading ? '…' : '—'} data={mockVisitors} color="#f59e0b" change={12} changeUp icon="👥" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Species Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Species Distribution</h3>
            <p className="text-gray-400 text-xs mb-5">Number of animals per species</p>
            {loading ? (
              <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded-lg animate-pulse" />)}</div>
            ) : speciesList.length > 0 ? (
              <div className="space-y-3">
                {speciesList.slice(0, 8).map((s, i) => (
                  <HorizontalBar key={s._id} label={s._id} value={s.count} max={maxSpecies} color={COLORS[i % COLORS.length]} />
                ))}
              </div>
            ) : <p className="text-gray-300 text-sm text-center py-8">No data available</p>}
          </div>

          {/* Health Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Health Status Breakdown</h3>
            <p className="text-gray-400 text-xs mb-5">Current health distribution</p>
            {loading ? (
              <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded-lg animate-pulse" />)}</div>
            ) : healthList.length > 0 ? (
              <div className="space-y-4">
                {healthList.map((h, i) => {
                  const total = healthList.reduce((s, x) => s + x.count, 0);
                  const pct = total > 0 ? Math.round((h.count / total) * 100) : 0;
                  const hColor = { Healthy: '#22c55e', 'Under Treatment': '#f59e0b', Critical: '#ef4444', Recovering: '#3b82f6' }[h._id] || COLORS[i];
                  return (
                    <div key={h._id} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">{h._id}</span>
                        <span className="text-gray-500">{h.count} <span className="text-gray-300">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: hColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-gray-300 text-sm text-center py-8">No health data</p>}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Gender Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Gender Distribution</h3>
            <p className="text-gray-400 text-xs mb-5">Male / Female / Unknown</p>
            {loading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : genderList.length > 0 ? (
              <div className="space-y-3">
                {genderList.map((g, i) => {
                  const total = genderList.reduce((s, x) => s + x.count, 0);
                  const pct = total > 0 ? Math.round((g.count / total) * 100) : 0;
                  const gColor = { Male: '#3b82f6', Female: '#ec4899', Unknown: '#9ca3af' }[g._id] || COLORS[i];
                  return (
                    <div key={g._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: gColor + '15' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: gColor + '25' }}>
                        {g._id === 'Male' ? '♂' : g._id === 'Female' ? '♀' : '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{g._id}</p>
                        <p className="text-xs text-gray-400">{pct}% of total</p>
                      </div>
                      <span className="text-lg font-bold" style={{ color: gColor }}>{g.count}</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-gray-300 text-sm text-center py-8">No data</p>}
          </div>

          {/* Enclosure Climate Types */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Enclosure Climates</h3>
            <p className="text-gray-400 text-xs mb-5">Breakdown by climate type</p>
            {loading ? (
              <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded-lg animate-pulse" />)}</div>
            ) : climateList.length > 0 ? (
              <div className="space-y-3">
                {climateList.map((c, i) => (
                  <HorizontalBar key={c._id} label={c._id} value={c.count} max={maxClimate} color={COLORS[i % COLORS.length]} />
                ))}
              </div>
            ) : <p className="text-gray-300 text-sm text-center py-8">No enclosures yet</p>}
          </div>

          {/* Summary Totals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">Capacity Summary</h3>
            <p className="text-gray-400 text-xs mb-5">Enclosure utilisation overview</p>
            {loading ? (
              <div className="space-y-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Total Capacity', value: encStats?.totalCapacity ?? 0, icon: '📊', color: 'bg-violet-50 text-violet-700' },
                  { label: 'Current Occupancy', value: encStats?.totalOccupancy ?? 0, icon: '🦁', color: 'bg-zoo-50 text-zoo-700' },
                  { label: 'Available Spaces', value: (encStats?.totalCapacity ?? 0) - (encStats?.totalOccupancy ?? 0), icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
                  { label: 'In Maintenance', value: encStats?.maintenanceEnclosures ?? 0, icon: '🔧', color: 'bg-amber-50 text-amber-700' },
                ].map(item => (
                  <div key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${item.color}`}>
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium opacity-70">{item.label}</p>
                    </div>
                    <span className="text-xl font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
