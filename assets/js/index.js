// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  $('#message-form').submit((e) => {
    e.preventDefault();
    const message = $('input[name="message"]').val();
    socket.send(message);
    $('input[name="message"]').val('');
  });
});

// Listen for messages
socket.addEventListener("message", (event) => {
  $('#text-message').append(`<span class="alert alert-dark">${event.data}</span>`)
});
