const rclnodejs = require('rclnodejs');
// const { QoS } = rclnodejs;

const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

rclnodejs.init().then(() => {
  const node = rclnodejs.createNode('publisher_example_node');
  const publisher = node.createPublisher('std_msgs/msg/String', 'topic');

  var counter = 0;

  function onConnection(socket) {
    setInterval(() => {
      console.log(`Publishing message: Hello ROS ${counter}`);
      publisher.publish(`Hello ROS ${counter++}`);
      socket.emit('hello', counter);
    }, 1000);
  }
  
  io.on('connection', onConnection);
  rclnodejs.spin(node);
});


http.listen(port, () => console.log('listening on port ' + port));
