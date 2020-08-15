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

lottery.get(['/','/home','/lottolucky88'], showListall)
lottery.get('/login', showLogin)
lottery.post('/login', readBody, checkPassword)
lottery.get('/welcome', readCookie, showWelcome)
lottery.get('/pass', readCookie, showPass)
lottery.get('/fail', showFail)
lottery.get('/forgot', showFotgot)
lottery.get('/register', showRegister)
lottery.post('/register', readBody, saveNewMember)
lottery.get('/connecting', showConnect)
lottery.get('/member', showMember)
lottery.get('/api/member',listAll)
lottery.get('/testApi', testApi)
lottery.use(express.static('public'))
lottery.use(express.static('photo'))
lottery.use((req, res) =>{ res.status(404).render('error.html')})

function testApi(req, res){
	res.render('testApi.html')
}

function listAll(req, res){
	res.header('Access-Control-Allow-Origin','*')//ต้องใส่header เพื่อส่งAPI
	pool.query('select * from member', function(error, data){
		//start
		var email = 'not found'
		var codes = 'not found'
		for(var i of data){
			if(i.email == "dreamz"){
				email = i.email
				codes = i.code
			}
		}
		//end
		res.send('API Test: '+ email +' - '+codes)
		//res.send(data) //data is show all anything
	})
}
function showWelcome(req, res){
	var card = null 
	if(req.cookies != null){
		card = req.cookies.card
	}
	if(valid[card]){
		var model = { }
		model.user = valid[card]
		res.render('welcome.html', model)
	} else {
		res.redirect('/login')
	}
}

function saveNewMember(req, res){
	var sql = 'insert into `member`(email, password, name)' +
						' values(?, sha2(?, 512), ?)'
	var data = [req.body.email, req.body.password, req.body.name]
	pool.query(sql, data, function(error, result){
		var model = { }
		//model.message = 'Test'
		if(error == null){
			model.message = 'Register Success...'
		} else {
			model.message = 'Fail to register...'
		}
		console.log('mode: ', model)
		res.render('register-result.html', model)
	})
}

function showRegister(req, res){
	res.render('register.html')
}

function showFotgot(req, res){
	res.render('forgot.html')
}

function showFail(req, res){
	res.render('fail.html')
}

function showPass(req, res){
	var card = null 
	if(req.cookies != null){
		card = req.cookies.card
	}
	if(valid[card]){
		var model = { }
		model.user = valid[card]
		res.render('pass.html', model)
	} else {
		res.redirect('/')
	}
}

function showListall(req, res){
	pool.query('select * from lotto_thai', function(error, data){
		var model = { }
		model.all = data
		res.render('home.html', model)
	})
}

function checkPassword(req, res){
	var sql  = 'select * from member where email=? and password=sha2(?,512) '
	var data = [ req.body.email, req.body.password ]
	pool.query(sql ,data, function(error, result){
		if(result.length == 1){
			var card = randomCard()
			valid[card] = result[0]
			res.header('Set-Cookie', 'card='+card+';HttpOnly')//Server is send ID Cookies.
			res.redirect('/welcome')//Server is send page welcome.html
		
		} else {
			//res.redirect('/')
			res.render('fail.html')
		}
	})
}

function randomCard(){ //create for id cookie
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
// ----------เพิ่มมาใหม่---------- ///////
function apiResult(req,res){
	pool.query('select * from results', function(err,data){
		res.rend(data)
	})
}
function apiCovid19(req,res){
	res.render('Access-Control-Allow-Origin','*') //ต้องระบุหัว Header ทุกครั้เมื่อส่ง Api งานBackend
	pool.query('select * from covid',function(error,data){
		
	})
}function showAPI(req, res){
	res.render('api.html')
}