
class Computer {
    constructor(computerID, computerName, GPUname, amountRAM, amountVRAM, CPUid){
        this.computerID = computerID,
        this.computerName = computerName
        this.GPUname = GPUname
        this.amountRAM = amountRAM
        this.amountVRAM = amountVRAM
        this.CPUid = CPUid

        this.CPU = null
        this.cores = []
    }

    static load(computer){
        return new Computer(
            computer.computerID,
            computer.computerName,
            computer.GPUname,
            computer.amountRAM,
            computer.amountVRAM,
            computer.CPUid
        )
    }

    setCPU(cpu){
        this.CPU = cpu
    }

    addCore(core) {
        this.cores.push(core)
    } 
}

class CPU {
    constructor(CPUid, CPUname, coreNumber, minFrequency, maxFrequency){
        this.CPUid = CPUid
        this.CPUname = CPUname
        this.coreNumber = coreNumber
        this.minFrequency = minFrequency 
        this.maxFrequency = maxFrequency
    }

    static load(cpu){
        return new CPU(
            cpu.CPUid,
            cpu.CPUname,
            cpu.coreNumber,
            cpu.minFrequency,
            cpu.maxFrequency
        )
    }
}

class Core{
    constructor(idCore, computerID){
        this.idCore = idCore
        this.computerID = computerID
    }
    static load(core){
        return new Core(
            core.idCore,
            core.computerID
        )
    }
}

class Monitor{
    constructor(time, computerID, RAMusage, nbThreads, nbProcesses, GPUtemp, CPUfreq, VRAMusage, fanSpeed){
        this.time = time
        this.computerID = computerID
        this.RAMusage = RAMusage
        this.nbThreads = nbThreads
        this.nbProcesses = nbProcesses
        this.GPUtemp = GPUtemp
        this.CPUfreq = CPUfreq
        this.VRAMusage = VRAMusage
        this.fanSpeed = fanSpeed

        this.coresStatus = []
    }

    static load(monitor){
        return new Monitor(
            monitor.time,
            monitor.computerID,
            monitor.RAMusage,
            monitor.nbThreads,
            monitor.nbProcesses,
            monitor.GPUtemp,
            monitor.CPUfreq,
            monitor.VRAMusage,
            monitor.fanSpeed
        )
    }

    addCoreStatus(coreStatus){
        this.coresStatus.push(coreStatus)
    }
}

class CoreStatus {
    constructor(time, computerID, idCore, coreFrequency, coreTemp){
        this.time = time
        this.computerID = computerID
        this.idCore = idCore
        this.coreFrequency = coreFrequency,
        this.coreTemp = coreTemp
    }
    static load (coreStatus){
        return new CoreStatus(
            coreStatus.time,
            coreStatus.computerID,
            coreStatus.idCore,
            coreStatus.coreFrequency,
            coreStatus.coreTemp,
        )
    }
}

module.exports = {
    Computer: Computer,
    CPU: CPU,
    Core: Core,
    Monitor: Monitor, 
    CoreStatus: CoreStatus
}