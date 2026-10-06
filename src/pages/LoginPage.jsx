import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle, Zap, Map, Brain, FileText } from 'lucide-react';
import { useAuthStore } from '../store/store';
import SMKCLogo from '../components/SMKCLogo';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { email: 'citizen@demo.com',      role: 'Citizen',       color: '#14b8a6', icon: '👤', desc: 'Report & track complaints' },
  { email: 'officer@smkc.demo',     role: 'Field Officer', color: '#1d4ed8', icon: '👮', desc: 'Verify & act on cases' },
  { email: 'supervisor@smkc.demo',  role: 'Supervisor',    color: '#7c3aed', icon: '🏛️', desc: 'Assign & issue notices' },
  { email: 'admin@smkc.demo',       role: 'Administrator', color: '#dc2626', icon: '⚙️', desc: 'Full platform control' },
];

const FEATURES = [
  { icon: Brain,    label: 'AI-Powered',    desc: 'YOLO v8 detection' },
  { icon: Map,      label: 'GIS Mapping',   desc: 'Real-time locations' },
  { icon: FileText, label: 'Digital Notices', desc: 'End-to-end enforcement' },
  { icon: Zap,      label: 'Case Intelligence', desc: 'Historical data' },
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
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #070e1a 0%, #0a1628 45%, #0f2240 100%)' }}>

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)' }} />

        {/* Top — Brand */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-10">
            <SMKCLogo size={60} className="ring-2 ring-white/20 glow-pulse" />
            <div>
              <div className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-0.5">SMKC · Nagar-Netra</div>
              <h1 className="text-3xl font-bold text-white font-display tracking-wide">NAGAR-NETRA</h1>
              <p className="text-slate-400 text-sm font-medium">AI + GIS Powered Civic Enforcement</p>
            </div>
          </div>

          <p className="text-2xl font-semibold text-white mb-3 leading-tight font-display">
            Detect. Verify.<br />Act. Resolve.
          </p>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
            SMKC's unified platform for managing illegal hoardings, encroachments and civic violations
            through AI detection, GIS mapping and digital enforcement workflows.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 stagger-children">
            {FEATURES.map((f) => (
              <div key={f.label}
                className="glass-card p-4 group hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(13,148,136,0.15)' }}>
                    <f.icon size={15} className="text-teal-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{f.label}</div>
                    <div className="text-slate-500 text-xs">{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Mini dashboard preview */}
        <div className="relative z-10 animate-slide-up delay-400">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              <span className="text-slate-400 text-xs font-mono">Platform Status · Live</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '20', label: 'Active Cases', color: '#60a5fa' },
                { val: '94%', label: 'AI Accuracy', color: '#2dd4bf' },
                { val: '8', label: 'Resolved', color: '#86efac' },
              ].map(({ val, label, color }) => (
                <div key={label} className="text-center">
                  <div className="text-xl font-bold font-display" style={{ color }}>{val}</div>
                  <div className="text-slate-500 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-slate-500 text-xs text-center">
            Sangli-Miraj-Kupwad Municipal Corporation · Official Portal v2.0
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="w-full lg:w-[460px] flex flex-col justify-center px-8 py-12 relative"
        style={{ background: 'rgba(255,255,255,0.97)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-sm mx-auto w-full">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8 animate-fade-in">
            <SMKCLogo size={40} className="ring-1 ring-white/10" />
            <div>
              <div className="font-bold text-white font-display">NAGAR-NETRA</div>
              <div className="text-teal-400 text-xs">SMKC Civic Enforcement</div>
            </div>
          </div>

          {/* Header */}
          <div className="animate-fade-in mb-7">
            <h2 className="text-2xl font-bold text-slate-900 mb-1 font-display">Sign In</h2>
            <p className="text-slate-500 text-sm">Access your NAGAR-NETRA dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in delay-100">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@smkc.demo"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-teal-400 hover:text-teal-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-3 text-base"
              style={{ width: '100%' }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <><span>Sign In</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-4 text-center animate-fade-in">
            <p className="text-slate-400 text-sm">
              New citizen?{' '}
              <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">Create an account</Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-7 animate-fade-in delay-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs font-semibold tracking-wide">DEMO ACCOUNTS</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc)}
                  className="role-card w-full text-left"
                  style={{ '--role-color': acc.color }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{acc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800">{acc.email}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold" style={{ color: acc.color }}>{acc.role}</span>
                        <span className="text-slate-400 text-xs">· {acc.desc}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 flex-shrink-0 transition-all group-hover:text-slate-500 group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 p-3 rounded-lg text-xs text-slate-500 text-center"
              style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              💡 Click any account above for instant access · Password: <span className="font-mono font-semibold">demo1234</span>
            </div>
          </div>

          <div className="mt-6 text-center animate-fade-in delay-300">
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
