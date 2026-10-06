import { useState } from 'react';
import { DemoDataBanner, PageHeader, ConfirmDialog } from '../../components/ui';
import { useAuthStore, useAuditStore } from '../../store/store';
import { UserPlus, Edit, XCircle, CheckCircle, RefreshCw, Search, Filter, Shield } from 'lucide-react';
import { fmtDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ROLE_COLORS = {
  Citizen:         { bg: '#fef3c7', text: '#92400e', badge: '#d97706' },
  'Field Officer': { bg: '#dbeafe', text: '#1e40af', badge: '#1d4ed8' },
  Supervisor:      { bg: '#ede9fe', text: '#5b21b6', badge: '#7c3aed' },
  Administrator:   { bg: '#fee2e2', text: '#991b1b', badge: '#dc2626' },
};

const ROLES = ['Citizen', 'Field Officer', 'Supervisor', 'Administrator'];

export default function UserManagementPage() {
  const { getAllUsers, updateUserStatus, updateUserRole } = useAuthStore();
  const { addLog } = useAuditStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [refresh, setRefresh] = useState(0);

  const allUsers = getAllUsers();
  const filtered = allUsers.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.zone?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDisable = (user) => {
    setConfirmDialog({
      title: `Disable ${user.name}?`,
      message: `This will prevent ${user.name} from accessing the platform. You can re-enable them at any time.`,
      type: 'danger',
      onConfirm: () => {
        updateUserStatus(user.email, 'Disabled');
        addLog({ user: 'Admin', role: 'Administrator', action: 'User Disabled', caseId: null, comment: user.email });
        toast.success(`${user.name} has been disabled`);
        setConfirmDialog(null);
        setRefresh(r => r + 1);
      },
    });
  };

  const handleEnable = (user) => {
    updateUserStatus(user.email, 'Active');
    addLog({ user: 'Admin', role: 'Administrator', action: 'User Enabled', caseId: null, comment: user.email });
    toast.success(`${user.name} has been re-enabled`);
    setRefresh(r => r + 1);
  };

  const handleChangeRole = () => {
    if (!editRole || editRole === editUser.role) { toast.error('Select a different role'); return; }
    updateUserRole(editUser.email, editRole);
    addLog({ user: 'Admin', role: 'Administrator', action: `Role Changed to ${editRole}`, caseId: null, comment: editUser.email });
    toast.success(`${editUser.name}'s role changed to ${editRole}`);
    setEditUser(null);
    setRefresh(r => r + 1);
  };

  const handleResetPassword = (user) => {
    setConfirmDialog({
      title: `Reset Password for ${user.name}?`,
      message: `A password reset link will be sent to ${user.email}. In demo mode, this is simulated.`,
      type: 'warning',
      onConfirm: () => {
        toast.success(`Password reset email sent to ${user.email} (demo simulation)`);
        setConfirmDialog(null);
      },
    });
  };

  return (
    <div className="p-6 animate-fade-in space-y-5">
      <DemoDataBanner />
      <PageHeader title="User Management" subtitle="Manage platform users, roles and departmental access">
        <button className="btn btn-primary btn-sm" onClick={() => toast('Officer/Admin accounts can be created from this panel in production', { icon: 'ℹ️' })}>
          <UserPlus size={14} /> Add User
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map((role) => (
          <div key={role}
            className="stat-card cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
            style={{ borderLeft: roleFilter === role ? `3px solid ${ROLE_COLORS[role].badge}` : '3px solid transparent' }}>
            <div className="text-2xl font-bold font-display" style={{ color: ROLE_COLORS[role].badge }}>
              {allUsers.filter(u => u.role === role).length}
            </div>
            <div className="text-xs text-slate-500 mt-1">{role}s</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <input
            className="form-input pl-9 py-2 text-sm"
            placeholder="Search by name, email, zone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <select
          className="form-input py-2 text-sm w-auto"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {(search || roleFilter) && (
          <button
            onClick={() => { setSearch(''); setRoleFilter(''); }}
            className="btn btn-sm text-slate-500 hover:text-slate-800">
            <RefreshCw size={13} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                    No users match your filters
                  </td>
                </tr>
              ) : filtered.map((u) => {
                const rc = ROLE_COLORS[u.role] || ROLE_COLORS.Citizen;
                return (
                  <tr key={u.email}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: rc.badge }}>
                          {u.avatar || u.name?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">{u.name}</div>
                          <div className="text-slate-400 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ background: rc.bg, color: rc.text }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-sm text-slate-600">{u.zone || '—'}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${u.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="text-xs text-slate-400">{fmtDate(u.createdAt)}</td>
                    <td className="text-xs text-slate-400">{u.lastLogin ? fmtDate(u.lastLogin) : '—'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          title="Change Role"
                          onClick={() => { setEditUser(u); setEditRole(u.role); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Shield size={13} />
                        </button>
                        <button
                          title="Reset Password"
                          onClick={() => handleResetPassword(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          <RefreshCw size={13} />
                        </button>
                        {u.status !== 'Disabled' ? (
                          <button
                            title="Disable User"
                            onClick={() => handleDisable(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <XCircle size={13} />
                          </button>
                        ) : (
                          <button
                            title="Enable User"
                            onClick={() => handleEnable(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                            <CheckCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-xs text-slate-400 flex justify-between items-center" style={{ borderTop: '1px solid #f1f5f9' }}>
          <span>Showing {filtered.length} of {allUsers.length} users</span>
          <span className="text-slate-500 font-medium">Official SMKC Personnel Directory</span>
        </div>
      </div>

      {/* Change Role modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in-scale p-6">
            <h3 className="font-bold text-slate-900 mb-1">Change Role</h3>
            <p className="text-slate-400 text-sm mb-4">Change role for <strong>{editUser.name}</strong></p>
            <select
              className="form-input mb-4"
              value={editRole}
              onChange={e => setEditRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-4">
              ⚠️ Changing roles affects what this user can access. Confirm carefully.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditUser(null)} className="btn btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleChangeRole} className="btn btn-primary flex-1 justify-center">Update Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
