const WebSocket = require("ws");
const {onConnection, connectedUsers} = require("./connection");

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", onConnection);

  console.log("WebSocket server iniciado.");

  return wss;
}

function sendMessageToUser(userId, payload) {

  const key = String(userId); 
  const ws = connectedUsers.get(key);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

module.exports = {initWebSocket, sendMessageToUser};
