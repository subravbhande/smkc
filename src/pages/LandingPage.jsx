import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Map, Brain, Camera, FileText,
  CheckCircle, Activity, Database, Bell, ChevronRight, Zap,
  TrendingUp, Shield, Phone, MessageSquare, AlertCircle, Eye,
  Users, Clock, Star, Award, Menu, X, MapPin
} from 'lucide-react';
import SMKCLogo from '../components/SMKCLogo';

/* ── Animated counter ── */
function CountUp({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let s = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          s += step;
          if (s >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(s));
        }, 16);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    }, { threshold: 0.1 });
    const el = ref.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);
  return ref;
}

function Particle({ style }) { return <div className="particle" style={style} />; }
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  width: `${Math.random() * 5 + 2}px`,
  height: `${Math.random() * 5 + 2}px`,
  left: `${Math.random() * 100}%`,
  bottom: `${Math.random() * 40}%`,
  background: i % 3 === 0 ? 'rgba(96,165,250,0.7)' : i % 3 === 1 ? 'rgba(45,212,191,0.6)' : 'rgba(167,139,250,0.5)',
  '--duration': `${Math.random() * 4 + 3}s`,
  '--delay': `${Math.random() * 5}s`,
  '--x-drift': `${(Math.random() - 0.5) * 100}px`,
}));

const FEATURES = [
  { icon: Brain,       title: 'AI-Powered Detection',    desc: 'YOLOv8 hoarding & encroachment detection with confidence scoring and permit cross-check', color: '#7c3aed' },
  { icon: Map,         title: 'Live GIS Mapping',        desc: 'Real-time case mapping on OpenStreetMap with zone-wise hotspot analysis', color: '#1d4ed8' },
  { icon: Camera,      title: 'Geo-tagged Evidence',     desc: 'Photo & video evidence with GPS coordinates, timestamp and OCR text extraction', color: '#0d9488' },
  { icon: CheckCircle, title: 'Field Verification',      desc: 'Trained officers verify every report on-site before any legal action is taken', color: '#16a34a' },
  { icon: FileText,    title: 'Digital Enforcement',     desc: 'Generate, preview, and serve enforcement notices digitally with legal references', color: '#ca8a04' },
  { icon: Activity,    title: 'Action Tracking',         desc: 'Before/after photo evidence comparison and real-time removal status tracking', color: '#dc2626' },
  { icon: Database,    title: 'Repeat Offender Intel',   desc: 'Historical location intelligence — automatically flag repeat violations at same spot', color: '#9d174d' },
  { icon: Bell,        title: 'Multi-channel Alerts',    desc: 'WhatsApp, in-app and email notifications for officers, supervisors & complainants', color: '#0369a1' },
];

const WORKFLOW = [
  { step: 'REPORT',  desc: 'Citizen reports with photo, location & mobile number', icon: '📱', color: '#1d4ed8' },
  { step: 'DETECT',  desc: 'AI analyzes image & flags violation with confidence score', icon: '🤖', color: '#7c3aed' },
  { step: 'VERIFY',  desc: 'Field officer conducts on-site inspection', icon: '🔍', color: '#0d9488' },
  { step: 'NOTICE',  desc: 'Supervisor issues legal enforcement notice', icon: '📄', color: '#ca8a04' },
  { step: 'ACTION',  desc: 'Enforcement team removes/rectifies violation', icon: '⚡', color: '#dc2626' },
  { step: 'RESOLVE', desc: 'Case closed with before/after evidence on GIS map', icon: '✅', color: '#16a34a' },
];

const STATS = [
  { value: 94,  suffix: '%', label: 'AI Detection Accuracy',  icon: Brain,      color: '#7c3aed' },
  { value: 20,  suffix: '+', label: 'Active Cases Tracked',   icon: FileText,   color: '#1d4ed8' },
  { value: 3,   suffix: '',  label: 'SMKC Zones Covered',     icon: Map,        color: '#0d9488' },
  { value: 40,  suffix: '%', label: 'Faster Resolution',      icon: TrendingUp, color: '#16a34a' },
];

