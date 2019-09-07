import express from 'express';
import http from 'http';
import cors from 'cors';
import uuid from 'uuid';
import { socketHandler, createIOInstance } from './socket';
import roomsDB from './db';
import './Room';
import ChatRoom from './Room';

const app = express();
const server = http.createServer(app);

server.listen(3001);

app.use(cors());

createIOInstance(server);

app.get('/getrooms', (req, res) => {
    res.send(roomsDB.getRoomIds());
});

app.post('/createroom', (req, res) => {
    roomsDB.rooms.push(new ChatRoom(uuid()))
    res.send(roomsDB.getRoomIds());
});
