import WebSocket ,{ WebSocketServer } from 'ws';
import uuid from "node-uuid";

var clients = [];
var clientIndex = 1;
var wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (ws) {
  var id = uuid.v4();

  ws.send(JSON.stringify({
    "id": id,
  }));

  var nickname = "Anonymous" + clientIndex;
  clients.push({"id": id , "ws": ws, "nickname": nickname});
  console.log('client [%s] connected', id);
  clientIndex++;

  ws.on("message", function (data) {
    var date = new Date();
    var data_str = data.toString();
    if (data_str.indexOf("changeNickname") == 0) {
      var nick_arr = data_str.split(" ");
      if (nick_arr.length >= 2) {
        var old_nickname = nickname;
        nickname = nick_arr[1];
        for (var i = 0; i < clients.length; i++) {
          var clientSk = clients[i].ws;
          var nickname_message = "Client " + old_nickname + " changed to " + nickname;
          clientSk.send(JSON.stringify({
            "id": id,
            "nickname": nickname,
            "message": nickname_message,
            'date': date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0')
          }));
        }
      }
    } else {
      for (var i = 0; i < clients.length; i++) {
        var clientSk = clients[i].ws;
        if(clientSk.readyState == WebSocket.OPEN) {
          clientSk.send(JSON.stringify({
            "id": id,
            "nickname": nickname,
            "message": data_str,
            'date': date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0')
          }));
        }
      }
    }
  });

  ws.on("close", function () {
    for (var i = 0; i < clients.length; i++) {
      if(clients[i].id == id) {
        console.log('client [%s] disconnected', id);
        clients.splice(i, 1);
      }
    }
  });
});
