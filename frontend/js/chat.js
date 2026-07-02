window.ChatManager = (function() {
    let socket = null;
    let currentChatUser = null;
    let onNewMessageCallback = null;

    function init() {
        const token = localStorage.getItem("token");
        if (!token) return;

        // io() viene de /socket.io/socket.io.js
        if (typeof io !== "undefined") {
            socket = io({
                auth: { token: token }
            });

            socket.on("connect", () => {
                console.log("Socket conectado");
            });

            socket.on("nuevo_mensaje", (data) => {
                if (onNewMessageCallback) {
                    onNewMessageCallback(data.emisor, data.texto, 'received', data.fecha);
                }
            });

            socket.on("mensaje_enviado", (data) => {
                if (onNewMessageCallback) {
                    onNewMessageCallback(data.receptor, data.texto, 'sent', data.fecha);
                }
            });
        }
    }

    async function loadChatHistory(userId, renderCallback) {
        currentChatUser = userId;
        const token = localStorage.getItem("token");
        if (!token) return false;
        
        try {
            const res = await fetch(`/api/matches/${userId}/mensajes`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.mensajes) {
                data.mensajes.forEach(msg => {
                    const type = msg.emisor === userId ? 'received' : 'sent';
                    renderCallback(msg.texto, type, false);
                });
                return data.mensajes.length > 0;
            }
            return false;
        } catch (err) {
            console.error("Error cargando historial", err);
            return false;
        }
    }

    function setOnNewMessage(callback) {
        onNewMessageCallback = callback;
    }

    function sendMessage(receptorId, texto) {
        if (socket && texto.trim()) {
            socket.emit("enviar_mensaje", {
                receptor: receptorId,
                texto: texto
            });
        }
    }

    // Initialize socket connection on load
    init();

    return {
        loadChatHistory,
        sendMessage,
        setOnNewMessage,
        getCurrentChatUser: () => currentChatUser
    };
})();
