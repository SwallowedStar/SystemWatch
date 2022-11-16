const { ComputerController, CoreController, MonitorController, CPUController, CoreStatusController } = require("../controllers")
const { Computer, Core, CPU, Monitor, CoreStatus } = require("../models")

function isObject(object) {
    return object != null && typeof object === 'object';
}

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}

async function testCoreController() {
    const computerID = 1
    const results = {}

    console.log("======== STARTING TESTS FOR CORE CONTROLLER ========")

    console.log("==== CoreController.create")
    const createResponse = await CoreController.create(1)
    console.log(createResponse)
    results["CoreController.create"] = createResponse instanceof Core

    console.log("==== CoreController.delete")
    const deleted = await CoreController.delete(createResponse.idCore)
    console.log(deleted)
    results["CoreController.delete"] = deleted !== null && deleted[0].affectedRows == 1

    return results
}

async function testComputerController() {

    const results = {}
    console.log("======== STARTING TESTS FOR COMPUTER CONTROLLER ========")

    const computerName = "Testcomputer"
    const GPUname = "Test GPU"
    const amountRAM = 6000000000
    const amountVRAM = 6000000000
    const CPUid = 1

    console.log("==== ComputerController.create")
    let computer = await ComputerController.create(computerName, GPUname, amountRAM, amountVRAM, CPUid)
    console.log(computer)
    results["ComputerController.create"] = computer instanceof Computer

    let cpu = await CPUController.get(computer.CPUid)
    console.log(cpu)
    for (let i = 0; i < cpu.coreNumber; i++) {
        await CoreController.create(computer.computerID)
    }

    console.log("==== ComputerController.get")
    let computerGet = await ComputerController.get(computer.computerID)
    results["ComputerController.get"] = deepEqual(computerGet, computer)
    console.log(computerGet)

    console.log("==== ComputerController.getComplete")
    let computerComplete = await ComputerController.getComplete(computer.computerID)
    results["ComputerController.getComplete"] = computerComplete instanceof Computer && computerComplete.cores.length == cpu.coreNumber
    console.log("modelclass here", computerComplete)


    console.log("==== ComputerController.delete")
    let deleted = await ComputerController.delete(computer.computerID)
    results["ComputerController.delete"] = deleted !== null && deleted[0].affectedRows == 1
    console.log(deleted)

    return results
}

async function testMonitorController() {
    const results = {}

    console.log("======== STARTING TESTS FOR MONITOR CONTROLLER ========")

    const time = new Date('2018-09-22 15:00:00').toISOString().slice(0, 19).replace('T', ' ')
    const time2 = new Date('2018-09-22 16:00:00').toISOString().slice(0, 19).replace('T', ' ')
    const computerID = 1

    console.log("==== MonitorController.create")
    let res = await MonitorController.create(time, computerID, 500000, 540, 300, 60.5, 3500, 50000, 30.6)
    console.log(res)
    results["MonitorController.create"] = res instanceof Monitor

    console.log("==== MonitorController.get")
    let getResult = await MonitorController.get(time, computerID)
    console.log(res)
    results["MonitorController.get"] = res instanceof Monitor && deepEqual(res, getResult)

    console.log("==== MonitorController.getComputerActivityBetween")
    let secondRes = await MonitorController.create(time2, computerID, 500000, 540, 300, 60.5, 3500, 50000, 30.6)

    let activity = await MonitorController.getComputerActivityBetween(computerID, time, time2)
    console.log(activity)
    results["MonitorController.getComputerActivityBetween"] = activity.length > 1

    console.log("==== MonitorController.delete")
    let deleted = await MonitorController.delete(res.time, res.computerID)
    console.log(deleted)
    results["MonitorController.delete"] = deleted !== null && deleted[0].affectedRows == 1

    let deleted2 = await MonitorController.delete(secondRes.time, secondRes.computerID)
    console.log(deleted2)

    return results
}

async function testCPUController(){
    const CPUname = "Intel i5-3 @ 3.800GHz"
    const coreNumber = 4
    const minFrequency = 0
    const maxFrequency = 3400000000

    const results = {}

    console.log("======== STARTING TESTS FOR CPU CONTROLLER ========")

    console.log("==== CPUController.create")
    const createResponse = await CPUController.create(CPUname, coreNumber, minFrequency, maxFrequency)
    console.log(createResponse)
    results["CPUController.create"] = createResponse instanceof CPU

    console.log("==== CPUController.get")
    const getResponse = await CPUController.get(createResponse.CPUid)
    console.log(getResponse)
    results["CPUController.get"] = getResponse instanceof CPU && deepEqual(getResponse, createResponse)
    
    console.log("==== CPUController.delete")
    const deleted = await CPUController.delete(createResponse.CPUid)
    console.log(deleted)
    results["CPUController.delete"] = deleted !== null && deleted[0].affectedRows == 1

    return results
}


async function testCoreStatusController(){
    const time = new Date('2018-09-22 15:00:00').toISOString().slice(0, 19).replace('T', ' ')
    const time2 = new Date('2018-09-22 16:00:00').toISOString().slice(0, 19).replace('T', ' ')
    const computerID = 1
    const idCore = 1
    const coreFrequency = 2000000000
    const coreTemp = 32.1

    const results = {}

    console.log("======== STARTING TESTS FOR CORESTATUS CONTROLLER ========")

    await MonitorController.create(time, computerID, 500000, 540, 300, 60.5, 3500, 50000, 30.6)
    await MonitorController.create(time2, computerID, 500000, 540, 300, 60.5, 3500, 50000, 30.6)

    console.log("==== CoreStatusController.create")
    const createResponse = await CoreStatusController.create(time, computerID, idCore, coreFrequency, coreTemp)
    console.log(createResponse)
    results["CoreStatusController.create"] = createResponse instanceof CoreStatus

    console.log("==== CoreStatusController.getComputerActivityBetween")
    await CoreStatusController.create(time2, computerID, idCore, coreFrequency, coreTemp)
    let secondRes = await CoreStatusController.getComputerActivityBetween(computerID, time, time2)
    console.log(secondRes)

    console.log("==== CoreStatusController.delete")
    const deleted = await CoreStatusController.delete(createResponse.time, createResponse.computerID, createResponse.idCore)
    console.log(deleted)
    results["CoreStatusController.delete"] = deleted !== null && deleted[0].affectedRows == 1
    await MonitorController.delete(createResponse.time, createResponse.computerID)

    await CoreStatusController.delete(time2, computerID, idCore)
    await MonitorController.delete(time2, computerID)

    return results
}

function testModel() {
    console.log("======== STARTING TESTS FOR MODELS ========")

}

module.exports = {
    testComputerController: testComputerController,
    testCoreController: testCoreController,
    testMonitorController: testMonitorController,
    testCPUController: testCPUController,
    testCoreStatusController: testCoreStatusController
}

