var fs = require("fs");
var employees = [];
var departments = [];

module.exports.addEmployee = function (employeeData) {
    var promise = new Promise((resolve, reject) => {
        
       if (typeof employeeData.isManager === "undefined") {
            employeeData.isManager = false;
       } else {
            employeeData.isManager = true;
       }

       employeeData.employeeNum = employees.length + 1;
       employees.push(employeeData);
        
     resolve (employees);
     })
     return promise;
};

module.exports.initialize = function () {
    var promise = new Promise((resolve, reject) => {
        try {
            fs.readFile('./data/employees.json', (err, data) => {
                if (err) throw err;

                employees = JSON.parse(data);
            })
            fs.readFile('./data/departments.json', (err, data) => {
                if (err) throw err;

                departments = JSON.parse(data);
            })

        }
        catch (ex) {
            console.log("INITIALIZE - FAILURE.");
            reject("INITIALIZE - FAILURE.");
        }
        console.log("INITIALIZE - SUCCESS.");
        resolve("INITIALIZE - SUCCESS.");
    })
    return promise;
};

module.exports.getAllEmployees = function () {

    var promise = new Promise((resolve, reject) => {
        if (employees.length === 0) {
            var err = "getAllEmployees() no results returned.";
            reject({ message: err });
        }
        resolve(employees);
    })
    return promise;

};

module.exports.getManagers = function () {
    var aManagers = [];
    var promise = new Promise((resolve, reject) => {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                aManagers.push(employees[i]);
            }
        }

        if (aManagers.length === 0) {
            var err = "getManagers() no results returned.";
            reject({ message: err });
        }

        resolve(aManagers);
    })
    return promise;

};


module.exports.getDepartments = function () {

    var promise = new Promise((resolve, reject) => {
        if (departments.length === 0) {
            var err = "getDepartments() no results returned.";
            reject({ message: err });
        }
        resolve(departments);
    })
    return promise;

};


module.exports.getEmployeeByNum = function (num) {
    
      var locEmp;
      var promise = new Promise((resolve, reject) => {
        
         for (var i=0; i < employees.length; i++){
             if (employees[i].employeeNum == num) {
               // console.log (num + employees[i]);
                 locEmp = employees[i];
                 i = employees.length;
             }
         }
  
         if(locEmp === "undefined") {
          var err = "getEmployeesByNum() does not have any data.";
          reject({message: err});
         }  
  
      resolve (locEmp);
      })
      return promise;
  
  };


  module.exports.getEmployeesByStatus = function (statusId) {
   
    var locEmp = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].status == statusId) {
               locEmp.push(employees[i]);
           }
       }

       if(locEmp.length === 0) {
        var err = "getEmployeesByStatus() does not have any data.";
        reject({message: err});
       }  

    resolve (locEmp);
    })
    return promise;

};

module.exports.getEmployeesByDepartment = function (departmentId) {

    var locEmp = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].department == departmentId) {
               locEmp.push(employees[i]);
           }
       }

       if(locEmp.length === 0) {
        var err = "getEmployeesByDepartment() does not have any data.";
        reject({message: err});
       }  

    resolve (locEmp);
    })
    return promise;

};


module.exports.getEmployeesByManager = function (managerBool) {
   
    var locEmp = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].isManager == managerBool) {
               locEmp.push(employees[i]);
           }
       }

       if(locEmp.length === 0) {
        var err = "getEmployeesByManager() does not have any data.";
        reject({message: err});
       }  

    resolve (locEmp);
    })
    return promise;

};

// module.exports.addEmployee = function (employeeData) {

//     var promise = new Promise((resolve, reject) => {
        
//        if (typeof employeeData.isManager === "undefined") {
//             employeeData.isManager = false;
//        } else {
//             employeeData.isManager = true;
//        }

//        employeeData.employeeNum = employees.length + 1;
//        employees.push(employeeData);
        
//      resolve (employees);
//      })
//      return promise;

// };
