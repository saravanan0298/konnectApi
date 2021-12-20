
const express = require('express')
const app = express()
app.use(express.json())

//mysql
const mysql = require('mysql');
const pool = mysql.createPool({
    host: "184.168.117.92",
    user: 'userCreation',
     password: 'Vp6f}9)U?u)r',
    database: 'PEST',
})

  pool.query(`SELECT 1 + 1 AS solution`, function (error, results, fields) {
    if (error) throw error;
  });
app.get('/', function (req, res) {
    res.json({ "name": "Raghul" })
})

app.post('/', async (req, res) => {

    pool.query(`SELECT * from login where username=? AND password=?`,[req.body.username,req.body.password] , function (error, results, fields) {
        if(results.length>0) {
            return res.status(200).json(results[0])
        } else {
                return res.status(401).json({"code":401,"message":"unauthorized user"})
        }
    })
   
 })


app.post('/createcustomer', async (req, res) => {
    
    if (!req.body) {
        return res.status(404).json({ code: "401", "message": "data is not given" })
    }
    pool.query(`insert into Customer Values(?,?,?,?,?,?,?,?,?,?,?,?)`,[req.body.CustomerId,req.body.CustomerName,req.body.ContactType,req.body.ContactRole,req.body.Email1,req.body.Email2,req.body.CompanyName,req.body.BillingAddress1,req.body.BillingAddress2,req.body.Mobile,req.body.Telephone,req.body.BillingPOSTCode],function(error,result, fields){
        if (error) throw error;  
    console.log("Number of records inserted: " + result.affectedRows);  
    })

   
    return res.json({ code: 204, message: "success" })
})





app.listen(4000,function(){
    console.log("running")
})