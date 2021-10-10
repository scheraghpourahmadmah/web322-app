/********************************************************************************* *
 *  WEB322 – Assignment 02 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * 
 *  of this assignment has been copied manually or electronically from any other source * (including 3rd party web sites) or distributed to other students.  
 * 
 *  Name: SHoleh CHeraghpourahmadmahmoudi Student ID: 122119209 Date: OCT/07/2021  
 * 
 *  Online (Heroku) Link: ________________________________________________________ 
 * 
 *  ********************************************************************************/

 var dataserver = require("./data-service.js");
 
 const express = require("express");
 const app = express();

 const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/home.html');
  });
app.get("/about",function (req, res)  {
    res.sendFile(__dirname +'/views/about.html');
});

app.get("/employess",function(req,res){
dataserver.getAllEmployees()

.then((data) =>{
  console.log("getAllEmployees JSON.");
  res.json(data);

})
.catch((err) =>{
  console.log(err);
  res.json(err);
})
});


app.get("/managers",function(req,res){
  dataserver.getManagers()
  
  .then((data) =>{
    console.log("getManagers JSON.");
    res.json(data);
  
  })
  .catch((err) =>{
    console.log(err);
    res.json(err);
  })
  });

  app.get("/departments",function(req,res){
    dataserver.getDepartments()
    
    .then((data) =>{
      console.log("getDepartments JSON.");
      res.json(data);
    
    })
    .catch((err) =>{
      console.log(err);
      res.json(err);
    })
    });

    app.use(function(req,res){
      res.status(404).sendFile(path.join(__dirname + '/views/error404.html'));
    })



    console.log ("Ready for initialize");
    dataserver.initialize()
    .then(() =>{
      console.log("initialize.then");
      // setup http server to listen on HTTP_PORT
       app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(err => {
      console.log(err);
    })

