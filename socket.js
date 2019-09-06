import rooms from './rooms';
import socket from 'socket.io';

export function getIOInstance(server) {
    let io = socket().listen(server);
    io.sockets.on('connection', (socket) => {
        socket.on('addMessage', (data) => {
            if (roomExists(data.roomId)) {
                rooms[data.roomId].push(data);
            } else {
                rooms[data.roomId] = [data];
            }
            io.sockets.emit('messageSent', rooms[data.roomId]);
        });
        socket.on('getInitialMessages', (id) => {
            let response;
            response = roomExists(id) ? rooms[id] : [];
            io.sockets.emit('initialMessagesProvided', response);
        });
        socket.on('isWriting', (data) => {
            io.sockets.emit(`notification-${data.roomId}`, {
                type: 'isWriting',
                user: data.user
            });
        });
        socket.on('writingStopped', (data) => {
            io.sockets.emit(`notification-${data.roomId}`, {
                type: 'writingStopped',
                user: data.user
            });
        });
        socket.on('userIsLeavingRoom', (data) => {});
    });
}

let roomExists = (id) => {
    return rooms.hasOwnProperty(id);
}

export default getIOInstance;