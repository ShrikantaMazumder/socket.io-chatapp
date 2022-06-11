let users = [];

const addUser = ({id, name, room}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(user => user.name === name && user.room === room);
    if (existingUser) {
        return {error: "User already exist!"}
    }

    const user = {
        id,
        name,
        room,
    }
    users.push(user);

    return user
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    addUser,
    removeUser,
}