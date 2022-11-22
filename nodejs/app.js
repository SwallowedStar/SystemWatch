// Import packages
const express = require("express")
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");
const apiRouter = require("./routes/api")

require("dotenv").config()

// Create the app
const app = express();

// Configure server
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Setup HTTP server
const server = http.createServer(app);

server.listen(process.env.LISTEN_PORT);

server.on('listening', function () {
    console.log("Le serveur est allumé");
});

server.on('error', function (error) {
    console.error(error);
});

// Setting up routes here
app.use("/api", apiRouter)