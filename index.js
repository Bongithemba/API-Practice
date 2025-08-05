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
  res.render('index.ejs'); // because I used locals if/else in the ejs file, I just render the index here
});

app.get("/display", (req, res)=>{ // displays the entire table
    con.query("SELECT * FROM students", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    let data = JSON.stringify(result)
    res.render('index.ejs', {content: data})
  });
  // res.sendStatus(200);
})

app.get("/idDisplay", (req, res)=>{ // display row of specific id
    const id = req.query["id"];
    console.log(id);
    con.query(`SELECT * FROM students WHERE id = '${id}'`, function (err, result) {
    if (err) throw err;
    let data = JSON.stringify(result)
    console.log(result);
    res.render('index.ejs', {content: data})
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
    res.sendStatus(200);
  });
});
 

app.patch("/update", (req, res)=>{ // update a student's details
  let oldValue = req.body["oldValue"];
  let newValue = req.body["newValue"];
  let position = oldValue.search('@');

  let prop;
  if (position != -1){
    prop = 'email';
  } else {
    prop = 'name';
  }

  let sql = `UPDATE students SET ${prop} = '${newValue}' WHERE ${prop} = '${oldValue}'`;
  con.query(sql, function (err, result) {
  if (err) throw err;
  console.log(result.affectedRows + " record(s) updated");
});

  res.sendStatus(200);
});


app.delete("/remove", (req, res)=>{ // delete a student's details
  let value = req.body
  let key = Object.keys(value);

  let sql = `DELETE FROM students WHERE ${key[0]} = ${value[key[0]]}`;
  con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Number of records deleted: " + result.affectedRows);
  });
  res.sendStatus(200);
})

app.listen (port, ()=>{ // listening on port 3000
    console.log(`Successful on port ${port}`);
})