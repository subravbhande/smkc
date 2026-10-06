import { useCasesStore, useAuthStore } from '../../store/store';
import { StatCard, DemoDataBanner, StatusBadge, PriorityBadge } from '../../components/ui';
import { fmtDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, CheckCircle, Clock, AlertTriangle,
  MapPin, Map, Zap, ArrowRight, ExternalLink
} from 'lucide-react';
import MapModule from '../../components/MapModule';

export default function OfficerDashboard() {
  const { cases } = useCasesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const myCases = cases.filter(
    (c) => c.assignedOfficer === user?.email || c.assignedOfficerName === user?.name
  );

  const stats = {
    assigned:  myCases.length,
    today:     myCases.filter(c => new Date(c.updatedAt).toDateString() === new Date().toDateString()).length,
    pending:   myCases.filter(c => c.status === 'Field Verification').length,
    high:      myCases.filter(c => ['Critical', 'High'].includes(c.priority)).length,
    completed: myCases.filter(c => c.status === 'Closed').length,
    nearby:    cases.filter(c => c.ward === 'Sangli').length,
  };

  const urgentCases = [...myCases]
    .filter(c => ['Critical', 'High'].includes(c.priority))
    .slice(0, 3);

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <DemoDataBanner />

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)' }}>
              <ClipboardList size={16} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Officer Dashboard</h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">
            {user?.name} · {user?.zone || 'Sangli'} Zone
          </p>
        </div>
        <button
          onClick={() => navigate('/officer/cases')}
          className="btn btn-primary btn-sm flex items-center gap-2">
          <ClipboardList size={14} />
          All Cases
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
        <StatCard label="Assigned"      value={stats.assigned}  icon={ClipboardList}  color="#1d4ed8" />
        <StatCard label="Today's Work"  value={stats.today}     icon={Clock}          color="#0d9488" />
        <StatCard label="Pending Verify"value={stats.pending}   icon={AlertTriangle}  color="#f59e0b" />
        <StatCard label="High Priority" value={stats.high}      icon={AlertTriangle}  color="#dc2626" />
        <StatCard label="Completed"     value={stats.completed} icon={CheckCircle}    color="#16a34a" />
        <StatCard label="Nearby Cases"  value={stats.nearby}    icon={MapPin}         color="#7c3aed" />
      </div>

      {/* ── Urgent Alert (if any high-priority) ── */}
      {urgentCases.length > 0 && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in"
          style={{ background: 'linear-gradient(135deg,#fef2f2,#fce7f3)', border: '1px solid #fecaca' }}>
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={15} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-red-700">
              {urgentCases.length} High-Priority Case{urgentCases.length > 1 ? 's' : ''} Need Attention
            </div>
            <div className="text-red-500 text-xs truncate">
              {urgentCases.map(c => c.id).join(' · ')}
            </div>
          </div>
          <button
            onClick={() => navigate('/officer/cases')}
            className="btn btn-sm flex-shrink-0"
            style={{ background: '#dc2626', color: 'white' }}>
            View
          </button>
        </div>
      )}

      {/* ── Cases + Map ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Assigned cases list */}
        <div className="lg:col-span-2 card flex flex-col">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="font-bold text-slate-800 text-sm font-display">Assigned Cases</h3>
            <button
              onClick={() => navigate('/officer/cases')}
              className="btn btn-outline btn-sm text-xs flex items-center gap-1">
              <ExternalLink size={11} /> View All
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto" style={{ maxHeight: 400 }}>
            {myCases.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-slate-400 text-sm font-medium">No cases assigned yet</div>
                <div className="text-slate-300 text-xs mt-1">Check back later</div>
              </div>
            ) : myCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-sm font-medium text-slate-700 truncate mb-1">{c.title}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin size={9} />{c.location}
                  </span>
                  <PriorityBadge priority={c.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              Nearby Cases Map
            </h3>
            <button
              onClick={() => navigate('/officer/map')}
              className="btn btn-outline btn-sm text-xs flex items-center gap-1">
              <Map size={11} /> Full Map
            </button>
          </div>
          <div style={{ height: 370 }}>
            <MapModule height="370px" showControls={false} />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Verify a Case',     icon: CheckCircle,   path: '/officer/verification', color: '#0d9488' },
          { label: 'View on Map',       icon: Map,           path: '/officer/map',          color: '#1d4ed8' },
          { label: 'All My Cases',      icon: ClipboardList, path: '/officer/cases',        color: '#7c3aed' },
          { label: 'Notifications',     icon: Zap,           path: '/notifications',        color: '#f59e0b' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="card card-hover p-4 text-left flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: `${action.color}15` }}>
              <action.icon size={18} style={{ color: action.color }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">{action.label}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <ArrowRight size={10} className="text-slate-300" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
