/********************************************************************************* *
 *  WEB322 – Assignment 04 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * 
 *  of this assignment has been copied manually or electronically from any other source * (including 3rd party web sites) or distributed to other students.  
 * 
 *  Name: Sholeh Cheraghpourahmadmahmoudi Student ID: 122119209 Date: NOV/07/2021  
 * 
 *  Online (Heroku) Link: https://thawing-bayou-79692.herokuapp.com/
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

const exphbs = require("express-handlebars");

app.use(express.static('./public/'));

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: "main",
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },

    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set('view engine', '.hbs');

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

const storage = multer.diskStorage({
  destination: "./public/images/uploaded/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


app.get('/', function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/home.html'));
  res.render("home");
});

app.get("/about", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render("about");
});

app.get("/employees/add", function (req, res) {
  //res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
  res.render("addEmployee");
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
  //res.sendFile(path.join(__dirname, '/views/addImage.html'));
  res.render("addImage");
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
      res.render("departments", { departments: data });

    })
    .catch((err) => {
      console.log(err);
      res.render({ message: "no results" });
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
app.post("/employee/update", (req, res) => {
  //console.log(req.body);
  dataserver.updateEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      console.log(err);
    })
});

app.get("/employees", function (req, res) {
  if (req.query.status) {
    dataserver.getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.render("employees", { employees: data });
      })
      .catch((err) => {
        res.render({ message: "no results" });
      })
  }
  else
    if (req.query.department) {
      dataserver.getEmployeesByDepartment(req.query.department)
        .then((data) => {
          res.render("employees", { employees: data });
        })
        .catch((err) => {
          res.render({ message: "no results" });
        })
    }
    else
      if (req.query.isManager) {
        dataserver.getEmployeesByManager(req.query.isManager)
          .then((data) => {
            res.render("employees", { employees: data });
          })
          .catch((err) => {
            res.render({ message: "no results" });
          })
      }
      else {
        dataserver.getAllEmployees()
          .then((data) => {
            //console.log("getAllEmployees JSON.");
            res.render("employees", { employees: data });
          })
          .catch((err) => {
            console.log(err);
            res.render({ message: "no results" });
          })
      }
});

app.get("/employee/:num", function (req, res) {
  dataserver.getEmployeeByNum(req.params.num)
    .then((data) => {
      // console.log("getEmployeeByNum JSON.");
      res.render("employee", { employee: data });
    })
    .catch((err) => {
      console.log(err);
      res.render("employee", { message: "no results" });
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
