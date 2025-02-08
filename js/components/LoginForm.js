class LoginForm {
  constructor(container) {
    this.container = container;
  }

  render({ onLogin, onCreateAccount }) {
    this.container.innerHTML = `
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form id="loginForm" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
            <button
              type="button"
              id="createAccountBtn"
              class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              
            </button>
          </div>
        </form>
      </div>
    `;

    this.container.querySelector('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = this.container.querySelector('#username').value;
      const password = this.container.querySelector('#password').value;
      onLogin(username, password);
    });

    this.container.querySelector('#createAccountBtn').addEventListener('click', onCreateAccount);
  }
}