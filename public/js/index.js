const socket = io()

const dropDown = document.querySelector('.dropdown')
const dropDownButton = document.querySelector('.dropbtn')
const dropDownContent = document.querySelector('.dropdown-content')


dropDownButton.setAttribute('disabled','disabled')

const roomInput = document.querySelector('#room-input')
socket.on('rooms', (rooms) => {
    dropDownContent.innerHTML =''
    const headerEl = document.createElement('p')
    const text = rooms !== null ?'---Available Rooms---':'---No Available Rooms---'
    headerEl.textContent = text
    dropDownContent.appendChild(headerEl)

    if(rooms){
        rooms.forEach((room) => {
        
            const roomEl = document.createElement('a')
            roomEl.textContent = room
            dropDownContent.appendChild(roomEl)
        })
    }
  
})


dropDownContent.addEventListener('click', (e) => {
    const val = e.target.text
    if(val !== undefined) {
        roomInput.value = val
    }
    
})

