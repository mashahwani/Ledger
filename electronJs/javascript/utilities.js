// Utillities facilitating program
var extras_ = {
  // Getting Current date for input panel
  date(id) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    document.getElementById(id).value = formattedDate;
  },
};

// Buttons Object
var buttons = {
  deleteButton(transaction) {
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger btn-sm pl-2 pr-2 ml-2";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
    return deleteBtn;
  },
  editButton() {
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-warning btn-sm pl-2 pr-2 mr-2";
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    return editBtn;
  },
};

// Getting Elements and manipulating
var elements = {
  // ledger form elements getting
  formElements(desc, amt, dt, dc) {
    const description = document.getElementById(desc).value;
    const amount = document.getElementById(amt).value;
    const date = document.getElementById(dt).value;
    const debitCreditDropdown = document.getElementById(dc).value;

    data = { description, amount, date, debitCreditDropdown };
    return data;
  },
  clearFields(desc, amt, dt, dc) {
    document.getElementById(desc).value = "";
    document.getElementById(amt).value = "";
    extras_.date(dt);
    document.getElementById(dc).value = "Credit";
  },
  tableHeaderCell(content) {
    const tb_cell = document.createElement("th");
    tb_cell.textContent = content;
    return tb_cell;
  },
};

module.exports = { extras_, buttons, elements };
