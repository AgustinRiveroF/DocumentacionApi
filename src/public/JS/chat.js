const socketClient = io();
const h4Name = document.getElementById("name");
const inputMessage = document.getElementById("message");
const divChat = document.getElementById("chat");
const divChats = document.getElementById("chatMessages");
let user;

fetch('/api/sessions/get-user')
  .then(response => response.json())
  .then(userData => {
    user = userData.first_name;
    h4Name.innerText = user;
    socketClient.emit("newUser", user);
  });

document.getElementById("botonEnviar").addEventListener("click", (e) => {
  e.preventDefault();
  const infoMessage = {
    name: user,
    message: inputMessage.value,
  };
  inputMessage.value = "";
  socketClient.emit("message", infoMessage);
});

socketClient.on("chat", (messages) => {
  const chat = messages
    .map((m) => {
      return `<p>${m.name}: ${m.message}</p>`;
    })
    .join(" ");
  divChats.innerHTML = chat;
  divChats.scrollTop = divChats.scrollHeight;
});

const toggleChatButton = document.getElementById("toggleChat");
const chatContainer = document.getElementById("chatContainer");

let isChatMinimized = true;

toggleChatButton.addEventListener("click", () => {
  
  if (isChatMinimized) {
    chatContainer.classList.remove("minimized");
    toggleChatButton.innerText = "Chat";
  } else {
    chatContainer.classList.add("minimized");
    toggleChatButton.innerText = "Chat";
  }

  isChatMinimized = !isChatMinimized;
});


document.addEventListener('DOMContentLoaded', function () {
  const adminToggle = document.getElementById('admin-toggle');
  const adminContent = document.querySelector('.admin-content');

  adminToggle.addEventListener('change', function () {
    adminContent.style.display = adminToggle.checked ? 'block' : 'none';
  });
});


