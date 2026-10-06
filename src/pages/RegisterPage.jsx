import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, CheckCircle, ArrowLeft, User, Phone, Mail, Lock } from 'lucide-react';
import SMKCLogo from '../components/SMKCLogo';
import { useAuthStore } from '../store/store';
import toast from 'react-hot-toast';

const STEPS = ['Personal Info', 'Contact', 'Security'];

export default function RegisterPage() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [caseId, setCaseId] = useState('');

  const [form, setForm] = useState({
    name: '',
    address: '',
    mobile: '',
    email: '',
    password: '',
    confirm: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) { toast.error('Please enter your full name'); return false; }
      if (form.name.trim().length < 3) { toast.error('Name must be at least 3 characters'); return false; }
    }
    if (step === 1) {
      if (!form.mobile.match(/^[6-9]\d{9}$/)) { toast.error('Enter a valid 10-digit Indian mobile number'); return false; }
      if (!form.email.includes('@')) { toast.error('Enter a valid email address'); return false; }
    }
    if (step === 2) {
      if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return false; }
      if (form.password !== form.confirm) { toast.error('Passwords do not match'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 2) { setStep(step + 1); return; }
    // Final submit
    setLoading(true);
    setTimeout(() => {
      // Mock registration — creates citizen account
      const registered = register?.({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        role: 'Citizen',
      });
      setLoading(false);
      setDone(true);
    }, 1400);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ background: 'linear-gradient(135deg, #070e1a 0%, #0a1628 100%)' }}>
        <div className="max-w-md w-full text-center animate-fade-in-scale">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-400/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-3">Registration Successful!</h2>
          <p className="text-slate-400 mb-2">Your citizen account has been created.</p>
          <p className="text-slate-500 text-sm mb-8">
            Registered as: <span className="text-teal-400 font-semibold">{form.email}</span>
          </p>
          <div className="p-4 rounded-xl mb-6 text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs text-slate-500 mb-2">Demo Login Details</div>
            <div className="text-sm text-slate-300">Use email: <span className="text-teal-400 font-mono">{form.email}</span></div>
            <div className="text-sm text-slate-300">Password: <span className="text-teal-400 font-mono">Your chosen password</span></div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary flex-1 justify-center">
              Login Now →
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-4">
            ⚠️ This is a prototype demonstration. No actual account is created on SMKC servers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #070e1a 0%, #0a1628 45%, #0f2240 100%)' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 max-w-sm text-center">
          <SMKCLogo size={90} className="mx-auto mb-6 ring-2 ring-white/15 glow-pulse" />
          <h1 className="text-3xl font-bold text-white font-display mb-2">NAGAR-NETRA</h1>
          <p className="text-teal-400 text-sm font-medium mb-8">Sangli-Miraj-Kupwad Municipal Corporation</p>
          <p className="text-slate-400 leading-relaxed">
            Create your citizen account to report civic violations, track your complaints, and stay informed about enforcement actions in your area.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3">
            {[
              { icon: '📱', title: 'Report Violations', desc: 'Submit photos and GPS location' },
              { icon: '🔍', title: 'Track Complaints',  desc: 'Real-time case status updates' },
              { icon: '🔔', title: 'Get Notified',     desc: 'Updates on your reports' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 p-3 rounded-xl text-left"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{item.title}</div>
                  <div className="text-slate-500 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back + Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <ArrowLeft size={16} /> Back to Login
            </Link>
            <div className="ml-auto lg:hidden">
              <SMKCLogo size={36} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white font-display mb-1">Create Citizen Account</h2>
            <p className="text-slate-400 text-sm">Register to report and track civic violations</p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background: i < step ? '#16a34a' : i === step ? '#1d4ed8' : 'rgba(255,255,255,0.08)',
                      color: i <= step ? 'white' : '#64748b',
                    }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-xs hidden sm:block" style={{ color: i === step ? '#93c5fd' : '#475569' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px" style={{ background: i < step ? '#16a34a' : 'rgba(255,255,255,0.1)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="rounded-2xl p-6 space-y-4 animate-fade-in"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

            {/* Step 0 — Personal Info */}
            {step === 0 && (
              <>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-input w-full pl-10"
                      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                      placeholder="Ramesh Kulkarni"
                    />
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Address (Optional)</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="form-input w-full resize-none"
                    style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                    placeholder="House No., Street, Ward..."
                  />
                </div>
              </>
            )}

            {/* Step 1 — Contact */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      type="tel"
                      maxLength={10}
                      className="form-input w-full pl-10"
                      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                      placeholder="9876543210"
                    />
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-xs mt-1">10-digit mobile number (no country code)</p>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className="form-input w-full pl-10"
                      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                      placeholder="you@example.com"
                    />
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </>
            )}

            {/* Step 2 — Security */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type={showPass ? 'text' : 'password'}
                      className="form-input w-full pl-10 pr-10"
                      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                      placeholder="Minimum 8 characters"
                    />
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: form.password.length >= i * 3
                              ? i <= 1 ? '#dc2626' : i <= 2 ? '#f59e0b' : i <= 3 ? '#0d9488' : '#16a34a'
                              : 'rgba(255,255,255,0.1)'
                          }} />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      type={showConfirm ? 'text' : 'password'}
                      className="form-input w-full pl-10 pr-10"
                      style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                      placeholder="Repeat your password"
                    />
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {form.confirm && form.password === form.confirm && (
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><CheckCircle size={11} /> Passwords match</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn btn-sm flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn btn-primary flex-1 justify-center">
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creating Account...</>
              ) : step < 2 ? (
                <>Continue <ArrowLeft size={14} className="rotate-180" /></>
              ) : (
                <><UserPlus size={15} /> Create Citizen Account</>
              )}
            </button>
          </div>

          <p className="text-center text-slate-600 text-xs mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-slate-700 text-xs mt-2">
            ⚠️ Prototype demo — Officer accounts are created by the Administrator
          </p>
        </div>
      </div>
    </div>
  );
}
