const { require } = window.electron;
var { extras_, buttons, elements } = require("./javascript/utilities.js");
let pageNumber = 0;
var lastPage = 0;
let id = false;
extras_.date("date"); // Setting Current date to date input panel

async function searchMe(event) {
  var searchData = await window.api.search(event.target.value);
  console.log(searchData);
  fetchDataAndDisplay(0, searchData);
}

// Call the function to fetch and display data
async function fetchDataAndDisplay(pageNumber, search = null) {
  try {
    // Getting All pages
    var records = await window.api.total();
    lastPage = Math.ceil(records[0]["total"] / 10);
    if (search) var data = search;
    else var { data } = await window.api.fetchDataFromMain(pageNumber);

    // Access data from the preload script
    const ledgerTable = document.getElementById("ledger");
    ledgerTable.innerHTML = ""; // Clear the table content before updating

    const headerRow = ledgerTable.insertRow();
    const header = [
      "#",
      "Date",
      "Description",
      "Debit",
      "Credit",
      "Balance",
      "Action",
    ];
    header.forEach((heads) => {
      headerRow.appendChild(elements.tableHeaderCell(heads));
    });

    data.forEach((transaction) => {
      const row = ledgerTable.insertRow();

      // Populate table cells
      for (const key in transaction) {
        if (Object.hasOwnProperty.call(transaction, key)) {
          const cell = row.insertCell();
          if (key == "description") {
            cell.classList.add("overflow-hidden");
          }
          cell.textContent = transaction[key];
        }
      }

      // Add "Actions" cell with delete button
      const actionsCell = row.insertCell();
      var ebtn = buttons.editButton();
      ebtn.addEventListener("click", () => {
        document.getElementById("description").value = transaction.description;
        document.getElementById("amount").value =
          transaction.debit || transaction.credit;
        document.getElementById("date").value = transaction.entry_date;
        document.getElementById("debitCreditDropdown").value = transaction.debit
          ? "Debit"
          : "Credit";
        id = transaction.id;
      });
      actionsCell.appendChild(ebtn);
      var dbtn = buttons.deleteButton();
      dbtn.addEventListener("click", async () => {
        await window.api.deleteRecord(transaction.id);
        fetchDataAndDisplay();
      });
      actionsCell.appendChild(dbtn);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchDataAndDisplay();

// Form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const elementIds = ["description", "amount", "date", "debitCreditDropdown"];
  try {
    // Access data from the preload script to add a new user
    if (!id) {
      await window.api.addLedgerRecord(elements.formElements(...elementIds));
      console.log(id);
    } else {
      await window.api.editRecord({
        id,
        ...elements.formElements(...elementIds),
      });
      console.log(id);
      id = false;
    }

    fetchDataAndDisplay(); // Fetch and display updated user data
    elements.clearFields(...elementIds); // Clear the form fields
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

function clearme() {
  const elementIds = ["description", "amount", "date", "debitCreditDropdown"];
  elements.clearFields(...elementIds);
}

function pageNumberMethod(event) {
  const btn = event.target.id;
  if (btn === "n") {
    if (pageNumber < lastPage - 1) ++pageNumber;
    else $("#exampleModalLong").modal("show");
    console.log(pageNumber);
  } else {
    if (pageNumber >= 1) --pageNumber;
    else $("#exampleModalLong").modal("show");
    console.log(pageNumber);
  }
  fetchDataAndDisplay(pageNumber * 10);
}
document
  .getElementById("ledgerForm")
  .addEventListener("submit", handleFormSubmit);
