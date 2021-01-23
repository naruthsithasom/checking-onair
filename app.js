const express = require('express');
const cors = require('cors');
const readBody = express.urlencoded({ extended: false });
const cookieP = require('cookie-parser')

const app = express();
const readCookie = cookieP();
const ejs = require('ejs');
const mysql = require('mysql');
const source = {
	host: 'localhost',
	database: 'checklist',
	user: 'root',
	password: ''
}
const pool = mysql.createPool(source);
let cookieValid = [ ];
let user = '';

app.listen(5000, showStatus);
app.engine('html', ejs.renderFile);

app.get('/checklist', readCookie, checkList);
app.post('/checklist', readBody, readCookie, saveNewList)

app.get('/query-staff', readCookie, showPool)

app.get('/insert', insert)
app.post('/insert', readBody,  testInert)

app.get('/register', showRegister)
app.post('/register', readBody, saveRegister)

app.get('/login', showLogin)
app.post('/login', readBody, checkLogin)

app.get('/logout', readCookie, gotoLogout)

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('photo'));

function showStatus() {
	let data = new Date();
	console.log(`>>>Server is started... ${data}`)
}

function checkList(req, res) {
	let card = null
	if(req.cookies != null ){
		card = req.cookies.card
	}
	if( cookieValid[card] ) {
		res.render('check.html')
	} else {
		res.redirect('/login')
	}
}

 function saveNewList(req, res) {
	//add data to database
	let id = 3;
	let data = '';
	let staff_id = 2;
	let sql = 'INSERT INTO report SET id = ?, data = ?, staff_id = ?';

	let result = [
		req.body.inputGroup1, req.body.btnRadio1, req.body.btnRadio2,
		req.body.selected1, req.body.selected2, req.body.selected3,
		req.body.selected4, req.body.selected5, req.body.selected6,
		req.body.btnRadio3, req.body.btnRadio4, req.body.btnRadio5,
		req.body.btnRadio6, req.body.btnRadio7, req.body.btnRadio8,
		req.body.btnRadio9, req.body.btnRadio10, req.body.btnRadio11,
		req.body.btnRadio12, req.body.btnRadio13, req.body.btnRadio14,
		req.body.btnRadio15, req.body.btnRadio16, req.body.btnRadio17,
		req.body.btnRadio18, req.body.btnRadio19, req.body.btnRadio20,
		req.body.btnRadio21, req.body.btnRadio22, req.body.btnRadio23,
		req.body.btnRadio24, req.body.btnRadio25, req.body.btnRadio26,
		req.body.btnRadio27, req.body.btnRadio28, req.body.inputGroup2,
	]
	for (let i in result){
		data += result[i]
	}
	  pool.query(sql,[3, 'sdfsfsdfsdfsdf', 2] , (err, i) => {
		let model = {};
		if(err == null){
			res.send(data);
			console.log('OK: ',data)
		}else {
			console.log('err: ',data)
			model.message = 'Fail....';
		}
	 })
	 //res.send(data);
}

function showPool(req, res){
	let card = null
	if( req.cookies != null ) {
		card = req.cookies.card
	} 
	if( cookieValid[card] ){
		pool.query(`SELECT * FROM staff`, (err, data) => {
			let model = {};
			model.all = data;
			res.send(data);
		})
	} else {
		res.send('Access Permission')
	}
}
function insert(req, res){
	res.render('test.html')
}
function testInert(req, res){
	//let sql = 'INSERT INTO report SET id = ?, data = ?, staff_id = ?';
	let sql = `INSERT INTO report(id, data, staff_id) VALUES (?,?,?)`;
	let resource = [req.body.id, req.body.data, req.body.staff_id]

	pool.query(sql, resource, (err, d) => {
		if(err == null){
			res.send(data)
		}
			res.send('error: ', err)
	})
}

function showRegister(req, res){
	res.render('register.html')
}

async function saveRegister(req, res){
	
	let sql = 'insert into staff (tvb,name,position,password) values (?,?,?,sha2(?,512))';
	let data = [req.body.tvb, req.body.name, req.body.position, req.body.password];
	
	await pool.query(sql, data,(error, role) => {
		if(error == null){
			console.log('Register success...')
		} else {
			console.log('Register is fail...', error)
		}
		res.render('login.html')
	})
}

function showLogin(req, res){
	res.render('login.html')
}

function checkLogin(req, res){
	let sql = 'SELECT * FROM staff WHERE tvb=? AND password=sha2(?,512)';
	let data = [req.body.tvb, req.body.password];

	pool.query(sql, data, (err, result) => {
		let model = { }
		model.all = result;
		if(result.length == 1){
			let card = generateKey();
			cookieValid[card] = result[0]
			res.header('Set-Cookie', 'card=' + card ) //Server send card-id cookie
		} else {
			console.log(data)
			res.redirect('/failed?' + err)
		}
		res.render('check.html', model)
	})
}

function generateKey(){
	let c = [ ]
	for( let i = 0; i < 8; i++){
		let r = parseInt(Math.random() * 10000)
			if( r < 1000) r = '0' + r
			if( r < 100) r = '00' + r
			if( r < 10) r = '000' + r
			c.push(r)
	} return c.join('-')
}

function gotoLogout(req, res){
	let card = req.cookies.card
	cookieValid[card] = null //ลบcard cookie
	res.render('logout.html')
}