const { pool } = require("../database");
const { Monitor } = require("../models");
const Controller = require("./Controller");

// ================ MONITOR CONTROLLER ================


const MonitorController = new Controller(Monitor)

MonitorController.getComputerActivityBetween = async (computerId, start, finish) => {
    const result = await pool.execute("SELECT * FROM monitor WHERE computerID=? and time between ? and ? ORDER BY time asc", [computerId, start, finish])

    const monitors = []
    for(let m of result[0]){
        monitors.push(Monitor.load(m))
    }

    return monitors
}


module.exports = MonitorController