import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCasesStore } from '../store/store';
import { StatusBadge, PriorityBadge, DemoDataBanner } from '../components/ui';
import { fmtDate } from '../utils/helpers';
import { Search, Filter, Download, Plus, MapPin, X, SlidersHorizontal } from 'lucide-react';

export default function CaseListPage({ role = 'admin' }) {
  const navigate = useNavigate();
  const { getFilteredCases, setFilters } = useCasesStore();
  const [search, setSearch] = useState('');
  const [localFilters, setLocalFilters] = useState({ status: '', type: '', priority: '', zone: '', source: '' });
  const [filtersOpen, setFiltersOpen] = useState(true);

  const applyFilters = () => {
    setFilters({ ...localFilters, search });
  };

  const clearFilters = () => {
    const empty = { status: '', type: '', priority: '', zone: '', search: '', source: '' };
    setLocalFilters({ status: '', type: '', priority: '', zone: '', source: '' });
    setSearch('');
    setFilters(empty);
  };

  const hasActiveFilters = search || localFilters.status || localFilters.type || localFilters.priority || localFilters.zone || localFilters.source;
  const cases = getFilteredCases();

  const handleExport = () => {
    const headers = 'Case ID,Type,Status,Priority,Location,Reporter,Source,Date\n';
    const rows = cases.map(c =>
      `"${c.id}","${c.type}","${c.status}","${c.priority || ''}","${c.location || ''}","${c.reporterName || ''}","${c.source || 'Web'}","${c.reportedAt?.split('T')[0] || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'nagar-netra-cases.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const TITLE_MAP = {
    admin: 'Case Management',
    supervisor: 'All Cases',
    officer: 'Assigned Cases',
    citizen: 'My Reports',
  };

  return (
    <div className="p-6 animate-fade-in space-y-5">
      <DemoDataBanner />

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">{TITLE_MAP[role]}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            <span className="font-semibold text-slate-600">{cases.length}</span> cases
            {hasActiveFilters && <span className="text-blue-600 ml-1">· Filtered</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`btn btn-sm flex items-center gap-1.5 ${filtersOpen ? 'btn-primary' : 'btn-outline'}`}>
            <SlidersHorizontal size={13} />
            Filters
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.3)' }}>
                !
              </span>
            )}
          </button>
          {(role === 'admin' || role === 'citizen') && (
            <button
              onClick={() => navigate('/citizen/report-new-auth')}
              className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Plus size={13} /> New Report
            </button>
          )}
          <button onClick={handleExport} className="btn btn-outline btn-sm flex items-center gap-1.5">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Filters Panel ── */}
      {filtersOpen && (
        <div className="card p-4 animate-fade-in">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="form-label">Search</label>
              <div className="relative">
                <input
                  className="form-input pl-9"
                  placeholder="Case ID, title, location..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyFilters()}
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input w-44"
                value={localFilters.status}
                onChange={e => setLocalFilters({ ...localFilters, status: e.target.value })}>
                <option value="">All Statuses</option>
                {['New', 'Under Review', 'Field Verification', 'Verified', 'Notice Issued', 'Compliance Pending', 'Action Ordered', 'Closed'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="form-label">Type</label>
              <select
                className="form-input w-48"
                value={localFilters.type}
                onChange={e => setLocalFilters({ ...localFilters, type: e.target.value })}>
                <option value="">All Types</option>
                <option>Illegal Hoarding</option>
                <option>Encroachment</option>
                <option>Unauthorized Advertisement</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="form-label">Priority</label>
              <select
                className="form-input w-32"
                value={localFilters.priority}
                onChange={e => setLocalFilters({ ...localFilters, priority: e.target.value })}>
                <option value="">All</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            {/* Zone */}
            <div>
              <label className="form-label">Zone</label>
              <select
                className="form-input w-32"
                value={localFilters.zone}
                onChange={e => setLocalFilters({ ...localFilters, zone: e.target.value })}>
                <option value="">All Zones</option>
                <option>Sangli</option>
                <option>Miraj</option>
                <option>Kupwad</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="form-label">Source</label>
              <select
                className="form-input w-36"
                value={localFilters.source}
                onChange={e => setLocalFilters({ ...localFilters, source: e.target.value })}>
                <option value="">All Sources</option>
                <option value="Web">🌐 Web</option>
                <option value="WhatsApp">💬 WhatsApp</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={applyFilters} className="btn btn-primary btn-sm flex items-center gap-1.5">
                <Filter size={13} /> Apply
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn btn-secondary btn-sm flex items-center gap-1.5">
                  <X size={13} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-xs text-slate-400 font-medium">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  "{search}"
                  <button onClick={() => { setSearch(''); }} className="hover:text-blue-800"><X size={10} /></button>
                </span>
              )}
              {localFilters.status && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}>
                  {localFilters.status}
                  <button onClick={() => setLocalFilters({ ...localFilters, status: '' })}><X size={10} /></button>
                </span>
              )}
              {localFilters.priority && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                  {localFilters.priority}
                  <button onClick={() => setLocalFilters({ ...localFilters, priority: '' })}><X size={10} /></button>
                </span>
              )}
              {localFilters.source && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                  {localFilters.source === 'WhatsApp' ? '💬 WhatsApp' : '🌐 Web'}
                  <button onClick={() => setLocalFilters({ ...localFilters, source: '' })}><X size={10} /></button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Type</th>
                <th>Title / Location</th>
                <th>Zone</th>
                <th>Reported</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Source</th>
                <th>Officer</th>
                <th>AI</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <div className="font-medium text-slate-500">No cases match your filters</div>
                    <button onClick={clearFilters} className="btn btn-outline btn-sm mt-3">Clear Filters</button>
                  </td>
                </tr>
              ) : cases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/cases/${c.id}`)}
                  className="cursor-pointer">
                  <td>
                    <span className="font-mono text-xs font-bold text-blue-700">{c.id}</span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-500 whitespace-nowrap px-2 py-1 rounded-md bg-slate-50">
                      {c.type}
                    </span>
                  </td>
                  <td>
                    <div className="font-medium text-slate-800 text-sm max-w-[200px] truncate">{c.title}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={9} />{c.location}
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-slate-600">{c.ward}</span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{fmtDate(c.reportedAt)}</span>
                  </td>
                  <td><PriorityBadge priority={c.priority} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={c.source === 'WhatsApp'
                        ? { background: '#dcfce7', color: '#16a34a' }
                        : { background: '#dbeafe', color: '#1d4ed8' }}>
                      {c.source === 'WhatsApp' ? '💬 WA' : '🌐 Web'}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-500">
                      {c.assignedOfficerName || (
                        <span className="text-slate-300 italic">Unassigned</span>
                      )}
                    </span>
                  </td>
                  <td>
                    {c.aiConfidence > 0 && (
                      <span className="text-xs font-bold text-purple-700">🤖 {c.aiConfidence}%</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-between text-xs text-slate-500"
          style={{ borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
          <span>
            Showing <span className="font-semibold text-slate-700">{cases.length}</span> cases · Demo Data
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:underline font-medium flex items-center gap-1">
              <X size={11} /> Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
