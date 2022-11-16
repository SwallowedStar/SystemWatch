const { pool } = require("../database")
const { Computer, Core, CPU } = require("../models")

// ================ COMPUTER CONTROLLER ================ 

const ComputerController = {}

ComputerController.create = async(computerName, GPUname, amountRAM, amountVRAM, CPUid) => {

    // INSERT INTO computer (computerName, GPUname, amountRAM, amountVRAM, CPUid) VALUES (?, ?, ?, ?, ?)
    let response = null
    let success = true
    
    response = await pool.execute("INSERT INTO computer (computerName, GPUname, amountRAM, amountVRAM, CPUid) VALUES (?, ?, ?, ?, ?)", 
    [computerName, GPUname, amountRAM, amountVRAM, CPUid])
    .catch(e=>{
        success = false
        return {
            "error": e.sqlMessage
        }
    })

    if(success){
        const computerID = response[0].insertId
        const computer = new Computer(
            computerID,
            computerName,
            GPUname,
            amountRAM,
            amountVRAM,
            CPUid
        )

        // We then create all the cores for this machine
        // TODO: automatically create the cores when a machine is added
        // eather here or in pure sql
        return computer
    }
    return response
}

ComputerController.all = async () => {
    const result = await pool.query("SELECT * FROM computer")
    let computers = []
    for(let r of result){
        computers.push(Computer.load(r))
    }
    return computers
}

ComputerController.find = async (computerName) => {
    // SELECT * from computer where computerName = computerName
    const result = await pool.execute("SELECT * FROM computer where computerName=?", [computerName])
    if (result[0][0] === undefined){
        return null
    }
    return Computer.load(result[0][0])
}

ComputerController.get = async (computerId) => {
    const result = await pool.execute("SELECT * from computer where computerID=?", [computerId])
    if (result[0][0] === undefined){
        return null
    }
    return Computer.load(result[0][0])
}

ComputerController.getComplete = async (computerId) => {
    // SELECT * from computer c join cpu c2 on c.CPUid = c2.CPUid join core c3 on c.computerID = c3.computerID where c.computerID = 1
    const result = await pool.execute("SELECT * from computer c join cpu c2 on c.CPUid = c2.CPUid join core c3 on c.computerID = c3.computerID where c.computerID = ?", [computerId])
    
    if (result[0][0] === undefined){
        return null
    }
    let computer = Computer.load(result[0][0])
    for (let r of result[0]){
        let core = Core.load(r)
        computer.addCore(core)
    }
    computer.setCPU(CPU.load(result[0][0]))
    return computer
}

ComputerController.delete = async (computerID) => {
    const response = pool.execute("DELETE FROM computer WHERE computerID=?", [computerID])
    .catch(e=>{
        return {
            "error" : e.sqlMessage
        }
    })
    return response
}


module.exports = ComputerController