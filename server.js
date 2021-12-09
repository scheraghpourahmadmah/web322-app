/********************************************************************************* *
 *  WEB322 – Assignment 06 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * 
 *  of this assignment has been copied manually or electronically from any other source * (including 3rd party web sites) or distributed to other students.  
 * 
 *  Name: Sholeh Cheraghpourahmadmahmoudi Student ID: 122119209 Date: DEC/08/2021  
 * 
 *  Online (Heroku) Link: 
 * 
 *  ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
var dataserver = require("./data-service.js");
const exphbs = require("express-handlebars");
var dataServiceAuth = require("./data-service-auth");
const clientSessions = require("client-sessions");

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public/'));



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

app.use(clientSessions({
  cookieName: "session",
  secret: "web_a6_secret",
  duration: 2 * 60 * 1000, // 2 minutes
  activeDuration: 1000 * 60 // 1 minute
}));

app.use((req,res,next) => {
  res.locals.session = req.session;
  next();
});

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

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};
app.get('/', function (req, res) {
  res.render("home");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  dataServiceAuth.registerUser(req.body)
  .then(() => res.render('register', { successMsg: "User created!"}))
  .catch((err) => res.render('register', { errorMsg: err, userName: req.body.userName }));
});

// post for /login
app.post("/login", function (req, res) {
  req.body.userAgent = req.get('User-Agent');

  dataServiceAuth.checkUser(req.body)
    .then(function (user) {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      }
      res.redirect('/employees');
    })
    .catch(function (err) {
      console.log(err);
      res.render('login', { errorMsg: err, userName: req.body.userName });
    });
});

app.get("/logout", function (req, res) {
  req.session.reset();
  res.redirect('/');
});

app.get("/userHistory", ensureLogin, function (req, res) {
  res.render('userHistory');
});

app.get("/employees/add", ensureLogin, function (req, res) {
  dataserver.getDepartments().then((data) => {
    res.render("addEmployee", { departments: data });
  }).catch((err) => {
    res.render("addEmployee", { departments: [] });
  });
});

app.post("/employees/add", ensureLogin, function (req, res) {
  dataserver.addEmployee(req.body)
    .then((dataserver) => {
      res.redirect("/employees");
    }).catch((err) => {
    });
});

app.get("/images", ensureLogin, function (req, res) {
  const imgPath = "/public/images/uploaded/";
  fs.readdir(path.join(__dirname, imgPath), function (err, items) {
    res.render("images", { images: items });
  });

});

app.get("/images/add", ensureLogin, function (req, res) {
  //res.sendFile(path.join(__dirname, '/views/addImage.html'));
  res.render("addImage");
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), function (req, res) {
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

app.get("/departments", ensureLogin, function (req, res) {
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

app.get("/department/:departmentId", ensureLogin, (req, res) => {
  dataserver.getDepartmentById(req.params.departmentId).then((data) => {
    res.render("department", { data: data });
  }).catch((err) => {
    res.status(404).send("Department Not Found");
  });
});

app.get("/departments/add", ensureLogin, (req, res) => {
  //res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
  res.render("addDepartment");
});

app.post("/departments/add", ensureLogin, (req, res) => {
  dataserver.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err) => {
    res.status(500).send("Unable to Update Employee");
  });
});

app.post("/department/update", ensureLogin, (req, res) => {
  dataserver.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err) => {
    res.status(500).send("Unable to Update Employee");
  });
});



app.get("/departments/delete/:departmentId", ensureLogin, (req, res) => {
  dataserver.deleteDepartmentById(req.params.departmentId).then((data) => {
    res.redirect("/departments");
  }).catch((err) => {
    res.status(500).send("Unable to Remove Department / Department not found)");
  });
});
app.get("/managers", ensureLogin, function (req, res) {
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

app.post("/images/add", ensureLogin, upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});

app.post("/employee/update", ensureLogin, (req, res) => {
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

app.get("/employees", ensureLogin, function (req, res) {
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

app.get("/employee/:num", ensureLogin, function (req, res) {
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
// dataserver.initialize().then(
//   app.listen(HTTP_PORT, onHttpStart)
// ).catch(err => {
//   console.log(err);
// });


// dataserver.initialize()
//   //.then(dataServiceAuth.initialize)
//   .then(function () {
//     app.listen(HTTP_PORT, onHttpStart)
//   }).catch(function (err) {
//     console.log("unable to start server: " + err);
//   });

dataserver.initialize()
  .then(dataServiceAuth.initialize())
  .then(
    app.listen(HTTP_PORT, onHttpStart)
  ).catch(err => {
    console.log(err);
  });
