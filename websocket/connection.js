const handleMessage = require("./messageHandler");

const connectedUsers = new Map();

function onConnection(ws, req) {
  const { query } = require('url').parse(req.url, true);
  const userId = query.userId;

  if (!userId) {
    ws.close(1008, "userId é obrigatório");
    return;
  }

  connectedUsers.set(String(userId), ws);

  ws.on("message", data => handleMessage(ws, data));

  ws.on("error", err => {
    console.error("Erro no WebSocket:", err.message);
  });

}

module.exports = {onConnection, connectedUsers};
