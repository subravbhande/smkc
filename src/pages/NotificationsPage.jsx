import { useNotifStore } from '../store/store';
import { fmtDateTime } from '../utils/helpers';
import { Bell, CheckCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NOTIF_CONFIG = {
  assignment: { icon: '👤', color: '#1d4ed8', bg: '#eff6ff' },
  deadline:   { icon: '⏰', color: '#dc2626', bg: '#fef2f2' },
  status:     { icon: '🔄', color: '#7c3aed', bg: '#faf5ff' },
  report:     { icon: '📋', color: '#0d9488', bg: '#f0fdfa' },
  closed:     { icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
  notice:     { icon: '📄', color: '#9d174d', bg: '#fdf2f8' },
};

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useNotifStore();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              <Bell size={15} color="white" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold"
                  style={{ border: '2px solid white' }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Notifications</h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">
            {unread > 0
              ? <><span className="font-semibold text-blue-600">{unread} unread</span> notification{unread > 1 ? 's' : ''}</>
              : 'All caught up ✓'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="btn btn-outline btn-sm flex items-center gap-1.5">
            <CheckCheck size={13} /> Mark All Read
          </button>
        )}
      </div>

      {/* ── Unread section ── */}
      {unread > 0 && (
        <div className="mb-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1 mb-2">
            Unread
          </div>
          <div className="space-y-2">
            {notifications.filter(n => !n.read).map((n, idx) => {
              const cfg = NOTIF_CONFIG[n.type] || { icon: '🔔', color: '#1d4ed8', bg: '#eff6ff' };
              return (
                <div
                  key={n.id}
                  onClick={() => { markRead(n.id); navigate(`/cases/${n.caseId}`); }}
                  className="card cursor-pointer group animate-slide-up"
                  style={{
                    borderLeft: `3px solid ${cfg.color}`,
                    animationDelay: `${idx * 0.05}s`,
                    background: `${cfg.bg}80`,
                  }}>
                  <div className="p-4 flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background: cfg.bg }}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 mb-1 leading-snug">
                        {n.message}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-400">{fmtDateTime(n.time)}</span>
                        <span className="font-mono text-xs font-bold" style={{ color: cfg.color }}>{n.caseId}</span>
                        <span className={`badge badge-${n.priority === 'High' ? 'high' : n.priority === 'Critical' ? 'critical' : 'low'}`}
                          style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
                          {n.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Read section ── */}
      {notifications.filter(n => n.read).length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1 mb-2">
            Earlier
          </div>
          <div className="space-y-2">
            {notifications.filter(n => n.read).map((n) => {
              const cfg = NOTIF_CONFIG[n.type] || { icon: '🔔', color: '#94a3b8', bg: '#f8fafc' };
              return (
                <div
                  key={n.id}
                  onClick={() => navigate(`/cases/${n.caseId}`)}
                  className="card cursor-pointer group opacity-70 hover:opacity-100 transition-opacity"
                  style={{ borderLeft: '3px solid #e2e8f0' }}>
                  <div className="p-4 flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                      style={{ background: '#f8fafc', filter: 'grayscale(0.4)' }}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-600 mb-1">{n.message}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{fmtDateTime(n.time)}</span>
                        <span className="font-mono text-xs text-slate-400">{n.caseId}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-6xl mb-5 animate-float">🔔</div>
          <h3 className="font-bold text-slate-600 mb-2 text-lg font-display">No notifications yet</h3>
          <p className="text-slate-400 text-sm">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
