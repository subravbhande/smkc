import { useState } from 'react';
import { PageHeader, DemoDataBanner } from '../../components/ui';
import { useNavigate } from 'react-router-dom';
import {
  Wifi, CheckCircle, XCircle, Settings, Activity, MessageSquare,
  Link, Copy, RefreshCw, Eye, EyeOff, AlertTriangle, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

// Demo/mock stats
const WA_STATS = {
  messagesReceived: 127,
  reportsCreated:   34,
  messagesSent:     289,
  failedMessages:   3,
  statusQueries:    58,
  avgResponseTime:  '1.4s',
};

const AI_STATS = {
  totalAnalyzed:   247,
  highConfidence:  189,
  ocrRuns:         134,
  avgConfidence:   '91.3%',
  falsePositives:  '< 5%',
};

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={13} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold font-display text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function StatusBadge({ connected }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${connected ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
      {connected ? 'Connected' : 'Active (Local)'}
    </span>
  );
}

export default function IntegrationsPage() {
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
  };

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <DemoDataBanner />
      <PageHeader title="Integrations" subtitle="Platform integrations and API service endpoints" />

      {/* ── WhatsApp Section ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#25d366' }}>
            <MessageSquare size={16} color="white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">WhatsApp Business API</h2>
            <p className="text-slate-400 text-sm">Two-way WhatsApp reporting and notification channel</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <StatusBadge connected={false} />
            <button
              onClick={() => navigate('/admin/whatsapp-simulator')}
              className="btn btn-sm"
              style={{ background: '#25d366', color: 'white' }}>
              <MessageSquare size={13} /> Open Simulator
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <StatCard label="Messages Received" value={WA_STATS.messagesReceived} icon={MessageSquare} color="#25d366" />
          <StatCard label="Reports Created"   value={WA_STATS.reportsCreated}   icon={CheckCircle} color="#16a34a" />
          <StatCard label="Messages Sent"     value={WA_STATS.messagesSent}     icon={Activity} color="#1d4ed8" />
          <StatCard label="Status Queries"    value={WA_STATS.statusQueries}    icon={RefreshCw} color="#7c3aed" />
          <StatCard label="Failed Messages"   value={WA_STATS.failedMessages}   icon={XCircle} color="#dc2626" />
          <StatCard label="Avg Response"      value={WA_STATS.avgResponseTime}  icon={Activity} color="#0d9488" />
        </div>

        {/* Config */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 font-semibold text-slate-800 text-sm flex items-center gap-2"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <Settings size={14} className="text-slate-400" /> WhatsApp API Configuration
          </div>
          <div className="p-5 space-y-4">
            <div className="p-3 rounded-xl flex items-start gap-3"
              style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Production Gateway Setup:</strong> Connect to WhatsApp Business API with the meta parameters below.
                WhatsApp Business API credentials are generated via Meta for Business at <strong>business.facebook.com</strong>.
              </p>
            </div>

            {[
              { key: 'WHATSAPP_TOKEN',          label: 'API Access Token',    value: 'EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', sensitive: true },
              { key: 'WHATSAPP_PHONE_NUMBER_ID', label: 'Phone Number ID',    value: '10234567890123456', sensitive: false },
              { key: 'WHATSAPP_VERIFY_TOKEN',    label: 'Webhook Verify Token', value: 'smkc_nagar_netra_2026', sensitive: true },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">{field.label}</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-mono"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <span className="text-xs text-slate-400 flex-shrink-0">{field.key}=</span>
                    <span className="text-slate-600 truncate">
                      {field.sensitive && !showToken
                        ? '••••••••••••••••'
                        : field.value
                      }
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(`${field.key}=${field.value}`, field.label)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Webhook URL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-mono"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Link size={12} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600 truncate">https://api.smkc.gov.in/api/whatsapp/webhook</span>
                </div>
                <button
                  onClick={() => handleCopy('https://api.smkc.gov.in/api/whatsapp/webhook', 'Webhook URL')}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <Copy size={13} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowToken(!showToken)}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1.5 transition-colors">
              {showToken ? <><EyeOff size={12} /> Hide sensitive values</> : <><Eye size={12} /> Show sensitive values (demo only)</>}
            </button>
          </div>
        </div>
      </section>

      {/* ── AI Section ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)' }}>
            <span className="text-white text-sm">🤖</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900">AI Detection Service</h2>
            <p className="text-slate-400 text-sm">YOLOv8 + OCR mock pipeline — production connects to real AI endpoint</p>
          </div>
          <div className="ml-auto">
            <StatusBadge connected={false} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <StatCard label="Total Analyzed"  value={AI_STATS.totalAnalyzed}  icon={Activity} color="#7c3aed" />
          <StatCard label="High Confidence" value={AI_STATS.highConfidence} icon={CheckCircle} color="#16a34a" />
          <StatCard label="OCR Runs"        value={AI_STATS.ocrRuns}        icon={RefreshCw} color="#0d9488" />
          <StatCard label="Avg Confidence"  value={AI_STATS.avgConfidence}  icon={Activity} color="#1d4ed8" />
          <StatCard label="False Positives" value={AI_STATS.falsePositives} icon={AlertTriangle} color="#f59e0b" />
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 font-semibold text-slate-800 text-sm flex items-center gap-2"
            style={{ borderBottom: '1px solid #f1f5f9' }}>
            <Settings size={14} className="text-slate-400" /> AI Module Configuration
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'AI Detection Engine', desc: 'YOLOv8-based hoarding/encroachment detection', enabled: aiEnabled, setEnabled: setAiEnabled },
              { label: 'OCR Text Extraction', desc: 'Tesseract/Google Vision OCR for hoarding text', enabled: ocrEnabled, setEnabled: setOcrEnabled },
              { label: 'Violation Notifications', desc: 'Auto-notify supervisor on high-confidence detections', enabled: notifEnabled, setEnabled: setNotifEnabled },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #f8fafc' }}>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{item.label}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{item.desc}</div>
                </div>
                <button
                  onClick={() => { item.setEnabled(!item.enabled); toast.success(`${item.label} ${!item.enabled ? 'enabled' : 'disabled'} (demo)`); }}
                  className={`relative w-10 h-5 rounded-full transition-all duration-300 ${item.enabled ? 'bg-teal-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${item.enabled ? 'left-5.5 left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-semibold text-slate-800 text-sm">AI Service Endpoint</div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">http://ai.smkc.local/api/analyze</div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">Mock</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── GIS / Map Section ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#0d9488)' }}>
            <span className="text-white text-sm">🗺️</span>
          </div>
          <h2 className="font-bold text-slate-900">GIS &amp; Map Services</h2>
          <div className="ml-auto">
            <StatusBadge connected={true} />
          </div>
        </div>

        <div className="card p-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Map Engine',       value: 'OpenStreetMap + Leaflet',    status: 'active' },
              { label: 'Tile Provider',    value: 'tile.openstreetmap.org',     status: 'active' },
              { label: 'GeoJSON Export',   value: 'Available',                  status: 'active' },
              { label: 'PostGIS',          value: 'Production Ready',           status: 'ready'  },
              { label: 'KML Export',       value: 'Available (GIS tools)',      status: 'active' },
              { label: 'Google Maps API',  value: 'Configure API Key in .env',  status: 'pending'},
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                style={{ background: '#f8fafc' }}>
                <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700 font-mono text-xs">{item.value}</span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'active' ? 'bg-green-500' : item.status === 'ready' ? 'bg-blue-500' : 'bg-amber-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* .env.example download */}
      <div className="card p-5 flex items-start gap-4"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', border: '1px solid #bbf7d0' }}>
        <div className="text-2xl">📋</div>
        <div className="flex-1">
          <div className="font-bold text-green-900 mb-1">.env.example — Environment Configuration Template</div>
          <p className="text-green-700 text-xs mb-3">
            Download the environment variable template to configure all integrations for production deployment.
            Never commit real tokens to version control.
          </p>
          <button
            onClick={() => {
              const content = `# NAGAR-NETRA Environment Configuration
# Copy this file to .env and fill in real values

# ── Authentication ──────────────────────
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# ── Database ──────────────────────────── 
DATABASE_URL=postgresql://user:password@host:5432/nagar_netra
POSTGIS_ENABLED=true

# ── WhatsApp Business API ─────────────── 
WHATSAPP_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token

# ── AI Service ────────────────────────── 
AI_SERVICE_URL=http://localhost:8001/api
AI_API_KEY=your_ai_api_key

# ── Google Maps (optional) ───────────── 
GOOGLE_MAPS_API_KEY=your_google_maps_key

# ── Notification Service ─────────────── 
TWILIO_SID=ACxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1234567890

# ── Storage ───────────────────────────── 
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# OR
AWS_S3_BUCKET=nagar-netra-evidence
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
`;
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = '.env.example'; a.click();
              URL.revokeObjectURL(url);
              toast.success('.env.example downloaded');
            }}
            className="btn btn-sm"
            style={{ background: '#16a34a', color: 'white' }}>
            <ExternalLink size={12} /> Download .env.example
          </button>
        </div>
      </div>
    </div>
  );
}
