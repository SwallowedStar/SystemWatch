const {ComputerController, CPUController, MonitorController, CoreStatusController} = require("../controllers")
const express = require("express")
const { Computer, CPU, Monitor, Core, CoreStatus } = require("../models")
const { getMissingProperties, isValidDate } = require("../utils")
const io = require("../app")

const apiRouter = express.Router()

async function createEntry(model, controller, req){
    let missingProperties = getMissingProperties(model.dbProperties, req.body)
    if(missingProperties.length == 0){
        return await controller.create(req.body)
    } else {
        return {
            "error" : `Folowing properties are missing: ${missingProperties.join()}`
        }
    }
}


apiRouter.get("/ping", function(req, res){
    res.json({
        status: "OK",
        timestamp: (new Date()).getTime()
    })
})

// Creates a computer
apiRouter.post("/computer", async (req, res) => {
    res.json(await createEntry(Computer, ComputerController, req))
})

// Create a computer, a CPU and all the computer cores.
apiRouter.post("/computer/complete", async (req, res) => {
    const neededComputerProperties = ["computerName", "GPUname", "amountRAM", "amountVRAM", "osName", "CPU"]
    const neededCPUProperties = ["CPUname", "coreNumber", "minFrequency", "maxFrequency"]

    let finish = false

    for(let computerProperty of neededComputerProperties){
        if(req.body[computerProperty] === undefined && !finish){
            finish = true
            res.json({
                "error": `missing : ${computerProperty}`
            })
            break
        }
    }

    if(!finish){
        for(let CPUproperty of neededCPUProperties){
            if(req.body.CPU[CPUproperty] === undefined && !finish){
                finish = true
                res.json({
                    "error": `missing : ${CPUproperty}`
                })
                break
            }
        }
    }
    if(!finish){
        res.json(await ComputerController.createComplete(req.body))
    }
})

// Get the computer
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

// Find the computer with it's name
apiRouter.get("/computer/find/:computerName", async (req, res) => {
    const foundComputer = await ComputerController.find(req.params.computerName)
    if(foundComputer["error"] !== undefined){
        res.json(foundComputer)
    } else {
        const fullComputer = await ComputerController.getComplete(foundComputer.computerID)
        res.json( fullComputer )
    }
})

// Get the computer, it's CPU and all it's cores
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

// Get all the computers 
apiRouter.get("/computers", async (req, res) => {
    res.json(await ComputerController.all())
})

// Delete computer
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

// Create a CPU
apiRouter.post("/cpu", async (req, res) => {
    res.json(await createEntry(CPU, CPUController, req))
})

// Get all the CPUs
apiRouter.get("/cpus", async (req, res) => {
    res.json(await CPUController.all())
})

// Get a CPU
apiRouter.get("/cpu/:CPUid", async (req, res) => {
    const id = parseInt(req.params.CPUid)
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else {
        res.json( await CPUController.get(req.params))
    }
})

// Delete a CPU
apiRouter.delete("/cpu/:CPUid", async (req, res) => {
    const id = parseInt(req.params.CPUid)
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else {
        res.json( await CPUController.delete(req.params))
    }
})

// Create a monitor
apiRouter.post("/monitor", async (req, res) => {
    const response = await createEntry(Monitor, MonitorController, req)
    if(response["error"] === undefined){
        io.to("" + response.computerID).emit("monitorchannel", JSON.stringify(response))
    }
    res.json(response)
})

// Get all the monitors
apiRouter.get("/monitors", async (req, res) => {
    res.json(await MonitorController.all())
})

// Deletes a monitor
apiRouter.delete("/monitor/:computerID/:date/:time", async (req, res) => {
    
    const id = parseInt(req.params.computerID)
    req.params.time = req.params.date + " " + req.params.time
    const date = new Date(req.params.time)
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else if (!isValidDate(date) || date.toString() == "Invalid Date"){
        res.json({
            "error" : "wrong date format"
        })
    } else {
        res.json( await MonitorController.delete(req.params))
    }
})

// Get all the monitors between 2 dates
apiRouter.get("/monitor/interval/:computerID/:startDate/:startTime/:finishDate/:finishTime", async (req, res) => {
    const id = parseInt(req.params.computerID)
    
    const startString = req.params.startDate + " " + req.params.startTime
    const finishString = req.params.finishDate + " " + req.params.finishTime

    const start = new Date(startString)
    const finish = new Date(finishString)
    
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else if (!isValidDate(start) || start.toString() == "Invalid Date") {
        res.json({
            "error" : "the start date isn't in the right format : YYYY-MM-DD/hh:mm:ss.00"
        })
    } else if (!isValidDate(finish) || finish.toString() == "Invalid Date" ) {
        res.json({
            "error" : "the finish date isn't in the right format : YYYY-MM-DD hh:mm:ss.00"
        })
    }
    else {
        res.json( await MonitorController.getComputerActivityBetween(id, startString, finishString))
    }
})

// Create core status
apiRouter.post("/corestatus", async (req, res) => {
    const response = await createEntry(CoreStatus, CoreStatusController, req)
    if(response["error"] === undefined){
        io.to("" + response.computerID).emit("corestatuschannel", JSON.stringify(response))
    }
    
    res.json(response)
})

// Get all corestatus between 2 time
apiRouter.get("/corestatus/interval/:computerID/:startDate/:startTime/:finishDate/:finishTime", async (req, res) => {
    const id = parseInt(req.params.computerID)
    
    const startString = req.params.startDate + " " + req.params.startTime
    const finishString = req.params.finishDate + " " + req.params.finishTime

    const start = new Date(startString)
    const finish = new Date(finishString)
    
    if(isNaN(id)){
        res.json({
            "error" : "the id must be an int"
        })
    } else if (!isValidDate(start) || start.toString() == "Invalid Date") {
        res.json({
            "error" : "the start date isn't in the right format : YYYY-MM-DD/hh:mm:ss.00"
        })
    } else if (!isValidDate(finish) || finish.toString() == "Invalid Date" ) {
        res.json({
            "error" : "the finish date isn't in the right format : YYYY-MM-DD hh:mm:ss.00"
        })
    }
    else {
        res.json( await CoreStatusController.getComputerActivityBetween(id, startString, finishString))
    }
})

// Delete a corestatus
apiRouter.delete("/corestatus/:computerID/:idCore/:date/:time", async (req, res) => {
    
    const id = parseInt(req.params.computerID)
    const idCore = parseInt(req.params.idCore)
    req.params.time = req.params.date + " " + req.params.time
    const date = new Date(req.params.time)
    if(isNaN(id)){
        res.json({
            "error" : "the computer id must be an int"
        })
    } else if (isNaN(idCore)) {
        res.json({
            "error" : "the core id must be an int"
        })
    } else if (!isValidDate(date) || date.toString() == "Invalid Date"){
        res.json({
            "error" : "wrong date format"
        })
    } else {
        res.json( await CoreStatusController.delete(req.params))
    }
})

// All the rest returns 404 error
apiRouter.get('*', (req, res) => {
    res.status(404).send('Non-existing route');
});

module.exports = apiRouter