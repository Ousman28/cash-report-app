const validation = {
  // Validate the main report data
  validateReport(data) {
    const errors = {};

    // Validate required fields
    const requiredFields = [
      { field: 'date', message: 'Date is required' },
      { field: 'refNo', message: 'Reference number is required' },
      { field: 'supervisor', message: 'Supervisor name is required' },
      { field: 'flight', message: 'Flight  is required' },
      { field: 'zone', message: 'Zone is required' },
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!data[field]) {
        errors[field] = message;
      }
    });

    // Validate numeric fields
    const numericFields = [
      { field: 'paid', message: 'Paid must be a positive number' },
      { field: 'diplomats', message: 'Diplomats must be a positive number' },
      { field: 'infants', message: 'Infants must be a positive number' },
      { field: 'notPaid', message: 'Not Paid must be a positive number' },
      { field: 'paidCardQr', message: 'Paid Card/QR must be a positive number' },
      { field: 'refunds', message: 'Refunds must be a positive number' },
      { field: 'deportees', message: 'Deportees must be a positive number' },
      { field: 'transit', message: 'Transit must be a positive number' },
      { field: 'waivers', message: 'Waivers must be a positive number' },
      { field: 'prepaidBank', message: 'Prepaid Bank must be a positive number' },
      { field: 'roundTrip', message: 'Round Trip must be a positive number' },
      { field: 'latePayment', message: 'Late Payment must be a positive number' },
    ];

    numericFields.forEach(({ field, message }) => {
      if (data[field] === undefined || isNaN(data[field]) || data[field] < 0) {
        errors[field] = message;
      }
    });

    // Validate Total Attended
    if (data.totalAttended === undefined || isNaN(data.totalAttended) || data.totalAttended < 0) {
      errors.totalAttended = 'Total Attended must be a positive number';
    }

    return errors;
  },

  // Validate IICS and GIA fields
  validateIICSGIA(iicsInfant, iicsAdult, giaInfant, giaAdult) {
    const errors = {};

    // Validate IICS fields
    if (iicsInfant === undefined || isNaN(iicsInfant) || iicsInfant < 0) {
      errors.iicsInfant = 'IICS Infant must be a positive number';
    }
    if (iicsAdult === undefined || isNaN(iicsAdult) || iicsAdult < 0) {
      errors.iicsAdult = 'IICS Adult must be a positive number';
    }

    // Validate GIA fields
    if (giaInfant === undefined || isNaN(giaInfant) || giaInfant < 0) {
      errors.giaInfant = 'GIA Infant must be a positive number';
    }
    if (giaAdult === undefined || isNaN(giaAdult) || giaAdult < 0) {
      errors.giaAdult = 'GIA Adult must be a positive number';
    }

    return errors;
  },

  // Validate the difference between Total Attended and GIA Total
  validateDifference(totalAttended, giaTotal) {
    const errors = {};

    if (totalAttended === undefined || isNaN(totalAttended) || totalAttended < 0) {
      errors.totalAttended = 'Total Attended must be a positive number';
    }
    if (giaTotal === undefined || isNaN(giaTotal) || giaTotal < 0) {
      errors.giaTotal = 'GIA Total must be a positive number';
    }

    if (totalAttended < giaTotal) {
      errors.difference = 'Total Attended cannot be less than GIA Total';
    }

    return errors;
  }
};