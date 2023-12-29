/* eslint class-methods-use-this: ["error", { "exceptMethods": ["addUserToList"] }] */

import ChatAPI from './api/ChatAPI';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = new WebSocket('ws://localhost:3000');
    this.currentUser = null;
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
    this.subscribeOnEvents();
  }

  bindToDOM() {
    this.container.innerHTML = `
      <div class="modal__background" id="modalRegister">
        <div class="modal__content">
          <div class="modal__body">
            <form id="registerForm">
              <div class="form__group">
                <label for="registerNameInput">Введите псевдоним</label>
                <input type="text" id="registerNameInput" class="form__input" />
              </div>
              <div class="form__hint" id="registerFormHint"></div>
            </form>
          </div>
          <div class="modal__footer">
            <button class="modal__ok" id="registerOkButton">Продолжить</button>
          </div>
        </div>
      </div>
      <div class="container" style="display: none;">
        <div class="chat__header">
          <h1>Чат</h1>
        </div>
        <div class="chat__container">
          <div class="chat__area">
            <div class="chat__messages-container" id="chatMessagesContainer"></div>
            <div class="chat__messages-input">
              <input type="text" class="form__input" id="messageInput" placeholder="Type a message...">
              <button id="sendMessageButton" class="modal__ok">Отправить</button>
            </div>
          </div>
          <div class="chat__userlist" id="userList">
            
          </div>
        </div>
      </div>
    `;
  }

  registerEvents() {
    document.getElementById('registerOkButton').addEventListener('click', this.onEnterChatHandler.bind(this));
    console.log('Registered event handler for register button');
    document.getElementById('sendMessageButton').addEventListener('click', this.sendMessage.bind(this));
    console.log('Registered event handler for send message button');
  }

  subscribeOnEvents() {
    this.websocket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      this.renderMessage(message);
    });
  }

  async onEnterChatHandler() {
    const name = document.getElementById('registerNameInput').value;
    console.log(`Attempting to register user with name: ${name}`);
    const users = await this.api.list();
    const isExist = users.find((user) => user.name === name);
    if (!isExist) {
      this.currentUser = await this.api.create(name);
      this.currentUser.name = 'You';
      console.log(`Registered new user: ${JSON.stringify(this.currentUser)}`);
      this.addUserToList(this.currentUser);
      document.getElementById('modalRegister').style.display = 'none';
      document.querySelector('.container').style.display = 'block';
    } else {
      alert('This name is already taken!');
    }
  }

  addUserToList(user) {
    const userList = document.getElementById('userList');
    userList.innerHTML += `<p>${user.name}</p>`;
  }

  sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    console.log(`Sending message: ${message}`);
    this.websocket.send(JSON.stringify({ type: 'send', user: this.currentUser, message }));
    messageInput.value = '';

    const messageContainer = document.getElementById('chatMessagesContainer');
    if (messageContainer.innerHTML.trim() === '<p>Здесь еще нет сообщений</p>') {
      messageContainer.innerHTML = '';
    }
  }

  renderMessage(message) {
    console.log(`Rendering message: ${JSON.stringify(message)}`);
    const messageContainer = document.getElementById('chatMessagesContainer');
    if (message.user && message.message) {
      const username = message.user.id === this.currentUser.id ? 'You' : message.user.name;
      const timestamp = new Date().toLocaleString();
      messageContainer.innerHTML += `<p><strong>${username} (${timestamp}):</strong> ${message.message}</p>`;
    } else if (message.message) {
      messageContainer.innerHTML += `<p>${message.message}</p>`;
    }

    if (!messageContainer.innerHTML.trim()) {
      messageContainer.innerHTML = '<p>Здесь еще нет сообщений</p>';
    }
  }
}
