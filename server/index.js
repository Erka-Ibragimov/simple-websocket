const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);
const PORT = process.env.PORT || 5000;
const aWss = WSServer.getWss();

app.ws("/", (ws, req) => {
  console.log("Подключение установленно");
  ws.send("Ты успещно подключился");
  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "connection":
        connectionHandler(ws, msg);
        break;

      default:
        break;
    }
  });
});

app.listen(PORT, () => console.log(`Startin on port ${PORT}`));

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(`Пользователь ${msg.user} подключился`);
    }
  });
};
