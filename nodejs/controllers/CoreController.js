const { pool } = require("../database");
const { Core } = require("../models");
const Controller = require("./Controller");


// ================ CORE CONTROLLER ================

const CoreController = new Controller(Core)

module.exports = CoreController