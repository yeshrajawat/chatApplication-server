const express = require('express');
const app = express();

const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        methods:['GET','POST']
    }
})

io.on('connection',(socket) => {
    console.log("User connected",socket.id);


    socket.on('join_room', ({roomId}) => {
        socket.join(roomId);
        console.log(`User with Id ${socket.id} has joined the room:${roomId}`);
    })

    socket.on('send_message',({messageData}) => {
        console.log(messageData);

        socket.to(messageData.roomId).emit('receive_message',messageData);
    })

    socket.on('disconnect', ()=>{
        console.log('User disconnected',socket.id);
    })
})



server.listen(3001,(err) => {
    if(err){
        console.error(err);
    }
    else{
        console.log('Listening to port 3001');
    }
})