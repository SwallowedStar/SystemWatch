const { pool } = require("../database");
const { CoreStatus } = require("../models");
const Controller = require("./Controller");

const CoreStatusController = new Controller(CoreStatus)

// get all teh cores status between 2 timestamp
CoreStatusController.getComputerActivityBetween = async (computerID, start, stop) => {
    const result = await pool.execute("SELECT * FROM corestatus WHERE computerID = ? AND time BETWEEN ? AND ? ORDER BY time ASC", [computerID, start, stop])

    const coresStatus = []
    for(let cs of result[0]){
        coresStatus.push(CoreStatus.load(cs))
    }

    return coresStatus
}

module.exports = CoreStatusController