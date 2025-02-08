const exportUtils = {
  exportToCSV(data) {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }

    // Define the headers for the CSV file
    const headers = [
      'Date',
      'Ref No',
      'Supervisor',
      'Flight Name',
      'Zone',
      'Paid',
      'Diplomats',
      'Infants',
      'Not Paid',
      'Paid Card/QR',
      'Refunds',
      'Deportees',
      'Transit',
      'Waivers',
      'Prepaid Bank',
      'Round Trip',
      'Late Payment',
      'Total Attended',
      'IICS Infant',
      'IICS Adult',
      'IICS Total',
      'GIA Infant',
      'GIA Adult',
      'GIA Total',
      'Difference',
      'Status',
      'Submitted By',
      'Verified By'
    ];

    // Convert the data to CSV format
    const csvContent = [
      headers.join(','), // Add the header row
      ...data.map(report => [
        report.date || '', // Date
        report.refNo || '', // Ref No
        report.supervisor || '', // Supervisor
        report.flightName || '', // Flight Name
        report.zone || '', // Zone
        report.paid || '', // Paid
        report.diplomats || '', // Diplomats
        report.infants || '', // Infants
        report.notPaid || '', // Not Paid
        report.paidCardQr || '', // Paid Card/QR
        report.refunds || '', // Refunds
        report.deportees || '', // Deportees
        report.transit || '', // Transit
        report.waivers || '', // Waivers
        report.prepaidBank || '', // Prepaid Bank
        report.roundTrip || '', // Round Trip
        report.latePayment || '', // Late Payment
        report.totalAttended || '', // Total Attended
        report.iicsInfant || '', // IICS Infant
        report.iicsAdult || '', // IICS Adult
        report.iicsTotal || '', // IICS Total
        report.giaInfant || '', // GIA Infant
        report.giaAdult || '', // GIA Adult
        report.giaTotal || '', // GIA Total
        (report.totalAttended - (report.giaTotal || 0)) || '', // Difference
        report.verified ? 'Verified' : 'Pending', // Status
        report.submittedBy || '', // Submitted By
        report.verifiedBy || '' // Verified By
      ].map(field => `"${field}"`).join(',')) // Wrap each field in quotes to handle commas
    ].join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-collection-report-${new Date().toISOString().split('T')[0]}.csv`;

    // Append the link to the document body and trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up by removing the link and revoking the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};