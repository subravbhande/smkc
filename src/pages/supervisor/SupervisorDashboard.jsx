import { useCasesStore, useAuthStore } from '../../store/store';
import { StatCard, DemoDataBanner, StatusBadge, PriorityBadge } from '../../components/ui';
import { fmtDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { DEMO_OFFICERS, CHART_DATA } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  ClipboardList, CheckCircle, Clock, AlertTriangle, Users,
  FileText, BarChart2, ExternalLink, MapPin
} from 'lucide-react';
import MapModule from '../../components/MapModule';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }}><span className="font-bold">{p.value}</span> cases</p>
      ))}
    </div>
  );
}

export default function SupervisorDashboard() {
  const { cases } = useCasesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const recent     = [...cases].sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)).slice(0, 5);
  const overdue    = cases.filter(c => c.status === 'Compliance Pending' || c.status === 'Action Ordered');
  const unassigned = cases.filter(c => !c.assignedOfficer && !['Closed', 'Rejected'].includes(c.status));

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <DemoDataBanner />

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)' }}>
              <BarChart2 size={16} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Supervisor Dashboard</h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">
            {user?.name} · {user?.zone || 'Sangli'} Zone · Municipal Enforcement Unit
          </p>
        </div>
        <button
          onClick={() => navigate('/supervisor/assignments')}
          className="btn btn-primary btn-sm flex items-center gap-2">
          <Users size={13} /> Assignments
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        <StatCard label="Total Active"      value={cases.filter(c => c.status !== 'Closed').length} icon={ClipboardList}  color="#1d4ed8" />
        <StatCard label="Unassigned"        value={unassigned.length}                                icon={AlertTriangle}  color="#dc2626" />
        <StatCard label="Overdue / Pending" value={overdue.length}                                   icon={Clock}          color="#f59e0b" />
        <StatCard label="Officers"          value={DEMO_OFFICERS.length}                             icon={Users}          color="#0d9488" />
      </div>

      {/* ── Unassigned alert ── */}
      {unassigned.length > 0 && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in"
          style={{ background: 'linear-gradient(135deg,#fef2f2,#fce7f3)', border: '1px solid #fecaca' }}>
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={14} color="white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-red-700">
              {unassigned.length} case{unassigned.length > 1 ? 's' : ''} without assigned officer
            </div>
            <div className="text-red-500 text-xs">Assign officers to begin field verification</div>
          </div>
          <button
            onClick={() => navigate('/supervisor/assignments')}
            className="btn btn-sm flex-shrink-0"
            style={{ background: '#dc2626', color: 'white' }}>
            Assign Now
          </button>
        </div>
      )}

      {/* ── Middle Row ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Officer Workload */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4 text-sm font-display flex items-center gap-2">
            <Users size={14} className="text-blue-600" />
            Officer Workload
          </h3>
          <div className="space-y-3">
            {DEMO_OFFICERS.map((o) => {
              const pct = Math.min((o.completed / (o.assigned || 1)) * 100, 100);
              return (
                <div key={o.id} className="p-3 rounded-xl transition-colors hover:bg-slate-50"
                  style={{ border: '1px solid #f1f5f9' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-sm text-slate-800">{o.name}</div>
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full"
                      style={{ background: '#f1f5f9' }}>
                      {o.zone}
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs mb-2">
                    <span className="text-blue-700 font-bold">{o.assigned} assigned</span>
                    <span className="text-amber-600">{o.pending} pending</span>
                    <span className="text-green-600">{o.completed} done</span>
                    {o.overdue > 0 && <span className="text-red-600 font-bold">{o.overdue} overdue</span>}
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 80 ? '#16a34a' : pct >= 50 ? '#0d9488' : '#1d4ed8',
                        '--target-width': `${pct}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Chart */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4 text-sm font-display flex items-center gap-2">
            <BarChart2 size={14} className="text-purple-600" />
            Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={CHART_DATA.byStatus} layout="vertical" barSize={11}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} width={95} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                {CHART_DATA.byStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Unassigned Cases */}
        <div className="card flex flex-col">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="font-bold text-slate-800 text-sm font-display">Unassigned Cases</h3>
            <span className="badge badge-action">{unassigned.length}</span>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto" style={{ maxHeight: 260 }}>
            {unassigned.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-slate-400 text-sm">All cases assigned</div>
              </div>
            ) : unassigned.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="font-mono text-xs font-bold text-blue-600 mb-0.5">{c.id}</div>
                <div className="text-xs font-medium text-slate-700 truncate mb-1">{c.title}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{fmtDate(c.reportedAt)}</span>
                  <PriorityBadge priority={c.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map + Recent Activity ── */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              Jurisdiction Map
            </h3>
            <button
              onClick={() => navigate('/supervisor/map')}
              className="btn btn-outline btn-sm text-xs flex items-center gap-1">
              <ExternalLink size={11} /> Full Map
            </button>
          </div>
          <div style={{ height: 300 }}>
            <MapModule height="300px" showControls={false} />
          </div>
        </div>

        <div className="lg:col-span-2 card flex flex-col">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="font-bold text-slate-800 text-sm font-display">Recent Activity</h3>
          </div>
          <div className="flex-1 divide-y divide-slate-50">
            {recent.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-sm font-medium text-slate-700 truncate mb-1">{c.title}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={9}/>{c.ward}</span>
                  <PriorityBadge priority={c.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
