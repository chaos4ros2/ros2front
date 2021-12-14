# ros2front
A tool for building and testing ros2 at frontend.

## what is ros2front?
Ros2front is a tool for building and testing ros2 at frontend.
This tool gets inspiration from the following tools:
* [rclnodejs](https://github.com/RobotWebTools/rclnodejs)
* [rosboard](https://github.com/dheera/rosboard)
* [socket.io](https://github.com/socketio/socket.io)

It has cool view for debuging（like `rosboard`）and not just create a view for subscriber 
but can pubisher a topic or create a server with user handle.(Thans to `rclnodejs`).

It's easy to develop because it built only by `node.js`.

## Status: Under development
Please see [Projects](https://github.com/chaos4ros2/ros2front/projects/1) for more details.

## How to test?
```
git clone https://github.com/chaos4ros2/ros2front.git
cd ros2front
npm install
node server.js
open a browser and access http://localhost:3000/
```

## demo
![ros2front](https://user-images.githubusercontent.com/80691913/146022501-3d04dad4-1712-49ba-a215-954cf8a043f1.gif)
