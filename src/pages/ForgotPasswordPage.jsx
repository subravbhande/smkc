import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle, Eye, EyeOff } from 'lucide-react';
import SMKCLogo from '../components/SMKCLogo';
import toast from 'react-hot-toast';

const STEPS = ['Email', 'Verify Token', 'New Password', 'Done'];

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [enteredToken, setEnteredToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const DEMO_EMAILS = ['citizen@demo.com', 'officer@smkc.demo', 'supervisor@smkc.demo', 'admin@smkc.demo'];

  const handleSendToken = () => {
    if (!email.includes('@')) { toast.error('Enter a valid email'); return; }
    if (!DEMO_EMAILS.includes(email)) {
      toast.error('Email not found in demo system');
      return;
    }
    setLoading(true);
    const mockToken = Math.floor(100000 + Math.random() * 900000).toString();
    setTimeout(() => {
      setToken(mockToken);
      setLoading(false);
      setStep(1);
      toast.success(`Token sent! Demo token: ${mockToken}`, { duration: 8000 });
    }, 1200);
  };

  const handleVerifyToken = () => {
    if (enteredToken !== token) {
      toast.error('Invalid verification token');
      return;
    }
    setStep(2);
  };

  const handleResetPassword = () => {
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #070e1a 0%, #0a1628 100%)' }}>
      <div className="w-full max-w-md animate-fade-in">

        {/* Header */}
        <div className="text-center mb-8">
          <SMKCLogo size={64} className="mx-auto mb-4 ring-2 ring-white/15" />
          <h1 className="text-2xl font-bold text-white font-display">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">NAGAR-NETRA · SMKC Platform</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                style={{
                  background: i < step ? '#16a34a' : i === step ? '#1d4ed8' : 'rgba(255,255,255,0.06)',
                  color: i <= step ? 'white' : '#475569',
                }}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px" style={{ background: i < step ? '#16a34a60' : 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Step 0 — Email */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Enter your email</h3>
                <p className="text-slate-500 text-sm mb-4">We'll send a verification code to your registered email.</p>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendToken()}
                  className="form-input w-full pl-10"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  placeholder="citizen@demo.com"
                />
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="text-xs text-slate-600 flex flex-wrap gap-1">
                <span>Try:</span>
                {DEMO_EMAILS.slice(0, 2).map(e => (
                  <button key={e} onClick={() => setEmail(e)} className="text-teal-600 hover:text-teal-400 font-mono">{e}</button>
                ))}
              </div>
              <button
                onClick={handleSendToken}
                disabled={loading}
                className="btn btn-primary w-full justify-center">
                {loading ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Sending...</> : 'Send Verification Code'}
              </button>
            </div>
          )}

          {/* Step 1 — Token */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Enter verification code</h3>
                <p className="text-slate-500 text-sm mb-1">Code sent to <span className="text-teal-400">{email}</span></p>
                <div className="px-3 py-2 rounded-lg text-xs font-mono text-amber-400 mb-4"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  ⚠️ Demo mode — your token is: <strong>{token}</strong>
                </div>
              </div>
              <input
                type="text"
                value={enteredToken}
                onChange={e => setEnteredToken(e.target.value)}
                maxLength={6}
                className="form-input w-full text-center text-xl font-mono tracking-widest"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                placeholder="000000"
              />
              <button onClick={handleVerifyToken} className="btn btn-primary w-full justify-center">
                Verify Code
              </button>
              <button onClick={() => { setStep(0); setEnteredToken(''); setToken(''); }}
                className="w-full text-center text-slate-500 text-sm hover:text-slate-300 transition-colors">
                Resend code
              </button>
            </div>
          )}

          {/* Step 2 — New Password */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Set new password</h3>
                <p className="text-slate-500 text-sm mb-4">Choose a strong password for your account.</p>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input w-full pl-10 pr-10"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  placeholder="Minimum 8 characters"
                />
                <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="form-input w-full"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                placeholder="Confirm new password"
              />
              <button onClick={handleResetPassword} disabled={loading} className="btn btn-primary w-full justify-center">
                {loading ? 'Updating...' : 'Reset Password'}
              </button>
            </div>
          )}

          {/* Step 3 — Done */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border-2 border-green-400/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Password Updated!</h3>
              <p className="text-slate-400 text-sm mb-6">Your password has been successfully reset.</p>
              <Link to="/login" className="btn btn-primary w-full justify-center">
                Login with New Password →
              </Link>
            </div>
          )}
        </div>

        <p className="text-center mt-5">
          <Link to="/login" className="text-slate-500 hover:text-teal-400 text-sm flex items-center justify-center gap-1 transition-colors">
            <ArrowLeft size={13} /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
