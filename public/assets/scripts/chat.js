var socket = io.connect('http://localhost');

let jwt = new URL(window.location.href).searchParams.get("jwt");
let email = new URL(window.location.href).searchParams.get("email")

localStorage.setItem('kansas-jwt', jwt);
localStorage.setItem('kansas-email', email);

let sendButtonElement = document.querySelector('#send');
let room = document.querySelector('#room');
let messageBox = document.querySelector('#message-box');
let door = document.querySelector('#door');
let ulElement = document.querySelector('ul');
let formElement = document.querySelector('form');
let roomWrapper = document.querySelector('.room-wrapper');
let doorWrapper = document.querySelector('.door-wrapper');
let messagesWrapper = document.querySelector('.messages-wrapper');
let roomNameElement = document.querySelector('#room-name');
let leaveRoomWrapper = document.querySelector('.leave-room-wrapper');
let leaveRoomButton = document.querySelector('#leave-room-button');

let currentRoom = '';

messageBox.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        sendButtonElement.click();
    }
});

formElement.addEventListener('submit', () => {
    localStorage.removeItem('kansas-jwt');
    localStorage.removeItem('kansas-email');
    socket.disconnect();
});

socket.on('connect', () => {
    socket.emit('authentication', { email: email, jwt: jwt });
    socket.on('authenticated', () => {
        socket.on('message sent', (msg) => {
            let newLi = document.createElement("li");
            newLi.innerHTML = msg;
            ulElement.appendChild(newLi);
            window.scrollTo(0, document.body.scrollHeight);
        });

        socket.on('room entered', (roomName) => {
            currentRoom = roomName;
            roomNameElement.innerHTML = `Room ${roomName}`;
            doorWrapper.classList.add('hidden');
            roomWrapper.classList.remove('hidden');
            leaveRoomWrapper.classList.remove('hidden');
            messagesWrapper.classList.remove('hidden');
        });

        socket.on('room left', () => {
            doorWrapper.classList.remove('hidden');
            roomWrapper.classList.add('hidden');
            leaveRoomWrapper.classList.add('hidden');
            messagesWrapper.classList.add('hidden');
        });

        sendButtonElement.addEventListener('click', () => {
            if (messageBox.value) {
                socket.emit('send message', currentRoom, messageBox.value);
                messageBox.value = '';
            }
        });

        door.addEventListener('click', () => {
            socket.emit('enter room', room.value);
            room.value = '';
        });

        leaveRoomButton.addEventListener('click', () => {
            socket.emit('leave room', currentRoom);
            room.value = '';
        });
    });
});
