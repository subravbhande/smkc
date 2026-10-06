import { DemoDataBanner, PageHeader } from '../components/ui';
import { CHART_DATA } from '../data/mockData';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, RadialBarChart, RadialBar
} from 'recharts';
import { TrendingDown, Clock, CheckCircle, AlertCircle, BarChart2 } from 'lucide-react';

const RESOLUTION_DATA = [
  { month: 'Jun', avgDays: 8.2, notices: 5 },
  { month: 'Jul', avgDays: 6.5, notices: 8 },
  { month: 'Aug', avgDays: 5.8, notices: 11 },
  { month: 'Sep', avgDays: 4.9, notices: 14 },
  { month: 'Oct', avgDays: 3.2, notices: 4 },
];

const HIGH_RISK_LOCATIONS = [
  { loc: 'Sangli-Miraj Road',    total: 3, y25: 1, y26: 2, types: 'Hoarding, Adv.',  risk: 'High' },
  { loc: 'Miraj Road, Bus Stand', total: 2, y25: 1, y26: 1, types: 'Hoarding, Encr.', risk: 'Medium' },
  { loc: 'Vishrambag, Sangli',   total: 2, y25: 0, y26: 2, types: 'Hoarding',         risk: 'Medium' },
  { loc: 'Juna Rajwada, Miraj',  total: 2, y25: 1, y26: 1, types: 'Hoarding',         risk: 'High' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.stroke || p.color }}>
          <span className="font-bold">{p.value}</span> <span className="text-slate-500">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

const METRIC_CARDS = [
  { label: 'Avg Resolution Time', value: '5.1 days', color: '#1d4ed8', icon: Clock,        trend: '-38% vs last qtr', trendUp: true },
  { label: 'Compliance Rate',     value: '78%',      color: '#16a34a', icon: CheckCircle,  trend: '+12% vs last qtr', trendUp: true },
  { label: 'Pending Notices',     value: '3',        color: '#dc2626', icon: AlertCircle,  trend: 'Action needed',    trendUp: false },
  { label: 'Repeat Locations',    value: '4',        color: '#f59e0b', icon: BarChart2,    trend: 'Under watch',      trendUp: false },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 animate-fade-in space-y-6">
      <DemoDataBanner />

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)' }}>
              <BarChart2 size={16} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Analytics & Reports</h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">Prototype Analytics · Demo Data Only</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <span className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" />
          Live Demo Data
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {METRIC_CARDS.map(({ label, value, color, icon: Icon, trend, trendUp }) => (
          <div key={label} className="card p-5 group hover-lift" style={{ '--stat-color': color }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}12` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  background: trendUp ? '#dcfce7' : '#fef2f2',
                  color: trendUp ? '#16a34a' : '#dc2626'
                }}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
            </div>
            <div className="text-3xl font-bold font-display mb-1" style={{ color }}>{value}</div>
            <div className="text-xs text-slate-500 font-medium">{label}</div>
            {/* Bottom accent */}
            <div className="mt-3 h-0.5 rounded-full" style={{ background: `${color}20` }}>
              <div className="h-full rounded-full w-0 group-hover:w-full transition-all duration-500" style={{ background: color }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Monthly Trend — Area */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-1 text-sm font-display flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Monthly Case Trend (2026)
          </h3>
          <p className="text-slate-400 text-xs mb-4">New cases reported vs. cases closed</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA.monthly}>
              <defs>
                <linearGradient id="anaBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="anaTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="cases"  stroke="#1d4ed8" fill="url(#anaBlue)"  strokeWidth={2.5} name="New Cases" dot={{ fill: '#1d4ed8', r: 3 }} />
              <Area type="monotone" dataKey="closed" stroke="#0d9488" fill="url(#anaTeal)" strokeWidth={2.5} name="Closed" dot={{ fill: '#0d9488', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Time */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-1 text-sm font-display flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            Resolution & Notices Trend
          </h3>
          <p className="text-slate-400 text-xs mb-4">Avg days to resolve · Notices issued per month</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={RESOLUTION_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="avgDays"  stroke="#1d4ed8" strokeWidth={2.5} dot={{ fill: '#1d4ed8', r: 4, strokeWidth: 0 }} name="Avg Days" />
              <Line type="monotone" dataKey="notices"  stroke="#dc2626" strokeWidth={2.5} dot={{ fill: '#dc2626', r: 4, strokeWidth: 0 }} name="Notices Issued" strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Violation Breakdown */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4 text-sm font-display flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            Violation Type Breakdown
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="45%" height={180}>
              <PieChart>
                <Pie
                  data={CHART_DATA.byType}
                  cx="50%" cy="50%"
                  innerRadius={42} outerRadius={72}
                  dataKey="value"
                  paddingAngle={3}>
                  {CHART_DATA.byType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {CHART_DATA.byType.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.color }} />
                      {t.name}
                    </span>
                    <span className="font-bold" style={{ color: t.color }}>{t.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(t.value / 20) * 100}%`, background: t.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone Chart */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4 text-sm font-display flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            Cases by Zone
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_DATA.byZone} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="cases"  fill="#7c3aed" radius={[5,5,0,0]} name="Total Cases" />
              <Bar dataKey="closed" fill="#0d9488" radius={[5,5,0,0]} name="Closed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── High-Risk Locations Table ── */}
      <div className="card">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display">High-Risk Locations · Repeat Offenders</h3>
            <p className="text-slate-400 text-xs mt-0.5">Locations with 2+ enforcement cases</p>
          </div>
          <span className="badge badge-review">Prototype Analytics</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Total Cases</th>
                <th>2025</th>
                <th>2026</th>
                <th>Violation Types</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {HIGH_RISK_LOCATIONS.map((row) => (
                <tr key={row.loc} className="hover:bg-slate-50 transition-colors">
                  <td className="font-medium text-slate-800">{row.loc}</td>
                  <td>
                    <span className="font-bold text-blue-700 text-base">{row.total}</span>
                  </td>
                  <td className="text-slate-500">{row.y25}</td>
                  <td className="text-slate-500">{row.y26}</td>
                  <td>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{row.types}</span>
                  </td>
                  <td>
                    <span className={`badge ${row.risk === 'High' ? 'badge-action' : 'badge-review'}`}>
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
