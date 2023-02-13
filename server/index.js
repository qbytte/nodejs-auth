const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database.js");
const md5 = require("md5");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all users
app.get("/users", (req, res) => {
  const sql = "select * from user";
  const params = [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get single user
app.get("/user/:id", (req, res) => {
  const sql = "select * from user where id = ?";
  const params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: row,
    });
  });
});

// Create new user
app.post("/user/", (req, res) => {
  const errors = [];

  if (!req.body.username) {
    errors.push("No username specified");
  }
  if (!req.body.password) {
    errors.push("No password specified");
  }
  if (!req.body.name) {
    errors.push("No name specified");
  }
  if (!req.body.lastname) {
    errors.push("No lastname specified");
  }
  if (!req.body.phone) {
    errors.push("No phone specified");
  }
  if (!req.body.address) {
    errors.push("No address specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  const data = {
    username: req.body.username,
    password: md5(req.body.password),
    name: req.body.name,
    lastname: req.body.lastname,
    phone: req.body.phone,
    address: req.body.address,
  };

  const sql =
    "INSERT INTO user (username, password, name, lastname, phone, address) VALUES (?,?,?,?,?,?)";
  const params = [
    data.username,
    data.password,
    data.name,
    data.lastname,
    data.phone,
    data.address,
  ];

  db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: data,
    });
  });
});

// Default respoonse for any other request
app.use((req, res) => {
  res.status(404);
});
