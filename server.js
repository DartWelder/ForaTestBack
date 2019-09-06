import express from 'express';
import http from 'http';
import cors from 'cors';
import uuid from 'uuid';
import { socketHandler, getIOInstance } from './socket';
import rooms from './rooms'

const app = express();
const server = http.createServer(app);
const io = getIOInstance(server);

server.listen(3001);

app.use(cors());

app.get('/getrooms', (req, res) => {
    res.send(getRoomKeys());
})

app.post('/createroom', (req, res) => {
    rooms[uuid()] = [];
    res.send(getRoomKeys());
})

let getRoomKeys = () => {
    return Object.entries(rooms)
        .map(([key, value]) => {
            return key;
        });
}