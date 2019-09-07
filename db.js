export default {
    rooms: [],
    getRoomIds: function () {
        return this.rooms
            .map((room) => {
                return room.id;
            });
    },
    roomExists: function (id) {
        this.getRoomIds().some((room) => room.id === id);
    },
    getRoomById: function (id) {
        return this.rooms.filter((room) => room.id === id)[0]
    },
    getUserById: function (roomId, userId) {
        const room = this.getRoomById(roomId);
        if (room) {
            return room.users.filter((user) => user.userId === userId)[0];
        }
        return null;
    },
    deleteUser: function (roomId, userId) {
        const room = this.getRoomById(roomId);
        if (!room) return;
        room.users = room.users.filter((user) => {
            return user.userId !== userId;
        });
    }
};