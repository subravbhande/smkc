// Utility helpers
export const STATUS_COLORS = {
  'New': 'badge-new',
  'Under Review': 'badge-review',
  'Field Verification': 'badge-field',
  'Verified': 'badge-verified',
  'Notice Issued': 'badge-notice',
  'Compliance Pending': 'badge-compliance',
  'Action Ordered': 'badge-action',
  'Closed': 'badge-closed',
  'Rejected': 'badge-rejected',
  'Escalated': 'badge-action',
};

export const PRIORITY_COLORS = {
  'Critical': 'badge-critical',
  'High': 'badge-high',
  'Medium': 'badge-medium',
  'Low': 'badge-low',
};

export const PRIORITY_DOT = {
  'Critical': '#dc2626',
  'High': '#ea580c',
  'Medium': '#ca8a04',
  'Low': '#16a34a',
};

export const STATUS_LIST = ['New','Under Review','Field Verification','Verified','Notice Issued','Compliance Pending','Action Ordered','Closed','Rejected'];
export const TYPE_LIST = ['Illegal Hoarding','Encroachment','Unauthorized Advertisement','Other'];
export const PRIORITY_LIST = ['Critical','High','Medium','Low'];

export function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function genCaseId() {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `NNT-2026-${num.toString().padStart(6, '0')}`;
}

export const DEMO_OFFICERS = [
  { id: 'rahul.patil@smkc.demo', name: 'Rahul Patil', zone: 'Sangli', assigned: 6, pending: 2, completed: 28, overdue: 1 },
  { id: 'priya.sharma@smkc.demo', name: 'Priya Sharma', zone: 'Sangli', assigned: 4, pending: 2, completed: 22, overdue: 0 },
  { id: 'vijay.kadam@smkc.demo', name: 'Vijay Kadam', zone: 'Miraj', assigned: 5, pending: 3, completed: 31, overdue: 2 },
  { id: 'amol.shinde@smkc.demo', name: 'Amol Shinde', zone: 'Kupwad', assigned: 3, pending: 1, completed: 18, overdue: 0 },
  { id: 'meera.joshi@smkc.demo', name: 'Meera Joshi', zone: 'Kupwad', assigned: 2, pending: 2, completed: 15, overdue: 1 },
];

export const TIMELINE_ICONS = {
  report: { bg: '#dbeafe', color: '#1d4ed8', label: '📋' },
  ai: { bg: '#ede9fe', color: '#6d28d9', label: '🤖' },
  ocr: { bg: '#f3e8ff', color: '#7c3aed', label: '🔍' },
  assign: { bg: '#fef3c7', color: '#92400e', label: '👤' },
  inspect: { bg: '#e0e7ff', color: '#3730a3', label: '🔎' },
  verify: { bg: '#d1fae5', color: '#065f46', label: '✅' },
  notice: { bg: '#fce7f3', color: '#9d174d', label: '📄' },
  action: { bg: '#fee2e2', color: '#991b1b', label: '⚡' },
  evidence: { bg: '#fef9c3', color: '#713f12', label: '📸' },
  close: { bg: '#f1f5f9', color: '#475569', label: '🔒' },
  status: { bg: '#e0f2fe', color: '#0369a1', label: '🔄' },
  default: { bg: '#f1f5f9', color: '#64748b', label: '•' },
};
