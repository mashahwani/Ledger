const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { ipcMain } = require("electron");
const { log } = require("console");

class AccountingDatabase {
  /**
   * Sharing resources.
   */
  static db = new sqlite3.Database(path.join(__dirname, "accounts.db"));

  // Empty Constructor
  constructor() {}

  // Close Database
  closeDb(minwin, params) {
    minwin.on("closed", () => {
      AccountingDatabase.db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Closed the database connection.");
      });
    });
  }
}

class LedgerQueries extends AccountingDatabase {
  /**
   * This Class is for Ledger Data. Where Queries are written in methods
   * in order to query data.
   */
  constructor(params) {
    // Calling Super constructor.
    super();
  }
  // Fetching All data from database to display
  fetchData(params) {
    ipcMain.handle("fetchDataFromMain", async (event, pageNumber = 0) => {
      return new Promise((resolve, reject) => {
        var query = `SELECT *
              FROM ledger
              ORDER BY id DESC
              LIMIT 10
              OFFSET ${pageNumber};`;

        AccountingDatabase.db.all(query, [], (err, rows) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({ data: rows });
          }
        });
      });
    });
  }

  // Total Number of records
  total(params) {
    ipcMain.handle("total", async (event) => {
      return new Promise((resolve, reject) => {
        var query = `SELECT COUNT(*) as total
              FROM ledger;`;

        AccountingDatabase.db.all(query, [], (err, total) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(total);
          }
        });
      });
    });
  }
  // Getting the last result for balance
  getBalance(query_, params) {
    return new Promise((resolve, reject) => {
      AccountingDatabase.db.get(query_, (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row ? row : 0);
        }
      });
    });
  }
  // Updating All balance if a record get updated
  updateAllBalance(id, op, value, params) {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE ledger
      SET balance = balance ${op} ${value}
      WHERE id > ${id};
    `;
      AccountingDatabase.db.run(query, (err) => {
        if (err) {
          reject(err.message);
        } else {
          resolve();
          console.log(
            `Balances updated successfully for records with ID > ${id}`
          );
        }
      });
    });
  }
  // Adding a records function
  addData(params) {
    ipcMain.handle("addLedgerRecord", async (event, data) => {
      const { description, amount, date, debitCreditDropdown } = data;
      let credit;
      let debit;
      let balance_;

      try {
        const query_ = "SELECT balance FROM ledger ORDER BY id DESC LIMIT 1";
        var balance = await this.getBalance(query_);
        balance = balance.balance;
        if (debitCreditDropdown === "Credit") {
          credit = amount;
          balance_ = balance ? balance + Number(credit) : credit;
          debit = null;
        } else {
          credit = null;
          debit = amount;
          balance_ = balance ? balance - Number(debit) : -debit;
        }

        await new Promise((resolve, reject) => {
          const query =
            "INSERT INTO ledger (entry_date, description, debit, credit, balance) VALUES (?, ?, ?, ?, ?)";
          AccountingDatabase.db.run(
            query,
            [date, description, debit, credit, balance_],
            (err) => {
              if (err) {
                reject(err.message);
              } else {
                resolve();
              }
            }
          );
        });

        return { success: true };
      } catch (error) {
        // Handle errors here
        console.error(error);
        return { success: false, error: error.message };
      }
    });
  }
  // Editing record function
  editRecord(params) {
    ipcMain.handle("editRecord", async (event, data) => {
      const { id, description, amount, date, debitCreditDropdown } = data;
      let credit;
      let debit;
      let balance_;

      try {
        const query_ = `SELECT balance FROM ledger WHERE id < ${id} ORDER BY id DESC LIMIT 1`;
        const query__ = `SELECT balance FROM ledger WHERE id == ${id}`;
        let pre = await this.getBalance(query__);
        pre = pre.balance;
        let balance = await this.getBalance(query_);
        balance = balance.balance;
        if (debitCreditDropdown === "Credit") {
          credit = amount;
          balance_ = balance + Number(credit);
          if (balance_ != pre)
            await this.updateAllBalance(id, "-", pre - balance_);
          debit = null;
        } else {
          credit = null;
          debit = amount;
          balance_ = balance - Number(debit);
          if (balance_ != pre)
            await this.updateAllBalance(id, "-", pre - balance_);
        }
        return new Promise((resolve, reject) => {
          const updateQuery = `
                UPDATE ledger
                SET entry_date = ?,
                description = ?,
                    debit = ?,
                    credit = ?,
                    balance = ?
                WHERE id = ?;
              `;
          AccountingDatabase.db.run(
            updateQuery,
            [date, description, debit, credit, balance_, id],
            (err) => {
              if (err) {
                reject(err.message);
              } else {
                resolve();
              }
            }
          );
        });
        // return { success: true };
      } catch (error) {
        // Handle errors here
        console.error(error);
        return { success: false, error: error.message };
      }
    });
  }
  // Deleting a record
  deleteRecord(params) {
    ipcMain.handle("deleteRecord", async (event, id) => {
      try {
        const query__ = `SELECT debit, credit FROM ledger WHERE id == ${id}`;
        const pre = await this.getBalance(query__);
        pre.credit
          ? await this.updateAllBalance(id, "-", pre.credit)
          : await this.updateAllBalance(id, "+", pre.debit);

        return new Promise((resolve, reject) => {
          const query = "DELETE FROM ledger WHERE id = ?";
          AccountingDatabase.db.run(query, [id], (err) => {
            if (err) {
              reject(err.message);
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    });
  }

  // Searching for record or records
  search(params) {
    ipcMain.handle("search", async (event, word) => {
      try {
        return new Promise((resolve, reject) => {
          const query = `SELECT * FROM ledger WHERE description LIKE ? ORDER BY id LIMIT 10 OFFSET 0`;
          const searchWord = `%${word}%`;
          AccountingDatabase.db.all(query, [searchWord], (err, rows) => {
            if (err) {
              reject(err.message);
            } else {
              resolve(rows);
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
}

module.exports = { LedgerQueries, AccountingDatabase };
