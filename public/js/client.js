var socket = io();

var counter = document.getElementById('counter');

socket.on("topic_list", list_topic);

var topics_ul = document.getElementById('topics_ul');

function list_topic(topic_list) {
  for (const topic of topic_list) {
    // delete「/」from topic name
    const topic_name = topic.slice(1);
    socket.on(topic_name, function(arg) {
      console.log(arg);
      counter.innerHTML = arg.data;
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

  topics_ul.onclick = function () {
    document.getElementById('counter').style.display = 'block';
  }
}