import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, MapPin, Camera, AlertTriangle, CheckCircle, Loader,
  Navigation, X, FileVideo, Image, Mic, Info, Eye
} from 'lucide-react';
import { useAuthStore, useCasesStore, useNotifStore } from '../store/store';
import { genCaseId } from '../utils/helpers';
import toast from 'react-hot-toast';

// ─── Mock AI results by violation type ───────────────────────
const AI_MOCK_RESULTS = {
  'Illegal Hoarding': {
    category: 'Unauthorized Advertisement Hoarding',
    confidence: 94,
    ocrText: 'ABC DEVELOPERS\nNEW PROJECT LAUNCH\nCONTACT: 98XXXXXXXX',
    ocrConfidence: 89,
    advertiser: 'ABC Developers',
    riskLevel: 'High',
    decision: 'Potential Violation',
    permit: { status: 'Expired', number: 'PERM-2026-1182', validTo: '30 Sep 2026' },
    recommendation: 'Field verification required. Permit check needed.',
    encroachmentArea: null,
  },
  'Encroachment': {
    category: 'Public Space Encroachment',
    confidence: 88,
    ocrText: '',
    ocrConfidence: 0,
    advertiser: '',
    riskLevel: 'Medium',
    decision: 'Requires Verification',
    permit: null,
    recommendation: 'Field visit recommended. Measure encroachment area.',
    encroachmentArea: '12.4 sq.m (estimated)',
  },
  'Unauthorized Advertisement': {
    category: 'Unauthorized Advertisement',
    confidence: 91,
    ocrText: 'KAPIL MOBILES\nBEST DEALS IN TOWN\n9XXXXXXXX',
    ocrConfidence: 85,
    advertiser: 'Kapil Mobiles',
    riskLevel: 'High',
    decision: 'Potential Violation',
    permit: { status: 'No Permit', number: null, validTo: null },
    recommendation: 'No permit found in registry. Immediate notice recommended.',
    encroachmentArea: null,
  },
  'Roadside Obstruction': {
    category: 'Roadside Hazard',
    confidence: 86,
    ocrText: '',
    ocrConfidence: 0,
    advertiser: '',
    riskLevel: 'High',
    decision: 'Requires Verification',
    permit: null,
    recommendation: 'Urgent field visit required — potential safety hazard.',
    encroachmentArea: '8.2 sq.m (estimated)',
  },
  'Other': {
    category: 'Civic Violation',
    confidence: 75,
    ocrText: '',
    ocrConfidence: 0,
    advertiser: '',
    riskLevel: 'Low',
    decision: 'Requires Verification',
    permit: null,
    recommendation: 'Manual review needed. Insufficient data for automated classification.',
    encroachmentArea: null,
  },
};

const ISSUE_TYPES = [
  { value: 'Illegal Hoarding',          label: 'Illegal Hoarding',          icon: '🏢', desc: 'Unauthorized hoardings, billboards' },
  { value: 'Unauthorized Advertisement', label: 'Unauthorized Advertisement', icon: '📢', desc: 'Banners, flex boards without permit' },
  { value: 'Encroachment',              label: 'Public Encroachment',        icon: '🚧', desc: 'Structures on public land/footpath' },
  { value: 'Roadside Obstruction',      label: 'Roadside Obstruction',       icon: '⚠️', desc: 'Debris, vehicles, stalls on road' },
  { value: 'Other',                     label: 'Other Civic Violation',       icon: '📋', desc: 'Other violations not listed above' },
];

const ACCEPT_TYPES = 'image/jpeg,image/png,image/webp,video/mp4';

function FilePreview({ file, onRemove }) {
  const isVideo = file.type.startsWith('video/');
  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
      <div className="h-24 flex items-center justify-center">
        {isVideo
          ? <FileVideo size={28} className="text-slate-400" />
          : <Image size={28} className="text-slate-400" />
        }
      </div>
      <div className="px-2 pb-2 text-xs text-slate-500 truncate">{file.name}</div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <X size={10} color="white" />
      </button>
    </div>
  );
}

