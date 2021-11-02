const rclnodejs = require('rclnodejs');
// const { QoS } = rclnodejs;

// run command synchronously
const { execSync } = require('child_process');

const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

setInterval(() => {
  // get ros2 topic list
  const topic_list_buffer = execSync(`ros2 topic list`);
  const topic_list = Buffer.from(topic_list_buffer).toString('utf-8').trim().split('\n');
  io.emit('topic_list', topic_list);
}, 1000);


rclnodejs.init().then(() => {
  const node = rclnodejs.createNode('subscription_message_example_node');
  
  let count = 0;

  node.createSubscription(
    'std_msgs/msg/String',
    'chatter',
    (state) => {
      console.log(`Received message No. ${++count}: `, state);
      // emit an event to all connected sockets(act as a server, not only act as one socket)
      // https://github.com/socketio/socket.io#simple-and-convenient-api
      // https://socket.io/docs/v4/server-api/#serversockets
      io.emit('hello', state);
    }
  );

  rclnodejs.spin(node);
});

http.listen(port, () => console.log('listening on port ' + port));
