const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to SQLite database");

    db.run(
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text,
            name text,
            lastname text,
            password text,
            phone text,
            address text,
            CONSTRAINT username_unique UNIQUE (username)
            )`,
      (err) => {
        err
          ? console.log("Table already created")
          : console.log("Table created");
      }
    );
  }
});

module.exports = db;
