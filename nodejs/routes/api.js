const {ComputerController} = require("../controllers")
const express = require("express")
const { Computer } = require("../models")
const { getMissingProperties } = require("../utils")

const apiRouter = express.Router()

// All routes will be here

apiRouter.get("/ping", function(req, res){
    res.json({
        status: "OK",
        timestamp: (new Date()).getTime()
    })
})

apiRouter.post("/computer", async (req, res) => {
    let missingProperties = getMissingProperties(Computer.dbProperties, req.body)
    if(missingProperties.length == 0){
        res.json(await ComputerController.create(req.body))
    } else {
        res.json({
            "error" : `Folowing properties are missing: ${missingProperties.join()}`
        })
    }
})

apiRouter.get("/computer/:computerID", async (req, res) => {
    const id = parseInt(req.params.computerID)
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else {
        res.json( await ComputerController.get(req.params))

    }
})

apiRouter.get("/computer/find/:computerName", async (req, res) => {
    res.json( await ComputerController.find(req.params.computerName) )
})

apiRouter.get("/computer/complete/:computerID", async (req, res) => {
    const id = parseInt(req.params.computerID)
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else {
        res.json( await ComputerController.getComplete(req.params.computerID))
    }
})

apiRouter.get("/computers", async (req, res) => {
    res.json(await ComputerController.all())
})

apiRouter.delete("/computer/:computerID", async (req, res) => {
    const id = parseInt(req.params.computerID)
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else {
        res.json( await ComputerController.delete(req.params))
    }
    
})

// post addComputer(computerName : str, GPUName : str, OSname: str, amountRAM: int, amountVRAM : int)
// Adds a computer to the database and returns it's entry

// post addCPU( CPUName : str ) -> returns the newly created CPU
// adds a new CPU model to the list and returns the entry

// post addCore( computerID )
// adds a new Core to a machine

// post addInputTime( time : datetime, computerID : int, RAMUsage : int, nbThreads : Int, nbProcesses, GPUTemp : float, GPUUsage : int, VRAMUsage: int, fanSpeed: int)
// adds a new entry to the input time. It also sends the info to the socket

// post addCoreStatus (time : datetime, computerID : int, idCore : int, coreFreq : float, coreTemp : int)
// adds a new core status to the list. It also sends the info to the socket

// get getComputer( computerName : str )
// gets all the infos from the "Computer" table and returns it.
// If the computer doesn't exist, an error with be thrown

// get getCompleteComputer ( computerName : str )
// this will get the "computer" table, but also the "CPU" and "CPUCore" attached to it
// If the computer doesn't exist, an error with be thrown

// get getComputerCores ( computerID : int )
// gets the cores that are linked to the specific computerID

// get getComputerCPU (computerID : int)
// gets all the infos on the Computer CPU

// get getTimeInterval(computerID, start: datetime, stop: datetime)


// get getComputers()
// gets all the computers stored into the database

// get getCPUs()
// get gets all the cpus stored in the database

module.exports = apiRouter