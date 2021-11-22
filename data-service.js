const Sequelize = require('sequelize');

var sequelize = new Sequelize('d70rqs2p6ufuo9', 'eiuozpqlhxfuwz', '997129cf7ab43d2c27216484e0676d3458055136626e2ea02e563a9c4b3ca03a', {
    host: 'ec2-35-169-49-157.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
});


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.log('Unable to connect to the database:', err);
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING,
});


// var fs = require("fs");
// var employees = [];
// var departments = [];

module.exports.addEmployee = function (employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            for (let x in employeeData) {
                if (employeeData[x] == "") {
                    employeeData[x] = null;
                }
            }
            resolve(Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                isManager: employeeData.isManager,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }));
        }).catch(() => {
            reject("unable to create employee.");
        });
    }).catch(() => {
        reject("unable to create employee.");
    });
};

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then((Employee) => {
                resolve();
            }).then((Department) => {
                resolve();
            }).catch((err) => {
                reject("unable to sync the database");
            });
        reject();
    });
};

module.exports.getAllEmployees = function () {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.findAll());
        }).catch((err) => {
            reject("no results returned.");
        });
    });

};

module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Department.findAll());
        }).catch((err) => {
            reject("no results returned.");
        });
    });
};

module.exports.getEmployeeByNum = function (num) {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where: {
                    employeeNum: num
                }
            }));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
};


module.exports.getEmployeesByStatus = function (statusId) {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where: {
                    status: statusId
                }
            }));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
};

module.exports.getEmployeesByDepartment = function (departmentId) {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where: {
                    department: departmentId
                }
            }));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
};


module.exports.getEmployeesByManager = function (managerBool) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where: {
                    employeeManagerNum: managerBool
                }
            }));
        }).catch((err) => {
            reject("no results returned.");
        });
    });

};

module.exports.updateEmployee = function (employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            for (let x in employeeData) {
                if (employeeData[x] == "") {
                    employeeData[x] = null;
                }
            }
            resolve(Employee.update({
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                addressPostal: employeeData.addressPostal,
                addressState: employeeData.addressPostal,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department
            }, {
                where: {
                    employeeNum: employeeData.employeeNum
                }
            }));
        }).catch(() => {
            reject("unable to create employee.");
        });
    });
};

module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            for (let i in departmentData) {
                if (departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }
            Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            }).then(() => {
                resolve(Department);
            }).catch((err) => {
                reject("unable to create department");
            });
        }).catch(() => {
            reject("unable to create department");
        });
    });
}

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            for (let i in departmentData) {
                if (departmentData[i] == "") {
                    departmentData[i] = null;
                }
            }
            Department.update({
                departmentName: departmentData.departmentName
            }, {
                where: {
                    departmentId: departmentData.departmentId
                }
            }).then(() => {
                resolve(Department);
            }).catch((err) => {
                reject("unable to update department");
            });
        }).catch(() => {
            reject("unable to update department");
        });
    });
}

module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Department.findAll({
                where: {
                    departmentId: id
                }
            }));
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.deleteDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Department.destroy({
                where: {
                    departmentId: id
                }
            }));
        }).catch((err) => {
            reject();
        });
    });
}

module.exports.deleteEmployeeById = function (id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve(Employee.destroy({
                where: {
                    employeeNum: empNum
                }
            }));
        }).catch((err) => {
            reject();
        });
    });
}
