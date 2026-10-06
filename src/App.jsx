import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/store';

// Layout
import AppLayout from './components/AppLayout';

// Public pages
import LandingPage           from './pages/LandingPage';
import LoginPage             from './pages/LoginPage';
import RegisterPage          from './pages/RegisterPage';
import ForgotPasswordPage    from './pages/ForgotPasswordPage';
import TrackComplaintPage    from './pages/TrackComplaintPage';
import UnauthorizedPage      from './pages/UnauthorizedPage';

// Shared pages
import CaseDetailPage        from './pages/CaseDetailPage';
import CaseListPage          from './pages/CaseListPage';
import MapPage               from './pages/MapPage';
import AnalyticsPage         from './pages/AnalyticsPage';
import NotificationsPage     from './pages/NotificationsPage';
import ReportForm            from './components/ReportForm';

// Citizen
import CitizenDashboard      from './pages/citizen/CitizenDashboard';

// Officer
import OfficerDashboard      from './pages/officer/OfficerDashboard';

// Supervisor
import SupervisorDashboard   from './pages/supervisor/SupervisorDashboard';
import AssignmentsPage       from './pages/supervisor/AssignmentsPage';

// Admin
import AdminDashboard        from './pages/admin/AdminDashboard';
import AuditLogPage          from './pages/admin/AuditLogPage';
import UserManagementPage    from './pages/admin/UserManagementPage';
import ZoneManagementPage    from './pages/admin/ZoneManagementPage';
import IntegrationsPage      from './pages/admin/IntegrationsPage';
import WhatsAppSimulatorPage from './pages/admin/WhatsAppSimulatorPage';

// ─── Protected Route ──────────────────────────────────────────
function Protected({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <AppLayout><UnauthorizedPage /></AppLayout>;
  }
  return <AppLayout>{children}</AppLayout>;
}

// ─── Role-based default route ─────────────────────────────────
function RoleRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const routes = {
    Citizen:       '/citizen/dashboard',
    'Field Officer': '/officer/dashboard',
    Supervisor:    '/supervisor/dashboard',
    Administrator: '/admin/dashboard',
  };
  return <Navigate to={routes[user?.role] || '/login'} replace />;
}

// ─── Report wrapper ───────────────────────────────────────────
function ReportPage() {
  return (
    <div className="p-6">
      <ReportForm />
    </div>
  );
}

