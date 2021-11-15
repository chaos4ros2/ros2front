var socket = io();

var main_area = document.getElementById('main_area');

socket.on("topic_list", list_topic);

var topics_ul = document.getElementById('topics_ul');

async function list_topic(topic_list) {
  for (const topic of topic_list) {
    // delete「/」from topic name
    const topic_name = topic.slice(1);

    socket.on(topic_name, (arg) => {
      // create topic display area and append it to main area
      if (!document.getElementById(topic_name)) {
        var display_area = create_area (topic_name);
        main_area.appendChild(display_area);
      } else {
        var display_area = document.getElementById(topic_name);
      }

      // Todo1: Add automatic message type detection.
      // Todo2: Add message display UI. 
      if (arg.data) display_area.innerHTML = arg.data;
      else if (arg.x) display_area.innerHTML = arg.x;
      else console.log(arg);
    });
  }

  const list = topic_list.map( (value) => 
  `<li class="tooltip-element" data-tooltip="0">
     <a href="#" data-active="4">
       <div class="icon">
         <i class='bx bx-notepad'></i>
         <i class='bx bxs-notepad'></i>
       </div>
       <span class="link hide">${value}</span>
     </a>
  </li>`).join('');
  topics_ul.innerHTML = `${list}`;
}

/**
 * create topic display area
 * 
 * @param {string} topic_name topic name
 * @returns 
 */
function create_area (topic_name) {
  const display_div = document.createElement('div');
  display_div.id = topic_name;
  display_div.className = 'display_div';
  return display_div;
}