const {ComputerController, CPUController, MonitorController, CoreStatusController} = require("../controllers")
const express = require("express")
const { Computer, CPU, Monitor, Core, CoreStatus } = require("../models")
const { getMissingProperties, isValidDate } = require("../utils")

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

apiRouter.post("/computer", async (req, res) => {
    res.json(await createEntry(Computer, ComputerController, req))
})

apiRouter.post("/computer/complete", async (req, res) => {
    const neededComputerProperties = ["computerName", "GPUname", "amountRAM", "amountVRAM", "CPU"]
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
        res.json(await  ComputerController.createComplete(req.body))
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


apiRouter.post("/cpu", async (req, res) => {
    res.json(await createEntry(CPU, CPUController, req))
})

apiRouter.get("/cpus", async (req, res) => {
    res.json(await CPUController.all())
})

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


// apiRouter.post()

apiRouter.post("/monitor", async (req, res) => {
    res.json(await createEntry(Monitor, MonitorController, req))
})

apiRouter.get("/monitors", async (req, res) => {
    res.json(await MonitorController.all())
})

apiRouter.post("/corestatus", async (req, res) => {
    res.json(await createEntry(CoreStatus, CoreStatusController, req))
})

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


apiRouter.post("/corestatus", async (req, res) => {
    res.json(await createEntry(CoreStatus, CoreStatusController, req))
})

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

apiRouter.get('*', (req, res) => {
    res.status(404).send('Non-existing route');
});

module.exports = apiRouter