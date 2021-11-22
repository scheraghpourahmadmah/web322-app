/********************************************************************************* *
 *  WEB322 – Assignment 05 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * 
 *  of this assignment has been copied manually or electronically from any other source * (including 3rd party web sites) or distributed to other students.  
 * 
 *  Name: Sholeh Cheraghpourahmadmahmoudi Student ID: 122119209 Date: NOV/21/2021  
 * 
 *  Online (Heroku) Link: https://afternoon-lake-19560.herokuapp.com/
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
  dataserver.getDepartments().then((data) => {
    res.render("addEmployee", { departments: data });
  }).catch((err) => {
    res.render("addEmployee", { departments: [] });
  });
});

app.post("/employees/add", function (req, res) {
  dataserver.addEmployee(req.body)
    .then((dataserver) => {
      res.redirect("/employees");
    }).catch((err) => {
    });
});

app.get("/images", function (req, res) {
  const imgPath = "/public/images/uploaded/";
  fs.readdir(path.join(__dirname, imgPath), function (err, items) {
    res.render("images", { images: items });
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
      res.render("departments", { data: data, title: "Departments" });

    })
    .catch((err) => {
      //console.log(err);
      res.render({ message: "no results" });
    })
});

app.get("/department/:departmentId", (req, res) => {
  dataserver.getDepartmentById(req.params.departmentId).then((data) => {
    res.render("department", { data: data });
  }).catch((err) => {
    res.status(404).send("Department Not Found");
  });
});

app.get("/departments/add", (req, res) => {
  //res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
  res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
  dataserver.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err) => {
    res.status(500).send("Unable to Update Employee");
  });
});

app.post("/department/update", (req, res) => {
  dataserver.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err) => {
    res.status(500).send("Unable to Update Employee");
  });
});



app.get("/departments/delete/:departmentId", (req, res) => {
  dataserver.deleteDepartmentById(req.params.departmentId).then((data) => {
    res.redirect("/departments");
  }).catch((err) => {
    res.status(500).send("Unable to Remove Department / Department not found)");
  });
});
app.get("/managers", function (req, res) {
  dataserver.getManagers()
    .then((dataserver) => {
      console.log("getManagers JSON.");
      res.json(dataserver);
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
      //console.log(err);
      res.status(500).send("Unable to Update Employee");
    })
});

app.get("/employees", function (req, res) {
  console.log(req.query.department);
  if (req.query.status) {
    dataserver.getEmployeesByStatus(req.query.status).then((data) => {
      res.render("employees", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render({ message: "no results" });
    });
  } else if (req.query.department) {
    dataserver.getEmployeesByDepartment(req.query.department).then((data) => {
      res.render("employees", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render({ message: "no results" });
    });
  } else if (req.query.manager) {
    dataserver.getEmployeesByManager(req.query.manager).then((data) => {
      res.render("employees", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render({ message: "no results" });
    });
  } else {
    dataserver.getAllEmployees().then((data) => {
      res.render("employees", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render({ message: "no results" });
    });
  }
});

app.get("/employee/:num", function (req, res) {
  let viewData = {};
  dataserver.getEmployeeByNum(req.params.num).then((data) => {
    if (data) {
      viewData.employee = data;
    } else {
      viewData.employee = null;
    }
  }).catch((err) => {
      console.log(err);
      res.render("employee", { message: "no results" });
    }).then(dataserver.getDepartments).then((data) => {
      viewData.departments = data;
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.employee[0].department) {
          viewData.departments[i].selected = true;
        }
      }
    }).catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
      if (viewData.employee == null) {
        res.status(404).send("Employee not found");
      } else {
        res.render("employee", { viewData: viewData })
      }
    });
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
