
// const employees = require("./data/employees.json");
// const departments = require("./data/departments.json");
//import * as fs from 'fs/promises';

var employees = [];
var departments = [];
var fs = require("fs");

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

// function getManagers () {
//     return employees.filter(employee => {
//         return employee.isManager == true;
//     });
// }