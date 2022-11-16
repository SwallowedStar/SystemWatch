const { pool } = require("../database");
const { CPU } = require("../models");

// ================ CPU CONTROLLER ================

const CPUController = {}

CPUController.get = async (CPUid) => {
    let result = await pool.execute("SELECT * FROM cpu WHERE CPUid=?", [CPUid])
    .catch(e=> {
        return {
            "error": e.sqlMessage
        }
    })
    if(result[0][0] === undefined){
        return null
    }
    return CPU.load(result[0][0])
}

CPUController.create = async (CPUname, coreNumber, minFrequency, maxFrequency) => {
    let success = true
    let response = await pool.execute("INSERT INTO cpu (CPUname, coreNumber, minFrequency, maxFrequency) VALUES (?,?,?,?)", 
    [CPUname, coreNumber, minFrequency, maxFrequency])
    .catch(e=> {
        success = false
        return {
            "error" : e.sqlMessage
        }
    })
    if(success){
        const CPUid = response[0].insertId
        const cpu = new CPU(
            CPUid,
            CPUname,
            coreNumber,
            minFrequency,
            maxFrequency
        )
        return cpu
    }
    return response
}


CPUController.delete = async (CPUid) => {
    const response = await pool.execute("DELETE FROM cpu WHERE CPUid = ?", [CPUid])
    .catch(e=>{
        return {
            "error" : e.sqlMessage
        }
    })
    return response
}

module.exports = CPUController