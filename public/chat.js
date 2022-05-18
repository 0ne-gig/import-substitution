$(function() {
  var socket = io.connect("http://localhost:3000");

  var message = $("#message");
  var username = $("#username");
  var send_message = $("#send_message");
  var send_username = $("#send_username");
  var chatroom = $("#chatroom");
  var feedback = $("#feedback");

  send_message.click(() => {
    // console.log(data)
    const input = document.getElementById('file')
    socket.emit("new_message", {
      message: message.val(),
      className: alertClass,
      file: input.files[0]
    });
  });
  var min = 1;
  var max = 6;
  var random = Math.floor(Math.random() * (max - min)) + min;

  // Устаналиваем класс в переменную в зависимости от случайного числа
  // Эти классы взяты из Bootstrap стилей
  var alertClass;
  switch (random) {
    case 1:
      alertClass = "secondary";
      break;
    case 2:
      alertClass = "danger";
      break;
    case 3:
      alertClass = "success";
      break;
    case 4:
      alertClass = "warning";
      break;
    case 5:
      alertClass = "info";
      break;
    case 6:
      alertClass = "light";
      break;
  }

  socket.on("add_mess", data => {
    feedback.html("");
    message.val("");
    console.log(data.file)
    var arrayBufferView = new Uint8Array(data.file);
    base64String = bufferToBase64(arrayBufferView)
    var img_url = `data:image/png;base64, ${base64String}`;

    img = `<img src="${img_url}">`
    chatroom.append(
      "<div class='alert alert-" +
        data.className +
        "'<b>" +
        data.username +
        "</b>: " +
        data.message + img +
        "</div>"
    );
  });

  send_username.click(() => {
    socket.emit("change_username", { username: username.val() });
  });

  message.bind("keypress", () => {
    socket.emit("typing");
  });

  socket.on("typing", data => {
    feedback.html(
      "<p><i>" + data.username + " печатает сообщение..." + "</i></p>"
    );
  });
});


'use strict';
function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}
