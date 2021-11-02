var socket = io();

socket.on("hello", echo);

var counter = document.getElementById('counter');

function echo(arg) {
  counter.innerHTML = arg.data;
}

socket.on("topic_list", list_topic);

var topic_list_div = document.getElementById('topic_list_div');

function list_topic(topic_list) {
  const list = topic_list.map( (value) => `<li>${value}</li>`).join('');
  topic_list_div.innerHTML = `<ul>${list}</ul>`;
}