const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./accounts.db');

// Create the 'users' table
// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS ledger (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       entry_date DATE NOT NULL,
//       description TEXT NOT NULL,
//       debit REAL,
//       credit REAL,
//       balance REAL 
//     )
//   `);
// });
// Drop the 'users' table if it exists
// db.run('DROP TABLE IF EXISTS users', (err) => {
//     if (err) {
//       console.error('Error dropping table:', err.message);
//     } else {
//       console.log('Table dropped successfully');
//     }
//   });

const dummyData = [
  ['2023-01-01', 'Initial Balance', null, null, 1000.00],
  ['2023-01-05', 'Utilities Payment', 100.00, null, 900.00],
  ['2023-01-10', 'Salary Deposit', null, 1500.00, 2400.00],
  ['2023-01-15', 'Grocery Purchase', 50.00, null, 2350.00],
  ['2023-01-20', 'Rent Payment', 800.00, null, 1550.00]
];

const insertStatement = db.prepare(`
  INSERT INTO ledger (entry_date, description, debit, credit, balance)
  VALUES (?, ?, ?, ?, ?)
`);

dummyData.forEach(entry => {
  insertStatement.run(entry, (err) => {
    if (err) throw err;
  });
});

insertStatement.finalize();

// Close the database connection when you're done

db.close();
