// Create WebSocket connection.
const ws = new WebSocket("ws://localhost:8080");
// Connection opened
ws.onopen = function(e) {
  console.log('Connection to server opened' );
}

// Listen for messages
ws.onmessage = function(event) {
  var data_obj = JSON.parse(event.data)
  var initial_id = data_obj.id;
  var message = data_obj.message
  var name = data_obj.nickname;
  var id = data_obj.id;
  if (message) {
    var html = `
    <div class="message-line ltr">
        <div class="name-text">${name}</div>
        <div class="d-inline-block">
            ${message}
        </div>
        <small class="message-time">${data_obj.date}</small>
    </div>
    `;
    $('.message-list').append(html);
  }
}

// Send message
$('#message-form').on('submit', function(e) {
  e.preventDefault();
  var message = $('input[name="message"]').val();
  ws.send(message);
})