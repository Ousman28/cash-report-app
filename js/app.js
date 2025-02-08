class App {
  constructor() {
    this.container = document.getElementById('app');
    this.currentUser = null;
    this.filteredReports = null; // Store filtered reports

    // Create initial admin account if it does not exist
    if (!storage.findUser('admin')) {
      storage.saveUser({
        username: 'admin',
        password: 'admin123', // Choose a secure password
        role: 'admin',
      });
    }

    this.init();
  }

  init() {
    // Initialize components
    this.header = new Header(document.createElement('div'));
    this.welcomeMessage = new WelcomeMessage(document.createElement('div'));
    this.loginForm = new LoginForm(document.createElement('div'));
    this.registerForm = new RegisterForm(document.createElement('div'));
    this.dataEntryForm = new DataEntryForm(document.createElement('div'));
    this.dataTable = new DataTable(document.createElement('div'));

    // Show the login screen by default
    this.showLoginScreen();
  }

  // Render the logo with responsive sizing
  renderLogo() {
    const logo = document.createElement('img');
    logo.src = '/css/image/my-logo.png'; // Path to your logo image
    logo.alt = 'App Logo';
    logo.className = 'mx-auto my-2 w-40 h-15 md:w-60 md:h-20 lg:w-80 lg:h-30'; // Responsive sizing
    this.container.appendChild(logo);
  }

  // Show the login screen
  showLoginScreen() {
    this.clearContainer();
    this.renderLogo();
    this.welcomeMessage.render();
    this.container.appendChild(this.welcomeMessage.container);

    this.loginForm.render({
      onLogin: this.handleLogin.bind(this),
    });
    this.container.appendChild(this.loginForm.container);
  }

  // Show the registration screen
  showRegisterScreen() {
    this.clearContainer();
    this.renderLogo();
    this.welcomeMessage.render();
    this.container.appendChild(this.welcomeMessage.container);

    this.registerForm.render({
      onRegister: this.handleAdminRegister.bind(this),
      onCancel: () => this.showLoginScreen(),
    });
    this.container.appendChild(this.registerForm.container);
  }

  // Handle user login
  handleLogin(username, password) {
    const user = storage.findUser(username, password);
    if (user) {
      this.currentUser = user;
      this.showDashboard();
    } else {
      alert('Invalid credentials');
    }
  }

  // Handle user registration
  handleRegister(username, password, role) {
    const users = storage.getUsers();
    if (users.some((u) => u.username === username)) {
      alert('Username already exists');
      return;
    }

    storage.saveUser({ username, password, role });
    alert('Welcome! Your account has been created successfully.');
    this.showLoginScreen();
  }

  // Handle admin registration
  handleAdminRegister(username, password, role) {
    const users = storage.getUsers();
    if (users.some((u) => u.username === username)) {
      alert('Username already exists');
      return;
    }

    storage.saveUser({ username, password, role });
    alert('User account has been created successfully.');
    this.showAdminDashboard();
  }

  // Handle user logout
  handleLogout() {
    this.currentUser = null;
    this.filteredReports = null; // Clear filtered reports on logout
    this.showLoginScreen();
  }

  // Show the appropriate dashboard based on user role
  showDashboard() {
    this.clearContainer();
    this.header.render(this.currentUser.username, () => this.handleLogout());
    this.container.appendChild(this.header.container);

    if (this.currentUser.role === 'admin') {
      this.showAdminDashboard();
    } else if (this.currentUser.role === 'teamLead') {
      this.showTeamLeadDashboard();
    } else if (this.currentUser.role === 'dataAnalyst' || this.currentUser.role === 'cashController') {
      this.showDataAnalystDashboard();
    }
  }

  // Show the admin dashboard
  showAdminDashboard() {
    this.clearContainer();
    this.header.render(this.currentUser.username, () => this.handleLogout());
    this.container.appendChild(this.header.container);

    // Date Range Picker
    const dateRangeInput = document.createElement('input');
    dateRangeInput.type = 'text';
    dateRangeInput.id = 'dateRangePicker';
    dateRangeInput.className = 'date-range-picker-input w-full md:w-auto mb-4'; // Responsive width
    this.container.appendChild(dateRangeInput);

    // Initialize Date Range Picker
    $(function () {
      $('#dateRangePicker').daterangepicker(
        {
          opens: 'left',
        },
        (start, end, label) => {
          this.filterDataByDateRange(start, end); // Use arrow function to retain `this` context
        }
      );
    });

    // Navigation bar with buttons
    const navBar = document.createElement('nav');
    navBar.className = 'flex flex-col md:flex-row justify-end gap-2 p-2'; // Responsive layout
    navBar.innerHTML = `
      <button id="createUserBtn" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full md:w-auto">Create User</button>
      <button id="deactivateUserBtn" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 w-full md:w-auto">Deactivate User</button>
      <button id="viewUsersBtn" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 w-full md:w-auto">View Users</button>
    `;
    this.container.appendChild(navBar);

    // Event listeners for navigation buttons
    document.getElementById('createUserBtn').addEventListener('click', () => this.showRegisterScreen());
    document.getElementById('deactivateUserBtn').addEventListener('click', () => this.deactivateUser());
    document.getElementById('viewUsersBtn').addEventListener('click', () => this.showUserList());
  }

  // Deactivate a user
  deactivateUser() {
    const username = prompt('Enter username to deactivate:');
    if (username) {
      const user = storage.findUserByUsername(username);
      if (user) {
        storage.deactivateUser(user.username);
        alert('User account has been deactivated.');
      } else {
        alert('User not found.');
      }
    }
  }

  // Show the team lead dashboard
  showTeamLeadDashboard() {
    this.clearContainer();
    this.header.render(this.currentUser.username, () => this.handleLogout());
    this.container.appendChild(this.header.container);

    this.dataEntryForm.render({
      onSubmit: this.handleReportSubmit.bind(this),
    });
    this.container.appendChild(this.dataEntryForm.container);

    const isUpdateActivated = storage.isUpdateActivated(this.currentUser.username);

    this.dataTable.render({
      data: storage.getReportsByUser(this.currentUser.username).sort((a, b) => new Date(b.date) - new Date(a.date)),
      showVerification: false,
      onUpdate: isUpdateActivated ? this.handleReportUpdate.bind(this) : null,
    });
    this.container.appendChild(this.dataTable.container);
  }

  // Show the data analyst dashboard
  showDataAnalystDashboard() {
    this.clearContainer();
    this.header.render(this.currentUser.username, () => this.handleLogout());
    this.container.appendChild(this.header.container);

    // Team Lead selection dropdown
    const teamLeadSelect = document.createElement('select');
    teamLeadSelect.id = 'teamLeadSelect';
    teamLeadSelect.className = 'p-2 border rounded w-full md:w-auto mb-4';

    const teamLeads = storage.getUsers().filter(user => user.role === 'teamLead');
    teamLeads.forEach(teamLead => {
      const option = document.createElement('option');
      option.value = teamLead.username;
      option.textContent = teamLead.username;
      teamLeadSelect.appendChild(option);
    });

    // Activate Update button
    const activateButton = document.createElement('button');
    activateButton.textContent = 'Activate Update';
    activateButton.className = 'bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full md:w-auto';
    activateButton.addEventListener('click', () => {
      const selectedTeamLead = teamLeadSelect.value;
      if (selectedTeamLead) {
        storage.activateUpdateForTeamLead(selectedTeamLead);
        alert(`Update button activated for ${selectedTeamLead}`);
      }
    });

    this.container.appendChild(teamLeadSelect);
    this.container.appendChild(activateButton);

    // Render the data table
    this.dataTable.render({
      data: this.filteredReports || storage.getReports().sort((a, b) => new Date(b.date) - new Date(a.date)), // Use filtered data if available
      showVerification: this.currentUser.role === 'dataAnalyst',
      onVerify: this.handleReportVerification.bind(this),
      onDownload: () => exportUtils.exportToCSV(this.filteredReports || storage.getReports()), // Export filtered data if available
    });
    this.container.appendChild(this.dataTable.container);
  }

  // Clear the container
  clearContainer() {
    this.container.innerHTML = '';
    this.filteredReports = null; // Clear filtered reports when the container is cleared
  }

  // Filter data by date range
  filterDataByDateRange(start, end) {
    this.filteredReports = storage.getReports().filter((report) => {
      const reportDate = new Date(report.date);
      return reportDate >= start && reportDate <= end;
    });

    this.dataTable.render({
      data: this.filteredReports,
      showVerification: this.currentUser.role === 'dataAnalyst',
      onVerify: this.handleReportVerification.bind(this),
      onDownload: () => exportUtils.exportToCSV(this.filteredReports), // Pass filtered data to export
    });
  }

  // Show the list of users
  showUserList() {
    const users = storage.getUsers();

    const userListContainer = document.createElement('div');
    userListContainer.className = 'user-list-container p-4';

    const userListTable = document.createElement('table');
    userListTable.className = 'user-list-table w-full';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th class="p-2">Username</th>
        <th class="p-2">Role</th>
      </tr>
    `;
    userListTable.appendChild(thead);

    const tbody = document.createElement('tbody');
    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${user.username}</td>
        <td class="p-2">${user.role}</td>
      `;
      tbody.appendChild(row);
    });
    userListTable.appendChild(tbody);

    userListContainer.appendChild(userListTable);
    this.container.appendChild(userListContainer);
  }

  // Handle report submission
  handleReportSubmit(data) {
    if (Object.keys(validation.validateReport(data)).length > 0) {
      alert('Please fill all required fields correctly');
      return;
    }

    const report = {
      ...data,
      id: crypto.randomUUID(),
      submittedBy: this.currentUser.username,
      verified: false,
    };

    storage.saveReport(report);
    this.showDashboard();
  }

  // Handle report update
  handleReportUpdate(id, updatedData) {
    if (this.currentUser.role === 'teamLead') {
      const report = storage.getReportById(id);
      if (report.submittedBy === this.currentUser.username) {
        storage.updateReport(id, updatedData);
        alert('Report updated successfully!');
        this.showTeamLeadDashboard();
      } else {
        alert('You can only update your own reports.');
      }
    } else if (this.currentUser.role === 'dataAnalyst') {
      storage.updateReport(id, updatedData);
      alert('Report updated successfully!');
      this.showDataAnalystDashboard();
    } else {
      alert('You do not have permission to update reports.');
    }
  }

  // Handle report verification
  handleReportVerification(id, { iicsInfant, iicsAdult, giaInfant, giaAdult }) {
    if (
      Object.keys(validation.validateIICSGIA(iicsInfant, iicsAdult, giaInfant, giaAdult)).length > 0
    ) {
      alert('Please fill all IICS and GIA fields correctly');
      return;
    }

    const iicsTotal = (parseInt(iicsInfant) || 0) + (parseInt(iicsAdult) || 0);
    const giaTotal = (parseInt(giaInfant) || 0) + (parseInt(giaAdult) || 0);

    storage.updateReport(id, {
      iicsInfant,
      iicsAdult,
      iicsTotal,
      giaInfant,
      giaAdult,
      giaTotal,
      verified: true,
      verifiedBy: this.currentUser.username,
    });

    this.showDashboard();
  }
}

// Initialize the app
new App();