// ─── Settings page ────────────────────────────────────────────
function SettingsPage() {
  return (
    <div className="p-6">
      <div className="card max-w-2xl">
        <div className="px-6 py-5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <h2 className="text-xl font-bold text-slate-900 font-display">System Settings</h2>
          <p className="text-slate-400 text-sm mt-0.5">NAGAR-NETRA platform configuration</p>
        </div>
        <div className="p-6">
          <div className="space-y-1">
            {[
              ['Platform Name',       'NAGAR-NETRA'],
              ['Version',             '2.0.0 (Enterprise Release)'],
              ['SMKC Unit',           'Sangli-Miraj-Kupwad Municipal Corporation'],
              ['AI Service',          'YOLOv8 Vision Pipeline (Active)'],
              ['Map Engine',          'OpenStreetMap + Leaflet + GeoJSON'],
              ['Authentication',      'JWT + bcrypt (Role-Based Access)'],
              ['Database',            'PostgreSQL + PostGIS (Geospatial Grid)'],
              ['WhatsApp',            'WhatsApp Business API Gateway (Active)'],
              ['Notification',        'Configured for Twilio / MSG91'],
              ['Export Formats',      'CSV, PDF, GeoJSON, KML'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #f8fafc' }}>
                <span className="text-sm text-slate-500 font-medium">{k}</span>
                <span className="text-sm font-semibold text-slate-800 font-mono">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-800">
              🔒 Configuration changes require root administrator multi-factor authentication under SMKC IT Security Guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 14 },
        success: { iconTheme: { primary: '#0d9488', secondary: 'white' } },
        error: { iconTheme: { primary: '#dc2626', secondary: 'white' } },
      }} />

      <Routes>
        {/* ── Public ── */}
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register"           element={<RegisterPage />} />
        <Route path="/forgot-password"    element={<ForgotPasswordPage />} />
        <Route path="/track"              element={<TrackComplaintPage />} />
        <Route path="/citizen/track"      element={<TrackComplaintPage />} />
        <Route path="/report"             element={
          <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">
              <ReportForm />
            </div>
          </div>
        } />
        <Route path="/citizen/report-new" element={
          <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">
              <ReportForm />
            </div>
          </div>
        } />
        <Route path="/whatsapp-simulator" element={<WhatsAppSimulatorPage />} />
        <Route path="/map" element={
          <div className="min-h-screen bg-slate-900 text-white">
            <MapPage title="SMKC GIS Case Map" />
          </div>
        } />
        <Route path="/unauthorized"       element={<UnauthorizedPage />} />

        {/* ── Role redirect ── */}
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* ── Shared (any authenticated) ── */}
        <Route path="/cases/:caseId" element={
          <Protected allowedRoles={['Citizen','Field Officer','Supervisor','Administrator']}>
            <CaseDetailPage />
          </Protected>
        } />
        <Route path="/notifications" element={
          <Protected allowedRoles={['Citizen','Field Officer','Supervisor','Administrator']}>
            <NotificationsPage />
          </Protected>
        } />

        {/* ── Citizen ── */}
        <Route path="/citizen/dashboard" element={
          <Protected allowedRoles={['Citizen']}>
            <CitizenDashboard />
          </Protected>
        } />
        <Route path="/citizen/reports" element={
          <Protected allowedRoles={['Citizen']}>
            <CaseListPage role="citizen" />
          </Protected>
        } />
        <Route path="/citizen/report-new-auth" element={
          <Protected allowedRoles={['Citizen']}>
            <ReportPage />
          </Protected>
        } />
        <Route path="/citizen/track-auth" element={
          <Protected allowedRoles={['Citizen']}>
            <TrackComplaintPage />
          </Protected>
        } />

        {/* ── Field Officer ── */}
        <Route path="/officer/dashboard" element={
          <Protected allowedRoles={['Field Officer']}>
            <OfficerDashboard />
          </Protected>
        } />
        <Route path="/officer/cases" element={
          <Protected allowedRoles={['Field Officer']}>
            <CaseListPage role="officer" />
          </Protected>
        } />
        <Route path="/officer/map" element={
          <Protected allowedRoles={['Field Officer']}>
            <MapPage title="Field Map" />
          </Protected>
        } />
        <Route path="/officer/verification" element={
          <Protected allowedRoles={['Field Officer']}>
            <CaseListPage role="officer" />
          </Protected>
        } />

        {/* ── Supervisor ── */}
        <Route path="/supervisor/dashboard" element={
          <Protected allowedRoles={['Supervisor']}>
            <SupervisorDashboard />
          </Protected>
        } />
        <Route path="/supervisor/cases" element={
          <Protected allowedRoles={['Supervisor']}>
            <CaseListPage role="supervisor" />
          </Protected>
        } />
        <Route path="/supervisor/map" element={
          <Protected allowedRoles={['Supervisor']}>
            <MapPage title="Jurisdiction Map" />
          </Protected>
        } />
        <Route path="/supervisor/assignments" element={
          <Protected allowedRoles={['Supervisor']}>
            <AssignmentsPage />
          </Protected>
        } />
        <Route path="/supervisor/notices" element={
          <Protected allowedRoles={['Supervisor']}>
            <CaseListPage role="supervisor" />
          </Protected>
        } />
        <Route path="/supervisor/analytics" element={
          <Protected allowedRoles={['Supervisor']}>
            <AnalyticsPage />
          </Protected>
        } />

        {/* ── Administrator ── */}
        <Route path="/admin/dashboard" element={
          <Protected allowedRoles={['Administrator']}>
            <AdminDashboard />
          </Protected>
        } />
        <Route path="/admin/cases" element={
          <Protected allowedRoles={['Administrator']}>
            <CaseListPage role="admin" />
          </Protected>
        } />
        <Route path="/admin/map" element={
          <Protected allowedRoles={['Administrator']}>
            <MapPage title="SMKC GIS Command Map" />
          </Protected>
        } />
        <Route path="/admin/users" element={
          <Protected allowedRoles={['Administrator']}>
            <UserManagementPage />
          </Protected>
        } />
        <Route path="/admin/zones" element={
          <Protected allowedRoles={['Administrator']}>
            <ZoneManagementPage />
          </Protected>
        } />
        <Route path="/admin/analytics" element={
          <Protected allowedRoles={['Administrator']}>
            <AnalyticsPage />
          </Protected>
        } />
        <Route path="/admin/audit" element={
          <Protected allowedRoles={['Administrator']}>
            <AuditLogPage />
          </Protected>
        } />
        <Route path="/admin/integrations" element={
          <Protected allowedRoles={['Administrator']}>
            <IntegrationsPage />
          </Protected>
        } />
        <Route path="/admin/whatsapp-simulator" element={
          <Protected allowedRoles={['Administrator']}>
            <WhatsAppSimulatorPage />
          </Protected>
        } />
        <Route path="/admin/settings" element={
          <Protected allowedRoles={['Administrator']}>
            <SettingsPage />
          </Protected>
        } />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
