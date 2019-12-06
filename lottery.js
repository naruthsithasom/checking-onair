var express = require('express')
var mysql = require('mysql')
var ejs = require('ejs')
var parser = require('cookie-parser')
var readCookie = parser()
var lottery = express()
var source = {
							host:    'localhost', 
							database:'lottolucky88', 
							user:    'admin', 
							password:'1234'
					}
var pool = mysql.createPool(source)
var readBody = express.urlencoded({extended:false})
var valid = []

lottery.listen(81, showStatus)
lottery.engine('html', ejs.renderFile)
lottery.use('/lottery-theme', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
lottery.use('/lottery-js',    express.static(__dirname + '/node_modules/bootstrap/dist/js'))
lottery.get(['/','/home','/lottolucky88'], showListall)
lottery.post(['/','/home','lottolucky88'], readBody, checkPassword)
lottery.get('/connecting', showConnect)
lottery.get('/member', showMember)
lottery.get('/all', showAll)
lottery.use(express.static('public'))
lottery.use(express.static('photo'))
lottery.use((req, res) =>{ res.status(404).render('error.html')})

function showListall(req, res){
	pool.query('select * from lotto_thai', function(error, data){
		var model = { }
		model.all = data
		res.render('home.html', model)
	})
}
function showAll(req, res){
	pool.query('select * from list', function(error ,data){
		var model = {}
		model.all = data
		res.render('all.html', model)
	})
}
function checkPassword(req, res){
	var sql  = 'select * from member where ' +
				'  email=? and password=sha2(?,512) '
	var data = [ req.body.email, req.body.password ]
	pool.query(sql ,data, function(error, result){
		if(result.length == 1){
			var card = randomCard()
			valid[card] = result[0]
			res.header('Set-Cookie', 'card='+card+';HttpOnly')
			//res.redirect('/dashboard')
			res.send('Login Success')//
		} else {
			//res.redirect('/loggin')
			res.send('Login Fail')
			console.log('>>:'+result)
		}
	})
}

function randomCard(){
	var a = [ ]
	for (var i = 0; i < 8; i++){
		var r = parseInt(Math.random() * 10000 )
			if( r < 1000) r = '0' + r
			if( r < 100) r = '00' + r
			if( r < 10) r = '000' + r
			a.push(r)
	} return a.join('-')
}

function showLogin(req, res){
	res.render('login.html')
}

function showHome(req, res){
	res.render('home.html')
}

function showStatus(){
	var date = new Date()
	console.log('>Server is strating... '+date.toString())
}

function showConnect(req, res){
	pool.query('select * from lotto_thai', function(error, data){
		res.send(data)
	})
}
function showMember(req, res){
	pool.query('select * from `member`', function(err, data){
		res.send(data)
	})
}

