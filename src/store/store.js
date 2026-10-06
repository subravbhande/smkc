import { create } from 'zustand';
import { DEMO_CASES, DEMO_NOTIFICATIONS, DEMO_AUDIT_LOGS } from '../data/mockData';

// ─── Demo user registry (expandable) ────────────────────────
const DEMO_USERS = {
  'citizen@demo.com':      { id: 'c1', name: 'Ramesh Kulkarni',    email: 'citizen@demo.com',     role: 'Citizen',       zone: 'Sangli', mobile: '9XXXXXXXX1', avatar: 'RK', status: 'Active', createdAt: '2026-01-15T10:00:00Z', lastLogin: '2026-10-03T07:00:00Z' },
  'citizen2@demo.com':     { id: 'c2', name: 'Anita Desai',         email: 'citizen2@demo.com',    role: 'Citizen',       zone: 'Miraj',  mobile: '9XXXXXXXX6', avatar: 'AD', status: 'Active', createdAt: '2026-02-20T10:00:00Z', lastLogin: '2026-09-30T15:00:00Z' },
  'citizen3@demo.com':     { id: 'c3', name: 'Mohan Patil',         email: 'citizen3@demo.com',    role: 'Citizen',       zone: 'Kupwad', mobile: '9XXXXXXXX7', avatar: 'MP', status: 'Active', createdAt: '2026-03-10T10:00:00Z', lastLogin: '2026-09-27T08:00:00Z' },
  'officer@smkc.demo':     { id: 'o1', name: 'Rahul Patil',         email: 'officer@smkc.demo',    role: 'Field Officer', zone: 'Sangli', mobile: '9XXXXXXXX1', avatar: 'RP', status: 'Active', createdAt: '2025-06-01T10:00:00Z', lastLogin: '2026-10-03T10:30:00Z' },
  'officer2@smkc.demo':    { id: 'o2', name: 'Priya Sharma',        email: 'officer2@smkc.demo',   role: 'Field Officer', zone: 'Sangli', mobile: '9XXXXXXXX2', avatar: 'PS', status: 'Active', createdAt: '2025-07-01T10:00:00Z', lastLogin: '2026-10-03T09:45:00Z' },
  'officer3@smkc.demo':    { id: 'o3', name: 'Vijay Kadam',         email: 'officer3@smkc.demo',   role: 'Field Officer', zone: 'Miraj',  mobile: '9XXXXXXXX3', avatar: 'VK', status: 'Active', createdAt: '2025-07-15T10:00:00Z', lastLogin: '2026-10-03T11:00:00Z' },
  'officer4@smkc.demo':    { id: 'o4', name: 'Amol Shinde',         email: 'officer4@smkc.demo',   role: 'Field Officer', zone: 'Kupwad', mobile: '9XXXXXXXX4', avatar: 'AS', status: 'Active', createdAt: '2025-08-01T10:00:00Z', lastLogin: '2026-10-02T16:30:00Z' },
  'officer5@smkc.demo':    { id: 'o5', name: 'Meera Joshi',         email: 'officer5@smkc.demo',   role: 'Field Officer', zone: 'Kupwad', mobile: '9XXXXXXXX5', avatar: 'MJ', status: 'Active', createdAt: '2025-09-01T10:00:00Z', lastLogin: '2026-10-03T08:00:00Z' },
  'supervisor@smkc.demo':  { id: 's1', name: 'Suresh Jadhav',       email: 'supervisor@smkc.demo', role: 'Supervisor',    zone: 'Sangli', mobile: '9XXXXXXXX8', avatar: 'SJ', status: 'Active', createdAt: '2025-01-01T10:00:00Z', lastLogin: '2026-10-03T09:00:00Z' },
  'supervisor2@smkc.demo': { id: 's2', name: 'Lata Patil',          email: 'supervisor2@smkc.demo',role: 'Supervisor',    zone: 'Miraj',  mobile: '9XXXXXXXX9', avatar: 'LP', status: 'Active', createdAt: '2025-01-01T10:00:00Z', lastLogin: '2026-10-02T14:00:00Z' },
  'admin@smkc.demo':       { id: 'a1', name: 'Commissioner Admin',  email: 'admin@smkc.demo',      role: 'Administrator', zone: 'All',    mobile: '9XXXXXXXX0', avatar: 'CA', status: 'Active', createdAt: '2024-01-01T10:00:00Z', lastLogin: '2026-10-03T08:00:00Z' },
};

