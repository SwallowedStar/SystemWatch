const Model = require("./Model")

class Computer extends Model{
    static dbProperties = ["computerName", "GPUname", "amountRAM", "amountVRAM", "CPUid", "osName"]
    static autoCompleteProperty = "computerID"
    static idProperties = ["computerID"]
    constructor(computerID, computerName, GPUname, amountRAM, amountVRAM, CPUid, osName){
        super(Computer)
        this.computerID = computerID,
        this.computerName = computerName
        this.GPUname = GPUname
        this.amountRAM = amountRAM
        this.amountVRAM = amountVRAM
        this.CPUid = CPUid
        this.osName = osName

        this.CPU = null
        this.cores = []
    }
    setCPU(cpu){
        this.CPU = cpu
    }

    addCore(core) {
        this.cores.push(core)
    } 
}

class CPU extends Model{
    static dbProperties = ["CPUname", "coreNumber", "minFrequency", "maxFrequency"]
    static autoCompleteProperty = "CPUid"
    static idProperties = ["CPUid"]
    constructor(CPUid, CPUname, coreNumber, minFrequency, maxFrequency){
        super(CPU)
        this.CPUid = CPUid
        this.CPUname = CPUname
        this.coreNumber = coreNumber
        this.minFrequency = minFrequency 
        this.maxFrequency = maxFrequency
    }
}

class Core extends Model{
    static dbProperties = ["computerID"]
    static autoCompleteProperty = "idCore"
    static idProperties = ["idCore"]
    constructor(idCore, computerID){
        super(Core)
        this.idCore = idCore
        this.computerID = computerID
    }
}

class Monitor extends Model{
    static dbProperties = ["time", "computerID", "RAMusage", "nbThreads", "nbProcesses", "GPUtemp", "CPUfreq", "VRAMusage", "electricalConsumption"]
    static idProperties = ["time", "computerID"]
    constructor(time, computerID, RAMusage, nbThreads, nbProcesses, GPUtemp, CPUfreq, VRAMusage, electricalConsumption){
        super(Monitor)
        this.time = time
        this.computerID = computerID
        this.RAMusage = RAMusage
        this.nbThreads = nbThreads
        this.nbProcesses = nbProcesses
        this.GPUtemp = GPUtemp
        this.CPUfreq = CPUfreq
        this.VRAMusage = VRAMusage
        this.electricalConsumption = electricalConsumption

        this.coresStatus = []
    }

    addCoreStatus(coreStatus){
        this.coresStatus.push(coreStatus)
    }

}

class CoreStatus extends Model{
    static dbProperties = ["time", "computerID", "idCore", "coreFrequency", "coreTemp"] 
    static idProperties = ["time", "computerID", "computerID"]
    constructor(time, computerID, idCore, coreFrequency, coreTemp){
        super(CoreStatus)
        this.time = time
        this.computerID = computerID
        this.idCore = idCore
        this.coreFrequency = coreFrequency,
        this.coreTemp = coreTemp
    }
}

module.exports = {
    Computer: Computer,
    CPU: CPU,
    Core: Core,
    Monitor: Monitor, 
    CoreStatus: CoreStatus
}