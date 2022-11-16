const { pool } = require("../database");
const { CoreStatus } = require("../models");

const CoreStatusController = {}

CoreStatusController.create = async (time, computerID, idCore, coreFrequency, coreTemp) => {
    let success = true
    const response = await pool.execute("INSERT INTO corestatus (time, computerID, idCore, coreFrequency, coreTemp) VALUES (?,?,?,?,?)", 
    [time, computerID, idCore, coreFrequency, coreTemp])
    .catch(e=> {
        success = false
        return {
            "error" : e.sqlMessage,
            "fullerror" : e
        }
    }) 

    if(success){
        return new CoreStatus(
            time, 
            computerID, 
            idCore, 
            coreFrequency, 
            coreTemp
        )
    }

    return response
}

CoreStatusController.delete = async (time, computerID, idCore)  => {
    console.log(time, computerID, idCore)
    const response = await pool.execute("DELETE FROM corestatus WHERE time = ? and computerID = ? and idCore = ?", 
    [time, computerID, idCore])
    .catch(e=> {
        return {
            "error" : e.sqlMessage
        }
    })
    return response
}

CoreStatusController.getComputerActivityBetween = async (computerID, start, stop) => {
    const result = await pool.execute("SELECT * FROM corestatus WHERE computerID = ? AND time BETWEEN ? AND ? ORDER BY time ASC", [computerID, start, stop])

    const coresStatus = []
    for(let cs of result[0]){
        coresStatus.push(CoreStatus.load(cs))
    }

    return coresStatus
}

module.exports = CoreStatusController