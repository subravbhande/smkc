import { DemoDataBanner, PageHeader } from '../../components/ui';
import { DEMO_OFFICERS } from '../../data/mockData';
import { useCasesStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../../components/ui';
import { fmtDate } from '../../utils/helpers';
import { Users } from 'lucide-react';

export default function AssignmentsPage() {
  const { cases, assignOfficer } = useCasesStore();
  const navigate = useNavigate();

  const unassigned = cases.filter(c => !c.assignedOfficer && !['Closed', 'Rejected'].includes(c.status));

  return (
    <div className="p-6 animate-fade-in">
      <DemoDataBanner />
      <PageHeader title="Case Assignments" subtitle="Assign and manage field officer workload" />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Officer workload */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Users size={16} />Officer Workload</h3>
            {DEMO_OFFICERS.map((o) => (
              <div key={o.id} className="mb-4 p-3 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{o.name}</div>
                    <div className="text-xs text-slate-500">{o.zone} Zone</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-blue-700">{o.assigned} assigned</div>
                    {o.overdue > 0 && <div className="text-red-600">{o.overdue} overdue</div>}
                  </div>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${Math.min((o.assigned / 8) * 100, 100)}%` }} />
                </div>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span>{o.pending} pending</span>
                  <span>{o.completed} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unassigned cases */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Unassigned Cases</h3>
              <span className="badge badge-action">{unassigned.length} pending</span>
            </div>
            {unassigned.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-slate-500 font-medium">All cases are assigned</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {unassigned.map((c) => (
                  <div key={c.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/cases/${c.id}`)}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-blue-700">{c.id}</span>
                          <PriorityBadge priority={c.priority} />
                        </div>
                        <div className="font-medium text-slate-800 text-sm truncate">{c.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{c.location} · {fmtDate(c.reportedAt)}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <select className="form-input text-xs py-1 w-36"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const o = DEMO_OFFICERS.find(off => off.id === e.target.value);
                              if (o) assignOfficer(c.id, o.name, o.id);
                            }
                          }}>
                          <option value="">Assign to...</option>
                          {DEMO_OFFICERS.map(o => (
                            <option key={o.id} value={o.id}>{o.name} ({o.assigned})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All assigned cases */}
          <div className="card mt-4">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">All Assigned Cases</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Officer</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.filter(c => c.assignedOfficerName).slice(0, 10).map((c) => (
                    <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="cursor-pointer">
                      <td><span className="font-mono text-xs font-bold text-blue-700">{c.id}</span></td>
                      <td className="max-w-40 truncate text-sm">{c.title}</td>
                      <td><PriorityBadge priority={c.priority} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="text-sm text-slate-600">{c.assignedOfficerName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
