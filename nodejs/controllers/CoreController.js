const { pool } = require("../database");
const { Core } = require("../models");

// ================ CORE CONTROLLER ================

const CoreController = {}

CoreController.create = async (computerID) => {
    let success = true
    const result = await pool.execute("INSERT INTO core (computerID) VALUES (?)", 
    [computerID])
    .catch(e=> {
        success = false
        return {
            "error": e.sqlMessage
        }
    })
    if(success){
        const idCore = result[0].insertId
        return new Core(
            idCore, 
            computerID
        )
    }
    return result
}

CoreController.get = async (coreID) => {
    const result = await pool.execute("SELECT * from core where idCore=?", [coreID])
    if(result[0][0] === undefined){
        return null
    }
    return Core.load(result[0][0])
}


CoreController.delete = async (idCore) => {
    const result = await pool.execute("DELETE FROM core where idCore = ?", [idCore])
    .catch(e => {
        return {
            "error" : e.sqlMessage
        }
    })

    return result
}

module.exports = CoreController