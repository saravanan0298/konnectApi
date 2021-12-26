
const express = require('express')
const exphbs = require('express-handlebars')
const cors = require('cors')
const multer = require('multer')
const bodyParser = require('body-parser')
const app = express()
app.use(express.json())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//mysql
const mysql = require('mysql');
const pool = mysql.createPool({
    host: "184.168.117.92",
    user: 'userCreation',
    password: 'Vp6f}9)U?u)r',
    database: 'PEST',
})


const port = process.env.PORT || 3001

pool.query(`SELECT 1 + 1 AS solution`, function (error, results, fields) {
    if (error) throw error;
});


app.get('/', function (req, res) {
    res.json({ "name": "Raghul" })
})

app.post('/authentication', async (req, res) => {

    pool.query(`SELECT * from login where username=? AND password=?`, [req.body.username, req.body.password], function (error, results, fields) {
        if (results.length > 0) {
            return res.status(200).json(results[0])
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })

})


/* Site API to create ,update and insert*/

app.get('/site', async (req, res) => {
    pool.query(`select * from Site`, function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        if (results.length > 0) {
            return res.status(200).json(results)
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})

app.post('/site', async (req, res) => {
    let query = 'INSERT INTO Site(`SiteID`, `SiteName`, `SiteStatus`, `Address1`, `Address2`, `IsNFCAvailable`, `PostCode`, `SiteZoneID`, `SiteTypeID`) VALUES(?,?,?,?,?,?,?,?,?)'
    let parameters = ["", req.body.SiteName, req.body.SiteStatus, req.body.Address1, req.body.Address2, req.body.IsNfcAvailable, req.body.PostalCode, req.body.SiteZoneID, req.body.SiteTypeID]
    pool.query(query, parameters, function (err, results, fields) {
        if (err) throw err
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "data not update" })
        }
    })

})

app.put('/site', async (req, res) => {
    let query = `Update Site SET  ` + Object.keys(req.body).map(key => `${key}=?`).join(",") + "where SiteName = ?"
    console.log(req.query.SiteName)
    const parameters = [...Object.values(req.body), req.query.SiteName]
    pool.query(query, parameters, function (err, results, fields) {
        if (err) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "data not update" })
        }
    })
})

app.delete('/site', async (req, res) => {
    let query = `DELETE FROM Site WHERE SiteID =${req.query.SiteID}`
    pool.query(query, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "deleted successfully" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})

//particular site details by using siteZoneId
app.get('/sitename', async (req, res) => {

    const id = parseInt(req.query.SiteZoneID)
    pool.query(`select * from Site where SiteZoneID = ${id}`, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.status(200).json(results)
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})

//sitezone to insert ,delete and read
app.get('/sitezone', async (req, res) => {
    pool.query(`select * from SiteZone`, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.status(200).json(results)
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})


app.post('/sitezone', async (req, res) => {
    let query = "INSERT INTO `SiteZone`(`SiteZoneID`, `Description`) VALUES (?,?)"
    let parameters = ["", req.body.Description]
    pool.query(query, parameters, function (error, results) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "data not update" })
        }
    })
})

app.delete('/sitezone', async (req, res) => {

    let query = `DELETE FROM SiteZone WHERE SiteZoneID = ${req.body.SiteZoneID} `
    pool.query(query, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "deleted successfully" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})



/* point details api to list pointDetails and add points details */

app.get('/pointdetails', async (req, res) => {
    const zoneId = parseInt(req.query.SiteZoneID)
    const siteId = parseInt(req.query.siteId)
    pool.query(`select * from Point_Details where SiteZoneID = ${zoneId} AND SiteID= ${siteId}`, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.status(200).json(results)
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })

})

app.post('/pointdetails', async (req, res) => {

    pool.query(`insert into Point_Details Values (?,?,?,?,?,?,?,?,?,?)`, [req.body.PointID, req.body.SiteZone, req.body.SiteID, req.body.PointNumber, req.body.PointNotes, req.body['UID'], req.body.PointImageURL, req.body.MapURL, req.body.AddedUserID, req.body.ScanDateTime], function (error, result, fields) {
        if (error) throw error;
        if (result.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "unauthorized user" })
        }

    })
})

/* contact API to create ,update and insert*/

app.get('/contact', async (req, res) => {

    pool.query(`select * from Contact`, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.status(200).json(results)
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })

})

app.post('/contact', async (req, res) => {
    pool.query(`insert into Contact Values (?,?,?,?,?,?,?,?,?,?,?,?)`, ["", req.body.ContactName, req.body.ContactType, req.body.ContactRole, req.body.Email1, req.body.Email2, req.body.CompanyName, req.body.BillingAddress1, req.body.BillingAddress2, req.body.Mobile, req.body.Telephone, req.body.BillingPOSTCode], function (error, result, fields) {
        if (error) throw error;
        if (result.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "unauthorized user" })
        }

    })
})

app.put('/contact', async (req, res) => {
    let query = `Update Contact SET  ` + Object.keys(req.body).map(key => `${key}=?`).join(",") + "where ContactName = ?"
    const parameters = [...Object.values(req.body), req.query.ContactName]
    pool.query(query, parameters, function (err, results, fields) {
        if (err) throw err
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "data not update" })
        }
    })
})

