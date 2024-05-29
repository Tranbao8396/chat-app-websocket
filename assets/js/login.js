const ws = new WebSocket("ws://192.168.1.31:8080");

ws.onopen = function (e) {
  console.log("Connection to server opened");
};

var data = [
  {
    "id": 1,
    "name": "bao",
    "password": "1234"
  },
  {
    "id": 2,
    "name": "tele",
    "password": "1234"
  }
]

$('#login-form').on('submit', function(e){
  e.preventDefault();
  var name = $('input[name="name"]').val();
  var password = $('input[name="password"]').val();

  for (var i = 0; i < data.length; i++) {
    if(data[i].name == name && data[i].password == password) {
      window.location.href = "chat.html";
    }
  }
});