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
        io.sockets.emit('messageSent', rooms[data.roomId])
    })
    socket.on('getInitialMessages', (id) => {
        let response;
        response = roomExists(id) ? rooms[id] : [];
        io.sockets.emit('initialMessagesProvided', response)
    })

    function roomExists (id) {
        return rooms.hasOwnProperty(id);
    }
});
