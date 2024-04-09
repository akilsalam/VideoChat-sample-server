const app = require('express')();
const server = require('http').createServer(app)
const cors = require("cors")

const io = require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    }
})

const PORT = process.env.PORT || 5000;

// Apply CORS middleware at the top
app.use(cors());

app.get("/", (req,res) => {
    res.send("Server is Running")
})

io.on("connection", (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({ userToCall, signalData, from, name}) => {
        io.to(userToCall).emit("calluser", {signal:signalData, from, name});
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
