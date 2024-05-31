// Create WebSocket connection.
const ws = new WebSocket("ws://192.168.1.31:8080");
// Connection opened
ws.onopen = function(e) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification('Connection to ws server opened');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification('Connection to ws server opened');
      }
    });
  }
}
var initial_id;

// Listen for messages
ws.onmessage = function(event) {
  var data_obj = JSON.parse(event.data)
  var message = data_obj.message
  var name = data_obj.nickname;
  if (!message) {
    initial_id = data_obj.id;
  }
  var id = data_obj.id;
  if (message) {
    var html = `
    <div class="message-line ${initial_id == id ? 'ltr' : ''}">
        <div class="name-text">${name}</div>
        <div class="d-inline-block">
            ${message}
        </div>
        <small class="message-time">${data_obj.date}</small>
    </div>
    `;
    $('.message-list').prepend(html);

    if (initial_id != id) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(`${name} Says : ${message}`);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            var notification = new Notification(`${name} Says : ${message}`);
          }
        });
      }
    }
  }
}

// Send message
$('#message-form').on('submit', function(e) {
  e.preventDefault();
  var message = $('input[name="message"]').val();
  ws.send(message);
  $('input[name="message"]').val('');
})