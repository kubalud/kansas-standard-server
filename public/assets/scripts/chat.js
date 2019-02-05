var socket = io.connect('http://localhost');

let jwt = new URL(window.location.href).searchParams.get("jwt");
let email = new URL(window.location.href).searchParams.get("email")

localStorage.setItem('kansas-jwt', jwt);
localStorage.setItem('kansas-email', email);

let sendButtonElement = document.querySelector('#send');
let inputElement = document.querySelector('input');
let ulElement = document.querySelector('ul');
let formElement = document.querySelector('form');

inputElement.addEventListener('keydown', (e) => {
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
        socket.on('chat message', function(msg){
            let newLi = document.createElement("li");
            newLi.innerHTML = msg;
            ulElement.appendChild(newLi);
            window.scrollTo(0, document.body.scrollHeight);
        });
    });

    sendButtonElement.addEventListener('click', () => {
        socket.emit('chat message', inputElement.value);
        inputElement.value = '';
    });
});
