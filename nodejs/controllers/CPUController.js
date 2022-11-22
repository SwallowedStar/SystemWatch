const { pool } = require("../database");
const { CPU } = require("../models");
const Controller = require("./Controller");

// ================ CPU CONTROLLER ================

const CPUController = new Controller(CPU)

// Finds computer by name
CPUController.find = async (CPUname) => {
    const result = await pool.execute( `SELECT * FROM cpu where CPUname = ?`, [CPUname])
    if (result[0][0] === undefined){
        return {
            "error" : `Couldn't find cpu with name: ${CPUname}`
        }
    }
    return CPU.load(result[0][0])
}

module.exports = CPUController