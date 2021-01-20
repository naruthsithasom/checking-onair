const express = require('express');
const app = express();

const ejs = require('ejs');
const { syncBuiltinESMExports } = require('module');

app.listen(5000, showStatus);
app.engine('html', ejs.renderFile);

app.get('/', checkList);

app.use(express.static('public'));
app.use(express.static('photo'))

function showStatus() {
	let data = new Date();
	console.log(`>>>Server is started... ${data}`)
}

function checkList(req, res) {
	res.render('check.html')
}