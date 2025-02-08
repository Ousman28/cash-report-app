class DataEntryForm {
  constructor(container) {
    this.container = container;
    this.flights = ['Brussel', 'Asky', 'Turkish Airline']; // Initial flight options
    this.supervisors = []; // Initial supervisor options
  }

  calculateTotal(formData) {
    return [
      'paid', 'diplomats', 'infants', 'notPaid', 'paidCardQr',
      'refunds', 'deportees', 'transit', 'waivers', 'prepaidBank',
      'roundTrip', 'latePayment'
    ].reduce((sum, field) => sum + Number(formData[field] || 0), 0);
  }

  render({ onSubmit }) {
    this.container.innerHTML = `
      <form id="dataEntryForm" class="space-y-8 bg-gradient-to-b from-white to-gray-50 p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Flight Data Entry Form</h2>
          <p class="text-gray-600">Enter flight details and passenger information</p>
        </div>

        <!-- Flight Information Section -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Flight Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                required
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input
                type="text"
                name="refNo"
                required
                placeholder="Enter reference number"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
              <div class="flex gap-2">
                <select
                  name="supervisor"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="" disabled selected>Select Supervisor</option>
                  ${this.supervisors.map(supervisor => `
                    <option value="${supervisor}">${supervisor}</option>
                  `).join('')}
                </select>
                <button
                  type="button"
                  id="addSupervisorButton"
                  class="mt-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Flight</label>
              <div class="flex gap-2">
                <select
                  name="flight"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="" disabled selected>Select Flight</option>
                  ${this.flights.map(flight => `
                    <option value="${flight}">${flight}</option>
                  `).join('')}
                </select>
                <button
                  type="button"
                  id="addFlightButton"
                  class="mt-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <select
                name="zone"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="" disabled selected>Select zone</option>
                <option value="arrival">Arrival</option>
                <option value="departure">Departure</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Passenger Counts Section -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Passenger Counts</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${[
              { label: 'Paid', name: 'paid', icon: '💰' },
              { label: 'Diplomats', name: 'diplomats', icon: '🎖️' },
              { label: 'Infants', name: 'infants', icon: '👶' },
              { label: 'Not Paid', name: 'notPaid', icon: '❌' },
              { label: 'Paid Card/QR', name: 'paidCardQr', icon: '💳' },
              { label: 'Refunds', name: 'refunds', icon: '↩️' },
              { label: 'Deportees', name: 'deportees', icon: '🚫' },
              { label: 'Transit', name: 'transit', icon: '🔄' },
              { label: 'Waivers', name: 'waivers', icon: '📋' },
              { label: 'Prepaid Bank', name: 'prepaidBank', icon: '🏦' },
              { label: 'Round Trip', name: 'roundTrip', icon: '🔁' },
              { label: 'Late Payment', name: 'latePayment', icon: '⏰' },
            ].map(({ label, name, icon }) => `
              <div class="bg-gray-50 p-3 rounded-lg transition-all hover:shadow-md">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ${icon} ${label}
                </label>
                <input
                  type="number"
                  name="${name}"
                  min="0"
                  value="0"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Remarks Section -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              name="remarks"
              rows="3"
              placeholder="Enter any additional remarks or notes"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            ></textarea>
          </div>
        </div>

        <!-- Form Footer -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="text-lg font-semibold flex items-center gap-2">
            <span class="text-gray-700">Total Attended:</span>
            <span id="totalAttended" class="text-2xl text-blue-600">0</span>
          </div>
          <div class="flex gap-4">
            <button
              type="button"
              id="resetButton"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Submit Data
            </button>
          </div>
        </div>
      </form>
    `;

    const form = this.container.querySelector('#dataEntryForm');
    const totalAttendedSpan = this.container.querySelector('#totalAttended');
    const resetButton = this.container.querySelector('#resetButton');
    const addFlightButton = this.container.querySelector('#addFlightButton');
    const addSupervisorButton = this.container.querySelector('#addSupervisorButton');
    const flightSelect = form.querySelector('select[name="flight"]');
    const supervisorSelect = form.querySelector('select[name="supervisor"]');

    // Update total when number inputs change
    form.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', () => {
        const formData = Object.fromEntries(new FormData(form));
        totalAttendedSpan.textContent = this.calculateTotal(formData);
      });
    });

    // Reset form handler
    resetButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the form? All data will be cleared.')) {
        form.reset();
        totalAttendedSpan.textContent = '0';
      }
    });

    // Add Flight handler
    addFlightButton.addEventListener('click', () => {
      const newFlight = prompt('Enter the name of the new flight:');
      if (newFlight && !this.flights.includes(newFlight)) {
        this.flights.push(newFlight);
        flightSelect.innerHTML = `
          <option value="" disabled selected>Select Flight</option>
          ${this.flights.map(flight => `
            <option value="${flight}">${flight}</option>
          `).join('')}
        `;
      }
    });

    // Add Supervisor handler
    addSupervisorButton.addEventListener('click', () => {
      const newSupervisor = prompt('Enter the name of the new supervisor:');
      if (newSupervisor && !this.supervisors.includes(newSupervisor)) {
        this.supervisors.push(newSupervisor);
        supervisorSelect.innerHTML = `
          <option value="" disabled selected>Select Supervisor</option>
          ${this.supervisors.map(supervisor => `
            <option value="${supervisor}">${supervisor}</option>
          `).join('')}
        `;
      }
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!confirm('Please confirm the data entered once submitted you cannot edit.')) {
        return;
      }

      const formData = Object.fromEntries(new FormData(form));
      formData.totalAttended = this.calculateTotal(formData);
      
      // Convert number fields to numbers
      ['paid', 'diplomats', 'infants', 'notPaid', 'paidCardQr', 'refunds', 'deportees', 
       'transit', 'waivers', 'prepaidBank', 'roundTrip', 'latePayment'].forEach(field => {
        formData[field] = Number(formData[field]);
      });

      onSubmit(formData);
    });
  }
}