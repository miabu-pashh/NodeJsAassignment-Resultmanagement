const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

const mysql = require('mysql');
const encoder = express.urlencoded({

    extended: false

});

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'resultmanagement'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});


//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//first home page
app.get('/',(req, res) =>{
    // res.send('new user from page');
    res.render('user_home', {
        title : 'Result Management System'
        
    });

});


app.get('/teacher',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM result";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'Result Management System',
            users : rows
        });
    });
});

app.get('/student',(req, res) =>{
    // res.send('new user from page');
    res.render('Student', {
        title : 'Result Management System'
        
    });

});

app.post("/find",encoder,function(req,res){

    var roll_number = req.body.Roll_no;

    // var dob = req.body.dob;
    var name=req.body.Name;



    connection.query("select * from result where  Roll_no = ? and Name = ?",[roll_number,name] , function(error,rows){

        if(rows.length > 0)

        res.render("final",{

            title: 'Result Management System',

            // users : results[0]
            users:rows

        });

        else{

            // req.send('Incorrect Roll number or Date of Birth!');
            res.render('error', {
                title : 'Result Management System'
                
            });

         }

    });

});

app.get('/add',(req, res) =>{
    // res.send('new user from page');
    res.render('user_add', {
        title : 'Result Management System'
        
    });

});

app.get('/home',(req, res) =>{
    // res.send('new user from page');
    res.render('user_home', {
        title : 'Result Management System'
        
    });

});

app.get('/try_result',(req, res) =>{
    // res.send('new user from page');
    res.render('Student', {
        title : 'Result Management System'
        
    });

});

app.post('/save',(req, res) => { 
    let data = {Roll_no:req.body.Roll_no, Name:req.body.Name, DateOfBirth:req.body.DateOfBirth, Score:req.body.Score};
    // let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO result SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/teacher');
    });
});

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from result where Student_id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update result SET Roll_no='"+req.body.Roll_no+"',  Name='"+req.body.Name+"',  DateOfBirth='"+req.body.DateOfBirth+"', Score='"+req.body.Score+"' where  Student_id="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/teacher');
    });
});

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from result where Student_id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/teacher');
    });
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});

// nodemon app (OR) npm start

///////////////////////////////////////////////////////////////////////////////////








//Teacher login

//route to Teacher login page

app.get('/teacher_login',(req,res) => {

    res.render('teacher_login', {

        title: 'Result Management System',

        //message: 'Incorrect Id or Password!',

        // serverError : req.flash('error')

    });

});
//authenticate the teacher and route to welcome page to display the result

app.post("/loginteach",encoder, function(req,res){

    var teacherid = req.body.teacherid;

    var password = req.body.password;



    connection.query("select * from teachers where  teacherid = ? and password = ?",[teacherid,password] , function(error,results,fields){    

         if(results.length > 0)

         {

            res.redirect('/teacher');

          }

         else{

            req.flash('error', 'Invalid Id or Password!!');

            res.redirect('/user_home')

         }

    });

});

