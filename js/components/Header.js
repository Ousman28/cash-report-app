class Header {
  constructor(container) {
    this.container = container;
  }

  render(username, onLogout) {
    this.container.innerHTML = `
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">
            Daily Cash Collection Report
          </h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">Welcome, ${username}</span>
            <button id="logoutBtn" class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </header>
    `;

    this.container.querySelector('#logoutBtn').addEventListener('click', onLogout);
  }
}