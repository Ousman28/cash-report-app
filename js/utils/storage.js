const storage = {
  USERS_KEY: 'cash_collection_users',
  REPORTS_KEY: 'cash_collection_reports',
  PENDING_UPDATES_KEY: 'cash_collection_pending_updates',
  ACTIVATED_TEAM_LEAD_KEY: 'cash_collection_activated_team_lead',

  // User management
  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },

  saveUser(user) {
    const users = this.getUsers();
    const existingUser = users.find((u) => u.username === user.username);
    if (existingUser) {
      Object.assign(existingUser, user); // Update existing user
    } else {
      users.push(user); // Add new user
    }
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  findUser(username, password) {
    const users = this.getUsers();
    return users.find((u) => u.username === username && u.password === password);
  },

  findUserByUsername(username) {
    const users = this.getUsers();
    return users.find((u) => u.username === username);
  },

  deactivateUser(username) {
    const users = this.getUsers();
    const user = users.find((u) => u.username === username);
    if (user) {
      user.active = false;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  },

  // Report management
  getReports() {
    return JSON.parse(localStorage.getItem(this.REPORTS_KEY) || '[]');
  },

  saveReport(report) {
    const reports = this.getReports();
    reports.push(report);
    localStorage.setItem(this.REPORTS_KEY, JSON.stringify(reports));
  },

  updateReport(id, updates) {
    const reports = this.getReports();
    const index = reports.findIndex((r) => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates };
      localStorage.setItem(this.REPORTS_KEY, JSON.stringify(reports));
      return true; // Success
    }
    return false; // Report not found
  },

  getReportById(id) {
    const reports = this.getReports();
    return reports.find((r) => r.id === id);
  },

  getReportsByUser(username) {
    const reports = this.getReports();
    return reports.filter((r) => r.submittedBy === username);
  },

  deleteReport(id) {
    const reports = this.getReports();
    const updatedReports = reports.filter((r) => r.id !== id);
    localStorage.setItem(this.REPORTS_KEY, JSON.stringify(updatedReports));
  },

  // Pending updates
  getPendingUpdates() {
    return JSON.parse(localStorage.getItem(this.PENDING_UPDATES_KEY) || '[]');
  },

  savePendingUpdate(id, updatedData) {
    const reports = this.getReports();
    const report = reports.find((r) => r.id === id);
    if (report) {
      const pendingUpdates = this.getPendingUpdates();
      pendingUpdates.push({
        id,
        updatedData,
        submittedBy: report.submittedBy,
        status: 'pending', // pending, approved, rejected
      });
      localStorage.setItem(this.PENDING_UPDATES_KEY, JSON.stringify(pendingUpdates));
    }
  },

  getPendingUpdatesByUser(username) {
    const pendingUpdates = this.getPendingUpdates();
    return pendingUpdates.filter((update) => update.submittedBy === username);
  },

  getAllPendingUpdates() {
    const pendingUpdates = this.getPendingUpdates();
    return pendingUpdates.filter((update) => update.status === 'pending');
  },

  verifyUpdate(id, status) {
    const pendingUpdates = this.getPendingUpdates();
    const update = pendingUpdates.find((u) => u.id === id);
    if (update) {
      update.status = status; // approved or rejected
      if (status === 'approved') {
        const reports = this.getReports();
        const report = reports.find((r) => r.id === id);
        if (report) {
          Object.assign(report, update.updatedData); // Apply the update to the report
          localStorage.setItem(this.REPORTS_KEY, JSON.stringify(reports));
        }
      }
      localStorage.setItem(this.PENDING_UPDATES_KEY, JSON.stringify(pendingUpdates));
    }
  },

  // Activation for Team Leads
  activateUpdateForTeamLead(username) {
    localStorage.setItem(this.ACTIVATED_TEAM_LEAD_KEY, username);
  },

  isUpdateActivated(username) {
    const activatedTeamLead = localStorage.getItem(this.ACTIVATED_TEAM_LEAD_KEY);
    return activatedTeamLead === username;
  },

  // Clear all data (for testing purposes)
  clearAll() {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.REPORTS_KEY);
    localStorage.removeItem(this.PENDING_UPDATES_KEY);
    localStorage.removeItem(this.ACTIVATED_TEAM_LEAD_KEY);
  },
};