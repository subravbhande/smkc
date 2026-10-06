import { useState } from 'react';
import { useCasesStore } from '../store/store';
import { StatusBadge, PriorityBadge } from '../components/ui';
import { fmtDate } from '../utils/helpers';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Clock, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'New',                label: 'Reported',   color: '#1d4ed8' },
  { key: 'Under Review',       label: 'Reviewing',  color: '#7c3aed' },
  { key: 'Field Verification', label: 'Field Visit', color: '#0d9488' },
  { key: 'Verified',           label: 'Verified',   color: '#0d9488' },
  { key: 'Notice Issued',      label: 'Notice',     color: '#9d174d' },
  { key: 'Action Ordered',     label: 'Action',     color: '#dc2626' },
  { key: 'Closed',             label: 'Closed',     color: '#16a34a' },
];

const DEMO_IDS = ['NNT-2026-004271', 'NNT-2026-004265', 'NNT-2026-004240'];

export default function TrackComplaintPage() {
  const { cases } = useCasesStore();
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState('');
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const raw = caseId.trim();
    if (!raw) return;
    const q = raw.toLowerCase();
    const digits = raw.replace(/\D/g, '');
    const c = cases.find(x =>
      x.id.toLowerCase() === q ||
      (digits.length >= 7 && (x.reporterMobile || '').replace(/\D/g, '').includes(digits))
    );
    setFound(c || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #070e1a 0%, #0a1628 40%, #0f2240 100%)' }}>
      {/* ── Header bar ── */}
      <header className="border-b border-white/08 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)' }}>
            <ShieldAlert size={16} color="white" />
          </div>
          <span className="font-display font-bold text-white">NAGAR-NETRA</span>
        </Link>
        <Link to="/login" className="btn btn-sm"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }}>
          Officer Login
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* ── Hero ── */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(13,148,136,0.12)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.25)' }}>
            🔍 Public Tracker
          </div>
          <h1 className="text-4xl font-bold text-white font-display mb-3">Track Your Complaint</h1>
          <p className="text-slate-400">Enter your Case ID to see real-time status and updates</p>
        </div>

        {/* ── Search Box ── */}
        <div className="animate-fade-in delay-100">
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
            <label className="text-slate-300 text-sm font-semibold block mb-2">Case ID or Citizen Mobile Number</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  className="form-input pl-10 font-mono w-full"
                  style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: 'white', caretColor: 'white' }}
                  placeholder="e.g. NNT-2026-004271 or 9876543210"
                  value={caseId}
                  onChange={e => setCaseId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button onClick={handleSearch} className="btn btn-primary px-6 flex-shrink-0">
                <Search size={15} /> Track
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Try:</span>
              {DEMO_IDS.map(id => (
                <button
                  key={id}
                  onClick={() => { setCaseId(id); }}
                  className="font-mono text-teal-400 hover:text-teal-300 transition-colors hover:underline">
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Not found ── */}
        {searched && !found && (
          <div className="mt-6 rounded-2xl p-8 text-center animate-fade-in-scale"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-white mb-1 font-display">Case Not Found</h3>
            <p className="text-slate-400 text-sm">Please check the Case ID and try again</p>
          </div>
        )}

        {/* ── Found case ── */}
        {found && (
          <div className="mt-6 space-y-4 animate-fade-in">
            {/* Main card */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-mono font-bold text-2xl text-blue-400 mb-1">{found.id}</div>
                  <div className="font-semibold text-white text-lg mb-1">{found.title}</div>
                  <div className="text-slate-400 text-sm flex items-center gap-1">
                    <MapPin size={12} />{found.location}
                  </div>
                </div>
                <StatusBadge status={found.status} />
              </div>

              {/* Progress stepper */}
              <div className="mb-6">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Progress</div>
                <div className="flex items-start gap-0 overflow-x-auto pb-1">
                  {STATUS_STEPS.map((step, i) => {
                    const currentIdx = STATUS_STEPS.findIndex(s => s.key === found.status);
                    const isActive = i === currentIdx;
                    const isDone   = i < currentIdx;
                    return (
                      <div key={step.key} className="flex items-start flex-shrink-0">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500"
                            style={{
                              background:   isDone ? step.color : isActive ? step.color : 'transparent',
                              borderColor:  isDone || isActive ? step.color : 'rgba(255,255,255,0.15)',
                              color:        isDone || isActive ? 'white' : '#64748b',
                            }}>
                            {isDone ? '✓' : i + 1}
                          </div>
                          <div
                            className="text-center mt-1.5 leading-tight"
                            style={{
                              fontSize: 9,
                              color: isDone ? step.color : isActive ? 'white' : '#475569',
                              fontWeight: isActive ? 700 : 400,
                              width: 52,
                            }}>
                            {step.label}
                          </div>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className="h-0.5 w-6 mt-3.5 flex-shrink-0 transition-all duration-500"
                            style={{ background: i < STATUS_STEPS.findIndex(s => s.key === found.status) ? step.color : 'rgba(255,255,255,0.1)' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Reported By',     found.reporterName + (found.reporterMobile ? ` (${found.reporterMobile})` : '')],
                  ['Reported On',     fmtDate(found.reportedAt)],
                  ['Violation Type',  found.type],
                  ['Priority',        found.priority],
                  ['Assigned Officer',found.assignedOfficerName || 'Pending Assignment'],
                  ['AI Confidence',   found.aiConfidence ? `🤖 ${found.aiConfidence}%` : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-slate-500 text-xs mb-1">{k}</div>
                    <div className="font-semibold text-white text-sm">{v}</div>
                  </div>
                ))}
              </div>

              {/* Notice */}
              {found.noticeNumber && (
                <div className="mt-3 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5' }}>
                  📄 Enforcement Notice: <span className="font-bold font-mono">{found.noticeNumber}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            {found.timeline?.length > 0 && (
              <div className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm font-display">
                  <Clock size={14} className="text-teal-400" /> Case Timeline
                </h3>
                <div className="space-y-4">
                  {found.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center flex-shrink-0 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0d9488' }} />
                        {i < found.timeline.length - 1 && (
                          <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.08)', minHeight: 16 }} />
                        )}
                      </div>
                      <div className="pb-2">
                        <div className="text-sm font-medium text-white">{t.event}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{t.user} · {fmtDate(t.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => navigate('/login')}
              className="w-full btn btn-primary justify-center py-3 text-base"
              style={{ width: '100%' }}>
              <ShieldAlert size={16} />
              Login to View Full Case Details
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
