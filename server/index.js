import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','POST'],
    credentials:true,
}));

const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST'],
        credentials:true,
    }
});
 
app.get("/",(_,res)=>{
    res.send("Socketio Server is running!!")
})

io.on('connection',(socket)=>{
    console.log('a user connected',socket.id);
    socket.on('error', (err) => console.error('Socket error:', err));

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
    })

    socket.on('message',(msg)=>{
        console.log("message received", msg);
        io.emit('message',msg)
    })
    
    socket.emit("welcome",`welcome to web sockets, ${socket.id}`)
    socket.broadcast.emit("welcome",` ${socket.id} joined the server.`)
})


server.listen(4000,()=>{
    console.log("server is running in port 4000");
    
})