// ─── Auth Store ──────────────────────────────────────────────
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, _password) => {
    // In prototype: any non-empty password works for demo accounts
    const user = DEMO_USERS[email?.toLowerCase()];
    if (user) {
      const loggedIn = { ...user, lastLogin: new Date().toISOString() };
      set({ user: loggedIn, isAuthenticated: true });
      return { success: true, role: user.role };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  register: (data) => {
    // Mock registration — creates a citizen entry in memory
    const newUser = {
      id: `c${Date.now()}`,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role: 'Citizen',
      zone: 'Sangli',
      avatar: data.name?.charAt(0)?.toUpperCase() || 'U',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    DEMO_USERS[data.email] = newUser;
    return { success: true, user: newUser };
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  getAllUsers: () => Object.values(DEMO_USERS),

  updateUserStatus: (email, status) => {
    if (DEMO_USERS[email]) {
      DEMO_USERS[email] = { ...DEMO_USERS[email], status };
    }
  },

  updateUserRole: (email, role) => {
    if (DEMO_USERS[email]) {
      DEMO_USERS[email] = { ...DEMO_USERS[email], role };
    }
  },
}));

// ─── Cases Store ─────────────────────────────────────────────
export const useCasesStore = create((set, get) => ({
  cases: DEMO_CASES,
  selectedCase: null,
  filters: { status: '', type: '', priority: '', zone: '', search: '', source: '' },

  setSelectedCase: (c) => set({ selectedCase: c }),

  updateCaseStatus: (caseId, newStatus, comment, userName, userRole) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const newEntry = {
          date: new Date().toISOString(),
          event: `Status changed to ${newStatus}${comment ? ': ' + comment : ''}`,
          user: userName,
          role: userRole || 'Officer',
          icon: 'status',
        };
        const updatedCase = {
          ...c,
          status: newStatus,
          timeline: [...(c.timeline || []), newEntry],
          updatedAt: new Date().toISOString(),
        };
        if (newStatus === 'Closed') {
          updatedCase.closedAt = new Date().toISOString();
        }
        return updatedCase;
      }),
    }));
    // Add to audit log
    useAuditStore.getState().addLog({
      user: userName,
      role: userRole || 'Officer',
      action: `Status Updated to ${newStatus}`,
      caseId,
      comment,
    });
  },

  assignOfficer: (caseId, officerName, officerId, instructions, priority) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const entry = {
          date: new Date().toISOString(),
          event: `Case assigned to ${officerName}${instructions ? ': ' + instructions : ''}`,
          user: 'Supervisor',
          role: 'Supervisor',
          icon: 'assign',
        };
        return {
          ...c,
          assignedOfficer: officerId,
          assignedOfficerName: officerName,
          status: 'Field Verification',
          priority: priority || c.priority,
          instructions,
          timeline: [...(c.timeline || []), entry],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  issueNotice: (caseId, noticeData, userName) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const entry = {
          date: new Date().toISOString(),
          event: `Notice ${noticeData.number} issued — Compliance deadline: ${noticeData.deadline}`,
          user: userName,
          role: 'Supervisor',
          icon: 'notice',
        };
        return {
          ...c,
          status: 'Notice Issued',
          noticeNumber: noticeData.number,
          noticeDate: new Date().toISOString(),
          noticeDeadline: noticeData.deadline,
          noticeRecipient: noticeData.recipient,
          noticeRule: noticeData.rule,
          timeline: [...(c.timeline || []), entry],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
    useAuditStore.getState().addLog({
      user: userName,
      role: 'Supervisor',
      action: `Notice Issued ${noticeData.number}`,
      caseId,
    });
  },

  orderAction: (caseId, actionData, userName) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const entry = {
          date: new Date().toISOString(),
          event: `Enforcement action ordered: ${actionData.type}${actionData.team ? ' — Team: ' + actionData.team : ''}`,
          user: userName,
          role: 'Supervisor',
          icon: 'action',
        };
        return {
          ...c,
          status: 'Action Ordered',
          actionType: actionData.type,
          actionTeam: actionData.team,
          actionDate: actionData.date,
          actionInstructions: actionData.instructions,
          timeline: [...(c.timeline || []), entry],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  uploadEvidence: (caseId, evidenceData, userName, userRole) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const entry = {
          date: new Date().toISOString(),
          event: `Evidence uploaded: ${evidenceData.label || evidenceData.filename}`,
          user: userName,
          role: userRole,
          icon: 'evidence',
        };
        return {
          ...c,
          fieldEvidence: [...(c.fieldEvidence || []), evidenceData],
          timeline: [...(c.timeline || []), entry],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  closeCase: (caseId, closureData, userName) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const entry = {
          date: new Date().toISOString(),
          event: `Case closed — ${closureData.reason}`,
          user: userName,
          role: 'Supervisor',
          icon: 'close',
        };
        return {
          ...c,
          status: 'Closed',
          closedAt: new Date().toISOString(),
          closedBy: userName,
          closureReason: closureData.reason,
          closureComment: closureData.comment,
          timeline: [...(c.timeline || []), entry],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
    useAuditStore.getState().addLog({
      user: userName,
      role: 'Supervisor',
      action: 'Case Closed',
      caseId,
      comment: closureData.reason,
    });
  },

  addCase: (newCase) => {
    set((state) => ({ cases: [newCase, ...state.cases] }));
    useAuditStore.getState().addLog({
      user: newCase.reporterName || 'Citizen',
      role: newCase.source === 'WhatsApp' ? 'WhatsApp' : 'Citizen',
      action: 'Report Submitted',
      caseId: newCase.id,
      comment: `Via ${newCase.source || 'Citizen Portal'}`,
    });
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  getFilteredCases: () => {
    const { cases, filters } = get();
    return cases.filter((c) => {
      if (filters.status && c.status !== filters.status) return false;
      if (filters.type && c.type !== filters.type) return false;
      if (filters.priority && c.priority !== filters.priority) return false;
      if (filters.zone && c.ward !== filters.zone) return false;
      if (filters.source && (c.source || 'Web') !== filters.source) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!c.id.toLowerCase().includes(q) &&
            !c.title.toLowerCase().includes(q) &&
            !(c.location || '').toLowerCase().includes(q) &&
            !(c.reporterName || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  },

  getNearbyCases: (lat, lng, radius = 0.05) => {
    const { cases } = get();
    return cases.filter(c => c.lat && c.lng &&
      Math.abs(c.lat - lat) < radius && Math.abs(c.lng - lng) < radius
    );
  },
}));

// ─── Notifications Store ──────────────────────────────────────
export const useNotifStore = create((set) => ({
  notifications: DEMO_NOTIFICATIONS,
  unreadCount: DEMO_NOTIFICATIONS.filter((n) => !n.read).length,

  markRead: (id) => set((state) => {
    const updated = state.notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
  }),

  markAllRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  addNotification: (notif) => set((state) => ({
    notifications: [{ id: Date.now(), ...notif, read: false, time: new Date().toISOString() }, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
}));

// ─── Audit Log Store ──────────────────────────────────────────
export const useAuditStore = create((set) => ({
  logs: DEMO_AUDIT_LOGS,

  addLog: (entry) => set((state) => ({
    logs: [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry,
    }, ...state.logs],
  })),
}));
