import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const con = mysql.createConnection({ // configure the database connection
  host: "localhost",
  user: "root",
  password: "Bong1Themb@",
  database: "studentData"
});

app.use(bodyParser.urlencoded({ extended:true }));// used for getting form data from client
// app.use(bodyParser.json());// used for getting json data
app.use(express.static("public"));

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

app.post("/add", (req, res)=>{ // add student to table
    let name = req.body['name'];
    let email = req.body['email']
    let sql = `INSERT INTO students (name, email) VALUES ('${name}', '${email}')`;
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect('/');
  });
});



app.post("/update", (req, res)=>{ // update a student's details
  let currentName = req.body["currentName"];
  let currentEmail = req.body["currentEmail"];
  let newName = req.body["newName"];
  let newEmail = req.body["newEmail"];


  console.log(currentName);
  console.log(currentEmail);
  console.log(newName);
  console.log(newEmail);

  let prop;
  let newValue;
  let oldValue;


  if (currentName == newName){
    newName = currentName;
  } else {
    prop = 'name';
    newValue = newName;
    oldValue = currentName;
  }

 
  if (currentEmail == newEmail){
    newEmail = currentEmail;
  } else {
    prop = 'email';
    newValue = newEmail;
    oldValue = currentEmail;
  }
 
  let sql = `UPDATE students SET ${prop} = '${newValue}' WHERE ${prop} = '${oldValue}'`;
  con.query(sql, function (err, result) {
  if (err) throw err;
  console.log(result.affectedRows + " record(s) updated");
});
  res.redirect('/');
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