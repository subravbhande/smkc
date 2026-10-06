import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Search, Shield, MapPin, Brain, Camera, FileText,
  CheckCircle, Activity, Database, ChevronRight, Zap,
  TrendingUp, Phone, MessageSquare, AlertCircle, Eye,
  Users, Clock, Menu, X, CheckCheck, Layers, FileCheck,
  Landmark, Smartphone, ShieldCheck, Scale, ExternalLink,
  AlertTriangle, ArrowUpRight, BarChart3, Radio, Sparkles
} from 'lucide-react';
import SMKCLogo from '../components/SMKCLogo';

// ─── Hero interactive demo data ─────────────────────────────────────
const HERO_CASES = [
  {
    id: 'NNT-2026-004271',
    type: 'Potential Hoarding',
    location: 'Sangli-Miraj Road, Near ROB',
    ward: 'Sangli',
    coords: '16.8524° N, 74.5815° E',
    confidence: 94,
    ocr: 'ABC DEVELOPERS',
    status: 'Field Verification',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    x: '38%',
    y: '42%',
    priority: 'High',
  },
  {
    id: 'NNT-2026-004265',
    type: 'Public Encroachment',
    location: 'Kupwad MIDC Road',
    ward: 'Kupwad',
    coords: '16.8200° N, 74.6300° E',
    confidence: 88,
    ocr: 'TEMPORARY SHED',
    status: 'Notice Issued',
    statusColor: '#dc2626',
    statusBg: '#fee2e2',
    x: '68%',
    y: '65%',
    priority: 'Critical',
  },
  {
    id: 'NNT-2026-004240',
    type: 'Roadside Obstruction',
    location: 'Civil Hospital Chowk, Miraj',
    ward: 'Miraj',
    coords: '16.8300° N, 74.6450° E',
    confidence: 91,
    ocr: 'COMMERCIAL BOARD',
    status: 'Closed · Resolved',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    x: '55%',
    y: '28%',
    priority: 'Resolved',
  },
];

// ─── GIS Section Data ───────────────────────────────────────────────
const GIS_WARS = {
  all: {
    label: 'All Wards (SMKC)',
    active: 18,
    highPriority: 4,
    hotspots: 6,
    resolved: 42,
    cases: [
      { id: 'NNT-4271', type: 'Illegal Hoarding', ward: 'Sangli', top: '35%', left: '32%', status: 'Verification' },
      { id: 'NNT-4265', type: 'Encroachment', ward: 'Kupwad', top: '62%', left: '70%', status: 'Notice' },
      { id: 'NNT-4252', type: 'Banner', ward: 'Miraj', top: '48%', left: '55%', status: 'Active' },
      { id: 'NNT-4240', type: 'Hoarding', ward: 'Miraj', top: '25%', left: '58%', status: 'Resolved' },
      { id: 'NNT-4231', type: 'Encroachment', ward: 'Sangli', top: '50%', left: '25%', status: 'Resolved' },
    ]
  },
  sangli: {
    label: 'Sangli Ward',
    active: 8,
    highPriority: 2,
    hotspots: 3,
    resolved: 19,
    cases: [
      { id: 'NNT-4271', type: 'Illegal Hoarding', ward: 'Sangli', top: '35%', left: '32%', status: 'Verification' },
      { id: 'NNT-4231', type: 'Encroachment', ward: 'Sangli', top: '50%', left: '25%', status: 'Resolved' },
    ]
  },
  miraj: {
    label: 'Miraj Ward',
    active: 6,
    highPriority: 1,
    hotspots: 2,
    resolved: 15,
    cases: [
      { id: 'NNT-4252', type: 'Banner', ward: 'Miraj', top: '48%', left: '55%', status: 'Active' },
      { id: 'NNT-4240', type: 'Hoarding', ward: 'Miraj', top: '25%', left: '58%', status: 'Resolved' },
    ]
  },
  kupwad: {
    label: 'Kupwad Ward',
    active: 4,
    highPriority: 1,
    hotspots: 1,
    resolved: 8,
    cases: [
      { id: 'NNT-4265', type: 'Encroachment', ward: 'Kupwad', top: '62%', left: '70%', status: 'Notice' },
    ]
  }
};

