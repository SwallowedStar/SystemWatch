// Import packages
const express = require("express")
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");
require("dotenv").config()

// Configure server
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Setup HTTP server
const server = http.createServer(app);

// Open port 3000
server.listen(process.env.LISTEN_PORT);

// Quand le serveur est allumé on le log
server.on('listening', function () {
    console.log("Le serveur est allumé");
});

// Si il y a une erreur on la log
server.on('error', function (error) {
    console.error(error);
});