import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";

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



app.get("/", (req, res) => {
  res.render("index.ejs");
})


app.post("/register", (req, res)=>{ // the registration page becomes the landing page
	let name = req.body["fullname"];
	let email = req.body["email"];
	let password = req.body["password"];
	let finalPassword = req.body["retypePassword"];
	const saltRounds = 10;

	if (password != finalPassword){
		res.render("index.ejs", {message: "Passwords much match"});
	}

	else {
		bcrypt.hash(finalPassword, saltRounds, function (err, hash) {
    		if (err) {
        	console.error(err);
			return;
    		}

			let sql = `INSERT INTO users (name, email, password, uuid) VALUES (?, ?, ?, FLOOR(RAND() * 90000) + 10000)`;
			con.query(sql, [name, email, hash], function (err, result){
			if (err) throw err;
			console.log("1 record inserted");
			res.render('login.ejs');
			})
		});
	}
});

app.post("/loginDetails", (req, res)=>{
	let email = req.body['email'];
	let password = req.body['password'];

	con.query(`SELECT * FROM users WHERE email = '${email}'`, function (err, result) {
    if (err) throw err;
    console.log(result[0].password);

	bcrypt.compare(password, result[0].password, function(err, result) {
		if (err) throw err;
		console.log(result);
		if (result == false){
			res.render('login.ejs', {message: "Incorrect Password!Try Again"})
		} 
    if (result == true){
    con.query("SELECT * FROM students", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.render('dashboard.ejs', {students: result});
    });   
    }
	});
	});
})

app.get("/login", (req, res) => {
  res.render('login.ejs');
})


app.post("/display", (req, res)=>{ // displays the entire table
    let display = req.body;
    con.query("SELECT * FROM students", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    let data = JSON.stringify(result)
    res.render('dashboard.ejs', {content: data}) // display in table form
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

    res.render("dashboard.ejs", { students: result }); // Return filtered data
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

app.get("/logout", (req, res) =>{
  res.render('index.ejs')
})

app.listen (port, ()=>{ // listening on port 3000
    console.log(`Successful on port ${port}`);
})