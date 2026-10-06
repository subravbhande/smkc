import { useState } from 'react';
import { DemoDataBanner, PageHeader } from '../../components/ui';
import { useAuditStore } from '../../store/store';
import { fmtDateTime } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Download, RefreshCw } from 'lucide-react';

const ROLE_COLORS = {
  'Field Officer':  '#1d4ed8',
  'Supervisor':     '#7c3aed',
  'Administrator':  '#dc2626',
  'System':         '#0d9488',
  'Citizen':        '#ca8a04',
  'WhatsApp':       '#25d366',
};

const ACTION_TYPES = [
  'Report Submitted', 'Status Updated', 'Case Assigned', 'Field Verified',
  'Notice Issued', 'Case Closed', 'AI Analysis Completed', 'Evidence Uploaded',
  'User Disabled', 'User Enabled', 'Role Changed',
];

export default function AuditLogPage() {
  const navigate = useNavigate();
  const { logs } = useAuditStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filtered = logs.filter(log => {
    if (roleFilter && log.role !== roleFilter) return false;
    if (actionFilter && !log.action?.includes(actionFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.user?.toLowerCase().includes(q) ||
        log.caseId?.toLowerCase().includes(q) ||
        log.action?.toLowerCase().includes(q) ||
        log.comment?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = 'Timestamp,User,Role,Action,Case ID,Comment\n';
    const rows = filtered.map(l =>
      `"${fmtDateTime(l.timestamp)}","${l.user}","${l.role}","${l.action}","${l.caseId || ''}","${l.comment || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nagar-netra-audit-log.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 animate-fade-in space-y-5">
      <DemoDataBanner />
      <PageHeader title="Audit Log" subtitle="Immutable record of all system actions · Demo Data">
        <button onClick={handleExportCSV} className="btn btn-secondary btn-sm flex items-center gap-1.5">
          <Download size={13} /> Export CSV
        </button>
      </PageHeader>

      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <input
            className="form-input pl-9 py-2 text-sm"
            placeholder="Search by user, case ID, action..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <select className="form-input py-2 text-sm w-auto" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {['Citizen', 'Field Officer', 'Supervisor', 'Administrator', 'System', 'WhatsApp'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select className="form-input py-2 text-sm w-auto" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          <option value="">All Actions</option>
          {ACTION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {(search || roleFilter || actionFilter) && (
          <button onClick={() => { setSearch(''); setRoleFilter(''); setActionFilter(''); }}
            className="btn btn-sm text-slate-500">
            <RefreshCw size={12} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <Shield size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500">All audit records are immutable — read-only in production architecture</span>
          <span className="ml-auto text-xs text-slate-400">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Case ID</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                    No audit records match your filters
                  </td>
                </tr>
              ) : filtered.map((log, i) => {
                const roleColor = ROLE_COLORS[log.role] || '#64748b';
                return (
                  <tr key={log.id || i} className="hover:bg-slate-50 transition-colors">
                    <td className="text-xs font-mono text-slate-500 whitespace-nowrap">{fmtDateTime(log.timestamp)}</td>
                    <td className="font-medium text-sm text-slate-800">{log.user}</td>
                    <td>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ background: `${roleColor}18`, color: roleColor }}>
                        {log.role}
                      </span>
                    </td>
                    <td className="font-medium text-sm text-slate-700">{log.action}</td>
                    <td>
                      {log.caseId ? (
                        <button
                          onClick={() => navigate(`/cases/${log.caseId}`)}
                          className="font-mono text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                          {log.caseId}
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="text-xs text-slate-500 max-w-48 truncate" title={log.comment}>{log.comment || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-xs text-slate-400 flex justify-between" style={{ borderTop: '1px solid #f1f5f9' }}>
          <span>Showing {filtered.length} of {logs.length} audit events</span>
          <span>⚠️ Demo data — production stores complete history</span>
        </div>
      </div>
    </div>
  );
}
