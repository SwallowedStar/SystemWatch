const express = require("express")
const { ComputerController } = require("../controllers")

const viewRouter = express.Router()

// Computer Selection
viewRouter.get("/", async function(req, res){
    const allComputers = await ComputerController.allComplete()
    res.render("home", {allComputers : allComputers})
})

// The live dashboard
viewRouter.get("/computer/dashboard/:computerID", async function(req, res) {
    const computer = await ComputerController.getComplete(req.params.computerID)
    // Here, we check if the computer exists
    if(computer["error"] !== undefined){
        res.redirect("/")
    }
    else{
        res.render("realTimeDashboard", {socketHost : process.env.SOCKET_HOST, listenPort: process.env.LISTEN_PORT, computer: computer, isLiveStreaming: true})
    }
})

// The activity history
viewRouter.get("/computer/history/:computerID", async function(req, res) {
    const computer = await ComputerController.getComplete(req.params.computerID)
    // Here, we check if the computer exists
    if(computer["error"] !== undefined){
        res.redirect("/")
    }
    else{
        res.render("realTimeDashboard", {socketHost : process.env.SOCKET_HOST, listenPort: process.env.LISTEN_PORT, computer: computer, isLiveStreaming: false})
    }
})

// The stats screen
viewRouter.get("/computer/dashboard/stats/:computerID", async function(req, res) {
    const computer = await ComputerController.getComplete(req.params.computerID)
    // Here, we check if the computer exists
    if(computer["error"] !== undefined){
        res.redirect("/")
    }
    else{
        res.render("statisticDash", {socketHost : process.env.SOCKET_HOST, listenPort: process.env.LISTEN_PORT, computer: computer})
    }
})
module.exports = viewRouter