import { useNavigate } from 'react-router-dom';
import { useCasesStore, useAuthStore } from '../../store/store';
import { StatCard, DemoDataBanner, StatusBadge, PriorityBadge, PageHeader } from '../../components/ui';
import { DASHBOARD_STATS, CHART_DATA } from '../../data/mockData';
import { fmtDate } from '../../utils/helpers';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  FileText, AlertTriangle, CheckCircle, Clock, MapPin, Users,
  TrendingUp, Shield, Bell, Eye, Zap, ExternalLink
} from 'lucide-react';
import MapModule from '../../components/MapModule';

/* Custom tooltip */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill || p.color }}>
          <span className="font-bold">{p.value}</span> {p.name}
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { cases } = useCasesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const recent = [...cases]
    .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    .slice(0, 6);

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <DemoDataBanner />

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)' }}>
              <Shield size={16} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">SMKC Command Dashboard</h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">NAGAR-NETRA · AI + GIS Powered Civic Enforcement Platform</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-slate-400">Logged in as</div>
          <div className="font-semibold text-slate-800">{user?.name}</div>
          <div className="text-xs font-medium text-red-500">{user?.role}</div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
        <StatCard label="Total Cases"          value={DASHBOARD_STATS.totalCases}         icon={FileText}      color="#1d4ed8" />
        <StatCard label="New Reports"          value={DASHBOARD_STATS.newReports}         icon={Bell}          color="#ea580c" delta={2} />
        <StatCard label="Under Verification"   value={DASHBOARD_STATS.underVerification}  icon={Eye}           color="#7c3aed" />
        <StatCard label="Verified Violations"  value={DASHBOARD_STATS.verifiedViolations} icon={AlertTriangle} color="#dc2626" />
        <StatCard label="Notices Issued"       value={DASHBOARD_STATS.noticesIssued}      icon={FileText}      color="#9d174d" />
        <StatCard label="Compliance Pending"   value={DASHBOARD_STATS.compliancePending}  icon={Clock}         color="#f59e0b" />
        <StatCard label="Action Pending"       value={DASHBOARD_STATS.actionPending}      icon={Zap}           color="#ea580c" />
        <StatCard label="Resolved / Closed"    value={DASHBOARD_STATS.resolved}           icon={CheckCircle}   color="#16a34a" delta={3} />
        <StatCard label="High Priority"        value={DASHBOARD_STATS.highPriorityCases}  icon={Shield}        color="#dc2626" />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Case Status Donut */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm font-display">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)' }} />
            Case Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={CHART_DATA.byStatus}
                cx="50%" cy="50%"
                innerRadius={52} outerRadius={82}
                dataKey="value"
                paddingAngle={2}>
                {CHART_DATA.byStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {CHART_DATA.byStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="truncate">{s.name}</span>
                <span className="ml-auto font-bold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend — area chart */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm font-display">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            Monthly Case Trend
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={CHART_DATA.monthly}>
              <defs>
                <linearGradient id="casesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1d4ed8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0d9488" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cases"  stroke="#1d4ed8" fill="url(#casesGrad)"  strokeWidth={2} name="New Cases" dot={false} />
              <Area type="monotone" dataKey="closed" stroke="#0d9488" fill="url(#closedGrad)" strokeWidth={2} name="Closed" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* By Zone horizontal bars */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm font-display">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            Cases by Zone
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={CHART_DATA.byZone} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="zone" tick={{ fontSize: 10, fill: '#64748b' }} width={55} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cases"  fill="#7c3aed" radius={[0,4,4,0]} name="Total" />
              <Bar dataKey="closed" fill="#0d9488" radius={[0,4,4,0]} name="Closed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Map + Recent Cases ── */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Map */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              Live GIS Map
            </h3>
            <button
              onClick={() => navigate('/admin/map')}
              className="btn btn-outline btn-sm flex items-center gap-1 text-xs">
              <ExternalLink size={12} />
              Full Map
            </button>
          </div>
          <div style={{ height: 340 }}>
            <MapModule height="340px" showControls={false} />
          </div>
        </div>

        {/* Recent Cases */}
        <div className="lg:col-span-2 card flex flex-col">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="font-bold text-slate-800 text-sm font-display">Recent Cases</h3>
            <button
              onClick={() => navigate('/admin/cases')}
              className="btn btn-outline btn-sm text-xs">
              View All
            </button>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
            {recent.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="px-5 py-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors group">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700">{c.id}</div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-sm font-medium text-slate-700 truncate mb-1">{c.title}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin size={9} />{c.ward}
                  </div>
                  <PriorityBadge priority={c.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Breakdown cards ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* By Type */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-5 text-sm font-display">By Violation Type</h3>
          <div className="space-y-3">
            {CHART_DATA.byType.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 text-xs">{t.name}</span>
                  <span className="font-bold text-xs" style={{ color: t.color }}>{t.value}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(t.value / 20) * 100}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}90)`, '--target-width': `${(t.value / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-5 text-sm font-display">By Priority</h3>
          <div className="space-y-3">
            {CHART_DATA.byPriority.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 text-xs">{t.name}</span>
                  <span className="font-bold text-xs" style={{ color: t.color }}>{t.value}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(t.value / 20) * 100}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}90)`, '--target-width': `${(t.value / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspot Analysis */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-5 text-sm font-display">Zone Hotspot Analysis</h3>
          <div className="space-y-3">
            {[
              { zone: 'Sangli City', cases: 9, pct: 45, color: '#dc2626' },
              { zone: 'Miraj',       cases: 6, pct: 30, color: '#ea580c' },
              { zone: 'Kupwad',      cases: 5, pct: 25, color: '#ca8a04' },
            ].map((h) => (
              <div key={h.zone}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-slate-50"
                style={{ border: '1px solid #f1f5f9' }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: h.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">{h.zone}</span>
                    <span className="font-bold" style={{ color: h.color }}>{h.cases}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${h.pct}%`, background: h.color, '--target-width': `${h.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-400 text-center mt-4">Active cases · Geospatial Surveillance Feed</div>
        </div>
      </div>

    </div>
  );
}
