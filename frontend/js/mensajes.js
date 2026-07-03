(function checkAuth() {
    if (!localStorage.getItem('token')) {
        window.location.replace('iniciar_sesion.html');
    }
})();

// Mensajes page logic
const contactsList = document.getElementById('contactsList');
const noChatsMsg = document.getElementById('noChatsMsg');
const activeChatContainer = document.getElementById('activeChatContainer');
const emptyStateContainer = document.getElementById('emptyStateContainer');
const activeChatAvatar = document.getElementById('activeChatAvatar');
const activeChatName = document.getElementById('activeChatName');
const pageChatMessages = document.getElementById('pageChatMessages');
const pageTypingIndicator = document.getElementById('pageTypingIndicator');
const pageChatForm = document.getElementById('pageChatForm');
const pageChatInput = document.getElementById('pageChatInput');

let currentUserId = null; // The logged-in user ID will be fetched from JWT
let currentChatTargetId = null; // The user we are talking to

// Decode JWT to get our own ID
function getMyId() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch(e) {
        return null;
    }
}
currentUserId = getMyId();

async function loadContacts() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch("/api/matches", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        const matches = data.matches || [];
        
        if (matches.length === 0) {
            noChatsMsg.classList.remove('d-none');
            contactsList.innerHTML = '';
            contactsList.appendChild(noChatsMsg);
            return;
        }
        
        noChatsMsg.classList.add('d-none');
        contactsList.innerHTML = ''; // Clear previous

        matches.forEach(match => {
            // Determine who is the "other" person
            const amIUser1 = (match.usuario1._id === currentUserId);
            const targetUser = amIUser1 ? match.usuario2 : match.usuario1;
            
            // REQUERIMIENTO: Solo mostrar MATCHES confirmados. No mostrar enviados ni recibidos.
            if (match.estado !== "matched") return;
            
            let statusText = "Match confirmado";

            const item = document.createElement('div');
            item.className = `list-group-item list-group-item-action p-3 d-flex align-items-center gap-3 ${currentChatTargetId === targetUser._id ? 'active' : ''}`;
            item.dataset.id = targetUser._id;
            item.style.cursor = 'pointer'; 
            item.innerHTML = `
                <img src="${targetUser.avatar}" class="rounded-circle object-fit-cover" width="50" height="50">
                <div class="flex-grow-1 overflow-hidden">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <h6 class="mb-0 fw-bold">${targetUser.nombre}</h6>
                    </div>
                    <p class="mb-0 small ${match.estado === 'matched' ? 'text-success' : 'text-muted'} text-truncate">
                        ${match.estado === 'matched' ? '<i class="bi bi-chat-heart-fill"></i>' : '<i class="bi bi-clock"></i>'} ${statusText}
                    </p>
                </div>
            `;
            
            // Allow chat (all items are matches now)
            item.addEventListener('click', () => openChat(targetUser._id, targetUser.nombre, targetUser.avatar));
            contactsList.appendChild(item);
        });
        
        // Si después de filtrar nos quedamos sin nada visible, mostramos el cartel vacío
        if (contactsList.children.length === 0) {
            noChatsMsg.classList.remove('d-none');
            contactsList.appendChild(noChatsMsg);
        } else {
            // Check if we arrived here from "Abrir Chat" in another page
            const autoOpenTargetId = localStorage.getItem('active_chat_target');
            if (autoOpenTargetId) {
                localStorage.removeItem('active_chat_target');
                // Find the match object for this target to get name and avatar
                const targetMatch = matches.find(m => m.usuario1._id === autoOpenTargetId || m.usuario2._id === autoOpenTargetId);
                if (targetMatch && targetMatch.estado === 'matched') {
                    const targetUser = (targetMatch.usuario1._id === autoOpenTargetId) ? targetMatch.usuario1 : targetMatch.usuario2;
                    openChat(targetUser._id, targetUser.nombre, targetUser.avatar);
                }
            }
        }
    } catch (err) {
        console.error("Error loading matches:", err);
    }
}

function appendMessage(text, type, animate = true) {
    const msgDiv = document.createElement('div');
    
    const baseClasses = "p-2 px-3 mb-2 rounded-4 shadow-sm w-75 position-relative";
    const typeClasses = type === 'sent' 
        ? "bg-success text-white align-self-end ms-auto" 
        : "bg-body-secondary text-body-emphasis align-self-start border border-light-subtle";
        
    msgDiv.className = `${baseClasses} ${typeClasses}`;
    if (!animate) msgDiv.style.animation = 'none';
    msgDiv.innerText = text;
    
    if (pageTypingIndicator && pageTypingIndicator.parentNode === pageChatMessages) {
        pageChatMessages.insertBefore(msgDiv, pageTypingIndicator);
    } else {
        pageChatMessages.appendChild(msgDiv);
    }
    pageChatMessages.scrollTop = pageChatMessages.scrollHeight;
}

async function openChat(id, name, avatar) {
    currentChatTargetId = id;
    emptyStateContainer.classList.add('d-none');
    activeChatContainer.classList.remove('d-none');
    
    activeChatName.innerText = name;
    activeChatAvatar.src = avatar;
    
    // Highlight contact
    document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.querySelector(`.list-group-item[data-id="${id}"]`);
    if (activeEl) activeEl.classList.add('active');

    // Clear messages UI
    pageChatMessages.innerHTML = '';
    if (pageTypingIndicator) {
        pageChatMessages.appendChild(pageTypingIndicator); 
    }
    
    // Load real history via ChatManager
    await ChatManager.loadChatHistory(id, appendMessage);
}

// Hook live incoming messages
if (window.ChatManager) {
    ChatManager.setOnNewMessage((userId, texto, type, fecha) => {
        if (currentChatTargetId === userId) {
            appendMessage(texto, type, true);
        } else if (type === 'received') {
            console.log("Nuevo mensaje en segundo plano de", userId);
        }
    });
}

pageChatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = pageChatInput.value.trim();
    if (text && currentChatTargetId) {
        ChatManager.sendMessage(currentChatTargetId, text);
        pageChatInput.value = '';
    }
});

// Initialize
loadContacts();
