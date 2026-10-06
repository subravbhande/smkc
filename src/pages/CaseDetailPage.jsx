import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCasesStore, useAuthStore } from '../store/store';
import { StatusBadge, PriorityBadge, AIBadge, DemoDataBanner, ConfirmDialog } from '../components/ui';
import { fmtDate, fmtDateTime, TIMELINE_ICONS, STATUS_LIST, DEMO_OFFICERS as OFFICERS } from '../utils/helpers';
import {
  MapPin, Calendar, User, ChevronRight, ArrowLeft, Download, Send,
  CheckCircle, FileText, Camera, Clock, Shield, Navigation, Edit3, X, Upload, Phone
} from 'lucide-react';
import MapModule from '../components/MapModule';
import toast from 'react-hot-toast';

function TimelineItem({ item, isLast }) {
  const icon = TIMELINE_ICONS[item.icon] || TIMELINE_ICONS.default;
  return (
    <div className="timeline-item">
      <div className="timeline-dot" style={{ background: icon.bg, borderColor: 'white', boxShadow: `0 0 0 2px ${icon.bg}` }}>
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>
          {icon.label}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-800">{item.event}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">{item.user}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded text-xs" style={{ background: icon.bg, color: icon.color }}>{item.role}</span>
          </div>
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0 ml-4">{fmtDateTime(item.date)}</span>
      </div>
    </div>
  );
}

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { cases, updateCaseStatus, assignOfficer, issueNotice, orderAction, closeCase } = useCasesStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [noticeForm, setNoticeForm] = useState({ number: '', deadline: '', recipient: '', rule: 'SMKC Advertisement Bye-laws 2018 — Section 12(b)', description: '' });
  const [showNoticeSuccess, setShowNoticeSuccess] = useState(false);
  const [actionForm, setActionForm] = useState({ type: 'Remove Hoarding', date: '', team: '', instructions: '' });
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [closureForm, setClosureForm] = useState({ reason: '', comment: '' });
  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  const c = cases.find((x) => x.id === caseId);
  if (!c) return (
    <div className="p-8 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-xl font-bold text-slate-700 mb-2">Case not found</h2>
      <button onClick={() => navigate(-1)} className="btn btn-secondary">Go Back</button>
    </div>
  );

  const canEdit = user?.role !== 'Citizen';
  const isSupervisorOrAdmin = user?.role === 'Supervisor' || user?.role === 'Administrator';
  const tabs = ['overview', 'evidence', 'ai-analysis', 'verification', 'notice', 'action', 'timeline', 'map'];

  const handleStatusUpdate = () => {
    updateCaseStatus(c.id, newStatus, statusComment, user?.name || 'Officer');
    toast.success(`Status updated to ${newStatus}`);
    setShowStatusDialog(false);
    setStatusComment('');
  };

  const handleAssign = () => {
    const officer = OFFICERS.find((o) => o.id === selectedOfficer);
    if (officer) {
      assignOfficer(c.id, officer.name, officer.id);
      toast.success(`Assigned to ${officer.name}`);
      setShowAssignDialog(false);
    }
  };

  const handleNoticeGenerate = () => {
    if (!noticeForm.number || !noticeForm.deadline) { toast.error('Fill notice number and deadline'); return; }
    issueNotice(c.id, {
      number: noticeForm.number,
      deadline: noticeForm.deadline,
      recipient: noticeForm.recipient || c.advertiserName || 'Concerned Party',
      rule: noticeForm.rule,
    }, user?.name || 'Supervisor');
    setShowNoticeSuccess(true);
    toast.success('Notice issued successfully!');
  };

  const handleOrderAction = () => {
    if (!actionForm.type) { toast.error('Select action type'); return; }
    orderAction(c.id, actionForm, user?.name || 'Supervisor');
    toast.success('Enforcement action ordered!');
  };

  const handleCloseCase = () => {
    if (!closureForm.reason) { toast.error('Please provide a closure reason'); return; }
    closeCase(c.id, closureForm, user?.name || 'Supervisor');
    toast.success('Case closed successfully');
    setShowCloseDialog(false);
  };

  // Compliance countdown
  const getComplianceCountdown = () => {
    if (!c.noticeDeadline) return null;
    const deadline = new Date(c.noticeDeadline);
    const now = new Date();
    const diffMs = deadline - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: `${Math.abs(diffDays)} days OVERDUE`, color: '#dc2626', bg: '#fef2f2' };
    if (diffDays === 0) return { label: 'Due TODAY', color: '#dc2626', bg: '#fef2f2' };
    if (diffDays <= 3) return { label: `${diffDays} day(s) remaining`, color: '#f59e0b', bg: '#fff7ed' };
    return { label: `${diffDays} days remaining`, color: '#16a34a', bg: '#f0fdf4' };
  };

  const countdown = getComplianceCountdown();

  return (
    <div className="p-6 animate-fade-in">
      <DemoDataBanner />

      {/* Back + Case Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 text-sm mb-3 hover:text-blue-600">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="font-mono font-bold text-xl text-blue-700">{c.id}</span>
                <StatusBadge status={c.status} />
                <PriorityBadge priority={c.priority} />
                {c.aiConfidence > 0 && <AIBadge confidence={c.aiConfidence} decision={c.aiDecision} />}
                {c.source && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: c.source === 'WhatsApp' ? '#dcfce7' : '#dbeafe', color: c.source === 'WhatsApp' ? '#16a34a' : '#1d4ed8' }}>
                    {c.source === 'WhatsApp' ? '💬 WhatsApp' : '🌐 Web'}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 font-display mb-1">{c.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={13} />{c.location}</span>
                <span className="flex items-center gap-1"><Calendar size={13} />{fmtDate(c.reportedAt)}</span>
                <span className="flex items-center gap-1"><User size={13} />{c.reporterName}</span>
                {c.reporterMobile && <span className="flex items-center gap-1 text-slate-500"><Phone size={13} />{c.reporterMobile}</span>}
                {c.assignedOfficerName && <span className="flex items-center gap-1"><Shield size={13} />Officer: {c.assignedOfficerName}</span>}
              </div>
            </div>
          {canEdit && (
            <div className="flex gap-2 flex-wrap">
              {isSupervisorOrAdmin && (
                <button onClick={() => setShowAssignDialog(true)} className="btn btn-outline btn-sm">
                  <User size={14} /> Assign Officer
                </button>
              )}
              <button onClick={() => { setNewStatus(c.status); setShowStatusDialog(true); }} className="btn btn-primary btn-sm">
                <Edit3 size={14} /> Update Status
              </button>
              {isSupervisorOrAdmin && c.status === 'Action Ordered' && (
                <button
                  onClick={() => setShowCloseDialog(true)}
                  className="btn btn-sm"
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                  🔒 Close Case
                </button>
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3">Case Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ['Case ID', c.id],
                    ['Type', c.type],
                    ['Status', c.status],
                    ['Priority', c.priority],
                    ['Location', c.location],
                    ['Ward/Zone', c.ward],
                    ['Reported By', c.reporterName],
                    ['Citizen Contact', c.reporterMobile || 'Not recorded'],
                    ['Reported At', fmtDateTime(c.reportedAt)],
                    ['Assigned Officer', c.assignedOfficerName || '—'],
                    ['Last Updated', fmtDateTime(c.updatedAt)],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-400 mb-0.5">{k}</div>
                      <div className="font-semibold text-slate-800 text-sm">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              {c.description && (
                <div className="card p-6">
                  <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.description}</p>
                </div>
              )}
              {/* Mini map */}
              <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Location</h3>
                  <a href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}&zoom=17`}
                    target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                    <Navigation size={12} /> Open in Map
                  </a>
                </div>
                <div style={{ height: 200 }}>
                  <MapModule height="200px" showControls={false} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Permit */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText size={16} /> Permit Info</h3>
                {c.permitNumber ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Number</span><span className="font-mono font-semibold">{c.permitNumber}</span></div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status</span>
                      <span className={`font-bold ${c.permitStatus === 'Expired' ? 'text-red-600' : c.permitStatus === 'No Permit' ? 'text-red-700' : 'text-green-600'}`}>{c.permitStatus}</span>
                    </div>
                    {c.advertiserName && <div className="flex justify-between"><span className="text-slate-500">Advertiser</span><span className="font-semibold">{c.advertiserName}</span></div>}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">{c.permitStatus === 'Not Applicable' ? 'Not applicable for this type' : 'No permit found'}</p>
                )}
              </div>

              {/* OCR */}
              {c.ocrText && (
                <div className="card p-5">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">🔍 OCR Result</h3>
                  <pre className="text-xs font-mono bg-slate-50 p-3 rounded-lg whitespace-pre-wrap text-slate-700">{c.ocrText}</pre>
                  <div className="mt-2 text-xs text-slate-400">OCR Confidence: ~91%</div>
                </div>
              )}

              {/* Compliance countdown */}
              {countdown && (
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Compliance Deadline</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: countdown.bg, color: countdown.color }}>
                      ⏱ {countdown.label}
                    </span>
                  </div>
                  {c.noticeDeadline && (
                    <div className="text-xs text-slate-400 mt-1">{fmtDate(c.noticeDeadline)}</div>
                  )}
                </div>
              )}

              {/* Notice */}
              {c.noticeNumber && (
                <div className="card p-5">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText size={16} /> Notice Issued</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-slate-500">Notice No</span><span className="font-mono font-bold text-blue-700">{c.noticeNumber}</span></div>
                    {c.noticeDate && <div className="flex justify-between"><span className="text-slate-500">Issued On</span><span>{fmtDate(c.noticeDate)}</span></div>}
                    {c.noticeDeadline && <div className="flex justify-between"><span className="text-slate-500">Deadline</span><span className="font-semibold text-red-600">{fmtDate(c.noticeDeadline)}</span></div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI ANALYSIS */}
        {activeTab === 'ai-analysis' && (
          <div className="max-w-2xl space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">AI Analysis Report</h3>
                  <p className="text-slate-400 text-sm">Automated detection · {fmtDateTime(c.reportedAt)}</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                <strong>Advisory Notice:</strong> AI analysis is advisory only. Final verification and enforcement decisions must be made by an authorized SMKC officer.
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Detected Object', value: c.aiCategory },
                  { label: 'Confidence', value: `${c.aiConfidence}%`, highlight: true },
                  { label: 'Risk Level', value: c.priority === 'Critical' || c.priority === 'High' ? 'High' : 'Medium', isRisk: true },
                  { label: 'AI Decision', value: c.aiDecision, isDecision: true },
                ].map(({ label, value, highlight, isRisk, isDecision }) => (
                  <div key={label} className="p-4 rounded-xl bg-slate-50">
                    <div className="text-xs text-slate-400 mb-1">{label}</div>
                    <div className={`font-bold text-base ${highlight ? 'text-blue-700' : isRisk ? (value === 'High' ? 'text-red-600' : 'text-amber-600') : isDecision ? (value === 'Potential Violation' ? 'text-red-700' : 'text-amber-700') : 'text-slate-800'}`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              {/* Confidence bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Detection Confidence</span>
                  <span className="font-bold text-blue-700">{c.aiConfidence}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.aiConfidence}%`, background: 'linear-gradient(90deg,#1d4ed8,#0d9488)' }} />
                </div>
              </div>
            </div>

            {/* OCR */}
            {c.ocrText && (
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">🔍 OCR Text Extraction</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap mb-4">{c.ocrText}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {c.advertiserName && <div className="p-3 bg-slate-50 rounded-lg"><div className="text-xs text-slate-400">Advertiser</div><div className="font-semibold">{c.advertiserName}</div></div>}
                  <div className="p-3 bg-slate-50 rounded-lg"><div className="text-xs text-slate-400">OCR Confidence</div><div className="font-bold text-green-700">91%</div></div>
                </div>
              </div>
            )}

            {/* Permit */}
            {c.permitNumber && (
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3">📋 Permit Verification</h3>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="p-3 bg-slate-50 rounded-lg"><div className="text-xs text-slate-400">Permit Number</div><div className="font-mono font-bold">{c.permitNumber}</div></div>
                  <div className="p-3 bg-red-50 rounded-lg"><div className="text-xs text-slate-400">Status</div><div className="font-bold text-red-700">{c.permitStatus}</div></div>
                  {c.advertiserName && <div className="p-3 bg-slate-50 rounded-lg"><div className="text-xs text-slate-400">Advertiser</div><div className="font-semibold">{c.advertiserName}</div></div>}
                </div>
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                  ⚠️ Potential Permit Violation — Requires Officer Verification
                </div>
              </div>
            )}
          </div>
        )}

        {/* NOTICE */}
        {activeTab === 'notice' && (
          <div className="max-w-2xl">
            {c.noticeNumber || showNoticeSuccess ? (
              <div className="card p-8 text-center">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Notice Issued</h3>
                <p className="text-slate-500 mb-2">Notice <strong>{c.noticeNumber}</strong> for Case {c.id}</p>
                {c.noticeDeadline && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                    style={{ background: countdown?.bg || '#fef2f2', color: countdown?.color || '#dc2626' }}>
                    ⏱ {countdown?.label || `Deadline: ${fmtDate(c.noticeDeadline)}`}
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      // Generate a simple PDF-like download
                      const noticeText = `NAGAR-NETRA ENFORCEMENT NOTICE\n\nNotice No: ${c.noticeNumber}\nCase ID: ${c.id}\nDate: ${new Date().toLocaleDateString('en-IN')}\nIssued To: ${c.noticeRecipient || c.advertiserName || 'Concerned Party'}\nLocation: ${c.location}\nViolation: ${c.title}\nCompliance Deadline: ${c.noticeDeadline ? new Date(c.noticeDeadline).toLocaleDateString('en-IN') : 'As directed'}\n\nYou are hereby directed to remove/rectify the above violation within the stipulated period.\nFailure to comply will result in enforcement action under applicable SMKC bye-laws.\n\n⚠️ PROTOTYPE DEMO — Not an actual SMKC legal notice.`;
                      const blob = new Blob([noticeText], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = `${c.noticeNumber}.txt`; a.click();
                      toast.success('Notice downloaded (demo)');
                    }}
                    className="btn btn-outline btn-sm">
                    <Download size={14} /> Download Notice
                  </button>
                  <button
                    onClick={() => toast.success('WhatsApp notification sent (demo)')}
                    className="btn btn-primary btn-sm">
                    <Send size={14} /> Send Notification
                  </button>
                </div>
              </div>
            ) : isSupervisorOrAdmin ? (
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2"><FileText size={18} /> Issue Enforcement Notice</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Notice Number <span className="text-red-500">*</span></label>
                      <input className="form-input font-mono" placeholder="SMKC-NOT-2026-XXXX"
                        value={noticeForm.number} onChange={e => setNoticeForm({...noticeForm, number: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">Case ID</label>
                      <input className="form-input font-mono bg-slate-50" value={c.id} readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Recipient / Party</label>
                      <input className="form-input" placeholder="Party name / entity"
                        value={noticeForm.recipient} onChange={e => setNoticeForm({...noticeForm, recipient: e.target.value})}
                        defaultValue={c.advertiserName} />
                    </div>
                    <div>
                      <label className="form-label">Compliance Deadline <span className="text-red-500">*</span></label>
                      <input type="date" className="form-input"
                        value={noticeForm.deadline} onChange={e => setNoticeForm({...noticeForm, deadline: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Legal Reference</label>
                    <input className="form-input"
                      value={noticeForm.rule} onChange={e => setNoticeForm({...noticeForm, rule: e.target.value})}
                      placeholder="e.g. SMKC Advertisement Bye-laws 2018 — Section 12(b)" />
                  </div>
                  <div>
                    <label className="form-label">Violation Description</label>
                    <textarea className="form-input" rows={3} placeholder="Describe the violation and enforcement basis..."
                      value={noticeForm.description} onChange={e => setNoticeForm({...noticeForm, description: e.target.value})} />
                  </div>
                  <button onClick={handleNoticeGenerate} className="btn btn-primary w-full justify-center" style={{ width: '100%' }}>
                    <FileText size={14} /> Issue Notice
                  </button>
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-slate-500">No notice has been issued for this case yet.</p>
                <p className="text-slate-400 text-sm mt-1">Supervisors can issue notices from the Notice tab.</p>
              </div>
            )}
          </div>
        )}

        {/* ACTION */}
        {activeTab === 'action' && (
          <div className="max-w-2xl space-y-4">
            {/* Enforcement Action Form */}
            {isSupervisorOrAdmin && c.status !== 'Action Ordered' && c.status !== 'Closed' && (
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">⚡ Order Enforcement Action</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Action Type</label>
                      <select className="form-input" value={actionForm.type} onChange={e => setActionForm({...actionForm, type: e.target.value})}>
                        <option>Remove Hoarding</option>
                        <option>Remove Encroachment</option>
                        <option>Issue Warning</option>
                        <option>Seize Material</option>
                        <option>Rectification Required</option>
                        <option>Reinspection Required</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Scheduled Date</label>
                      <input type="date" className="form-input" value={actionForm.date} onChange={e => setActionForm({...actionForm, date: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Assigned Team</label>
                    <input className="form-input" placeholder="e.g. Ward 3 Enforcement Team"
                      value={actionForm.team} onChange={e => setActionForm({...actionForm, team: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Instructions</label>
                    <textarea className="form-input" rows={3} placeholder="Instructions for the action team..."
                      value={actionForm.instructions} onChange={e => setActionForm({...actionForm, instructions: e.target.value})} />
                  </div>
                  <button className="btn btn-primary w-full justify-center" style={{ width: '100%' }} onClick={handleOrderAction}>
                    ⚡ Order Enforcement Action
                  </button>
                </div>
              </div>
            )}

            {c.status === 'Action Ordered' && (
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-slate-900">Action Ordered</div>
                    <div className="text-xs text-slate-500">{c.actionType} — {c.actionTeam || 'Team TBD'}</div>
                  </div>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 font-bold">In Progress</span>
                </div>
                {c.actionDate && (
                  <div className="text-sm text-slate-600">Scheduled: <strong>{fmtDate(c.actionDate)}</strong></div>
                )}
              </div>
            )}

            {/* Before/After Evidence */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Camera size={16} /> Before / After Evidence
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Before */}
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">📸 Before</div>
                  <input ref={beforeRef} type="file" accept="image/*,video/mp4" className="hidden"
                    onChange={e => { if (e.target.files[0]) { setBeforePhoto(e.target.files[0].name); toast.success('Before photo attached'); } }} />
                  {beforePhoto ? (
                    <div className="aspect-video bg-slate-100 rounded-xl flex flex-col items-center justify-center relative group">
                      <Camera size={20} className="text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500 truncate px-2">{beforePhoto}</span>
                      <button onClick={() => setBeforePhoto(null)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => beforeRef.current?.click()}
                      className="aspect-video w-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload size={20} className="text-slate-300 mb-1" />
                      <span className="text-xs text-slate-400">Upload Before Photo</span>
                    </button>
                  )}
                </div>
                {/* After */}
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">✅ After</div>
                  <input ref={afterRef} type="file" accept="image/*,video/mp4" className="hidden"
                    onChange={e => { if (e.target.files[0]) { setAfterPhoto(e.target.files[0].name); toast.success('After photo attached'); } }} />
                  {afterPhoto ? (
                    <div className="aspect-video bg-green-50 rounded-xl border border-green-200 flex flex-col items-center justify-center relative group">
                      <CheckCircle size={20} className="text-green-500 mb-1" />
                      <span className="text-xs text-green-600 font-semibold truncate px-2">{afterPhoto}</span>
                      <button onClick={() => setAfterPhoto(null)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => afterRef.current?.click()}
                      className="aspect-video w-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:border-green-400 transition-colors cursor-pointer">
                      <Upload size={20} className="text-slate-300 mb-1" />
                      <span className="text-xs text-slate-400">Upload After Photo</span>
                    </button>
                  )}
                </div>
              </div>
              {(beforePhoto || afterPhoto) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      toast.success('Before/After evidence saved to case record!');
                    }}
                    className="btn btn-primary btn-sm">
                    <Upload size={13} /> Save Evidence
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="max-w-2xl">
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Clock size={16} /> Case Timeline</h3>
              {c.timeline.length === 0 ? (
                <p className="text-slate-400 text-sm">No timeline events yet.</p>
              ) : (
                <div>
                  {c.timeline.map((item, i) => (
                    <TimelineItem key={i} item={item} isLast={i === c.timeline.length - 1} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAP */}
        {activeTab === 'map' && (
          <div className="card overflow-hidden" style={{ height: 500 }}>
            <MapModule height="500px" showControls={true} />
          </div>
        )}

        {/* EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="max-w-2xl space-y-4">
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Camera size={16} /> Evidence Gallery</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                    <Camera size={28} className="text-slate-300" />
                  </div>
                ))}
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400">
                <Camera size={20} className="mx-auto text-slate-300 mb-2" />
                <span className="text-sm text-slate-400">Upload new evidence</span>
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="max-w-2xl space-y-4">
            {c.status === 'Closed' ? (
              <div className="card p-8 text-center">
                <div className="text-5xl mb-3">🔒</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Case Closed</h3>
                <p className="text-slate-500 text-sm mb-2">{c.closureReason || 'Violation resolved'}</p>
                {c.closedAt && <p className="text-xs text-slate-400">Closed on {fmtDate(c.closedAt)} by {c.closedBy}</p>}
              </div>
            ) : (
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <CheckCircle size={18} /> Field Verification
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Verification Status</label>
                      <select className="form-input" id="verif-status">
                        <option>Confirmed Violation</option>
                        <option>No Violation Found</option>
                        <option>Requires Further Investigation</option>
                        <option>Duplicate Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Inspection Date</label>
                      <input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Inspection Notes</label>
                    <textarea className="form-input" rows={4}
                      placeholder="Describe field observations, measurements, additional findings..." />
                  </div>
                  <div>
                    <label className="form-label">Recommended Action</label>
                    <select className="form-input">
                      <option>Issue Notice</option>
                      <option>Immediate Removal</option>
                      <option>Warning</option>
                      <option>No Action Required</option>
                      <option>Escalate to Supervisor</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn btn-primary flex-1 justify-center"
                      onClick={() => {
                        const verif = document.getElementById('verif-status')?.value || 'Confirmed Violation';
                        updateCaseStatus(c.id, 'Field Verified', `Field verification: ${verif}`, user?.name || 'Officer', user?.role);
                        toast.success('Verification submitted!');
                      }}>
                      <CheckCircle size={14} /> Submit Verification
                    </button>
                    <button className="btn btn-secondary btn-sm">Save Draft</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Update Dialog */}
      {showStatusDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Update Case Status</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">New Status</label>
                <select className="form-input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Comment (optional)</label>
                <textarea className="form-input" rows={3} value={statusComment} onChange={e => setStatusComment(e.target.value)} placeholder="Add a note about this status change..." />
              </div>
              <div className="flex gap-3 justify-end">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowStatusDialog(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleStatusUpdate}>Update Status</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Dialog */}
      {showAssignDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Assign Field Officer</h3>
            <div className="space-y-3 mb-4">
              {OFFICERS.map((o) => (
                <label key={o.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedOfficer === o.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="officer" value={o.id} checked={selectedOfficer === o.id} onChange={e => setSelectedOfficer(e.target.value)} />
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{o.name}</div>
                    <div className="text-xs text-slate-500">{o.zone} · {o.assigned} assigned · {o.pending} pending</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAssignDialog(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleAssign} disabled={!selectedOfficer}>Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* Case Closure Dialog */}
      {showCloseDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in-scale">
            <h3 className="font-bold text-slate-900 text-lg mb-1">🔒 Close Case</h3>
            <p className="text-slate-400 text-sm mb-5">This will mark the case as resolved. Please provide a closure reason.</p>
            <div className="space-y-4">
              <div>
                <label className="form-label">Closure Reason <span className="text-red-500">*</span></label>
                <select className="form-input" value={closureForm.reason}
                  onChange={e => setClosureForm({...closureForm, reason: e.target.value})}>
                  <option value="">Select a reason...</option>
                  <option>Violation Removed — Compliance Achieved</option>
                  <option>Structure Demolished by Enforcement Team</option>
                  <option>Valid Permit Found — No Violation</option>
                  <option>Duplicate Report</option>
                  <option>Report Withdrawn by Citizen</option>
                  <option>Encroachment Cleared</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Additional Comment</label>
                <textarea className="form-input" rows={3} placeholder="Details about the resolution..."
                  value={closureForm.comment}
                  onChange={e => setClosureForm({...closureForm, comment: e.target.value})} />
              </div>
              <div className="p-3 rounded-xl text-xs"
                style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
                ⚠️ Closing this case is permanent. Ensure before/after evidence has been uploaded.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCloseDialog(false)} className="btn btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={handleCloseCase} className="btn flex-1 justify-center"
                  style={{ background: '#dc2626', color: 'white' }}>
                  🔒 Close Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
