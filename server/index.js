import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','POST']
}));

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST']
    }
});

app.get("/",(_,res)=>{
    res.send("Socketio Server is running!!")
})

io.on('connection',(socket)=>{
    console.log('a user connected',socket.id);
    socket.on('message',(msg)=>{
        console.log("message received", msg);
        io.emit('message',msg)
    })
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
    })
})


server.listen(4000,()=>{
    console.log("server is running in port 4000");
    
})