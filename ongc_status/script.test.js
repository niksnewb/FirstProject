
test('should remove the table row when a .btn-danger button within it is clicked', () => {
  // Set up the DOM fixture
  document.body.innerHTML = `
    <table>
      <tbody id="status-table-body">
        <tr id="row1">
          <td>Item 1</td>
          <td><button class="btn btn-danger">Delete</button></td>
        </tr>
        <tr id="row2">
          <td>Item 2</td>
          <td><button class="btn">View</button></td>
        </tr>
      </tbody>
    </table>
  `;

  // Check initial state
  expect($('#status-table-body tr').length).toBe(2);
  expect($('#row1').length).toBe(1);

  // Act: Simulate a click on the delete button in the first row
  $('#row1 .btn-danger').click();

  // Assert: The row should be removed
  expect($('#status-table-body tr').length).toBe(1);
  expect($('#row1').length).toBe(0);
  expect($('#row2').length).toBe(1);
});
