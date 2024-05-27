import WebSocket ,{ WebSocketServer } from 'ws';
import uuid from "node-uuid";

var clients = [];
var clientIndex = 1;
var wss = new WebSocketServer({ port: 8181 });

wss.on("connection", function (ws) {
  var client_uuid = uuid.v4();
  var nickname = "AnonymousUser" + clientIndex;
  clientIndex += 1;
  clients.push({ id: client_uuid, ws: ws, nickname: nickname });
  console.log("client [%s] connected", client_uuid);
  ws.on("message", function (message) {
    if (message.toString().indexOf("/nick") == 0) {
      var nickname_array = message.toString().split(" ");
      if (nickname_array.length >= 2) {
        var old_nickname = nickname;
        nickname = nickname_array[1];
        for (var i = 0; i < clients.length; i++) {
          var clientSocket = clients[i].ws;
          var nickname_message =
            "Client " + old_nickname + " changed to " + nickname;
          clientSocket.send(
            JSON.stringify({
              id: client_uuid,
              nickname: nickname,
              message: nickname_message,
            })
          );
        }
      }
    } else {
      for (var i = 0; i < clients.length; i++) {
        var clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
          console.log("client [%s]: %s", clients[i].id, message);
          clientSocket.send(
            JSON.stringify({
              id: client_uuid,
              nickname: nickname,
              message: message.toString(),
            })
          );
        }
      }
    }
  });

  ws.on("close", function () {
    for (var i = 0; i < clients.length; i++) {
      if (clients[i].id == client_uuid) {
        console.log("client [%s] disconnected", client_uuid);
        clients.splice(i, 1);
      }
    }
  });
});
