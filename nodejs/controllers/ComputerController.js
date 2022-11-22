const { pool } = require("../database")
const { Computer, Core, CPU } = require("../models")
const Controller = require("./Controller")
const CPUController = require("./CPUController")
const CoreController = require("./CoreController")

// ================ COMPUTER CONTROLLER ================ 

const ComputerController = new Controller(Computer)

// Finds computer by name
ComputerController.find = async (computerName) => {
    const result = await pool.execute("SELECT * FROM computer where computerName = ?", [computerName])
    if (result[0][0] === undefined){
        return {
            "error" : `Couldn't find computer with name: ${computerName}`
        }
    }
    return Computer.load(result[0][0])
}

// get the entry from the computer table and associates it with it's CPU and Cores
ComputerController.getComplete = async (computerId) => {
    const result = await pool.execute("SELECT * from computer c join cpu c2 on c.CPUid = c2.CPUid join core c3 on c.computerID = c3.computerID where c.computerID = ?", [computerId])
    
    if (result[0][0] === undefined){
        return {
            "error" : `Computer with id:${computerId} not found`
        }
    }
    let computer = Computer.load(result[0][0])
    for (let r of result[0]){
        let core = Core.load(r)
        computer.addCore(core)
    }
    computer.setCPU(CPU.load(result[0][0]))
    return computer
}

ComputerController.createComplete = async(computer) => {
    let cpuExists = true

    let cpu = await CPUController.find(computer.CPU.CPUname)
    if(cpu["error"] !== undefined){
        cpuExists = false
    }

    if(!cpuExists){
        cpu = await CPUController.create(computer.CPU)

        if(cpu["error"] !== undefined){
            return cpu
        }
    }
    computer.CPUid = cpu.CPUid

    let newComputer = await ComputerController.create(computer)
    if(newComputer["error"] !== undefined){
        await pool.execute("ROLLBACK;")
        return newComputer
    }

    for(let i = 0; i<cpu.coreNumber; i++){
        let newCore = await CoreController.create({"computerID" : newComputer.computerID})
        if(newCore["error"] !== undefined){
            return newCore
        }
    }

    return ComputerController.getComplete(newComputer.computerID)
}

module.exports = ComputerController