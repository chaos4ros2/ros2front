var socket = io();

socket.on("topic_list", list_topic);

// an area to stock messages
var message_store = document.getElementById('message_store');

// winboxn event obj
var winbox_obj = {};

// parent element of topic button 
var topics_ul = document.getElementById('topics_ul');

function list_topic(topic_list) {
  for (const topic of topic_list) {
    // delete「/」from topic name
    const topic_name = topic.slice(1);

    socket.on(topic_name, (arg) => {
      // create topic display area and append it to main area
      if (!document.getElementById(topic_name)) {
        var display_area = create_area(topic_name);
        message_store.appendChild(display_area);
      } else {
        var display_area = document.getElementById(topic_name);
      }
      
      display_area.innerHTML = recursive_call_message(arg);
      init_box(topic_name);
    });
  }

  const list = topic_list.map( (value) => 
  `<li class="tooltip-element" data-tooltip="0">
     <a href="#" data-active="4">
       <div class="icon">
         <i class='bx bx-notepad'></i>
         <i class='bx bxs-notepad'></i>
       </div>
       <span class="link hide" onclick="show_box('${value.slice(1)}');">${value}</span>
     </a>
  </li>`).join('');
  topics_ul.innerHTML = `${list}`;
  
}

/**
 * create topic display area
 * 
 * @param {string} topic_name topic name
 * @returns {node} html element div
 */
function create_area(topic_name) {
  const display_div = document.createElement('div');
  display_div.id = topic_name;
  display_div.className = 'display_div';
  return display_div;
}

/**
 * create a winbox for display and clone display_div to it 
 * 
 * @param {string} topic_name topic name
 * @returns {boolean} return "true" to skip the closing(removing)
*/
function init_box(topic_name) {
  if (!winbox_obj[topic_name]) winbox_obj[topic_name] = new WinBox(topic_name, {
     // https://github.com/nextapps-de/winbox#the-onclose-callback
     onclose: function() {
       document.getElementById(this.id).style.display = 'none';
       return true;
    }    
  });
  if (document.getElementById(topic_name))
      winbox_obj[topic_name].mount(document.getElementById(topic_name).cloneNode(true));
}

/**
 * show a initialized hidden winbox 
 * 
 * @param {string} topic_name topic name
*/
function show_box(topic_name) {
  if (winbox_obj[topic_name]) 
      document.getElementById(winbox_obj[topic_name].id).style.display = '';
}

/**
 * execute ros2 rqt_graph 
*/
async function rqt_graph() {
  // send a notification to the server
  const url = 'http://localhost:3000/rqt_graph';
  const res = await fetch(url);

  const data = await res.text();
  console.log(data);
}

/**
 * create display messages recursively
 * 
 * @param {obj} message_obj message object
 * @returns {string} formatted messages
 */
function recursive_call_message(message_obj) {
  let message = '';
  for (const key in message_obj) {
    if (message_obj.hasOwnProperty(key)) {
      if (typeof message_obj[key] == 'object') {
        message += recursive_call_message(message_obj[key])
      } else {
        message += `${key} : ${message_obj[key]}<br>`;
      }
    }
  }
  return message;
}