var express = require('express')
var mysql = require('mysql')
var ejs = require('ejs')

var lottery = express ()
var source = {
							host:    'localhost', 
							database:'lottery', 
							user:    'admin', 
							password:'1234'
					}
var pool = mysql.createPool(source)


lottery.listen(81, showStatus)
lottery.engine('html', ejs.renderFile)
lottery.use('/lottery-theme', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
lottery.use('/lottery-js',    express.static(__dirname + '/node_modules/bootstrap/dist/js'))
lottery.get('/', showIndex)
lottery.get('/connecting', showConnect)
lottery.get('/all', showAll)
lottery.get('/lotto-th', showLottoThai)
lootery.get('/dashbroad', showDashbroad)
lottery.use(express.static('public'))
lottery.use(express.static('photo'))
lottery.use((req, res) =>{ res.status(404).render('error.html')})

function showDashbroad(req, res){
	res.render('dashbroad.html')
}

function showLottoThai(req, res){
	res.render('lotto-th.html')
}

function showStatus(){
	var date = new Date()
	console.log('>Server is strating... '+date.toString())
}

function showIndex(req, res){
	res.render('index.html')
}

function showConnect(req, res){
	pool.query('select * from list', function(error, data){
		res.send(data)
	})
}

function showAll(req, res){
	pool.query('select * from list', function(error ,data){
		var model = {}
		model.alls = data
		res.render('all.html', model)
	})
}
