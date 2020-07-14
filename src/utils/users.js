const users = []
let rooms = []

//addUser
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room}
    users.push(user)
    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id )
    if(index !== -1) {
        return users.splice(index,1)[0]   // returns an array of remove item... so we access only the item removed
    }
}

const getAllRooms = () => {
    rooms = []
    if(users.length>0) {
         users.forEach((user) => {
            if(!rooms.includes(user.room)) {
                rooms.push(user.room)
            }
         }) 
    return rooms
}

}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.trim().toLowerCase())
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAllRooms

}