// ─── 7-Step Pipeline Data ───────────────────────────────────────────
const PIPELINE_STEPS = [
  {
    num: '01',
    title: 'REPORT',
    sub: 'Citizen or Officer',
    desc: 'Capture evidence photo, description, and auto GPS coordinates via Web Portal or WhatsApp Bot.',
    icon: Camera,
    color: '#0d9488',
    detail: 'Tamper-evident geo-tagging, mobile number verification constraint, and instant case ID generation.'
  },
  {
    num: '02',
    title: 'AI ANALYSIS',
    sub: 'Vision & OCR Pipeline',
    desc: 'Computer vision classifies hoardings and encroachments; OCR extracts advertiser names and contacts.',
    icon: Brain,
    color: '#3b82f6',
    detail: 'Confidence scoring (e.g. 94%), bounding box coordinates, and preliminary risk stratification.'
  },
  {
    num: '03',
    title: 'GIS MAPPING',
    sub: 'Spatial Intelligence',
    desc: 'Pinpoints exact jurisdiction ward, plots hotspot density, and checks for prior repeat violations.',
    icon: Layers,
    color: '#6366f1',
    detail: 'Layered onto OpenStreetMap & SMKC zone boundaries for city-wide geospatial surveillance.'
  },
  {
    num: '04',
    title: 'OFFICER VERIFY',
    sub: 'Human-in-the-Loop',
    desc: 'Authorized field officer inspects on-site, validates AI recommendations, and uploads ground proof.',
    icon: ShieldCheck,
    color: '#0284c7',
    detail: 'Human accountability guarantee: No enforcement is triggered without designated officer sign-off.'
  },
  {
    num: '05',
    title: 'NOTICE ISSUED',
    sub: 'Digital Due Process',
    desc: 'Official municipal notice generated with legal compliance deadlines (e.g. 48 hours for removal).',
    icon: FileCheck,
    color: '#d97706',
    detail: 'Automated notice reference numbering (e.g. SMKC-NOT-2026-0692) linked permanently to case history.'
  },
  {
    num: '06',
    title: 'ENFORCEMENT',
    sub: 'Field Demolition/Removal',
    desc: 'Municipal squad dispatched if deadline elapses without owner compliance; structure removed safely.',
    icon: Zap,
    color: '#dc2626',
    detail: 'Demolition logs, penalty assessment, and removal squad activity recorded with time stamps.'
  },
  {
    num: '07',
    title: 'RESOLUTION',
    sub: 'Verified Closure',
    desc: 'Before/after geo-tagged evidence uploaded; case permanently closed with tamper-proof audit trail.',
    icon: CheckCircle,
    color: '#16a34a',
    detail: 'Citizen receives resolution notification; public sidewalk or sightline restored to the city.'
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHeroCase, setActiveHeroCase] = useState(HERO_CASES[0]);
  const [activePipelineIdx, setActivePipelineIdx] = useState(1);
  const [selectedWard, setSelectedWard] = useState('all');
  const [beforeAfterMode, setBeforeAfterMode] = useState('after');

  // Handle navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-teal-500 selection:text-white">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: PREMIUM STICKY NAVBAR & CIVIC HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Official Government Strip */}
        <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="font-medium text-slate-200 truncate">
                Government of Maharashtra · Sangli-Miraj-Kupwad Municipal Corporation (SMKC)
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-slate-400 text-[10px] flex-shrink-0 font-medium">
              <span>Citizen Helpline: <strong className="text-white font-mono">1800-233-5599</strong></span>
              <span className="text-slate-700">|</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                GIS Feed: Active
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`transition-all duration-300 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm py-2.5'
              : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/70 py-3'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 lg:gap-6">

              {/* Left: Brand + Official SMKC Subtitle */}
              <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
                <div className="p-1 rounded-full bg-slate-100 ring-1 ring-slate-200 group-hover:ring-blue-400 transition-all flex-shrink-0">
                  <SMKCLogo size={34} />
                </div>
                <div className="flex flex-col flex-shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight whitespace-nowrap">
                      NAGAR-NETRA
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                      SMKC
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium tracking-wide whitespace-nowrap hidden sm:block">
                    Civic Enforcement Platform
                  </span>
                </div>
              </Link>

              {/* Middle: Desktop Navigation Links (Desktop Wide >= 1280px) */}
              <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#hero" className="whitespace-nowrap hover:text-blue-700 transition-colors">Home</a>
                <a href="#how-it-works" className="whitespace-nowrap hover:text-blue-700 transition-colors">How It Works</a>
                <a href="#features" className="whitespace-nowrap hover:text-blue-700 transition-colors">Features</a>
                <a href="#gis-intelligence" className="whitespace-nowrap hover:text-blue-700 transition-colors">GIS Intelligence</a>
                <a href="#responsible-ai" className="whitespace-nowrap hover:text-blue-700 transition-colors">Responsible AI</a>
                <a href="#about" className="whitespace-nowrap hover:text-blue-700 transition-colors">About</a>
              </div>

              {/* Middle: Streamlined Links for Medium-Laptops (1024px to 1279px, e.g. 1036px) */}
              <div className="hidden lg:flex xl:hidden items-center gap-4 text-xs font-semibold text-slate-600">
                <a href="#hero" className="whitespace-nowrap hover:text-blue-700 transition-colors">Home</a>
                <a href="#how-it-works" className="whitespace-nowrap hover:text-blue-700 transition-colors">Workflow</a>
                <a href="#features" className="whitespace-nowrap hover:text-blue-700 transition-colors">Features</a>
                <a href="#gis-intelligence" className="whitespace-nowrap hover:text-blue-700 transition-colors">GIS Radar</a>
                <a href="#responsible-ai" className="whitespace-nowrap hover:text-blue-700 transition-colors">AI Pipeline</a>
              </div>

              {/* Right: Action Buttons */}
              <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 flex-shrink-0">
                <button
                  onClick={() => navigate('/track')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all flex items-center gap-1.5 whitespace-nowrap">
                  <Search size={13} className="text-blue-600 flex-shrink-0" />
                  <span>Track Complaint</span>
                </button>
                <button
                  onClick={() => navigate('/report')}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap">
                  <Camera size={13} className="flex-shrink-0" />
                  <span>Report Violation</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-lg border border-slate-200/80 hover:border-blue-200 transition-all flex items-center gap-1.5 whitespace-nowrap"
                  title="Official Portal Login">
                  <Shield size={14} className="text-blue-600 flex-shrink-0" />
                  <span className="hidden xl:inline">Officer Login</span>
                </button>
              </div>

              {/* Mobile Hamburger Menu Button (< 640px) */}
              <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate('/report')}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg text-white bg-blue-600 shadow-xs whitespace-nowrap">
                  Report
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200 flex-shrink-0"
                  aria-label="Toggle Menu">
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="sm:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 shadow-lg animate-slide-in">
              <div className="flex flex-col space-y-2.5 text-sm font-medium text-slate-600 pt-2 border-t border-slate-100">
                <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-blue-700">Home</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-blue-700">How It Works</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-blue-700">Features</a>
                <a href="#gis-intelligence" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-blue-700">GIS Intelligence</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-blue-700">About SMKC</a>
              </div>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/report'); }}
                  className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 flex items-center justify-center gap-2 shadow-sm">
                  <Camera size={14} /> Report a Violation
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/track'); }}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 flex items-center justify-center gap-2">
                  <Search size={14} className="text-blue-600" /> Track Complaint
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/whatsapp-simulator'); }}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2">
                  <MessageSquare size={14} className="text-emerald-600" /> WhatsApp Reporting Demo
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5">
                  <Shield size={14} /> Official / Officer Portal Login
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5, 6 & 7: HERO SECTION + AI/GIS COMMAND VISUAL
          ═══════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/25 to-white text-slate-900 border-b border-slate-200">
        {/* Subtle grid pattern & background atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 20%, rgba(37,99,235,0.06) 0%, transparent 70%),
                              linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left 7 Columns: Editorial Headline, Tagline, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Government Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                SMKC CIVIC INTELLIGENCE PLATFORM
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.08]">
                  Digital Eyes.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600">
                    Verified Action.
                  </span>
                </h1>
                <p className="font-display font-semibold text-lg sm:text-xl text-blue-900/90 tracking-wide pt-1">
                  See civic violations. Verify them with evidence. Resolve them faster.
                </p>
              </div>

              {/* Explanatory Paragraph */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                NAGAR-NETRA connects citizens, field officers and municipal authorities through AI-powered detection, geo-tagged evidence, GIS mapping and end-to-end enforcement workflows.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/report')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group">
                  <span>Report a Violation</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/track')}
                  className="px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2">
                  <Search size={15} className="text-blue-600" />
                  <span>Track Complaint</span>
                </button>

                <button
                  onClick={() => navigate('/whatsapp-simulator')}
                  className="px-5 py-3.5 rounded-xl font-semibold text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-xs transition-all flex items-center justify-center gap-2">
                  <MessageSquare size={15} className="text-emerald-600" />
                  <span>Report via WhatsApp</span>
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                <Landmark size={14} className="text-blue-600 flex-shrink-0" />
                <span>Built for Sangli-Miraj-Kupwad Municipal Corporation (SMKC)</span>
              </div>
            </div>

            {/* Right 5 Columns: Sophisticated GIS + AI Command Display */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/60 overflow-hidden p-4 sm:p-5">

                {/* Command Canvas Top Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-mono text-[11px] text-blue-700 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80">
                      GIS RADAR · LIVE
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    SANGLI JURISDICTION
                  </span>
                </div>

                {/* Stylized City Vector Map Area */}
                <div className="relative h-64 sm:h-72 w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                  {/* Subtle Grid Vectors */}
                  <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="cityGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeOpacity="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cityGrid)" />
                    {/* Simulated Arterial Roads / Krishna River line */}
                    <path d="M 0,90 Q 90,140 180,110 T 360,180" fill="none" stroke="#38bdf8" strokeWidth="3" strokeOpacity="0.8" />
                    <path d="M 40,240 L 160,80 L 320,130" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
                  </svg>

                  {/* Ward Labels */}
                  <div className="absolute top-4 left-6 text-[10px] font-mono text-slate-500 font-bold tracking-wider">
                    ZONE 1 · SANGLI
                  </div>
                  <div className="absolute bottom-4 left-10 text-[10px] font-mono text-slate-500 font-bold tracking-wider">
                    ZONE 2 · KUPWAD MIDC
                  </div>
                  <div className="absolute top-12 right-6 text-[10px] font-mono text-slate-500 font-bold tracking-wider">
                    ZONE 3 · MIRAJ
                  </div>

                  {/* Interactive Map Markers */}
                  {HERO_CASES.map((item) => {
                    const isSelected = activeHeroCase.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveHeroCase(item)}
                        style={{ top: item.y, left: item.x }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                        aria-label={`View Case ${item.id}`}>
                        <span
                          className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                            isSelected ? 'bg-blue-400' : 'bg-slate-400'
                          }`}
                        />
                        <div
                          className={`relative w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-md transition-transform ${
                            isSelected
                              ? 'bg-blue-600 text-white ring-4 ring-blue-500/25 scale-125'
                              : 'bg-slate-200 text-slate-700 hover:scale-110 border border-slate-300'
                          }`}>
                          📍
                        </div>
                      </button>
                    );
                  })}

                  {/* Detection Bounding Box Graphic Overlay on Map */}
                  <div className="absolute top-4 right-4 pointer-events-none border border-blue-200 bg-white/95 rounded-md p-1.5 shadow-sm text-[9px] font-mono text-blue-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>AI DETECTED · {activeHeroCase.confidence}% CONF</span>
                    </div>
                  </div>
                </div>

                {/* Active Case Telemetry Panel */}
                <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {activeHeroCase.id}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: activeHeroCase.statusBg, color: activeHeroCase.statusColor }}>
                        {activeHeroCase.status}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      AI: {activeHeroCase.confidence}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-slate-200 text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[10px]">VIOLATION:</span>
                      <span className="font-semibold text-slate-900">{activeHeroCase.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">COORDINATES:</span>
                      <span className="font-mono text-slate-700">{activeHeroCase.coords}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">LOCATION:</span>
                      <span className="truncate block font-medium">{activeHeroCase.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">OCR DETECTED:</span>
                      <span className="font-mono text-amber-700 font-semibold">{activeHeroCase.ocr}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60">
                    <span>Click any marker to inspect</span>
                    <button
                      onClick={() => navigate('/map')}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                      Full Case Map <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: TRUST / IMPACT STRIP
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-200/90 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                title: 'AI-Powered',
                sub: 'Intelligent evidence analysis',
                icon: Brain,
                color: '#0d9488',
                bgColor: '#f0fdfa'
              },
              {
                title: 'Geo-Tagged',
                sub: 'Location-aware reporting',
                icon: MapPin,
                color: '#0284c7',
                bgColor: '#f0f9ff'
              },
              {
                title: 'End-to-End',
                sub: 'Report to resolution',
                icon: Activity,
                color: '#7c3aed',
                bgColor: '#faf5ff'
              },
              {
                title: 'Auditable',
                sub: 'Every action recorded',
                icon: ShieldCheck,
                color: '#16a34a',
                bgColor: '#f0fdf4'
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: item.bgColor, color: item.color }}>
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: PROBLEM SECTION (BEFORE VS WITH NAGAR-NETRA)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              The Civic Challenge
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              Civic problems are easy to report.<br />
              Managing them shouldn't be.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Traditional municipal reporting suffers from scattered hotlines, unverifiable photos, manual verification backlogs, and untracked enforcement deadlines. NAGAR-NETRA replaces administrative friction with transparent, data-driven execution.
            </p>
          </div>

          {/* Visual Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* BEFORE Card */}
            <div className="rounded-2xl bg-white border border-rose-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-extrabold text-rose-600 tracking-wider text-sm uppercase">
                  BEFORE
                </span>
                <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                  Fragmented Workflow
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Disconnected complaints', desc: 'Reports arrive scattered via calls, letters, paper registries & social media.' },
                  { title: 'Manual verification', desc: 'Officers travel blindly without verified coordinates, wasting field time.' },
                  { title: 'Scattered evidence', desc: 'Permit files stored in paper archives; prior spot violations missed.' },
                  { title: 'Delayed action', desc: 'Unenforced removal orders, compliance deadlines expire without accountability.' },
                ].map((step, idx) => (
                  <div key={step.title} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
                      <p className="text-xs text-slate-500 leading-normal">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WITH NAGAR-NETRA Card */}
            <div className="rounded-2xl bg-white border border-teal-300 p-6 sm:p-8 shadow-md relative overflow-hidden ring-1 ring-teal-500/20">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-extrabold text-teal-700 tracking-wider text-sm uppercase">
                  WITH NAGAR-NETRA
                </span>
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Unified Accountability
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'One report', desc: 'Unified intake from web and WhatsApp with mandatory citizen identity constraint.' },
                  { title: 'AI assistance + Geo-tagged evidence', desc: 'YOLOv8 vision detection + OCR with tamper-proof EXIF GPS coordinates.' },
                  { title: 'Officer verification', desc: 'Human-in-the-loop: Ground-truthing with authorized inspector sign-off.' },
                  { title: 'Digital notice → Enforcement → Closure', desc: 'Automated legal notice, crew dispatch, and before/after audit trail.' },
                ].map((step, idx) => (
                  <div key={step.title} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                      <p className="text-xs text-slate-600 leading-normal">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 10: CORE SOLUTION SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Core Architecture
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              One platform. One case.<br />Complete accountability.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              NAGAR-NETRA turns a citizen report or field observation into a traceable municipal case.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Report',
                desc: 'Citizen or field officer submits geotagged photo, description, and contact evidence.',
                icon: Camera,
                color: '#0d9488'
              },
              {
                num: '02',
                title: 'Detect',
                desc: 'AI identifies potential hoardings and encroachments with bounding-box analysis.',
                icon: Brain,
                color: '#2563eb'
              },
              {
                num: '03',
                title: 'Locate',
                desc: 'GPS and GIS map the exact location, municipal ward boundaries, and hotspot density.',
                icon: MapPin,
                color: '#7c3aed'
              },
              {
                num: '04',
                title: 'Verify',
                desc: 'Authorized officers validate the violation through on-site field inspection.',
                icon: ShieldCheck,
                color: '#0284c7'
              },
              {
                num: '05',
                title: 'Act',
                desc: 'Notices, legal compliance deadlines, and enforcement crew actions are managed digitally.',
                icon: FileCheck,
                color: '#d97706'
              },
              {
                num: '06',
                title: 'Resolve',
                desc: 'Before/after evidence closes the loop permanently with public notice archives.',
                icon: CheckCircle,
                color: '#16a34a'
              },
            ].map((card) => (
              <div
                key={card.num}
                className="rounded-2xl p-6 bg-slate-50/80 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-bold text-sm text-slate-400 group-hover:text-teal-600 transition-colors">
                    {card.num}
                  </span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'white', color: card.color, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <card.icon size={18} />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 11: "HOW IT WORKS" WORKFLOW PIPELINE
          ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 lg:py-24 bg-slate-50/80 border-b border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
              End-to-End Pipeline
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              How NAGAR-NETRA Works
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Every complaint follows a structured 7-stage verifiable lifecycle from initial capture to physical resolution.
            </p>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {PIPELINE_STEPS.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => setActivePipelineIdx(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activePipelineIdx === idx
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
                }`}>
                <span className="font-mono">{step.num}</span>
                <span>{step.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Feature Showcase */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-lg shadow-slate-200/50">
            {(() => {
              const current = PIPELINE_STEPS[activePipelineIdx];
              const StepIcon = current.icon;
              return (
                <div className="grid md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-4 flex flex-col items-start space-y-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ background: current.color, color: 'white' }}>
                      <StepIcon size={32} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600">
                        PHASE {current.num} OF 07
                      </span>
                      <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                        {current.title}
                      </h3>
                      <p className="text-slate-500 text-xs font-medium">
                        {current.sub}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-4 border-t md:border-t-0 md:border-l border-slate-200 md:pl-8 pt-4 md:pt-0">
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                      {current.desc}
                    </p>
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 flex items-start gap-3">
                      <Sparkles size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-blue-900 block mb-0.5">Municipal Integrity Guard:</strong>
                        {current.detail}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 12: AI SECTION ("AI assists the officer. It doesn't replace the officer.")
          ═══════════════════════════════════════════════════════════════ */}
      <section id="responsible-ai" className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Human-in-the-Loop Vision
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              AI assists the officer.<br />
              It doesn't replace the officer.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Automated computer vision performs rapid evidence triage and OCR text extraction, but final legal enforcement decisions are strictly reserved for authorized municipal officers.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Left: Uploaded Evidence Photo with Bounding Box Overlay */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg">
                {/* Photo Simulation */}
                <div className="h-64 sm:h-72 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative p-6">
                  {/* Background Mock Hoarding Graphic */}
                  <div className="w-full max-w-sm h-36 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-3 text-center bg-white/80 shadow-xs">
                    <span className="text-3xl mb-1">🏢</span>
                    <span className="font-display font-bold text-slate-900 text-sm">ABC DEVELOPERS · LUXURY APARTMENTS</span>
                    <span className="text-xs font-mono text-slate-500">CONTACT: +91 98XXXXXXXX</span>
                  </div>

                  {/* AI Detection Bounding Box Graphic */}
                  <div className="absolute inset-8 border-2 border-blue-500 bg-blue-500/10 rounded-md pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                        UNAUTHORIZED_HOARDING · 94%
                      </span>
                      <span className="font-mono text-[9px] text-blue-800 font-semibold bg-white/80 px-1 rounded">
                        16.8524, 74.5815
                      </span>
                    </div>
                    <div className="self-end bg-white text-slate-800 font-mono text-[9px] px-2 py-0.5 rounded border border-slate-300 shadow-xs">
                      OCR: ABC DEVELOPERS
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>RAW EVIDENCE: IMG_20261004_SMKC.JPG</span>
                  <span className="text-blue-700 font-mono font-semibold">YOLOv8 + EASYOCR</span>
                </div>
              </div>
            </div>

            {/* Right: AI Analysis Structured Breakdown */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Model Inference Breakdown
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                    High Confidence: 94%
                  </span>
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Detected Class:</span>
                    <span className="font-semibold text-slate-900">Potential Illegal Hoarding</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Extracted Advertiser:</span>
                    <span className="font-mono font-bold text-slate-900">ABC DEVELOPERS</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Permit Registry Check:</span>
                    <span className="font-bold text-rose-600">No Active Permit (Expired 30 Sep)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Risk Assessment:</span>
                    <span className="font-semibold text-amber-700">High (Footpath Encroachment)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">System Recommendation:</span>
                    <span className="font-semibold text-teal-700">Field Verification Required</span>
                  </div>
                </div>
              </div>

              {/* Crucial Responsible AI Disclaimer Box */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Responsible AI Principle:</strong> "AI results are advisory. Final verification is performed by an authorized municipal officer before any legal notice is issued."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 13: GIS SECTION ("See the city as a living map.")
          ═══════════════════════════════════════════════════════════════ */}
      <section id="gis-intelligence" className="py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200/80">
              Spatial Intelligence
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              See the city as a living map.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Track active violations, examine ward-level density, spot repeat encroachment hotspots, and route field enforcement squads efficiently.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left 8 Cols: Interactive GIS Canvas */}
            <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-5 shadow-lg shadow-slate-200/50 space-y-4">
              {/* Ward Selector Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                <div className="flex gap-2">
                  {Object.entries(GIS_WARS).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedWard(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedWard === key
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                      }`}>
                      {data.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  SMKC BOUNDARY: 16.85° N, 74.58° E
                </span>
              </div>

              {/* Map Preview Area */}
              <div className="relative h-72 sm:h-80 w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-60">
                  <defs>
                    <pattern id="gisGrid2" width="24" height="24" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#94a3b8" fillOpacity="0.6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gisGrid2)" />
                  {/* Stylized road network */}
                  <path d="M 20,40 L 180,140 L 400,100" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />
                  <path d="M 80,260 L 220,160 L 320,280" stroke="#94a3b8" strokeWidth="2" fill="none" />
                </svg>

                {/* Hotspot Pulse Rings */}
                <div className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full bg-rose-500/15 border border-rose-400 animate-pulse pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-xs">
                  <span className="text-[9px] font-mono text-rose-700 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-xs">HOTSPOT 1</span>
                </div>

                {/* Case Pins for Active Ward */}
                {GIS_WARS[selectedWard].cases.map((c) => (
                  <div
                    key={c.id}
                    style={{ top: c.top, left: c.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 p-1 px-2 rounded-md bg-white border border-slate-200 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span className="font-mono text-[10px] text-slate-900 font-bold">{c.id}</span>
                    <span className="text-[9px] text-slate-500">({c.ward})</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">
                  Live layer view with ward zones and verified GPS points.
                </span>
                <button
                  onClick={() => navigate('/map')}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-1.5">
                  Explore Case Map <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right 4 Cols: GIS KPI Intelligence Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg shadow-slate-200/50 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-slate-900 text-base">
                    GIS Intelligence
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    Live Ward Feed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Active Cases</span>
                    <span className="font-display font-extrabold text-2xl text-slate-900">
                      {GIS_WARS[selectedWard].active}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">High Priority</span>
                    <span className="font-display font-extrabold text-2xl text-rose-600">
                      {GIS_WARS[selectedWard].highPriority}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Active Hotspots</span>
                    <span className="font-display font-extrabold text-2xl text-amber-600">
                      {GIS_WARS[selectedWard].hotspots}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Resolved Cases</span>
                    <span className="font-display font-extrabold text-2xl text-emerald-600">
                      {GIS_WARS[selectedWard].resolved}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
                  Data aggregates geo-spatial reports across Sangli, Miraj, and Kupwad municipal divisions for rapid supervisor review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 14: WHATSAPP SECTION (ZERO-APP CITIZEN REPORTING)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Left 6 Cols: Explanatory Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Inclusive Citizen Access
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
                Report from WhatsApp.<br />
                No new app required.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Citizens can send a photo, location and description through WhatsApp. NAGAR-NETRA converts the conversation into a structured municipal case with automated AI review.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Zero app installation required for citizens',
                  'Instant case ID generated directly in the chat',
                  'Send GPS pin with native WhatsApp location sharing',
                  'Track case status anytime by replying STATUS [Case ID]',
                ].map((pt) => (
                  <div key={pt} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                    <CheckCheck size={18} className="text-green-600 flex-shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => navigate('/whatsapp-simulator')}
                  className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#25d366] hover:bg-[#20ba59] shadow-md shadow-green-900/20 transition-all flex items-center gap-2">
                  <MessageSquare size={16} /> Try WhatsApp Demo
                </button>
                <button
                  onClick={() => navigate('/track')}
                  className="px-5 py-3 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all">
                  Track Existing Case
                </button>
              </div>

              <div className="text-xs text-slate-400">
                * Simulated WhatsApp bot interface for demonstration & evaluation purposes.
              </div>
            </div>

            {/* Right 6 Cols: Realistic WhatsApp Mockup Frame */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#111b21] border border-slate-800 shadow-2xl max-w-sm mx-auto overflow-hidden">
                {/* WA Top Bar */}
                <div className="bg-[#1f2c34] p-3.5 flex items-center gap-3 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                    🏛️
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-bold truncate">SMKC Nagar-Netra</h4>
                    <span className="text-[11px] text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                      Official Channel · Active Bot
                    </span>
                  </div>
                </div>

                {/* WA Chat Log */}
                <div className="p-4 space-y-3 bg-[#efeae2] text-xs">
                  {/* Citizen MSG */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none px-3.5 py-2 bg-[#d9fdd3] text-slate-800 shadow-xs">
                      <p>Illegal hoarding erected near Sangli-Miraj Road overbridge.</p>
                      <span className="text-[9px] text-slate-500 block text-right mt-1">10:14 AM</span>
                    </div>
                  </div>

                  {/* Bot MSG */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-none px-3.5 py-2 bg-white text-slate-800 shadow-xs border border-slate-200/60">
                      <p>🏛️ Namaste! Please send a clear evidence photo of the violation.</p>
                      <span className="text-[9px] text-slate-400 block text-right mt-1">10:14 AM</span>
                    </div>
                  </div>

                  {/* Citizen MSG: Photo */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none p-2 bg-[#d9fdd3] text-slate-800 shadow-xs space-y-1">
                      <div className="h-20 bg-slate-100 rounded-lg flex items-center justify-center text-center border border-emerald-200/60">
                        <div>
                          <Camera size={20} className="mx-auto text-emerald-600 mb-1" />
                          <span className="text-[10px] text-slate-700 font-medium">photo_evidence.jpg</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 block text-right">10:15 AM</span>
                    </div>
                  </div>

                  {/* Bot MSG: Location Request */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-none px-3.5 py-2 bg-white text-slate-800 shadow-xs border border-slate-200/60">
                      <p>Please share your current GPS location to pin this complaint on our GIS map.</p>
                      <span className="text-[9px] text-slate-400 block text-right mt-1">10:15 AM</span>
                    </div>
                  </div>

                  {/* Citizen MSG: Location */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none px-3.5 py-2 bg-[#d9fdd3] text-slate-800 shadow-xs flex items-center gap-2">
                      <MapPin size={18} className="text-emerald-700 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block">Location Shared</span>
                        <span className="text-[10px] text-emerald-800">Sangli-Miraj Road (16.8524°N, 74.5815°E)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bot Confirmation Case Card */}
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl rounded-tl-none p-3 bg-white text-slate-800 border border-emerald-400 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <CheckCheck size={14} />
                        <span>Case Registered Successfully!</span>
                      </div>
                      <div className="font-mono text-slate-800 text-[11px] bg-slate-50 border border-slate-200 p-2 rounded">
                        <div>CASE ID: <strong className="text-slate-900">NNT-2026-004271</strong></div>
                        <div>STATUS: <strong className="text-amber-700">Under Review</strong></div>
                        <div>AI SCORE: <strong className="text-emerald-700">94% Confidence</strong></div>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Reply STATUS NNT-2026-004271 to track updates anytime.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#1f2c34] text-center text-xs text-slate-400">
                  <button
                    onClick={() => navigate('/whatsapp-simulator')}
                    className="text-teal-400 hover:underline font-semibold">
                    Launch Interactive WhatsApp Simulator →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 15 & 16: CASE LIFECYCLE & BEFORE/AFTER RESOLUTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Verified Resolution
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              From reported problem to verified resolution.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Every complaint leaves an immutable audit trail. Compare the site before and after municipal action.
            </p>
          </div>

          {/* Before / After Comparison Showcase */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  CASE ID: NNT-2026-004271
                </span>
                <h3 className="font-display font-bold text-slate-900 text-lg mt-1">
                  Unauthorized Commercial Billboard Removal
                </h3>
                <span className="text-xs text-slate-500">
                  Location: Sangli-Miraj Road, Near Railway Overbridge
                </span>
              </div>

              {/* View Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setBeforeAfterMode('before')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    beforeAfterMode === 'before'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}>
                  BEFORE VIOLATION
                </button>
                <button
                  onClick={() => setBeforeAfterMode('after')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    beforeAfterMode === 'after'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}>
                  AFTER REMOVAL ✓
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className={`mt-6 rounded-2xl overflow-hidden border min-h-[260px] flex flex-col justify-between p-6 relative shadow-sm transition-all ${
              beforeAfterMode === 'before'
                ? 'bg-rose-50/60 border-rose-200 text-slate-900'
                : 'bg-emerald-50/60 border-emerald-200 text-slate-900'
            }`}>
              {beforeAfterMode === 'before' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                      EVIDENCE PHOTOGRAPH (DAY 01)
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      GPS: 16.8524° N, 74.5815° E
                    </span>
                  </div>
                  <div className="my-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-rose-100 border border-rose-300 mx-auto flex items-center justify-center text-3xl mb-3 shadow-xs">
                      🚧
                    </div>
                    <h4 className="font-display font-bold text-xl text-slate-900">
                      Unauthorized 40ft Structural Hoarding Obstructing Pedestrian Walkway
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      No municipal permit issued · Advertiser: ABC Developers · Risk: High
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-rose-800 font-mono border-t border-rose-200 pt-3">
                    <span>STATUS: FIELD VERIFICATION COMPLETED</span>
                    <span>ACTION: 48H NOTICE ISSUED</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                      POST-ENFORCEMENT AUDIT (DAY 03)
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      GPS: 16.8524° N, 74.5815° E
                    </span>
                  </div>
                  <div className="my-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-3xl mb-3 shadow-xs">
                      ✅
                    </div>
                    <h4 className="font-display font-bold text-xl text-slate-900">
                      Structure Dismantled & Public Right-of-Way Completely Restored
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Verified by Field Officer Vijay Kadam · Penalty assessed · Before/After photo approved
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-800 font-mono border-t border-emerald-200 pt-3">
                    <span>STATUS: RESOLVED & CLOSED</span>
                    <span>AUDIT: IMMUTABLE ARCHIVE</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-3 text-center text-xs text-slate-400">
              * Demonstration scenario showcasing closed-loop municipal enforcement.
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 17: CENTRAL COMMAND CENTER SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-slate-50/80 border-b border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
                Municipal Operations
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
                One view for the entire city.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Supervisors and municipal administrators monitor real-time case triage, field officer workloads, compliance countdowns, and ward hotspot distributions in a unified dashboard.
              </p>

              <div className="space-y-3">
                {[
                  'Real-time case triage across Sangli, Miraj, and Kupwad',
                  'Automated notice delivery tracking and statutory countdowns',
                  'Balanced workload distribution among certified field officers',
                  'Audit log exporter for municipal compliance meetings',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCheck size={16} className="text-blue-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                  <Shield size={16} /> Explore SMKC Command Center
                </button>
              </div>
            </div>

            {/* Dashboard UI Mockup Preview */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-lg shadow-slate-200/50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="font-mono text-slate-900 font-bold">SMKC CENTRAL DASHBOARD</span>
                  </div>
                  <span className="text-slate-500 font-medium">JURISDICTION: SANGLI-MIRAJ-KUPWAD</span>
                </div>

                {/* Dashboard Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">TOTAL CASES</span>
                    <span className="font-display font-bold text-xl text-slate-900">18</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">VERIFYING</span>
                    <span className="font-display font-bold text-xl text-amber-600">7</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">NOTICES ACTIVE</span>
                    <span className="font-display font-bold text-xl text-rose-600">5</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-medium">RESOLVED</span>
                    <span className="font-display font-bold text-xl text-emerald-600">42</span>
                  </div>
                </div>

                {/* Mini Workload & Recent Cases List */}
                <div className="space-y-2 text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                    Recent Verified Enforcement Stream
                  </span>
                  {[
                    { id: 'NNT-4271', issue: 'Illegal Hoarding', ward: 'Sangli', officer: 'Vijay Kadam', status: 'Verification' },
                    { id: 'NNT-4265', issue: 'Encroachment', ward: 'Kupwad', officer: 'Amol Shinde', status: 'Notice Sent' },
                    { id: 'NNT-4240', issue: 'Road Obstruction', ward: 'Miraj', officer: 'Priya Sharma', status: 'Dismantled' },
                  ].map((row) => (
                    <div key={row.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-600 font-bold">{row.id}</span>
                        <span>{row.issue} · {row.ward}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{row.officer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 18: ROLE-BASED EXPERIENCE
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Role Specialization
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              One platform. Different experiences.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Every stakeholder interacts with tailored interfaces designed for their specific civic duty.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: 'Citizen',
                badge: 'Public',
                desc: 'Report violations in seconds via Web or WhatsApp. Track resolution progress with Case ID or registered mobile.',
                icon: Users,
                features: ['Zero App WhatsApp', 'Mobile Tracking', 'SMS Updates'],
                cta: 'Report / Track',
                onClick: () => navigate('/report')
              },
              {
                role: 'Field Officer',
                badge: 'Operations',
                desc: 'Mobile-first field view for on-site inspection, GIS navigation, camera evidence capture, and ground verification.',
                icon: Shield,
                features: ['Turn-by-turn Navigation', 'Offline GPS Capture', 'Verification Logs'],
                cta: 'Officer Portal',
                onClick: () => navigate('/login')
              },
              {
                role: 'Supervisor',
                badge: 'Enforcement',
                desc: 'Ward-level oversight, officer assignment, legal compliance notices, statutory deadline monitoring, and action approvals.',
                icon: FileCheck,
                features: ['Automated Notices', 'Workload Balancing', 'Compliance Clock'],
                cta: 'Supervisor Portal',
                onClick: () => navigate('/login')
              },
              {
                role: 'Administrator',
                badge: 'Governance',
                desc: 'City-wide spatial analytics, officer accounts, ward zoning boundaries, system integrations, and full audit logs.',
                icon: Landmark,
                features: ['GIS Heatmaps', 'Zone Management', 'Audit Trail Export'],
                cta: 'Admin Console',
                onClick: () => navigate('/login')
              },
            ].map((card) => (
              <div
                key={card.role}
                className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-teal-600 border border-slate-200 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <card.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                    {card.role}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {card.desc}
                  </p>
                  <ul className="space-y-1.5 mb-6">
                    {card.features.map(f => (
                      <li key={f} className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={card.onClick}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-colors flex items-center justify-center gap-1">
                  <span>{card.cta}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 19: FEATURE GRID (10 KEY CAPABILITIES)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 lg:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Platform Features
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              Comprehensive Civic Technology
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Engineered specifically for municipal municipal corporations to enforce public rights-of-way and advertisement guidelines.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {[
              { title: 'AI Detection', desc: 'Identify hoardings & encroachments with bounding box coordinates.', icon: Brain },
              { title: 'OCR Engine', desc: 'Extract advertiser name, campaign text & contact numbers instantly.', icon: FileText },
              { title: 'Geo-Tagged Evidence', desc: 'Tamper-evident camera capture with embedded GPS coordinates & time.', icon: Camera },
              { title: 'GIS Mapping', desc: 'Real-time vector and heatmap visualizations of active complaints.', icon: Layers },
              { title: 'Permit Verification', desc: 'Automatic cross-check against municipal authorized permit registry.', icon: FileCheck },
              { title: 'Digital Notices', desc: 'Generate standardized statutory compliance notices with deadlines.', icon: AlertTriangle },
              { title: 'Enforcement Tracking', desc: 'Log physical removal crew dispatches and penalty assessments.', icon: Zap },
              { title: 'Historical Intelligence', desc: 'Identify repeat offenders and persistent violation hotspots over time.', icon: TrendingUp },
              { title: 'Full Audit Trail', desc: 'Immutable records of every user action, status change & timestamp.', icon: ShieldCheck },
              { title: 'WhatsApp Reporting', desc: 'Zero-friction citizen participation via conversational messaging.', icon: MessageSquare },
            ].map((feat) => (
              <div
                key={feat.title}
                className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                  <feat.icon size={18} />
                </div>
                <h4 className="font-display font-bold text-slate-900 text-sm mb-1.5">
                  {feat.title}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 20 & 21: RESPONSIBLE AI + GEOSPATIAL COMPATIBILITY
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Responsible AI 3 Pillars */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Ethical Governance
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-3">
                Technology assists decisions.<br />People remain accountable.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Three foundational principles that govern every algorithm in NAGAR-NETRA.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: 'Human Verification',
                  desc: 'AI only identifies potential violations. An authorized municipal officer must validate evidence in person before any notice or fine is issued.',
                  icon: Scale
                },
                {
                  title: 'Evidence First',
                  desc: 'Every single case is grounded in tamper-evident imagery, EXIF timestamps, and verifiable GPS coordinates that hold up to legal scrutiny.',
                  icon: Camera
                },
                {
                  title: 'Full Auditability',
                  desc: 'Every recommendation, edit, and notice is logged permanently with the identity of the responsible officer and exact timestamp.',
                  icon: ShieldCheck
                },
              ].map((pil) => (
                <div key={pil.title} className="rounded-2xl p-6 bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                    <pil.icon size={20} />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-base mb-2">
                    {pil.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Geospatial Compatibility Strip */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 border border-blue-200 text-slate-900 p-6 sm:p-8 max-w-5xl mx-auto text-center space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider bg-blue-100/60 px-2.5 py-1 rounded border border-blue-200">
              Interoperable Standards
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
              Built for modern geospatial workflows.
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
              NAGAR-NETRA coordinates and vector layers are architected for open GIS interchange with state and national mapping infrastructure.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {['Leaflet GIS', 'OpenStreetMap', 'GeoJSON Layers', 'KML / KMZ Export', 'NIC Geo-Portals', 'ESRI Shapefiles'].map(std => (
                <span key={std} className="px-3 py-1.5 rounded-lg bg-white text-xs font-mono text-slate-700 border border-slate-200 shadow-xs">
                  {std}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 22: QUALITATIVE IMPACT SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Civic Outcomes
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-3 mb-4">
              Measurable Civic Impact
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Transforming urban governance through transparency, faster field cycles, and cleaner public rights-of-way.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: 'Faster Reporting',
                desc: 'Structured intakes from Web and WhatsApp in under 60 seconds with auto location capture.',
                icon: Zap
              },
              {
                title: 'Better Verification',
                desc: 'AI-assisted OCR and hazard classification give field officers instant context before arrival.',
                icon: Brain
              },
              {
                title: 'Greater Visibility',
                desc: 'Unified GIS map view across Sangli, Miraj, and Kupwad exposes repeat hotspots effortlessly.',
                icon: Eye
              },
              {
                title: 'Faster Enforcement',
                desc: 'Digital legal notices with strict compliance countdowns expedite physical removal squads.',
                icon: Activity
              },
              {
                title: 'Stronger Accountability',
                desc: 'Complete end-to-end audit logs build trust between citizens and municipal authorities.',
                icon: ShieldCheck
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <item.icon size={20} />
                </div>
                <h4 className="font-display font-bold text-slate-900 text-base mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 23: STRONG CALL TO ACTION (ROYAL BLUE CIVIC BANNER)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-center relative overflow-hidden shadow-xl">
        {/* Background Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-100 bg-white/15 px-3 py-1.5 rounded-full border border-white/25">
            Citizen & Municipal Participation
          </span>

          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            See a problem?<br />
            Help SMKC resolve it.
          </h2>

          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Report suspected illegal hoardings and public-space encroachments with photo evidence and location. Together, let's keep Sangli, Miraj, and Kupwad safe and organized.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => navigate('/report')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-blue-900 bg-white hover:bg-slate-100 shadow-xl shadow-blue-950/20 transition-all flex items-center justify-center gap-2">
              <Camera size={16} /> Report a Violation
            </button>
            <button
              onClick={() => navigate('/whatsapp-simulator')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2">
              <MessageSquare size={16} className="text-white" /> Report via WhatsApp
            </button>
            <button
              onClick={() => navigate('/track')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-900/60 hover:bg-blue-900/80 border border-blue-400/40 transition-all flex items-center justify-center gap-2">
              <Search size={16} className="text-blue-200" /> Track Complaint
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 24: FOOTER (OFFICIAL LIGHT CIVIC BRANDING)
          ═══════════════════════════════════════════════════════════════ */}
      <footer id="about" className="bg-slate-100/90 text-slate-600 border-t border-slate-200 text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-200">

            {/* Left 2 Cols: Brand info */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <SMKCLogo size={36} />
                <div>
                  <span className="font-display font-extrabold text-slate-900 text-base tracking-tight block">
                    NAGAR-NETRA
                  </span>
                  <span className="text-[11px] text-blue-700 font-medium">
                    Network for Evidence, Tracking, Reporting & Action
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed max-w-sm pt-1">
                An advanced AI and GIS civic intelligence platform designed for Sangli-Miraj-Kupwad Municipal Corporation (SMKC) to detect, verify, and resolve public rights-of-way violations.
              </p>
              <div className="text-[11px] text-slate-500 font-mono pt-1">
                🏛️ Sangli-Miraj-Kupwad Municipal Corporation (SMKC)
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Platform</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#hero" className="hover:text-blue-700 transition-colors">Home</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-700 transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-blue-700 transition-colors">Features</a></li>
                <li><button onClick={() => navigate('/map')} className="hover:text-blue-700 transition-colors text-left">GIS Intelligence Map</button></li>
                <li><a href="#responsible-ai" className="hover:text-blue-700 transition-colors">Responsible AI</a></li>
              </ul>
            </div>

            {/* Citizen actions */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Citizen Services</h4>
              <ul className="space-y-2 text-slate-600">
                <li><button onClick={() => navigate('/report')} className="hover:text-blue-700 transition-colors text-left">Report Violation</button></li>
                <li><button onClick={() => navigate('/track')} className="hover:text-blue-700 transition-colors text-left">Track Complaint</button></li>
                <li><button onClick={() => navigate('/whatsapp-simulator')} className="hover:text-blue-700 transition-colors text-left">WhatsApp Simulator</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-blue-700 transition-colors text-left">Officer Login</button></li>
              </ul>
            </div>

            {/* Legal / Authority */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Transparency</h4>
              <ul className="space-y-2 text-slate-600">
                <li><span className="text-slate-500">Citizen Privacy Policy</span></li>
                <li><span className="text-slate-500">Terms of Enforcement</span></li>
                <li><span className="text-slate-500">Open Data Guidelines</span></li>
                <li><span className="text-slate-500">Maharashtra Municipal Act</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom disclaimer bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 NAGAR-NETRA. Sangli-Miraj-Kupwad Municipal Corporation (SMKC).
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Municipal Enforcement Cloud · Active</span>
              </span>
              <span className="text-slate-300">·</span>
              <span>All Civic Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
