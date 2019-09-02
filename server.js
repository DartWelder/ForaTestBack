import express from 'express';
import http from 'http';
import socket from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socket().listen(server);

server.listen(3001);

let rooms = {};

io.sockets.on('connection', (socket) => {
    socket.on('addMessage', (data) => {
        if (roomExists(data.roomId)) {
            rooms[data.roomId].push(data);
        } else {
            rooms[data.roomId] = [data];
        }
    })
    socket.on('getInitialMessages', (data) => {
        let response;
        roomExistsdata(roomId) ? rooms[roomId] : [];
        console.log(response)
        socket.emit('initialMessagesProvided', response)
    })

})

function roomExists(id) {
    return rooms.hasOwnProperty(id);
}