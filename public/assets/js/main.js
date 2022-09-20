const socket = io();
let username = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginInput');
let btnLoginInput = document.querySelector('#btnLoginInput');
let chatInputMessage = document.querySelector('#chatInputMessage');
let btnInputMessage = document.querySelector('#btnInputMessage');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

btnLoginInput.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginInput.value) {
        let name = loginInput.value.trim();
        if (name.length > 0) {
            username = name;
            document.title = 'Chat - ' + username;
            socket.emit('join-request', username);
        }
    }
});

btnInputMessage.addEventListener('click', (e) => {
    e.preventDefault();
    
    let txt = chatInputMessage.value.trim();
    chatInputMessage.value = '';

    if (txt.length > 0) {
        socket.emit('send-msg', txt);
    }
});

socket.on('user-ok', (list) => {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    chatInputMessage.focus();

    addMessage('status', null, 'Você entrou no chat!');
    
    userList = list;
    renderUsersList();
});

socket.on('list-update', (data) => {
    if (data.joined) {
        addMessage('status', null, data.joined + ' entrou no chat!');
    }

    if (data.left) {
        addMessage('status', null, data.left + ' saiu do chat!');
    }

    userList = data.list;
    renderUsersList();
});

socket.on('show-msg', (data) => {
    addMessage('msg', data.username, data.message);
});

socket.on('disconnect', () => {
    addMessage('status', null, 'Você foi desconectado do servidor!');
    userList = [];
    renderUsersList();
});

socket.on('connect_error', () => {
    addMessage('status', null, 'Tentando reconectar ao servidor...');
});

socket.on('connect', () => {
    addMessage('status', null, 'Você está conectado ao servidor!');
    if (username != '') {
        socket.emit('join-request', username);
    }
});

function renderUsersList() {
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(item => {
        ul.innerHTML += `<li class="${item === username ? 'me' : 'other'}">${item}</li>`;
    });
}

function addMessage(type, user, msg) {
    let ul = document.querySelector('.chatList');

    switch (type) {
        case 'status':
            ul.innerHTML += `<li class="msgStatus">${msg}</li>`;
        break;
        case 'msg':
            ul.innerHTML += `
                <li class="msgText">
                    <div class="${user === username ? 'me' : 'other'}">    
                        ${user !== username ? '<span class="name">'+ user +'</span>' : ''}
                        <span class="txt">${msg}</span>
                    </div>
                </li>
            `;
        break;
    }

    ul.scrollTop = ul.scrollHeight;
}