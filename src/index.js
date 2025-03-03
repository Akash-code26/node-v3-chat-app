const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getAllRooms } = require('./utils/users')

const filter = new Filter()

filter.addWords('gandu','chutiya')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public') 

app.use(express.static(publicDirectoryPath))

// let count = 0

// server(emit) -> client (recieve) - countUpdated
// client(emit) -> server (recieve) - increment

io.on('connection', (socket) => {  
    console.log('New WebSocket connection')

    socket.emit('rooms', getAllRooms())

    socket.on('join', ({username, room}, callback) => {
        
        const { error, user } = addUser({ id: socket.id, username, room })
        
        if(error) {
            return callback(error)
        }

     
        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        io.emit('rooms', getAllRooms())
        
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (msg, callback) => { 
        const user = getUser(socket.id)

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left the room!`))
            io.to(user.room).emit('roomData', {
                room:user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage (user.username, `https://google.com/maps?q=${latitude},${longitude}`) )
        callback()
    })

    

})


server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
