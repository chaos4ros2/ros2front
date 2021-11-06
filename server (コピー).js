const rclnodejs = require('rclnodejs');
// const { QoS } = rclnodejs;
var node = {};

// run command synchronously
const { execSync } = require('child_process');

const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var topic_list = [];

app.use(express.static(__dirname + '/public'));

// トピック数比較用
var pre_topic_count = 0;

class SubscriberServer {
  constructor(node) {
    this.node = node;
    // トピック数比較用
    this.pre_topic_count = 0;
  }

  interval() {
    setInterval(() => {
      // get ros2 topic list
      const topic_list_buffer = execSync(`ros2 topic list`);
      topic_list = Buffer.from(topic_list_buffer).toString('utf-8').trim().split('\n');
      io.emit('topic_list', topic_list);
      // topicは増えると新しい購読者を初期化する（最初の初期化も必要、うまく同じ関数にまとめられるか）
      if (pre_topic_count == 0) init_subscriber(this.node, topic_list);
      else if (topic_list.length > pre_topic_count) {
        console.log(this.node);
        // scan_topic_list(node, topic_list);
      }
      // topicの個数を保存
      pre_topic_count = topic_list.length;
    }, 1000);
  }

  /**
   * 購読者の作成
   * 
   * @param mixed node ROS2ノードのインスタンス
   * @param string topic_name トピック名
  */
  create_subscription(topic_name) {
    let count = 0;
    this.node.createSubscription(
      'std_msgs/msg/String',
      topic_name,
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

setInterval(() => {
  console.log(node);
  // get ros2 topic list
  const topic_list_buffer = execSync(`ros2 topic list`);
  topic_list = Buffer.from(topic_list_buffer).toString('utf-8').trim().split('\n');
  io.emit('topic_list', topic_list);
  // topicは増えると新しい購読者を初期化する（最初の初期化も必要、うまく同じ関数にまとめられるか）
  if (pre_topic_count == 0) init_subscriber(node, topic_list);
  else if (topic_list.length > pre_topic_count) {
    console.log(node);
    // scan_topic_list(node, topic_list);
  }
  // topicの個数を保存
  pre_topic_count = topic_list.length;
}, 1000);

/**
 * 購読者の初期化 
 * 
 * @param string topic_list トピック名
*/
function init_subscriber(node, topic_list) {
  rclnodejs.init().then(() => {
    node = new rclnodejs.Node('subscription_message_example_node');
    topic_list.forEach(element => {
      // delete「/」from topic name
      const topic_name = element.slice(1);
      create_subscription(node, topic_name);
    }); 

    node.spin();
  });
}

/**
 * topic listを走査する
 * @param mixed node ROS2ノードのインスタンス
 * @param string topic_list トピックリスト
*/
function scan_topic_list(node, topic_list) {
  topic_list.forEach(element => {
    // delete「/」from topic name
    const topic_name = element.slice(1);
    create_subscription(node, topic_name);
  });
}

/**
 * 購読者の作成
 * 
 * @param mixed node ROS2ノードのインスタンス
 * @param string topic_name トピック名
*/
function create_subscription(node, topic_name) {
  let count = 0;
  node.createSubscription(
    'std_msgs/msg/String',
    topic_name,
    (state) => {
      console.log(`Received ${topic_name} message No. ${++count}: `, state);
      // emit an event to all connected sockets(act as a server, not only act as one socket)
      // https://github.com/socketio/socket.io#simple-and-convenient-api
      // https://socket.io/docs/v4/server-api/#serversockets
      io.emit(topic_name, state);
    }
  );
}

http.listen(port, () => console.log('listening on port ' + port));
