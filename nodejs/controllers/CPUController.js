const { pool } = require("../database");
const { CPU } = require("../models");
const Controller = require("./Controller");

// ================ CPU CONTROLLER ================

const CPUController = new Controller(CPU)

module.exports = CPUController