const express = require("express")
const router = express.Router()

// All routes will be here

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