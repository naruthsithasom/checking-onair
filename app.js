const express = require('express')
const app = express()

const cookieP = require('cookie-parser')
const readCookie = cookieP()

const ejs = require('ejs')
const cors = require('cors')

const mysql = require('mysql')
const source = {
    host: 'localhost',
    database: 'checklist',
    user: 'root',
    password: 'Dreamz1931'
}

const pool = mysql.createPool(source)
const readBody = express.urlencoded({ extended: false })

let cookieValid = []
let model = {}

app.listen(5000, showStatus)
app.engine('html', ejs.renderFile)


app.get(['/', '/dashboard'], readCookie, showDashboard)

app.get('/checklist', readCookie, checkList)
app.post('/checklist', readCookie, readBody, saveNewList)

app.get('/register', showRegister)
app.post('/register', readBody, saveRegister)

app.get('/login', showLogin)
app.post('/login', readBody, checkLogin)

app.get('/profile', readCookie, showProfile)

app.get('/logout', readCookie, gotoLogout)

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('photo'))
app.use((req, res) => { res.status(404).render('error.html') })

function testProfile(req, res){
    let outHtml = `<table>
                    <tr>
                        <th>ลำดับ</th>
                        <th>รายงาน</th>
                        <th>วันลงบันทึก</th>
                     </tr>
                     <tr>
                        <td></td>   
                        <td></td>   
                        <td></td>   
                       </tr>`
    res.render('profile.html',outHtml)
}

function showStatus() {
    let date = new Date()
    console.log(`>: Server is started. ${date} `)
}

 function showDashboard(req, res) {
    let card = null
    if (req.cookies != null) {
        card = req.cookies.card
    }
    if (cookieValid[card]) {
         pool.query('select * from staff', (error, result) => {
            model.stafflists = result
        })
         pool.query('select * from report', (error, result) => {
            model.report = result
            //res.status(202)
            res.render('dashboard.html', model)
        })
    } else {
        res.redirect('/login')
    }
}

function checkList(req, res) {
    let card = null
    if (req.cookies != null) {
        card = req.cookies.card
    }
    if (cookieValid[card]) {
        res.render('check.html', model)
    } else {
        res.redirect('/login')
    }
}

function saveNewList(req, res) {

    let sql = 'INSERT INTO REPORT (data, staff_id) values (?, ?)'
    let data_ = ""
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
    //let a = 'ระดับความดัง(-ULFS) : '
    for (let i in result) { 
        data_ = data_ + '-' + result[i] 
    }

    //let m = model.user
    let staff_ = model.user.find(x => x.id)
    let data = [data_, Number(staff_.id)]

    pool.query(sql, data, (err) => {
        if (err == null) {
            res.render('dashboard.html', model)
            console.log('OK, It is work a insert to database...')
        } else { console.log('Oh,It is not to a insert to database: ', err) }
    })
}

function showRegister(req, res) {
    res.render('register.html')
}

async function saveRegister(req, res) {

    let sql = 'insert into staff (tvb,name,position,password) values (?,?,?,sha2(?,512))'
    let data = [req.body.tvb, req.body.name, req.body.position, req.body.password]

    await pool.query(sql, data, (error) => {
        if (error == null) {
            console.log('Register is success..')
        } else {
            console.log('Register is fail...', error)
        }
        res.render('login.html')
    })
}

function showLogin(req, res) {
    res.render('login.html')
}

// async function checkLogin(req, res) {

//     let sql = `SELECT * FROM staff WHERE tvb=? AND password=sha2(?,512)`
//     let data = [req.body.tvb, req.body.password]

