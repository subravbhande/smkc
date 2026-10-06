import { useCasesStore, useAuthStore } from '../../store/store';
import { StatCard, DemoDataBanner, StatusBadge, PriorityBadge } from '../../components/ui';
import { fmtDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, Clock, AlertTriangle,
  MapPin, Plus, Activity, ArrowRight, Search
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'New',                label: 'Reported',   color: '#1d4ed8' },
  { key: 'Under Review',       label: 'Reviewing',  color: '#f59e0b' },
  { key: 'Field Verification', label: 'Verifying',  color: '#7c3aed' },
  { key: 'Verified',           label: 'Verified',   color: '#0d9488' },
  { key: 'Notice Issued',      label: 'Notice',     color: '#9d174d' },
  { key: 'Closed',             label: 'Closed',     color: '#16a34a' },
];

export default function CitizenDashboard() {
  const { cases } = useCasesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const myCases = cases
    .filter((c) => c.reportedBy === user?.email || c.reporterName === user?.name)
    .slice(0, 10);

  const stats = {
    total:    myCases.length,
    review:   myCases.filter(c => ['Under Review', 'New'].includes(c.status)).length,
    verified: myCases.filter(c => c.status === 'Verified').length,
    closed:   myCases.filter(c => c.status === 'Closed').length,
    action:   myCases.filter(c => ['Action Ordered', 'Notice Issued', 'Compliance Pending'].includes(c.status)).length,
  };

  // Find most recent active case
  const latestActive = myCases.find(c => c.status !== 'Closed');

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <DemoDataBanner />

      {/* ── Welcome Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0d9488,#16a34a)' }}>
              <span className="text-white text-sm font-bold">{user?.avatar || '👤'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Welcome, {user?.name?.split(' ')[0] || 'Citizen'}!
            </h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">Your complaint reports and status updates</p>
        </div>
        <button
          onClick={() => navigate('/citizen/report-new-auth')}
          className="btn btn-primary flex items-center gap-2">
          <Plus size={15} />
          New Report
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 stagger-children">
        <StatCard label="Total Reports"  value={stats.total}    icon={FileText}      color="#1d4ed8" />
        <StatCard label="Under Review"   value={stats.review}   icon={Clock}         color="#f59e0b" />
        <StatCard label="Verified"       value={stats.verified} icon={CheckCircle}   color="#0d9488" />
        <StatCard label="Action Taken"   value={stats.action}   icon={AlertTriangle} color="#dc2626" />
        <StatCard label="Closed"         value={stats.closed}   icon={CheckCircle}   color="#64748b" />
      </div>

      {/* ── Active Case Tracker ── */}
      {latestActive && (
        <div
          className="card p-5 cursor-pointer hover-lift"
          onClick={() => navigate(`/cases/${latestActive.id}`)}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Latest Active Case</div>
              <div className="font-mono text-sm font-bold text-blue-700">{latestActive.id}</div>
              <div className="font-semibold text-slate-800 mt-0.5">{latestActive.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={latestActive.status} />
              <ArrowRight size={16} className="text-slate-400" />
            </div>
          </div>

          {/* Progress pipeline */}
          <div className="flex items-center gap-1">
            {STATUS_STEPS.map((step, i) => {
              const stepIdx = STATUS_STEPS.findIndex(s => s.key === latestActive.status);
              const isActive = i === stepIdx;
              const isDone = i < stepIdx;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="h-1.5 w-full rounded-full transition-all duration-500"
                    style={{
                      background: isDone ? step.color : isActive ? `${step.color}60` : '#e2e8f0',
                    }} />
                  <span className="text-[9px] text-slate-400 hidden md:block">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Promo card ── */}
      <div
        className="rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden cursor-pointer hover-lift"
        onClick={() => navigate('/citizen/report-new-auth')}
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1d4ed8 100%)' }}>
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="text-4xl relative z-10 animate-float">📱</div>
        <div className="flex-1 relative z-10">
          <div className="font-bold text-white text-lg mb-1">Spot a Violation?</div>
          <div className="text-blue-200 text-sm leading-relaxed">
            Submit photos, GPS location and description — our AI analyzes instantly and logs it for enforcement.
          </div>
        </div>
        <div className="relative z-10 flex-shrink-0">
          <div className="btn flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
            <Plus size={14} />
            Report Now
          </div>
        </div>
      </div>

      {/* ── My Reports list ── */}
      <div className="card">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display">My Reports</h3>
            <p className="text-slate-400 text-xs mt-0.5">Demo: sample reports linked to your account</p>
          </div>
          <button
            onClick={() => navigate('/citizen/reports')}
            className="btn btn-outline btn-sm text-xs flex items-center gap-1">
            View All <ArrowRight size={11} />
          </button>
        </div>

        {myCases.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-6xl mb-4 animate-float">📋</div>
            <h3 className="font-bold text-slate-600 mb-2 font-display">No reports yet</h3>
            <p className="text-slate-400 text-sm mb-5">Submit your first civic violation report</p>
            <button
              onClick={() => navigate('/citizen/report-new-auth')}
              className="btn btn-primary btn-sm">
              <Plus size={13} /> Report a Violation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {myCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors group flex items-center gap-4">

                {/* Type icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                  style={{ background: '#f1f5f9' }}>
                  {c.type === 'Illegal Hoarding' ? '🪧' : c.type === 'Encroachment' ? '🚧' : '📢'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-blue-600">{c.id}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="font-medium text-slate-800 text-sm truncate">{c.title}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={9} />{c.location}
                    <span className="mx-1">·</span>
                    {fmtDate(c.reportedAt)}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <PriorityBadge priority={c.priority} />
                  {c.aiConfidence > 0 && (
                    <span className="text-[10px] text-purple-600 font-bold">🤖 {c.aiConfidence}%</span>
                  )}
                </div>

                <ArrowRight size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/citizen/track')}
          className="card card-hover p-4 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#eff6ff' }}>
            <Search size={17} style={{ color: '#1d4ed8' }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Track Complaint</div>
            <div className="text-xs text-slate-400">Check status by Case ID</div>
          </div>
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="card card-hover p-4 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#f0fdfa' }}>
            <Activity size={17} style={{ color: '#0d9488' }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Notifications</div>
            <div className="text-xs text-slate-400">Updates on your reports</div>
          </div>
        </button>
      </div>
    </div>
  );
}
