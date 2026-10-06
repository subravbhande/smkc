import { useState, useEffect } from 'react';
import SMKCLogo from './SMKCLogo';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, FileText, CheckSquare, Bell, Users,
  BarChart2, Settings, LogOut, Menu, X,
  ClipboardList, Wifi, UserCog, MapPin, Activity, BookOpen
} from 'lucide-react';
import { useAuthStore, useNotifStore } from '../store/store';

const NAV_CONFIG = {
  Citizen: [
    { to: '/citizen/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/citizen/reports',          icon: ClipboardList,   label: 'My Reports' },
    { to: '/citizen/report-new-auth',  icon: FileText,        label: 'Report Issue' },
    { to: '/citizen/track',            icon: Activity,        label: 'Track Complaint' },
    { to: '/notifications',            icon: Bell,            label: 'Notifications', badge: true },
  ],
  'Field Officer': [
    { to: '/officer/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/officer/cases',        icon: ClipboardList,   label: 'Assigned Cases' },
    { to: '/officer/map',          icon: Map,             label: 'Map' },
    { to: '/officer/verification', icon: CheckSquare,     label: 'Verification' },
    { to: '/notifications',        icon: Bell,            label: 'Notifications', badge: true },
  ],
  Supervisor: [
    { to: '/supervisor/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/supervisor/cases',       icon: ClipboardList,   label: 'All Cases' },
    { to: '/supervisor/map',         icon: Map,             label: 'Map' },
    { to: '/supervisor/assignments', icon: Users,           label: 'Assignments' },
    { to: '/supervisor/notices',     icon: FileText,        label: 'Notices' },
    { to: '/supervisor/analytics',   icon: BarChart2,       label: 'Analytics' },
    { to: '/notifications',          icon: Bell,            label: 'Notifications', badge: true },
  ],
  Administrator: [
    { to: '/admin/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/cases',              icon: ClipboardList,   label: 'Cases' },
    { to: '/admin/map',                icon: Map,             label: 'Map' },
    { to: '/admin/users',              icon: UserCog,         label: 'Users' },
    { to: '/admin/zones',              icon: MapPin,          label: 'Zones' },
    { to: '/admin/analytics',          icon: BarChart2,       label: 'Analytics' },
    { to: '/admin/audit',              icon: BookOpen,        label: 'Audit Logs' },
    { to: '/admin/whatsapp-simulator', icon: Wifi,            label: 'WhatsApp Demo' },
    { to: '/admin/integrations',       icon: Wifi,            label: 'Integrations' },
    { to: '/notifications',            icon: Bell,            label: 'Notifications', badge: true },
    { to: '/admin/settings',           icon: Settings,        label: 'Settings' },
  ],
};

const ROLE_COLORS = {
  Citizen: '#14b8a6',
  'Field Officer': '#60a5fa',
  Supervisor: '#a78bfa',
  Administrator: '#f87171',
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotifStore();
  const navigate = useNavigate();

  // Detect mobile (< 768px)
  const isMobile = () => window.innerWidth < 768;

  // Desktop: sidebar open by default; Mobile: closed by default
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile());
  const [mobileOpen, setMobileOpen] = useState(false); // mobile overlay state

  // Keep desktop/mobile states separate on resize
  useEffect(() => {
    const onResize = () => {
      if (!isMobile()) {
        setMobileOpen(false);   // close overlay when going to desktop
        setSidebarOpen(true);   // re-open desktop sidebar
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close mobile overlay when navigating
  const handleNavClick = () => {
    if (isMobile()) setMobileOpen(false);
  };

  const navItems = NAV_CONFIG[user?.role] || [];
  const roleColor = ROLE_COLORS[user?.role] || '#60a5fa';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sidebar content (shared between desktop and mobile overlay)
  const SidebarContent = ({ compact }) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 64 }}>
        <SMKCLogo size={36} className="flex-shrink-0 ring-2 ring-white/20" />
        {!compact && (
          <div className="animate-fade-in overflow-hidden">
            <div className="font-display font-bold text-white text-sm leading-tight whitespace-nowrap">NAGAR-NETRA</div>
            <div className="text-slate-500 text-xs whitespace-nowrap">SMKC Platform</div>
          </div>
        )}
        {/* Close button: mobile shows X, desktop shows collapse toggle */}
        <button
          onClick={() => isMobile() ? setMobileOpen(false) : setSidebarOpen(!sidebarOpen)}
          className="ml-auto text-slate-600 hover:text-white transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-white/5">
          {(mobileOpen || sidebarOpen) ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* User info */}
      {!compact && user && (
        <div className="mx-3 mt-4 mb-2 px-3 py-3 rounded-xl animate-fade-in"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${roleColor}80, ${roleColor}40)`, border: `1px solid ${roleColor}30` }}>
              {user.avatar || user.name?.[0]}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate leading-tight">{user.name}</div>
              <div className="text-xs font-medium" style={{ color: roleColor }}>{user.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed avatar */}
      {compact && (
        <div className="px-3 pt-4 pb-2 flex justify-center">
          <SMKCLogo size={36} className="ring-2 ring-white/20" />
        </div>
      )}

      {/* Nav label */}
      {!compact && (
        <div className="px-5 pt-4 pb-1">
          <span className="text-slate-600 text-xs font-semibold tracking-widest uppercase">Navigation</span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navItems.map((item, idx) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-3 px-3 py-2.5 ${isActive ? 'active' : ''}`
            }
            title={compact ? item.label : ''}
            style={{ animationDelay: `${idx * 0.04}s` }}>
            {({ isActive }) => (
              <>
                <div className="relative flex-shrink-0">
                  <item.icon size={17} />
                  {item.badge && unreadCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold leading-none"
                      style={{ border: '2px solid #080f1d' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                {!compact && (
                  <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                )}
                {!compact && isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="sidebar-item flex items-center gap-3 px-3 py-2.5 w-full text-red-400 hover:text-red-300"
            title={compact ? 'Logout' : ''}>
            <LogOut size={17} />
            {!compact && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
        {!compact && (
          <div className="px-4 pb-4">
            <div className="text-center py-1.5 rounded-lg text-xs font-bold tracking-wide"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
              ⚠ DEMO MODE
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">

      {/* ── DESKTOP SIDEBAR ── (hidden on mobile) */}
      <aside
        className="sidebar flex-col flex-shrink-0 hidden md:flex"
        style={{
          width: sidebarOpen ? 240 : 68,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
        <SidebarContent compact={!sidebarOpen} />
      </aside>

      {/* ── MOBILE OVERLAY SIDEBAR ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Drawer */}
          <aside
            className="sidebar absolute left-0 top-0 bottom-0 flex flex-col animate-fade-in-left"
            style={{ width: 260 }}
            onClick={e => e.stopPropagation()}>
            <SidebarContent compact={false} />
          </aside>
        </div>
      )}

      {/* ── MOBILE TOP BAR ── (shown only on mobile) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <SMKCLogo size={28} />
            <span className="text-white font-bold text-sm font-display">NAGAR-NETRA</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notif badge */}
            <div className="relative">
              <Bell size={18} className="text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold leading-none border border-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
