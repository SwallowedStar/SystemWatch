const { pool } = require("../database");
const { Monitor } = require("../models");

// ================ MONITOR CONTROLLER ================


const MonitorController = {}

MonitorController.create = async (time, computerID, RAMusage, nbThreads, nbProcesses, GPUtemp, CPUfreq, VRAMusage, fanSpeed) => {
    let success = true

    const result = await pool.execute("INSERT INTO monitor (time, computerID, RAMusage, nbThreads, nbProcesses, GPUtemp, CPUfreq, VRAMusage, fanSpeed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [time, computerID, RAMusage, nbThreads, nbProcesses, GPUtemp, CPUfreq, VRAMusage, fanSpeed])
    .catch(e=>{
        success = false
        return {
            "error" : e.sqlMessage,
            "fullerror" : e
        }
    })

    if(success){
        return new Monitor(time, computerID, RAMusage, nbThreads, nbProcesses, GPUtemp, CPUfreq, VRAMusage, fanSpeed)
    }
    return result
}

MonitorController.delete = async (time, computerID)  => {
    const result = await pool.execute("DELETE FROM monitor where time = ? and computerID = ?", [time, computerID])
    .catch(e=> {
        return {
            "error" : e.sqlMessage
        }
    })
    return result
}

MonitorController.get = async (time, computerID) => {
    

    const result = await pool.execute("SELECT * FROM monitor where time=? and computerID = ?", [time, computerID])
    if(result[0][0] === undefined){
        return null
    }
    return Monitor.load(result[0][0])
}

MonitorController.getComputerActivityBetween = async (computerId, start, finish) => {
    const result = await pool.execute("SELECT * FROM monitor WHERE computerID=? and time between ? and ? ORDER BY time asc", [computerId, start, finish])

    const monitors = []
    for(let m of result[0]){
        monitors.push(Monitor.load(m))
    }

    return monitors
}


module.exports = MonitorController