// Recent demo complaints for the marquee
const RECENT_COMPLAINTS = [
  { id: 'NNT-2026-004271', type: 'Illegal Hoarding', location: 'Sangli-Miraj Road', time: '2 hrs ago',  status: 'Field Verification' },
  { id: 'NNT-2026-004265', type: 'Encroachment',     location: 'Madhavnagar Road',  time: '5 hrs ago',  status: 'Notice Issued' },
  { id: 'NNT-2026-004254', type: 'Illegal Hoarding', location: 'Miraj Bus Stand',   time: '1 day ago',  status: 'Action Ordered' },
  { id: 'NNT-2026-004240', type: 'Encroachment',     location: 'Kupwad MIDC Road',  time: '2 days ago', status: 'Closed' },
  { id: 'NNT-2026-004272', type: 'Unauthorized Ad',  location: 'Court Road, Sangli', time: '30 min ago', status: 'Under Review' },
];

const STATUS_COLORS = {
  'Under Review':       '#f59e0b',
  'Field Verification': '#7c3aed',
  'Notice Issued':      '#1d4ed8',
  'Action Ordered':     '#dc2626',
  'Closed':             '#16a34a',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const featRef  = useReveal();
  const workRef  = useReveal();
  const statsRef = useReveal();
  const ctaRef   = useReveal();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Fixed Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
        style={{ background: 'rgba(8,15,26,0.95)', backdropFilter: 'blur(24px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SMKCLogo size={32} />
            <div>
              <span className="font-display font-bold text-white tracking-wide text-base sm:text-lg">NAGAR-NETRA</span>
              <div className="text-slate-500 text-[10px] tracking-widest uppercase hidden sm:block">SMKC Civic Enforcement</div>
            </div>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-400">
            <a href="#features"  className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#workflow"  className="hover:text-teal-400 transition-colors">How It Works</a>
            <a href="#stats"     className="hover:text-teal-400 transition-colors">Impact</a>
            <Link to="/citizen/track" className="hover:text-teal-400 transition-colors">Track Complaint</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/citizen/report-new"
              className="btn btn-sm hidden sm:flex"
              style={{ background: 'rgba(13,148,136,0.18)', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.35)' }}>
              📸 Report
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm hidden sm:flex">Officer Login</Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 animate-fade-in"
            style={{ background: 'rgba(8,15,26,0.98)' }}>
            <div className="px-4 py-4 space-y-1">
              {[
                { href: '#features', label: 'Features' },
                { href: '#workflow', label: 'How It Works' },
                { href: '#stats', label: 'Impact' },
              ].map(item => (
                <a key={item.label} href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                  <ChevronRight size={14} className="text-teal-500" />
                  {item.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/citizen/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn w-full justify-center"
                  style={{ background: 'rgba(13,148,136,0.18)', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.35)' }}>
                  🔍 Track Complaint
                </Link>
                <Link to="/citizen/report-new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn w-full justify-center"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)', color: 'white' }}>
                  📸 Report a Violation
                </Link>
                <Link to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary w-full justify-center">
                  Officer Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden hero-gradient">
        <div className="scan-line" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/5 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.10) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 left-2/3 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)' }} />
        {PARTICLES.map((p, i) => <Particle key={i} style={p} />)}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">

          {/* Left — Copy */}
          <div className="animate-fade-in">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(20,184,166,0.12)', color: '#5eead4', border: '1px solid rgba(20,184,166,0.28)' }}>
              <span className="w-2 h-2 rounded-full bg-teal-400 pulse-dot" />
              🚀 Prototype v1.0 · Sangli-Miraj-Kupwad Municipal Corporation
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white font-display leading-[1.04] mb-3">
              NAGAR-<br />
              <span className="gradient-text">NETRA</span>
            </h1>
            <p className="text-xl text-slate-300 font-semibold mb-1">AI + GIS Powered Civic Enforcement</p>
            <p className="text-2xl text-teal-400 font-display font-bold mb-6 animate-slide-in">
              Report. Detect. Verify. Resolve.
            </p>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-lg">
              SMKC's unified platform to detect, report, track and resolve illegal hoardings and
              public-space encroachments through AI-powered evidence analysis and digital enforcement workflows.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link to="/citizen/report-new"
                className="btn btn-lg animate-fade-in"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)', color: 'white', boxShadow: '0 4px 24px rgba(29,78,216,0.4)' }}>
                <Camera size={18} />
                Report a Violation
                <ArrowRight size={18} />
              </Link>
              <Link to="/citizen/track"
                className="btn btn-lg animate-fade-in"
                style={{ background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}>
                🔍 Track My Complaint
              </Link>
            </div>

            {/* Quick stats chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: '94% AI Accuracy',   icon: '🤖' },
                { label: 'Real-time GIS',     icon: '🗺️' },
                { label: 'Digital Notices',   icon: '📄' },
                { label: 'WhatsApp Reports',  icon: '💬' },
              ].map(chip => (
                <div key={chip.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live Dashboard Preview */}
          <div className="hidden lg:block animate-fade-in-right">
            <div className="rounded-2xl p-5 border border-white/10 relative"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
              {/* Window chrome */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-slate-500 text-xs font-mono">NAGAR-NETRA · Live Dashboard</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                  <span className="text-green-400 text-xs">Live</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4 stagger-children">
                {[
                  { val: '20', label: 'Total Cases',   color: '#1d4ed8' },
                  { val: '7',  label: 'High Priority', color: '#dc2626' },
                  { val: '8',  label: 'Resolved',      color: '#16a34a' },
                ].map(({ val, label, color }) => (
                  <div key={label} className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <div className="text-2xl font-bold font-display" style={{ color }}>{val}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Recent complaints live feed */}
              <div className="p-3 rounded-xl mb-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs font-semibold">Live Case Feed</span>
                  <div className="flex items-center gap-1 text-green-400 text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
                    Real-time
                  </div>
                </div>
                {RECENT_COMPLAINTS.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-2.5 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: STATUS_COLORS[c.status] || '#64748b' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-semibold truncate">{c.type}</div>
                      <div className="text-slate-500 text-[10px] truncate">{c.location}</div>
                    </div>
                    <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${STATUS_COLORS[c.status] || '#64748b'}22`, color: STATUS_COLORS[c.status] || '#94a3b8' }}>
                      {c.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone bar chart */}
              <div className="p-3 rounded-xl mb-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-slate-400 text-xs mb-3 font-semibold">Zone Activity</div>
                {[
                  { zone: 'Sangli City', pct: 45, color: '#dc2626' },
                  { zone: 'Miraj',       pct: 30, color: '#ea580c' },
                  { zone: 'Kupwad',      pct: 25, color: '#ca8a04' },
                ].map(z => (
                  <div key={z.zone} className="mb-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{z.zone}</span>
                      <span style={{ color: z.color }}>{z.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${z.pct}%`, background: z.color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Map preview */}
              <div className="p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-xs font-semibold">GIS Map · Live</div>
                    <div className="text-slate-400 text-[10px]">20 cases across SMKC</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 px-4 py-3 animate-float rounded-xl"
                style={{ background: 'rgba(13,148,136,0.18)', border: '1px solid rgba(13,148,136,0.35)', backdropFilter: 'blur(8px)' }}>
                <div className="text-teal-400 text-sm font-bold">🤖 AI Active</div>
                <div className="text-slate-400 text-xs">YOLOv8 · Running</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-float">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ── Citizen Identity Bar ── */}
      <section className="py-5 border-y"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderColor: '#bbf7d0' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-green-700" />
            </div>
            <div>
              <div className="font-bold text-green-900 text-sm">Verified Complaints Only — Your Identity Matters</div>
              <div className="text-green-700 text-xs">Mobile number, name and photo evidence are mandatory to file a complaint</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Phone, label: 'Mobile No. Required' },
              { icon: Users, label: 'Full Name Required' },
              { icon: Camera, label: 'Photo Evidence Required' },
              { icon: MapPin, label: 'GPS Location Required' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(22,163,74,0.12)', color: '#15803d', border: '1px solid rgba(22,163,74,0.25)' }}>
                <Icon size={11} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats" className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={statsRef} className="reveal grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, suffix, label, icon: Icon, color }) => (
              <div key={label} className="text-center p-6 rounded-2xl card card-hover group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ background: `${color}15` }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <div className="text-4xl font-bold font-display mb-1" style={{ color }}>
                  <CountUp target={value} suffix={suffix} />
                </div>
                <div className="text-slate-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Report (Citizen Guide) ── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg,#f8fafc,#f0fdf4)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
              <Phone size={12} /> For Citizens
            </div>
            <h2 className="text-4xl font-bold text-slate-900 font-display mb-3">How to File a Complaint</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Your identity helps us take action. Provide accurate information and we'll keep you updated at every step.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Steps */}
            <div className="space-y-4">
              {[
                {
                  step: '1', icon: '📸', title: 'Take a Photo',
                  desc: 'Photograph the violation clearly — hoarding, banner, or encroachment. Video evidence is also accepted.',
                  required: null, badge: null,
                },
                {
                  step: '2', icon: '👤', title: 'Enter Your Details',
                  desc: 'Provide your full name and a valid 10-digit mobile number. This lets us send you status updates via SMS/WhatsApp.',
                  required: ['Full Name', 'Mobile Number'],
                  badge: 'Mandatory for Accountability',
                },
                {
                  step: '3', icon: '📍', title: 'Mark the Location',
                  desc: 'Use GPS auto-detect or manually type the address. Accurate location ensures officers reach the right spot.',
                  required: ['GPS / Address'],
                  badge: null,
                },
                {
                  step: '4', icon: '✅', title: 'Submit & Track',
                  desc: 'Submit and receive a unique Case ID. Track your complaint status online or via WhatsApp anytime.',
                  required: null, badge: null,
                },
              ].map(item => (
                <div key={item.step} className="card p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)', minWidth: 40 }}>
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-bold text-slate-900">{item.title}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                          ⚠ {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    {item.required && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.required.map(r => (
                          <span key={r} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA Card */}
            <div className="space-y-5">
              {/* WhatsApp Report Card */}
              <div className="rounded-2xl p-6 text-white overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg,#128c7e,#25d366)', boxShadow: '0 8px 32px rgba(37,211,102,0.25)' }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
                  style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageSquare size={24} color="white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">WhatsApp Reporter</div>
                      <div className="text-green-200 text-sm">Report without downloading any app</div>
                    </div>
                  </div>
                  <p className="text-green-100 text-sm mb-5 leading-relaxed">
                    Send a photo of the violation with your location to our WhatsApp number.
                    Our AI bot will guide you through the reporting process in simple steps — in Marathi or English.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { icon: '📸', text: 'Send Photo' },
                      { icon: '📍', text: 'Share Location' },
                      { icon: '📝', text: 'Describe Issue' },
                      { icon: '✅', text: 'Get Case ID' },
                    ].map(item => (
                      <div key={item.text} className="flex items-center gap-2 text-sm bg-white/15 rounded-lg px-3 py-2">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3 text-sm">
                    <Phone size={16} />
                    <span className="font-mono font-bold">+91 90000 XXXXX</span>
                    <span className="text-green-200 text-xs ml-auto">(Demo)</span>
                  </div>
                </div>
              </div>

              {/* Accountability Notice */}
              <div className="card p-5 border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 mb-1">Why We Collect Your Identity</div>
                    <ul className="text-slate-500 text-sm space-y-1.5">
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">•</span>
                        To send SMS/WhatsApp status updates on your complaint
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">•</span>
                        To prevent frivolous or malicious anonymous reports
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">•</span>
                        To contact you if officers need clarification
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">•</span>
                        Your data is used only for SMKC enforcement — not shared
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Link to="/citizen/report-new"
                className="btn w-full justify-center py-4 text-base font-bold"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)', color: 'white', boxShadow: '0 4px 20px rgba(29,78,216,0.35)' }}>
                <Camera size={18} /> File a Complaint Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section id="workflow" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={workRef} className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
              Complete Enforcement Workflow
            </div>
            <h2 className="text-4xl font-bold text-slate-900 font-display mb-3">
              From Report to Resolution — Fully Tracked
            </h2>
            <p className="text-slate-500">Every step is logged, timestamped and auditable on the GIS dashboard</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {WORKFLOW.map((w, i) => (
              <div key={w.step} className="flex items-center gap-3">
                <div className="card card-hover p-5 text-center w-44 group cursor-default"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {w.icon}
                  </div>
                  <div className="font-bold text-xs font-display mb-1.5" style={{ color: w.color }}>
                    {i + 1}. {w.step}
                  </div>
                  <div className="text-slate-400 text-xs leading-snug">{w.desc}</div>
                  <div className="mt-3 h-1 rounded-full" style={{ background: `${w.color}25` }}>
                    <div className="h-full rounded-full w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: w.color }} />
                  </div>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <ChevronRight size={20} className="text-slate-300 flex-shrink-0 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={featRef} className="reveal text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}>
              Platform Capabilities
            </div>
            <h2 className="text-4xl font-bold text-slate-900 font-display mb-3">
              Built for Civic Enforcement at Scale
            </h2>
            <p className="text-slate-500">Every tool SMKC needs — in one intelligent, role-based platform</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {FEATURES.map(f => (
              <div key={f.title} className="card card-hover card-gradient-border p-6 group bg-white">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `${f.color}12` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 font-display">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: f.color }}>
                  <span>Learn more</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Activity Ticker ── */}
      <section className="py-4 overflow-hidden" style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-6">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap flex-shrink-0 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-400 pulse-dot" />
            Live Feed
          </span>
          <div className="flex gap-6 overflow-hidden">
            {RECENT_COMPLAINTS.map(c => (
              <div key={c.id} className="flex items-center gap-3 whitespace-nowrap text-xs text-slate-400 flex-shrink-0">
                <span className="font-mono text-slate-500">{c.id}</span>
                <span className="text-slate-300 font-medium">{c.type}</span>
                <span className="text-slate-500">·</span>
                <span>{c.location}</span>
                <span className="px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${STATUS_COLORS[c.status] || '#64748b'}22`, color: STATUS_COLORS[c.status] || '#94a3b8' }}>
                  {c.status}
                </span>
                <span className="text-slate-600">{c.time}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Demo Roles ── */}
      <section ref={ctaRef} className="reveal py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #0f2240 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.14) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(20,184,166,0.1)', color: '#5eead4', border: '1px solid rgba(20,184,166,0.22)' }}>
            <Shield size={12} />
            4 Roles · Full RBAC · Live Demo
          </div>
          <h2 className="text-4xl font-bold text-white font-display mb-4">
            Explore NAGAR-NETRA's Full Workflow
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Try any role — from filing a citizen complaint to closing a case as Administrator
          </p>

          {/* Demo role cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger-children">
            {[
              { role: 'Citizen',       icon: '👤', color: '#14b8a6', email: 'citizen@demo.com',      desc: 'File & track complaints' },
              { role: 'Field Officer', icon: '👮', color: '#1d4ed8', email: 'officer@smkc.demo',     desc: 'Inspect & verify cases' },
              { role: 'Supervisor',    icon: '🏛️', color: '#7c3aed', email: 'supervisor@smkc.demo',  desc: 'Issue notices & assign' },
              { role: 'Administrator', icon: '⚙️', color: '#dc2626', email: 'admin@smkc.demo',       desc: 'Full system access' },
            ].map(r => (
              <div key={r.role}
                className="rounded-xl p-4 cursor-pointer transition-all duration-300 group hover:scale-[1.03]"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${r.color}30` }}
                onClick={() => navigate('/login')}>
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="text-white text-sm font-bold mb-0.5">{r.role}</div>
                <div className="text-slate-500 text-[10px] font-mono truncate mb-2">{r.email}</div>
                <div className="text-slate-400 text-xs mb-3">{r.desc}</div>
                <div className="text-xs font-semibold group-hover:gap-2 flex items-center gap-1 transition-all" style={{ color: r.color }}>
                  Try this role <ArrowRight size={11} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/citizen/report-new"
              className="btn btn-lg"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)', color: 'white' }}>
              <Camera size={18} /> Report a Violation <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="btn btn-lg"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              Officer / Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#020810', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Top row */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <SMKCLogo size={32} />
              <div>
                <div className="text-white font-bold">NAGAR-NETRA</div>
                <div className="text-slate-500 text-xs">AI + GIS Civic Enforcement</div>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              A prototype civic enforcement platform for Sangli-Miraj-Kupwad Municipal Corporation.
              Built to modernize hoarding and encroachment management through AI and digital workflows.
            </p>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Quick Links</div>
            <div className="space-y-2">
              {[
                { label: 'Report a Violation',  to: '/citizen/report-new' },
                { label: 'Track My Complaint',  to: '/citizen/track' },
                { label: 'Officer Login',        to: '/login' },
              ].map(l => (
                <Link key={l.label} to={l.to}
                  className="flex items-center gap-2 text-slate-500 text-sm hover:text-teal-400 transition-colors">
                  <ChevronRight size={13} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Mandatory Report Fields</div>
            <div className="space-y-2">
              {[
                { icon: Users,      label: 'Full Name (Complainant)' },
                { icon: Phone,      label: 'Mobile Number (10-digit)' },
                { icon: Camera,     label: 'Photo/Video Evidence' },
                { icon: MapPin,     label: 'GPS / Address of Violation' },
                { icon: AlertCircle, label: 'Violation Type' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-500 text-xs">
                  <Icon size={12} className="text-teal-600 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t px-6 py-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="text-slate-600 text-xs">
            © 2026 Sangli-Miraj-Kupwad Municipal Corporation · NAGAR-NETRA Prototype
          </div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', padding: '4px 12px', borderRadius: 999 }}>
            ⚠️ Prototype v1.0 — Demo Data Only · Not official SMKC data
          </div>
        </div>
      </footer>

    </div>
  );
}
