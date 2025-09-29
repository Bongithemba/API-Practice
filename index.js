import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config({ path: '/home/student/Desktop/API-Practice/.env'});

const app = express();
const port = 3000;
const con = mysql.createConnection({ // configure the database connection
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});


app.use(bodyParser.urlencoded({ extended:true }));// used for getting form data from client
// app.use(bodyParser.json());// used for getting json data
app.use(express.static("public")); //Middleware for all static files in public directory

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");// Connects the server to the database
})

app.get("/", (req, res)=>{
   con.query("SELECT * FROM students", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.render('index.ejs', {students: result}) // display in table form 
  });   
});
  

app.post("/display", (req, res)=>{ // displays the entire table
    let display = req.body;
    con.query("SELECT * FROM students", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    let data = JSON.stringify(result)
    res.render('index.ejs', {content: data}) // display in table form
  });
  // res.sendStatus(200);
})

app.post("/idDisplay", (req, res)=>{ // display row of specific id
    const id = req.body["id"];
    con.query(`SELECT * FROM students WHERE id = '${id}'`, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.redirect('/')
    // res.sendStatus(200);
  });
})

app.post("/add", (req, res) => {
  let name = req.body['name'];
  let email = req.body['email'];
  let phone = req.body['phone'] || null;
  let dob = req.body['dob'] || null;

  let sql = `INSERT INTO students (name, email, phone, dob) VALUES (?, ?, ?, ?)`;
  con.query(sql, [name, email, phone, dob], function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect('/');
  });
});

app.post("/search", (req, res) => {
  const uid = req.body.uid;

  // Search for a student by UID
  const sql = `SELECT * FROM students WHERE uid = ?`;
  con.query(sql, [uid], function (err, result) {
    if (err) throw err;

    res.render("index.ejs", { students: result }); // Return filtered data
  });
});




// code was only updating one field at a time, fixed using GPT.
app.post("/update", (req, res) => {
  let id = req.body["id"];
  let newName = req.body["newName"];
  let newEmail = req.body["newEmail"];
  let newPhone = req.body["newPhone"];
  let newDob = req.body["newDob"];

  let sql = `UPDATE students SET name = ?, email = ?, phone = ?, dob = ? WHERE id = ?`;
  con.query(sql, [newName, newEmail, newPhone, newDob, id], function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
    res.redirect('/');
  });
});


app.post("/remove", (req, res)=>{ // delete a student's details
  let property = req.body["property"];
  let value = req.body["id-delete"];
  let sql = `DELETE FROM students WHERE ${property} = ${con.escape(value)}`;
  con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Number of records deleted: " + result.affectedRows);
  
  });
 res.redirect('/');
})

app.listen (port, ()=>{ // listening on port 3000
    console.log(`Successful on port ${port}`);
})