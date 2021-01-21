const express = require('express');
const app = express();
const cors = require('cors');
const ejs = require('ejs');

const readBody = express.urlencoded({ extended: false });

app.listen(5000, showStatus);
app.engine('html', ejs.renderFile);

app.get('/checklist', checkList);
app.post('/checklist', readBody, saveNewList)


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('photo'))

function showStatus() {
	let data = new Date();
	console.log(`>>>Server is started... ${data}`)
}

function checkList(req, res) {
	res.render('check.html')
}

function saveNewList(req, res) {
	let data = [
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
		req.body.btnRadio27, req.body.btnRadio28, req.body.inputGroup2
	]
	//res.send(data)
	let model = {}
	model = data
	res.send(model)
	//res.render('list-result.html', model)
}