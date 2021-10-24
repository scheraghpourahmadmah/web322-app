/********************************************************************************* *
 *  WEB322 – Assignment 03 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * 
 *  of this assignment has been copied manually or electronically from any other source * (including 3rd party web sites) or distributed to other students.  
 * 
 *  Name: SHoleh CHeraghpourahmadmahmoudi Student ID: 122119209 Date: OCT/24/2021  
 * 
 *  Online (Heroku) Link:  https://thawing-bayou-79692.herokuapp.com/
 * 
 *  ********************************************************************************/

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

var dataserver = require("./data-service.js");
const multer = require("multer");
const path = require("path");

const fs = require("fs");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public/'));

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage({
  destination: "./public/images/uploaded/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees/add", function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
});

app.post("/employees/add", function (req, res) {
  dataserver.addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    });
});

app.get("/images", function (req, res) {
  const imgPath = "/public/images/uploaded/";
  fs.readdir(path.join(__dirname, imgPath), function (err, items) {
    var obj = { images: [] };
    var size = items.length;
    for (var i = 0; i < items.length; i++) {
      obj.images.push(items[i]);
    }
    res.json(obj);
  });

});

app.get("/images/add", function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addImage.html'));
});

app.post("/images/add", upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});

// app.get("/employees", function (req, res) {
//   dataserver.getAllEmployees()
//     .then((data) => {
//       console.log("getAllEmployees JSON.");
//       res.json(data);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json(err);
//     })
// });

app.get("/departments", function (req, res) {
  dataserver.getDepartments()
    .then((data) => {
      console.log("getDepartments JSON.");
      res.json(data);

    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    })
});

app.get("/managers", function (req, res) {
  dataserver.getManagers()
    .then((data) => {
      console.log("getManagers JSON.");
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    })
});

app.post("/images/add", upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});

app.get("/employees", function (req, res) {
  if (req.query.status) {
    dataserver.getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      })
  }
  else
    if (req.query.department) {
      dataserver.getEmployeesByDepartment(req.query.department)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json(err);
        })
    }
    else
      if (req.query.isManager) {
        dataserver.getEmployeesByManager(req.query.isManager)
          .then((data) => {
            res.json(data);
          })
          .catch((err) => {
            res.json(err);
          })
      }
      else {
        dataserver.getAllEmployees()
          .then((data) => {
            //console.log("getAllEmployees JSON.");
            res.json(data);
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
          })
      }
});

app.get("/employees/:num", function (req, res) {
  dataserver.getEmployeeByNum(req.params.num)
    .then((data) => {
      // console.log("getEmployeeByNum JSON.");
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    })
});


// 404
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname + '/views/error404.html'));
});

// setup http server to listen on HTTP_PORT]
dataserver.initialize().then(
  app.listen(HTTP_PORT, onHttpStart)
).catch(err => {
  console.log(err);
});
