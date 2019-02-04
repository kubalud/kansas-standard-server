var socket = io.connect('http://localhost');

localStorage.setItem('kansas-jwt', new URL(window.location.href).searchParams.get("jwt"));
localStorage.setItem('kansas-email', new URL(window.location.href).searchParams.get("email"));

let buttonElement = document.querySelector('button');
let inputElement = document.querySelector('input');
let ulElement = document.querySelector('ul');
let formElement = document.querySelector('form');

formElement.addEventListener('submit', (qwe) => {
    debugger;
    localStorage.removeItem('kansas-jwt');
    localStorage.removeItem('kansas-email');
});

buttonElement.addEventListener('click', () => {
    socket.emit('chat message', inputElement.value);
    inputElement.value = '';
});

socket.on('connect', () => {
    socket.emit('authentication', { email: "test@test.com", password: "secret" });
    socket.on('authenticated', () => {
        console.log("yeah!");
    });
});

socket.on('chat message', function(msg){
    let newLi = document.createElement("li");
    newLi.innerHTML = msg;
    ulElement.appendChild(newLi);
    window.scrollTo(0, document.body.scrollHeight);
});