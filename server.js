import express from 'express'
import http from 'http'
import socket from 'socket.io'
import cors from 'cors'
import uuid from 'uuid'

const app = express();
const server = http.createServer(app);
const io = socket().listen(server);

server.listen(3001);

let rooms = {};

app.use(cors())

app.get('/getrooms', (req, res) => {
    res.send(getRoomKeys());
})

app.get('/createroom', (req, res) => {
    rooms[uuid()] = [];
    res.send(getRoomKeys());
})

io.sockets.on('connection', (socket) => {
    socket.on('addMessage', (data) => {
        if (roomExists(data.roomId)) {
            rooms[data.roomId].push(data);
        } else {
            rooms[data.roomId] = [data];
        }
        io.sockets.emit('messageSent', rooms[data.roomId])
    });
    socket.on('getInitialMessages', (id) => {
        let response;
        response = roomExists(id) ? rooms[id] : [];
        io.sockets.emit('initialMessagesProvided', response)
    });
    socket.on('isWriting', (data) => {
        console.log(`notification-${data.roomId}`)
        io.sockets.emit(`notification-${data.roomId}`, {
            type: 'isWriting',
            user: data.user
        })
    });
});

let roomExists = (id) => {
    return rooms.hasOwnProperty(id);
}

let getRoomKeys = () => {
    return Object.entries(rooms)
        .map(([key, value]) => {
            console.log(key)
            return key;
        })
}