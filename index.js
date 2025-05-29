const express = require("express");
const app = express();

const mongoStore = require("connect-mongo");
const session = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { Server: socketServer } = require("socket.io");

const http = require("http");
const server = http.createServer(app);

const io = new socketServer(server);

const connectDB = require("./Config/db.js");

const dotenv = require("dotenv");
dotenv.config();

server.on("error", err => {
    console.error("Server error:", err);
});

io.on("connection", socket => {
    console.log("user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cookieParser())
const errorHandler = require("./Server/Utils/error.middleware.js");
app.use(errorHandler);

app.use(morgan("dev"));

app.use(
    express.urlencoded({
        extended: true
    })
);

// app.use(
//     cors({
//         origin: "http://localhost:8000",
//         credentials: true
//     })

app.use(
    session({
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),
        secret: process.env.SECRET_KEY,
        saveUninitialized: false,
        resave: false,
        cookies: {
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true
        }
    })
);

app.use(express.json());
app.use("/", require("./Server/Routes/api.route.js"));

server.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server running at http://127.0.0.1:${process.env.PORT}/`);
});
