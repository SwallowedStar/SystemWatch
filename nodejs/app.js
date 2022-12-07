// Import packages
const express = require("express")
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");

const {Server} = require("socket.io")
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

// We give to the app the ejs engine
app.set('view engine', 'ejs');


const io = new Server(server, {
    cors: {
        origin: (requestOrigin, callback) => {
            callback(undefined, requestOrigin)
        },
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    // TODO: look into the concepts of rooms and namespaces
    console.log(`Confirmed connection from ${socket.id}`)

    socket.emit("welcome", "Hello world")
    
    if (socket.handshake.query["computerID"] !== undefined){
        console.log("Logging into room " + socket.handshake.query["computerID"] + typeof(socket.handshake.query["computerID"]))
        socket.join(socket.handshake.query["computerID"])
    }
})

// Very ugly, but it has to work like that because of the need of the server in socket.io
module.exports = io

const apiRouter = require("./routes/api");
const viewRouter = require("./routes/views")

const { type } = require("os");
// Setting up routes here
app.use("/api", apiRouter)
app.use("/", viewRouter)

app.use("/static", express.static("static"))