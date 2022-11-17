const e = require("express")
const mysql2 = require("mysql2")
const {Computer, Core, CoreStatus, Monitor, CPU} = require("../models")
require("dotenv").config()

let dbConnection = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port : process.env.DB_PORT,
})


dbConnection.connect(function(err){
    if(!err){
        console.log("Database is connected")
    } else {
        console.log("Error connecting to databse ...", err)
    }
})

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port : process.env.DB_PORT,
    connectionLimit: 100,
    dateStrings: 'date'
}).promise()


module.exports = {
    pool: pool,
}
