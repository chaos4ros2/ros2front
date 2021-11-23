const rclnodejs = require('rclnodejs');
const { QoS } = rclnodejs;

// run command synchronously
const { execSync } = require('child_process');
// run command asynchronous
const { exec } = require('child_process');

const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

// execute rqt_graph
app.get('/rqt_graph',function(req, res) {
  exec(`rqt_graph`);
  res.send('rqt_graph ok');
});

class SubscriberServer {
  constructor(node) {
    this.node = node;
    // for comparison of numbers of topics
    this.pre_topic_list = [];    
  }

  interval() {
    setInterval(() => {
      // get ros2 topic list
      const topic_list_buffer = execSync(`ros2 topic list`);
      const topic_list = Buffer.from(topic_list_buffer).toString('utf-8').trim().split('\n');
      io.emit('topic_list', topic_list);
      // The topic will initialize new subscribers as it increases
      if (this.pre_topic_list.length == 0 || topic_list.length > this.pre_topic_list.length) 
          this.add_subscriber(topic_list);
      this.pre_topic_list = topic_list;
    }, 1000);
  }

  /**
   * add subscribers 
   * 
   * @param {mixed} topic_list an array holding the topic names
  */
   add_subscriber(topic_list) {
    // add only differences from existing topics
    const diff = topic_list.filter(i => this.pre_topic_list.indexOf(i) == -1);

    diff.forEach(element => {
      // get topic type
      const mesage_type_buffer = execSync(`ros2 topic info ${element}`);
      const message_type = Buffer.from(mesage_type_buffer).toString('utf-8').trim().split('\n')[0].replace('Type: ', '');

      // delete「/」from topic name
      const topic_name = element.slice(1);
      this.create_subscription(topic_name, message_type);
    }); 
  }
  
  /**
   * create subscriber
   * 
   * @param {string} topic_name topic name
   * @param {string} message_type message type
  */
  create_subscription(topic_name, message_type) {
    let count = 0;
    this.node.createSubscription(
      message_type,
      topic_name,
      { qos: QoS.profileSystemDefault },
      (state) => {
        console.log(`Received ${topic_name} message No. ${++count}: `, state);
        // emit an event to all connected sockets(act as a server, not only act as one socket)
        // https://github.com/socketio/socket.io#simple-and-convenient-api
        // https://socket.io/docs/v4/server-api/#serversockets
        io.emit(topic_name, state);
      }
    );
  }

}

rclnodejs.init().then(() => {
  const node = new rclnodejs.Node('subscription_message_example_node');
  const server = new SubscriberServer(node);
  
  server.interval();
  
  node.spin();
});

http.listen(port, () => console.log('listening on port ' + port));