//     await pool.query(sql, data, (err, result) => {
//         model.user = result
//         if (result.length == 1) {
//             let card = generateKey()
//             cookieValid[card] = result[0]
//             res.status(202)
//             res.header('Set-Cookie', 'card=' + card)
//             res.render('dashboard.html', model)
//         }
//         else {
//             console.error(err)
//             res.redirect('/login')
//         }
//     })
//      pool.query('select * from report', (error, result) => {
//         model.report = result
//     })
// }
async function checkLogin(req, res) {

    let sql = `SELECT * FROM staff WHERE tvb=? AND password=sha2(?,512)`
    let data = [req.body.tvb, req.body.password]

    await pool.query(sql, data, (err, result) => {
        model.user = result
        if (result.length == 1) {
            let card = generateKey()
            cookieValid[card] = result[0]
            res.status(202)
            res.header('Set-Cookie', 'card=' + card)
        } if(result.length == 1){
            pool.query('select * from report', (error, result) => {
                model.report = result
                res.render('dashboard.html', model)
            })
        }
        else {
            console.error(err)
            res.redirect('/login')
        }
    })
}
function generateKey() {

    let c = []
    for (let i = 0; i < 8; i++) {
        let r = parseInt(Math.random() * 10000)
        if (r < 1000) r = '0' + r
        if (r < 100) r = '00' + r
        if (r < 10) r = '000' + r
        c.push(r)
    }
    return c.join('-')
}

function gotoLogout(req, res) {
    let card = req.cookies.card
    cookieValid[card] = null
    res.redirect('/login')
}

function showProfile(req, res) {
    let card = null
    if (req.cookies != null) {
        card = req.cookies.card
    }
    if (cookieValid[card]) {
         pool.query('select * from report', (error, result) => {
            model.report = result
         
            //res.status(202)
            let i = model.user.map( x => x.id)
            //let j = model.report.find( x => x.staff_id == i)

            if(i) {
                pool.query('select * from report where staff_id = ?',[i], (err, result) => {
                    model.profile = result
                    res.render('profile.html', model)
                    //res.send(model)
                })
            }else{
                console.log('i: '+ i + ':' + ' j:' + j) //i:20 , j:7,2,2,6,11,20
                res.send('error')
            }
        })
    } else {
        res.redirect('/login')
    }
}

/*
        <% for (let i in all) { %>
          <label>ชื่อ-นามสกุล:</label> <span> <%= all[i].name %> </span> <br/>
          <label>รหัสพนักงาน:</label> <span> <%= all[i].tvb %> </span><br/>
          <label>ตำแหน่ง:</label> <span> <%= all[i].position %> </span><br/>
					<% } %>
					

      <% all.map( x => { %>
        <%= x.data %>
      <% }) %>
*/

/*
+------------+----------+------+-----+-------------------+-------------------+
| Field      | Type     | Null | Key | Default           | Extra             |
+------------+----------+------+-----+-------------------+-------------------+
| id         | int      | NO   | PRI | NULL              | auto_increment    |
| data       | text     | NO   |     | NULL              |                   |
| date_times | datetime | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| staff_id   | int      | YES  | MUL | NULL              |                   |
+------------+----------+------+-----+-------------------+-------------------+
*/

// app.get('/query-staff', readCookie, showPool)
// app.get('/insert', showInsert)
// app.post('/insert', readBody,  testInert)
// function showInsert(req, res){ res.render('test.html')}

// function testInert(req, res){
// 	let sql = 'INSERT INTO REPORT (data, staff_id) values (?, ?)'
// 	let add = [req.body.data, Number(req.body.staff_id)]

// 	 pool.query(sql, add, (err) => {
// 		if(err == null){ 
// 			res.send('Success')
// 			console.log('insert done!!') 
// 		}
// 		else { 
// 			res.send(err) 
// 			console.log('err>>',err) 
// 		}
// 	})
// }
// function showPool(req, res){
// 	let card = null
// 	if( req.cookies != null ) {
// 		card = req.cookies.card
// 	} 
// 	if( cookieValid[card] ){
// 		pool.query(`SELECT * FROM staff`, (err, data) => {
// 			res.send(data);
// 		})
// 	} else {
// 		res.send('Access Permission')
// 	}
// }