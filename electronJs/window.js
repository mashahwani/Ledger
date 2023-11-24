const { BrowserWindow, ipcMain } = require("electron");
const { LedgerQueries, AccountingDatabase } = require("./accounting.js");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      focusable: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("views/ledger.html");

  // Database Creating
  const db = new AccountingDatabase();
  // Ledger Operations
  const ledger = new LedgerQueries();
  ledger.fetchData();
  ledger.addData();
  ledger.editRecord();
  ledger.deleteRecord();
  ledger.total();
  ledger.search();
  // Closing Database
  db.closeDb(mainWindow);
}

module.exports = { createWindow };
