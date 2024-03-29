const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "timer",
});
connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  //接続と同時にテーブルを作成
  console.log("success");
  connection.query(
    "CREATE TABLE users (id INT AUTO_INCREMENT, work_time INT NOT NULL, break_time INT NOT NULL, PRIMARY KEY (id) )",
    (err, result) => {
      //if (err) throw err;
      console.log("テーブルが作成されました");
      console.log(result);
    }
  );
});

app.get("/", (req, res) => {
  //'CREATE TABLE users (id INT AUTO_INCREMENT, name TEXT, PRIMARY KEY (id))';
  connection.query("SELECT * FROM users", (error, results) => {
    console.log(results);
    res.render("index.ejs", { items: results });
  });
});

app.get("/new", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    console.log(results);
    res.render("new.ejs", { items: results });
  });
});

app.post("/create", (req, res) => {
  connection.query(
    "INSERT INTO users(work_time, break_time) VALUES(?,?)",
    [req.body.work_time, req.body.break_time],
    (error, results) => {
      console.log(results);
      res.redirect("/");
    }
  );
});
app.post("/delete/:id", (req, res) => {
  console.log(req.params.id);
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.redirect("/");
    }
  );
});

app.get("/choose/:id", (req, res) => {
  console.log(req.params.id);
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (error, results) => {
      console.log(results[0]);
      res.render("timer.ejs",{item:results[0]});
    }
  );
});

app.listen(3000);