export default function ReportForm() {
  const { user } = useAuthStore();
  const { addCase } = useCasesStore();
  const { addNotification } = useNotifStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [caseId, setCaseId] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [selectedType, setSelectedType] = useState('Illegal Hoarding');
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    lat: '',
    lng: '',
    fullName: user?.name || '',
    mobileNumber: '',
    gpsDetected: false,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ─── GPS Location Capture ─────────────────────────────────
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser. Please enter manually.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Mock reverse geocode for demo (using known SMKC coordinates)
        const mockAddress = latitude.toFixed(4) === '16.8524' || true
          ? `Near ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E — SMKC Jurisdiction`
          : `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;

        setForm(f => ({
          ...f,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          location: f.location || mockAddress,
          gpsDetected: true,
        }));
        setGpsLoading(false);
        toast.success('📍 GPS location captured!');
      },
      (err) => {
        setGpsLoading(false);
        // Use demo Sangli coordinates as fallback
        setForm(f => ({
          ...f,
          lat: '16.852400',
          lng: '74.581500',
          gpsDetected: true,
        }));
        toast('Location access denied. Using demo coordinates.', { icon: '📍' });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // ─── File upload handler ───────────────────────────────────
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const valid = newFiles.filter(f => {
      if (f.size > 50 * 1024 * 1024) { toast.error(`${f.name} exceeds 50MB limit`); return false; }
      if (!f.type.match(/image\/(jpeg|png|webp)|video\/mp4/)) { toast.error(`${f.name}: unsupported format`); return false; }
      return true;
    });
    setFiles(prev => [...prev, ...valid]);
    if (valid.length) toast.success(`${valid.length} file(s) added`);
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  // ─── Submit ───────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Please enter a title'); return; }
    if (!form.location.trim()) { toast.error('Please enter a location or use GPS'); return; }
    if (!form.fullName.trim()) { toast.error('Please enter your full name'); return; }
    if (!form.mobileNumber.match(/^[0-9]{10}$/)) { toast.error('Please enter a valid 10-digit mobile number'); return; }
    if (files.length === 0) { toast.error('Please upload at least one photo or video as evidence'); return; }

    setLoading(true);
    setStep(2); // AI analyzing step

    // Simulate file upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 15;
      setUploadProgress(Math.min(prog, 90));
      if (prog >= 90) clearInterval(interval);
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      const ai = AI_MOCK_RESULTS[selectedType] || AI_MOCK_RESULTS['Other'];
      setAiResult(ai);
      const id = genCaseId();
      setCaseId(id);

      const newCase = {
        id,
        type: selectedType,
        source: 'Web',
        title: form.title,
        description: form.description,
        location: form.location,
        address: form.location,
        lat: parseFloat(form.lat) || 16.8524,
        lng: parseFloat(form.lng) || 74.5815,
        ward: 'Sangli',
        reportedBy: user?.email || 'citizen@demo.com',
        reporterName: form.fullName || user?.name || 'Anonymous Citizen',
        reporterMobile: form.mobileNumber || null,
        reportedAt: new Date().toISOString(),
        status: 'Under Review',
        priority: ai.riskLevel === 'High' ? 'High' : 'Medium',
        assignedOfficer: null,
        assignedOfficerName: null,
        aiConfidence: ai.confidence,
        aiDecision: ai.decision,
        aiCategory: ai.category,
        ocrText: ai.ocrText,
        ocrConfidence: ai.ocrConfidence,
        advertiserName: ai.advertiser,
        permitNumber: ai.permit?.number || null,
        permitStatus: ai.permit?.status || 'Unknown',
        noticeNumber: null,
        evidenceImages: files.map(f => f.name),
        evidenceCount: files.length,
        timeline: [
          {
            date: new Date().toISOString(),
            event: 'Report submitted via Citizen Portal',
            user: user?.name || 'Citizen',
            role: 'Citizen',
            icon: 'report',
          },
          {
            date: new Date(Date.now() + 5000).toISOString(),
            event: `AI analysis completed — ${ai.decision} (${ai.confidence}% confidence)`,
            user: 'AI System',
            role: 'System',
            icon: 'ai',
          },
          ...(ai.ocrText ? [{
            date: new Date(Date.now() + 6000).toISOString(),
            event: `OCR completed — Text extracted from evidence image (${ai.ocrConfidence}% confidence)`,
            user: 'AI System',
            role: 'System',
            icon: 'ocr',
          }] : []),
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addCase(newCase);
      addNotification({
        type: 'report',
        message: `New report submitted: ${id}`,
        caseId: id,
        priority: ai.riskLevel === 'High' ? 'High' : 'Medium',
      });
      setLoading(false);
      setStep(3);
      toast.success('Report submitted successfully!');
    }, 2500);
  };

  // ─────────────────── STEP 1: FORM ─────────────────────────
  if (step === 1) return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-7 pb-5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)' }}>
              <AlertTriangle size={18} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Report a Civic Violation</h2>
              <p className="text-slate-500 text-sm">All reports are reviewed by SMKC officers</p>
            </div>
          </div>
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg mt-3 text-xs bg-blue-50 border border-blue-200 text-blue-800">
            <Info size={12} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Citizen reports are dispatched directly to the SMKC AI verification and field inspection pipeline.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Issue Type selector */}
          <div>
            <label className="form-label">Issue Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {ISSUE_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedType(t.value)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 border-2"
                  style={{
                    borderColor: selectedType === t.value ? '#1d4ed8' : '#e2e8f0',
                    background: selectedType === t.value ? '#eff6ff' : 'white',
                  }}>
                  <span className="text-xl flex-shrink-0">{t.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{t.label}</div>
                    <div className="text-xs text-slate-400">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="form-label">Brief Title <span className="text-red-500">*</span></label>
            <input
              name="title"
              className="form-input"
              placeholder="e.g. Large unauthorized hoarding near bus stop"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Detailed Description</label>
            <textarea
              name="description"
              className="form-input resize-none"
              rows={3}
              placeholder="Describe what you observed — dimensions, duration, impact..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Location + GPS */}
          <div>
            <label className="form-label">Location / Address <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  name="location"
                  className={`form-input pl-9 ${form.gpsDetected ? 'border-green-400 bg-green-50' : ''}`}
                  placeholder="e.g. Sangli-Miraj Road, near railway overbridge"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
                <MapPin size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${form.gpsDetected ? 'text-green-500' : 'text-slate-400'}`} />
              </div>
              <button
                type="button"
                onClick={handleGetGPS}
                disabled={gpsLoading}
                title="Use my current GPS location"
                className="btn btn-sm px-3 flex-shrink-0 flex items-center gap-1.5"
                style={{ background: form.gpsDetected ? '#dcfce7' : '#eff6ff', color: form.gpsDetected ? '#16a34a' : '#1d4ed8', border: `1px solid ${form.gpsDetected ? '#86efac' : '#bfdbfe'}` }}>
                {gpsLoading
                  ? <Loader size={14} className="animate-spin" />
                  : <Navigation size={14} />
                }
                {form.gpsDetected ? 'GPS ✓' : 'Use GPS'}
              </button>
            </div>
            {form.gpsDetected && form.lat && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
                <Navigation size={11} />
                <span className="font-mono">Lat: {form.lat}, Lng: {form.lng}</span>
              </div>
            )}
          </div>

          {/* Evidence upload */}
          <div>
            <label className="form-label">
              Evidence (Photos / Video) <span className="text-red-500">*</span>
              <span className="ml-2 text-xs font-normal text-slate-400">JPG, PNG, WEBP, MP4 · Max 50MB per file</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 ${files.length ? 'border-blue-300' : 'border-slate-200'}`}>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPT_TYPES}
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Camera size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-slate-400 text-xs mt-1">Photo/Video evidence is mandatory for verification</p>
            </div>

            {/* File previews */}
            {files.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                {files.map((f, i) => (
                  <FilePreview key={i} file={f} onRemove={() => removeFile(i)} />
                ))}
              </div>
            )}
          </div>

          {/* ─── Reporter Identity ─── */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #bfdbfe', background: '#eff6ff' }}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#dbeafe', borderBottom: '1px solid #bfdbfe' }}>
              <Eye size={13} className="text-blue-600" />
              <span className="text-blue-800 text-xs font-bold uppercase tracking-wide">Reporter Identity — Required for Verification</span>
              <span className="ml-auto text-blue-500 text-xs">🔒 Data used only by SMKC officers</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 p-4">
            <div>
              <label className="form-label">Full Name <span className="text-red-500">*</span></label>
              <input
                name="fullName"
                className="form-input"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Mobile Number <span className="text-red-500">*</span></label>
              <input
                name="mobileNumber"
                type="tel"
                maxLength={10}
                className="form-input"
                placeholder="10-digit mobile number"
                value={form.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setForm({ ...form, mobileNumber: val });
                }}
                required
              />
            </div>
            </div>
          </div>{/* end Reporter Identity card */}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full justify-center"
            style={{ width: '100%' }}>
            <Upload size={16} />
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );

  // ─────────────────── STEP 2: ANALYZING ────────────────────
  if (step === 2) return (
    <div className="max-w-xl mx-auto py-12 animate-fade-in-scale">
      <div className="card p-10 text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
          <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
          <div className="absolute inset-2 rounded-full bg-purple-50 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">Analyzing Evidence...</h3>
        <p className="text-slate-500 text-sm mb-6">AI is processing your submission</p>

        {/* Upload progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Uploading evidence</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg,#7c3aed,#0d9488)' }}
            />
          </div>
        </div>

        <div className="space-y-2 text-sm text-left">
          {[
            { done: uploadProgress >= 30, text: 'Evidence uploaded' },
            { done: uploadProgress >= 60, text: 'AI violation detection running' },
            { done: uploadProgress >= 80, text: 'OCR text extraction' },
            { done: uploadProgress >= 100, text: 'Permit database check' },
          ].map(item => (
            <div key={item.text} className={`flex items-center gap-2.5 transition-all duration-300 ${item.done ? 'text-slate-700' : 'text-slate-300'}`}>
              {item.done
                ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex-shrink-0" />
              }
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─────────────────── STEP 3: SUCCESS + AI ─────────────────
  if (step === 3) return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-5">
      {/* Success card */}
      <div className="card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Report Submitted!</h2>
        <p className="text-slate-500 mb-5">Your complaint has been registered with NAGAR-NETRA</p>
        <div className="inline-block bg-blue-50 border border-blue-200 rounded-2xl px-8 py-4 mb-4">
          <div className="text-xs text-blue-500 font-semibold mb-1 uppercase tracking-widest">Case ID</div>
          <div className="text-3xl font-bold font-mono text-blue-800">{caseId}</div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center mt-2">
          {[
            { label: 'Status', value: 'Under Review', color: '#f59e0b' },
            { label: 'Evidence', value: `${files.length || 0} file(s)`, color: '#1d4ed8' },
            { label: 'AI Confidence', value: `${aiResult?.confidence || 0}%`, color: '#7c3aed' },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl bg-slate-50">
              <div className="text-xs text-slate-400 mb-0.5">{item.label}</div>
              <div className="font-bold text-sm" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      {aiResult && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-bold text-slate-900 font-display">AI Analysis Result</h3>
              <p className="text-slate-400 text-xs">Automated preliminary assessment</p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 rounded-full font-semibold" style={{ background: '#ede9fe', color: '#7c3aed' }}>Automated</span>
          </div>

          {/* Important notice */}
          <div className="px-4 py-3 rounded-xl mb-5 text-xs flex items-start gap-2"
            style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
            <AlertTriangle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="text-amber-800">
              <strong>Important:</strong> AI analysis is advisory only. Final verification must be performed by an authorized SMKC field officer. AI does not confirm any violation.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Detected Category', value: aiResult.category, color: '#1e293b' },
              { label: 'Confidence Score',  value: `${aiResult.confidence}%`, color: aiResult.confidence > 90 ? '#dc2626' : '#f59e0b' },
              { label: 'Risk Level',        value: aiResult.riskLevel,  color: aiResult.riskLevel === 'High' ? '#dc2626' : '#f59e0b' },
              { label: 'AI Decision',       value: aiResult.decision,   color: aiResult.decision === 'Potential Violation' ? '#7c3aed' : '#f59e0b' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                <div className="font-bold text-sm" style={{ color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="px-4 py-3 rounded-xl mb-3"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div className="text-xs font-semibold text-blue-700 mb-1">💡 Recommendation</div>
            <div className="text-sm text-blue-900">{aiResult.recommendation}</div>
          </div>

          {/* OCR */}
          {aiResult.ocrText && (
            <div className="px-4 py-3 rounded-xl mb-3"
              style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-purple-700">🔍 OCR — Extracted Text</div>
                <span className="text-xs text-purple-500">{aiResult.ocrConfidence}% confidence</span>
              </div>
              <pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">{aiResult.ocrText}</pre>
              {aiResult.advertiser && (
                <div className="mt-2 text-xs text-purple-600">Identified Advertiser: <strong>{aiResult.advertiser}</strong></div>
              )}
            </div>
          )}

          {/* Encroachment area */}
          {aiResult.encroachmentArea && (
            <div className="px-4 py-3 rounded-xl mb-3"
              style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <div className="text-xs font-semibold text-orange-700 mb-1">📐 Estimated Encroachment Area</div>
              <div className="font-bold text-slate-800">{aiResult.encroachmentArea}</div>
            </div>
          )}

          {/* Permit check */}
          {aiResult.permit && (
            <div className="px-4 py-3 rounded-xl"
              style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <div className="text-xs font-semibold text-red-700 mb-2">📋 Permit Check</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Status:</span>
                <strong className="text-red-700">{aiResult.permit.status}</strong>
              </div>
              {aiResult.permit.number && (
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>Permit No.:</span><span className="font-mono">{aiResult.permit.number}</span>
                </div>
              )}
              {aiResult.permit.validTo && (
                <div className="flex items-center justify-between text-xs text-slate-500 mt-0.5">
                  <span>Valid Until:</span><span>{aiResult.permit.validTo}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => navigate(`/cases/${caseId}`)} className="btn btn-primary flex-1 justify-center">
          <Eye size={15} /> View Case Details
        </button>
        <button
          onClick={() => {
            setStep(1);
            setFiles([]);
            setAiResult(null);
            setCaseId(null);
            setUploadProgress(0);
            setSelectedType('Illegal Hoarding');
            setForm({ title: '', description: '', location: '', lat: '', lng: '', contact: user?.email || '', gpsDetected: false });
          }}
          className="btn btn-secondary flex-1 justify-center">
          Report Another
        </button>
      </div>

      <p className="text-center text-xs text-slate-400">
        Sangli-Miraj-Kupwad Municipal Corporation · Public Grievance Redressal
      </p>
    </div>
  );
}
