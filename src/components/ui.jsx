import { useEffect, useRef, useState } from 'react';
import { STATUS_COLORS, PRIORITY_COLORS, fmtDate } from '../utils/helpers';
import { MapPin, Calendar, User, TrendingUp, TrendingDown } from 'lucide-react';

/* ── Animated counter ── */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return [count, ref];
}

/* ─────────────────────────────────────────────────────── */

export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_COLORS[status] || 'badge-new'}`}>{status}</span>;
}

export function PriorityBadge({ priority }) {
  return <span className={`badge ${PRIORITY_COLORS[priority] || 'badge-low'}`}>{priority}</span>;
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, color = '#1d4ed8', delta, bg }) {
  const numericValue = parseInt(String(value).replace(/\D/g, ''), 10) || 0;
  const [count, ref] = useCountUp(numericValue);
  const displayValue = isNaN(numericValue) || numericValue === 0 ? value : count;

  return (
    <div className="stat-card animate-fade-in group" style={{ '--stat-color': color }}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />

      <div className="flex items-start justify-between" ref={ref}>
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-900 font-display leading-none">{displayValue}</p>
          {delta !== undefined && (
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: delta >= 0 ? '#16a34a' : '#dc2626' }}>
              {delta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(delta)} from last week
            </p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: bg || `${color}15` }}>
          <Icon size={22} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export function CaseCard({ caseItem, onClick }) {
  return (
    <div className="card card-hover p-4 cursor-pointer animate-fade-in" onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs font-mono font-bold text-blue-700">{caseItem.id}</div>
          <div className="font-semibold text-slate-800 text-sm mt-0.5 line-clamp-1">{caseItem.title}</div>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>
      <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
        <MapPin size={11} />
        <span className="truncate">{caseItem.location}</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{caseItem.type}</span>
          <PriorityBadge priority={caseItem.priority} />
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Calendar size={10} />
          <span>{fmtDate(caseItem.reportedAt)}</span>
        </div>
      </div>
      {caseItem.assignedOfficerName && (
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
          <User size={11} />
          <span>{caseItem.assignedOfficerName}</span>
        </div>
      )}
    </div>
  );
}

export function DemoDataBanner() {
  return (
    <div className="mb-5 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium"
      style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a20)', border: '1px solid #f59e0b40', color: '#78350f' }}>
      <span className="text-base flex-shrink-0">⚠️</span>
      <span>All data shown is <strong>DEMO DATA</strong> — fictional records for prototype demonstration only. Not actual SMKC enforcement data.</span>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="text-6xl mb-5 animate-float">{icon || '📋'}</div>
      <h3 className="text-slate-700 font-bold text-lg mb-2 font-display">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin" />
      </div>
    </div>
  );
}

export function AIBadge({ confidence, decision }) {
  const color = decision === 'Potential Violation' ? '#dc2626' : '#ca8a04';
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
      style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}>
      <span>🤖</span>
      <span>{decision}</span>
      <span className="font-bold">{confidence}%</span>
    </div>
  );
}

export function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-fade-in-scale">
        <h3 className="font-bold text-slate-900 text-lg mb-2 font-display">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Section card with accent header ── */
export function SectionCard({ title, action, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <h3 className="font-bold text-slate-900 text-sm font-display">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ── Metric chip ── */
export function MetricChip({ label, value, color = '#1d4ed8' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
      style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
      <span className="font-bold" style={{ color }}>{value}</span>
      <span className="text-slate-500">{label}</span>
    </div>
  );
}
