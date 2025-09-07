$(document).ready(function () {
  var dateRangePicker = $('#date-range').daterangepicker({
    opens: 'left', // default for desktop
    parentEl: '.date-range-picker',
    format: 'DD-MMM-YYYY',
    separator: ' to ',
    startDate: moment().subtract(1, 'years'),
    endDate: moment(),
    locale: {
      format: 'DD-MMM-YYYY',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      fromLabel: 'From',
      toLabel: 'To',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: 0,
    },
  });

  // Optional: reconfigure for mobile
  function adjustDatePicker() {
    if (window.innerWidth < 768) {
      // Small screens → force to open center
      $('#date-range').data('daterangepicker').opens = 'center';
    } else {
      // Larger screens → open left (default)
      $('#date-range').data('daterangepicker').opens = 'left';
    }
  }

  // Run once at load
  adjustDatePicker();

  // Run on resize
  $(window).on('resize', adjustDatePicker);

  // Listen for Apply
  dateRangePicker.on('apply.daterangepicker', function (ev, picker) {
    console.log(
      'Date range selected: ' +
        picker.startDate.format('DD-MMM-YYYY') +
        ' to ' +
        picker.endDate.format('DD-MMM-YYYY')
    );
  });


  // Optional: Add click event to remove rows from table
  $('#status-table-body').on('click', '.btn-danger', function() {
    $(this).closest('tr').remove();
  });



  
});






// console.log("Script loaded");
//   function applyFilter() {
//     var startDate = $('#date-range').data('daterangepicker').startDate;
//     var endDate = $('#date-range').data('daterangepicker').endDate;
//     // Apply your filter logic here
//   }
//     $('#apply-filter').on('click', applyFilter);
