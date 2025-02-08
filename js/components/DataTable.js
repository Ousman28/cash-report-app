class DataTable {
  constructor(container) {
    this.container = container;
  }

  render({ data, showVerification, onVerify, onUpdate, onDownload }) {
    this.data = data; // Store the data
    this.showVerification = showVerification;
    this.onVerify = onVerify;
    this.onUpdate = onUpdate;
    this.onDownload = onDownload;

    this.container.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow">
          <input type="text" id="supervisorFilter" placeholder="Filter by Supervisor" class="flex-1 min-w-[200px] px-3 py-2 border rounded-md" />
          <input type="text" id="flightFilter" placeholder="Filter by Flight Name" class="flex-1 min-w-[200px] px-3 py-2 border rounded-md" />
          <div class="flex-1 min-w-[200px] flex items-center">
            <label for="startDateFilter" class="mr-2 text-gray-700">Start Date:</label>
            <input type="date" id="startDateFilter" class="flex-1 px-3 py-2 border rounded-md" />
          </div>
          <div class="flex-1 min-w-[200px] flex items-center">
            <label for="endDateFilter" class="mr-2 text-gray-700">End Date:</label>
            <input type="date" id="endDateFilter" class="flex-1 px-3 py-2 border rounded-md" />
          </div>
          <button id="downloadBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Download Report
          </button>
        </div>
        <div class="table-container" style="max-height: 400px; overflow: auto;">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                ${[
                  'Date', 'Ref No', 'Supervisor', 'Flight Name', 'Zone', 'Paid', 'Diplomats', 'Infants', 'Not Paid', 'Paid Card/QR', 'Refunds', 'Deportees', 'Transit', 'Waivers', 'Prepaid Bank', 'Round Trip', 'Late Payment', 'Total Attended',
                  ...(showVerification ? ['IICS Infant', 'IICS Adult', 'IICS Total', 'GIA Infant', 'GIA Adult', 'GIA Total'] : []),
                  'Difference',
                  'Status',
                  ...(showVerification || onUpdate ? ['Actions'] : []),
                ]
                  .map(
                    (header) => `
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ${header}
                      </th>
                    `
                  )
                  .join('')}
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" id="tableBody">
              ${this.renderRows(data, showVerification, onUpdate)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add event listeners
    const tableBody = this.container.querySelector('#tableBody');
    const supervisorFilter = this.container.querySelector('#supervisorFilter');
    const flightFilter = this.container.querySelector('#flightFilter');
    const startDateFilter = this.container.querySelector('#startDateFilter');
    const endDateFilter = this.container.querySelector('#endDateFilter');
    const downloadBtn = this.container.querySelector('#downloadBtn');

    // Handle row editing for verification
    if (showVerification) {
      tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
          const row = e.target.closest('tr');
          const id = row.dataset.id;
          this.enableVerificationEditing(row, id, onVerify);
        }
      });
    }

    // Handle row updating for Team Leads
    if (onUpdate) {
      tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('update-btn')) {
          const row = e.target.closest('tr');
          const id = row.dataset.id;
          this.enableUpdateEditing(row, id, onUpdate);
        }
      });
    }

    // Filter table based on inputs
    const filterTable = () => {
      const filteredData = this.data.filter((item) => {
        const matchesSupervisor = !supervisorFilter.value || item.supervisor.toLowerCase().includes(supervisorFilter.value.toLowerCase());
        const matchesFlight = !flightFilter.value || item.flightName.toLowerCase().includes(flightFilter.value.toLowerCase());
        const itemDate = new Date(item.date);
        const startDate = startDateFilter.value ? new Date(startDateFilter.value) : null;
        const endDate = endDateFilter.value ? new Date(endDateFilter.value) : null;
        let matchesDate = true;
        if (startDate && endDate) {
          matchesDate = itemDate >= startDate && itemDate <= endDate;
        } else if (startDate) {
          matchesDate = itemDate >= startDate;
        } else if (endDate) {
          matchesDate = itemDate <= endDate;
        }
        return matchesSupervisor && matchesFlight && matchesDate;
      });
      tableBody.innerHTML = this.renderRows(filteredData, showVerification, onUpdate);
    };

    supervisorFilter.addEventListener('input', filterTable);
    flightFilter.addEventListener('input', filterTable);
    startDateFilter.addEventListener('input', filterTable);
    endDateFilter.addEventListener('input', filterTable);
    downloadBtn.addEventListener('click', onDownload);
  }

  renderRows(data, showVerification, onUpdate) {
    if (data.length === 0) {
      return `
        <tr>
          <td colspan="${showVerification ? 27 : 18}" class="px-6 py-4 text-center text-gray-500">
            No data available
          </td>
        </tr>
      `;
    }
    return data
      .map(
        (item) => `
          <tr data-id="${item.id}">
            <td class="px-6 py-4 whitespace-nowrap">${item.date}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.refNo}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.supervisor}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.flightName}</td>
            <td class="px-6 py-4 whitespace-nowrap capitalize">${item.zone}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.paid}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.diplomats}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.infants}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.notPaid}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.paidCardQr}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.refunds}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.deportees}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.transit}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.waivers}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.prepaidBank}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.roundTrip}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.latePayment}</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.totalAttended}</td>
            ${
              showVerification
                ? `
                  <td class="px-3 py-4 whitespace-nowrap">${item.iicsInfant || '-'}</td>
                  <td class="px-3 py-4 whitespace-nowrap">${item.iicsAdult || '-'}</td>
                  <td class="px-3 py-4 whitespace-nowrap">${item.iicsTotal || '-'}</td>
                  <td class="px-3 py-4 whitespace-nowrap">${item.giaInfant || '-'}</td>
                  <td class="px-3 py-4 whitespace-nowrap">${item.giaAdult || '-'}</td>
                  <td class="px-3 py-4 whitespace-nowrap">${item.giaTotal || '-'}</td>
                `
                : ''
            }
            <td class="px-6 py-4 whitespace-nowrap">
              ${item.totalAttended - (item.giaTotal || 0)} <!-- Calculate the difference -->
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                item.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }">
                ${item.verified ? 'Verified' : 'Pending'}
              </span>
            </td>
            ${
              showVerification && !item.verified
                ? `
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button class="edit-btn px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Edit
                    </button>
                  </td>
                `
                : onUpdate
                ? `
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button class="update-btn px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Update
                    </button>
                  </td>
                `
                : ''
            }
          </tr>
        `
      )
      .join('');
  }

  enableVerificationEditing(row, id, onVerify) {
    const cells = row.querySelectorAll('td');
    const iicsInfantCell = cells[18];
    const iicsAdultCell = cells[19];
    const giaInfantCell = cells[21];
    const giaAdultCell = cells[22];
    const actionCell = cells[25];

    // Replace text content with input fields
    iicsInfantCell.innerHTML = `
      <input type="text" class="w-full h-12 px-2 py-1 border rounded" value="${iicsInfantCell.textContent === '-' ? '' : iicsInfantCell.textContent}">
    `;
    iicsAdultCell.innerHTML = `
      <input type="text" class="w-full h-12 px-2 py-1 border rounded" value="${iicsAdultCell.textContent === '-' ? '' : iicsAdultCell.textContent}">
    `;
    giaInfantCell.innerHTML = `
      <input type="text" class="w-full h-12 px-2 py-1 border rounded" value="${giaInfantCell.textContent === '-' ? '' : giaInfantCell.textContent}">
    `;
    giaAdultCell.innerHTML = `
      <input type="text" class="w-full h-12 px-2 py-1 border rounded" value="${giaAdultCell.textContent === '-' ? '' : giaAdultCell.textContent}">
    `;

    // Replace the Edit button with Save and Cancel buttons
    actionCell.innerHTML = `
      <div class="space-x-2">
        <button class="verify-btn px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
          Verify
        </button>
        <button class="cancel-btn px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          Cancel
        </button>
      </div>
    `;

    // Add event listeners for Save and Cancel
    const verifyBtn = actionCell.querySelector('.verify-btn');
    const cancelBtn = actionCell.querySelector('.cancel-btn');
    const iicsInfantInput = iicsInfantCell.querySelector('input');
    const iicsAdultInput = iicsAdultCell.querySelector('input');
    const giaInfantInput = giaInfantCell.querySelector('input');
    const giaAdultInput = giaAdultCell.querySelector('input');

    verifyBtn.addEventListener('click', () => {
      const iicsInfant = iicsInfantInput.value.trim();
      const iicsAdult = iicsAdultInput.value.trim();
      const giaInfant = giaInfantInput.value.trim();
      const giaAdult = giaAdultInput.value.trim();

      if (!iicsInfant || !iicsAdult || !giaInfant || !giaAdult) {
        alert('All fields are required');
        return;
      }

      if (confirm('Are you sure you want to verify this data?')) {
        onVerify(id, { iicsInfant, iicsAdult, giaInfant, giaAdult });
      }
    });

    cancelBtn.addEventListener('click', () => {
      // Restore original content
      iicsInfantCell.innerHTML = iicsInfantCell._originalContent || '-';
      iicsAdultCell.innerHTML = iicsAdultCell._originalContent || '-';
      giaInfantCell.innerHTML = giaInfantCell._originalContent || '-';
      giaAdultCell.innerHTML = giaAdultCell._originalContent || '-';
      actionCell.innerHTML = `
        <button class="edit-btn px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Edit
        </button>
      `;
    });
  }

  enableUpdateEditing(row, id, onUpdate) {
    const cells = row.querySelectorAll('td');
    const actionCell = cells[cells.length - 1]; // Last cell contains the Update button

    // Define editable columns
    const editableColumns = ['paid', 'diplomats', 'infants', 'notPaid', 'paidCardQr', 'refunds', 'deportees', 'transit', 'waivers', 'prepaidBank', 'roundTrip', 'latePayment'];

    // Replace text content with input fields for editable columns
    editableColumns.forEach((column, index) => {
      const cell = cells[index + 4]; // Skip the first 4 columns (Date, Ref No, Supervisor, Flight Name)
      cell._originalContent = cell.textContent; // Save original content
      cell.innerHTML = `
        <input type="text" class="w-full h-12 px-2 py-1 border rounded" value="${cell.textContent}">
      `;
    });

    // Replace the Update button with Save and Cancel buttons
    actionCell.innerHTML = `
      <div class="space-x-2">
        <button class="save-btn px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
          Save
        </button>
        <button class="cancel-btn px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          Cancel
        </button>
      </div>
    `;

    // Add event listeners for Save and Cancel
    const saveBtn = actionCell.querySelector('.save-btn');
    const cancelBtn = actionCell.querySelector('.cancel-btn');

    saveBtn.addEventListener('click', () => {
      const updatedData = {};
      editableColumns.forEach((column, index) => {
        const cell = cells[index + 4];
        const input = cell.querySelector('input');
        updatedData[column] = input.value.trim();
      });

      console.log('Updated Data:', updatedData); // Debugging
      if (confirm('Are you sure you want to update this data?')) {
        onUpdate(id, updatedData);
      }
    });

    cancelBtn.addEventListener('click', () => {
      // Restore original content
      editableColumns.forEach((column, index) => {
        const cell = cells[index + 4];
        cell.innerHTML = cell._originalContent;
      });
      actionCell.innerHTML = `
        <button class="update-btn px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
          Update
        </button>
      `;
    });
  }
}