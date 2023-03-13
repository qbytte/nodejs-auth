const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database.js");
const crypto = require("crypto");
const fs = require("fs");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const encryptText = (text) => {
  return crypto.publicEncrypt(
    {
      key: fs.readFileSync("public_key.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(text)
  );
};

const decryptText = (text) => {
  return crypto.privateDecrypt(
    {
      key: fs.readFileSync("private_key.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    text
  );
};

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
app.post("/user", (req, res) => {
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
    password: encryptText(req.body.password),
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

app.post("/login", (req, res) => {
  const sql = "select username, password from user where username = ?";
  const params = [req.body.username];

  console.log(req.body.username);

  db.get(sql, params, (err, row) => {
    console.log(params);
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (row === undefined) {
      res.status(400).json({ error: "Username not found" });
      return;
    }

    if (Buffer.from(decryptText(row.password), "utf8").toString() === req.body.password) {
      res.status(200).json({ Nice: "Logged in bud" });
      return;
    } else {
      console.log();
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  });
});

// Default respoonse for any other request
app.use((req, res) => {
  res.status(404);
});
