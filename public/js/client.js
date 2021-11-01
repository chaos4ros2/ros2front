var socket = io();

socket.on("hello", echo);

var counter = document.getElementById('counter');

function echo(arg) {
  counter.innerHTML = arg.data;
}