app.delete('/contact', async (req, res) => {
    let query = `DELETE FROM Contact WHERE ContactID =${req.query.ContactID}`
    pool.query(query, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "deleted successfully" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})

/* staff API to create ,update and insert */

app.get('/staff', async (req, res) => {

    pool.query(`select * from Staff`, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.status(200).json(results)
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})

app.post('/staff', async (req, res) => {


    let query = `INSERT INTO Staff(StaffID, StaffName, Gender, StaffType, StaffImageURL,Email, Status, Mobile, Address1, Address2, PostCode, Nationality, JobStartDate, JobEndDate,IDType, ID, JobTitle, Department, NextOfKin, NextOfKinMobile, Relationship, DOB, MartialStatus, HighestQualification, Religion) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    pool.query(query, ["", req.body.StaffName, req.body.Gender, req.body.StaffType, req.body.StaffImageURL, req.body.Email, req.body.Status, req.body.Mobile, req.body.Address1, req.body.Address2, req.body.PostCode, req.body.Nationality, req.body.JobStartDate, req.body.JobEndDate, req.body.IDType, req.body.ID, req.body.JobTitle, req.body.Department, req.body.NextOfKin, req.body.NextOfKinMobile, req.body.Relationship, req.body.DOB, req.body.MartialStatus, req.body.HighestQualification, req.body.Religion], function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "unauthorized user" })
        }
    })
})

app.put('/staff', async (req, res) => {
    let query = `Update Staff SET  ` + Object.keys(req.body).map(key => `${key}=?`).join(",") + "where ID = ?"
    const parameters = [...Object.values(req.body), req.query.ID]
    pool.query(query, parameters, function (err, results, fields) {
        if (err) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "data not update" })
        }
    })
})

app.delete('/staff', async (req, res) => {
    let query = `DELETE FROM Staff WHERE StaffID =${req.query.StaffID}`
    pool.query(query, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "deleted successfully" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})

/*scandetails */
app.post('/scandetails', async (req, res) => {
    const currentDate = new Date();
    let query = "Insert into Scan_Details values (?,?,?,?,?)"
    let parameters = ["", req.body.UID, req.body.SiteID, req.body.UserID, currentDate]
    pool.query(query, parameters, function (err, results, fields) {
        if (err) throw err
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "unauthorized user" })
        }

    })

})


/*Contact site API to create and delete only  */

app.post('/contactsite', async (req, res) => {
    let query = `INSERT INTO Contact_Site (ConSiteID, ContactID, SiteID) VALUES (?,?,?)`
    let parameters = ["", req.body.ContactID, req.body.SiteID]
    pool.query(query, parameters, function (error, results, fields) {
        if (error) throw error
        if (results.length > 0) {
            return res.status(200).json(results)
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }

    })
})

app.delete('/contactsite', async (req, res) => {

    let query = `DELETE FROM Contact_Site WHERE ConSiteID =${req.query.ConSiteID}`
    pool.query(query, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "deleted successfully" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })

})


/*staff certficate Api to create and delete */

app.post('/staffCertificate', async (req, res) => {
    let query = "INSERT INTO `Staff_Certificate`(`StaffCertID`, `StaffID`, `Certification`, `CertificationBody`, `ValidityStartDate`, `ValidityEndDate`, `CertificateURL`) VALUES (?,?,?,?,?,?,?)"
    let parameters = ["", req.body.StaffID, req.body.Certification, req.body.CertificationBody, req.body.ValidityStartDate, req.body.ValidityEndDate, req.body.CertificateURL]
    pool.query(query, parameters, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }

    })
})

app.delete('/staffcertificate', async (req, res) => {

    let query = `DELETE FROM Staff_Certificate WHERE StaffCertID =${req.query.StaffCertID}`
    pool.query(query, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ message: "deleted successfully" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })

})

/*siteType create API to  add and delete only*/

app.post('/sitetype', async (req, res) => {
    let query = `INSERT INTO SiteType (SiteTypeID,Description) VALUES (?,?)`
    let parameters = ["", req.body.Description]
    pool.query(query, parameters, function (error, results, fields) {
        if (error) throw error
        if (results.length > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }

    })
})

app.delete('/sitetype', async (req, res) => {
    let query = `DELETE FROM SiteType WHERE SiteTypeId =${req.query.SiteTypeID}`
    pool.query(query, function (error, results, fields) {
        if (error) throw error
        if (results.affectedRows > 0) {
            return res.status(200).json({ message: "deleted successfully" })
        } else {
            return res.status(401).json({ "code": 401, "message": "unauthorized user" })
        }
    })
})


/* imageUrl to store images and get */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter })

app.post('/imagesupload', upload.single('image'), (req, res) => {

    let query = "INSERT INTO `imagesurl`(`imageurl`) VALUES (?)"
    pool.query(query, req.file.path, function (err, results) {

        if (err) throw err
        if (results.affectedRows > 0) {
            return res.status(200).json({ code: 200, message: "success" })
        } else {
            return res.status(401).json({ code: 401, "message": "unauthorized user" })
        }

    })
})

app.get('/imagesupload', async (req, res) => {

    pool.query(`select * from imagesurl`, function (err, results, fields) {
        if (err) throw err

        if (results.length > 0) {
            let demo = results.map(e => `https://konnect68.herokuapp.com/${e.imageurl}`)

            return res.status(200).json(demo)
        } else {
            return res.status(401).json({ "code": 401, "message": results.imageurl })
        }
    })
})


app.engine('hbs', exphbs({ extends: ".hbs" }))
app.


    app.listen(port, function () {
        console.log(`${port} is running`)
    })