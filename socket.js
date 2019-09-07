import db from './db';
import socket from 'socket.io';

export function createIOInstance(server) {
    let io = socket().listen(server);
    io.sockets.on('connection', (socket) => {
        socket.on('addMessage', (data) => {
            var room = db.getRoomById(data.roomId);
            if (!room) {
                io.sockets.emit(`error-${data.roomId}`, 'Room doesn\'t exist');
                return;
            } else {
                room.messages.push(data);
            }
            io.sockets.emit('messageSent', room.messages);
        });
        socket.on('getInitialMessages', (id) => {
            const room = db.getRoomById(id);
            let response;
            response = room ? room.messages : [];
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
        socket.on('userIsJoinedToRoom', (data) => {            
            const room = db.getRoomById(data.roomId);
            if (!room) {
                io.sockets.emit(`error-${data.roomId}`, 'Room doesn\'t exist');
                return;
            }
            const user = db.getUserById(data.user.userId);
            if (!user) {
                room.users.push(data.user);
            }
            io.sockets.emit(`userOnline-${data.roomId}`, room.users);
        });
        socket.on('userIsLeavingRoom', (data) => {
            const room = db.getRoomById(data.roomId);
            if (!room) {
                return;
            }            
            const user = db.getUserById(data.roomId, data.user.userId);
            if (user) {
                db.deleteUser(room.id, user.userId);
            }
            io.sockets.emit(`userOnline-${data.roomId}`, room.users);
        });
    });
}

let roomExists = (id) => {
    return db.roomExists(id);
}

export default createIOInstance;