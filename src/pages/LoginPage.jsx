import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Shield, Map, Brain,
  FileText, Zap, Lock, Mail, CheckCircle2, Building2
} from 'lucide-react';
import { useAuthStore } from '../store/store';
import SMKCLogo from '../components/SMKCLogo';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  {
    email: 'citizen@demo.com',
    role: 'Citizen',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: '👤',
    desc: 'Report violations & track complaint progress',
  },
  {
    email: 'officer@smkc.demo',
    role: 'Field Officer',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    icon: '🛡️',
    desc: 'Inspect on-site, verify evidence & upload proof',
  },
  {
    email: 'supervisor@smkc.demo',
    role: 'Supervisor',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    icon: '🏛️',
    desc: 'Assign field squads & issue compliance notices',
  },
  {
    email: 'admin@smkc.demo',
    role: 'Administrator',
    color: '#e11d48',
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    icon: '⚙️',
    desc: 'Full municipal system control, GIS & audit logs',
  },
];

const FEATURES = [
  { icon: Brain, label: 'AI Vision Pipeline', desc: 'Automated hoarding & encroachment detection' },
  { icon: Map, label: 'GIS Spatial Mapping', desc: 'Ward-level coordinates & density hotspots' },
  { icon: FileText, label: 'Digital Due Process', desc: 'Tamper-evident legal notices with deadlines' },
  { icon: Zap, label: 'Enforcement Audit', desc: 'Complete verifiable before/after evidence trails' },
];

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const ROLE_ROUTES = {
    Citizen: '/citizen/dashboard',
    'Field Officer': '/officer/dashboard',
    Supervisor: '/supervisor/dashboard',
    Administrator: '/admin/dashboard',
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        toast.success(`Welcome back!`);
        navigate(ROLE_ROUTES[result.role] || '/');
      } else {
        toast.error('Invalid credentials. Use a demo account below.');
      }
      setLoading(false);
    }, 900);
  };

  const quickLogin = (acc) => {
    setEmail(acc.email);
    setPassword('demo1234');
    setActiveRole(acc.role);
    setTimeout(() => {
      const result = login(acc.email, 'demo1234');
      if (result.success) {
        toast.success(`Logged in as ${acc.role} 🎉`);
        navigate(ROLE_ROUTES[result.role]);
      }
    }, 120);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">

      {/* Official Government Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800 flex-shrink-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="font-medium text-slate-200 truncate">
              Government of Maharashtra · Sangli-Miraj-Kupwad Municipal Corporation (SMKC)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[10px] flex-shrink-0 font-medium">
            <span>Citizen Helpline: <strong className="text-white font-mono">1800-233-5599</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Portal Status: Online
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row relative">

        {/* ── Left Panel: Civic Platform Showcase (Light Theme) ── */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-10 xl:p-14 relative bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/60 border-r border-slate-200/80 overflow-hidden">
          
          {/* Subtle Grid Vectors Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 20%, rgba(37,99,235,0.06) 0%, transparent 70%),
                                linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)`,
              backgroundSize: '100% 100%, 36px 36px, 36px 36px',
            }}
          />

          {/* Top Brand & Title */}
          <div className="relative z-10 space-y-6 max-w-lg">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="p-1.5 rounded-full bg-white ring-1 ring-slate-200 shadow-xs group-hover:ring-blue-400 transition-all">
                <SMKCLogo size={42} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                    NAGAR-NETRA
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-800 border border-blue-200">
                    SMKC
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium tracking-wide">
                  Civic Enforcement & Surveillance System
                </span>
              </div>
            </Link>

            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                <Building2 size={12} className="text-blue-600" />
                <span>MUNICIPAL ENFORCEMENT PORTAL</span>
              </div>
              <h2 className="font-display font-bold text-3xl xl:text-4xl text-slate-900 leading-tight">
                Digital Eyes.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600">
                  Verified Action.
                </span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Secure access for citizens, field verification squads, supervisory officers,
                and corporation administrators to manage illegal hoardings and public encroachments.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-2.5">
                    <f.icon size={16} className="text-blue-600" />
                  </div>
                  <div className="text-slate-900 text-xs font-bold font-display">{f.label}</div>
                  <div className="text-slate-500 text-[11px] leading-snug mt-0.5">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Live Metrics Showcase */}
          <div className="relative z-10 pt-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-md shadow-slate-200/50 max-w-lg">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-700">Live Enforcement Grid</span>
                </div>
                <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  SANGLI · MIRAJ · KUPWAD
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-display font-extrabold text-xl text-blue-700">18</div>
                  <div className="text-[11px] text-slate-500">Active Cases</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-display font-extrabold text-xl text-teal-600">94%</div>
                  <div className="text-[11px] text-slate-500">AI Confidence</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-display font-extrabold text-xl text-emerald-600">42</div>
                  <div className="text-[11px] text-slate-500">Resolved</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 mt-4 flex items-center justify-between max-w-lg">
              <span>© 2026 NAGAR-NETRA · SMKC</span>
              <span>Official Civic Portal v2.0</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Sign In Form & One-Click Role Access ── */}
        <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10 bg-white flex-shrink-0">
          <div className="max-w-sm sm:max-w-md mx-auto w-full space-y-6">

            {/* Mobile Brand Banner (< lg) */}
            <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-100">
              <Link to="/" className="flex items-center gap-3">
                <SMKCLogo size={36} />
                <div>
                  <div className="font-display font-extrabold text-lg text-slate-900">NAGAR-NETRA</div>
                  <div className="text-[11px] text-slate-500">SMKC Civic Enforcement</div>
                </div>
              </Link>
              <Link to="/" className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                <ArrowLeft size={13} /> Home
              </Link>
            </div>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 mb-2">
                <Shield size={12} className="text-blue-600" />
                <span>Authorized Sign In</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Sign in with your registered account or use 1-click role access below.
              </p>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="officer@smkc.demo"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="text-center text-xs text-slate-500">
              New citizen or reporter?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                Register an account
              </Link>
            </div>

            {/* 1-Click Role Access (Demo Accounts for Evaluators) */}
            <div className="pt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  One-Click Role Access
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = activeRole === acc.role;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => quickLogin(acc)}
                      className="w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer hover:shadow-xs"
                      style={{
                        backgroundColor: isCurrent ? acc.bgColor : '#ffffff',
                        borderColor: isCurrent ? acc.color : '#e2e8f0',
                      }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg flex-shrink-0">{acc.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{acc.role}</span>
                            <span
                              className="text-[10px] font-semibold px-1.5 py-0.2 rounded"
                              style={{ backgroundColor: acc.bgColor, color: acc.color, border: `1px solid ${acc.borderColor}` }}>
                              Instant Demo
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{acc.desc}</p>
                        </div>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2"
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                <span>
                  Click any role for instant login · Password: <strong className="font-mono text-slate-700">demo1234</strong>
                </span>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="text-center pt-1">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors">
                <ArrowLeft size={13} /> Return to NAGAR-NETRA Homepage
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
