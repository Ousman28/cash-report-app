class RegisterForm {
  constructor(container) {
    this.container = container;
  }

  render({ onRegister, onCancel }) {
    this.container.innerHTML = `
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Register</h2>
        <form id="registerForm" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your username"
            />
            <p class="text-xs text-gray-500 mt-1">Username must be unique.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
            />
            <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters long.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a role</option>
              <option value="teamLead">Team Lead</option>
              <option value="dataAnalyst">Data Analyst</option>
              <option value="cashController">Cash Controller</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Telephone</label>
            <input
              type="tel"
              id="telephone"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your telephone number"
            />
          </div>
          <div class="flex justify-between">
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Create Account
            </button>
            <button
              type="button"
              id="cancelBtn"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;

    this.container.querySelector('#registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = this.container.querySelector('#username').value;
      const password = this.container.querySelector('#password').value;
      const role = this.container.querySelector('#role').value;
      const gender = this.container.querySelector('#gender').value;
      const email = this.container.querySelector('#email').value;
      const dateOfBirth = this.container.querySelector('#dateOfBirth').value;
      const telephone = this.container.querySelector('#telephone').value;
      onRegister(username, password, role, gender, email, dateOfBirth, telephone);
    });

    this.container.querySelector('#cancelBtn').addEventListener('click', onCancel);
  }
}
