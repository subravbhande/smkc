import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import SMKCLogo from '../components/SMKCLogo';

export default function UnauthorizedPage() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #070e1a 0%, #0a1628 100%)' }}>
      <div className="text-center max-w-md animate-fade-in-scale">
        <SMKCLogo size={64} className="mx-auto mb-6 opacity-60" />
        <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldX size={36} className="text-red-400" />
        </div>
        <div className="text-6xl font-bold font-display mb-2"
          style={{ background: 'linear-gradient(135deg,#dc2626,#f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          403
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Access Denied</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          You do not have permission to access this section.
          {user && (
            <span className="block mt-1 text-slate-500">
              Your role (<span className="text-amber-400 font-semibold">{user.role}</span>) does not allow access to this resource.
            </span>
          )}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.history.back()} className="btn btn-sm flex items-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={13} /> Go Back
          </button>
          <Link to="/dashboard" className="btn btn-primary btn-sm flex items-center gap-1.5">
            <Home size={13} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
