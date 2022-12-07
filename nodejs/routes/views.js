const express = require("express")
const { ComputerController } = require("../controllers")

const viewRouter = express.Router()

viewRouter.get("/", async function(req, res){
    const allComputers = await ComputerController.all()
    res.render("home", {allComputers : allComputers})
})

module.exports = viewRouter