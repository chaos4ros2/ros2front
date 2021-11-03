var socket = io();

socket.on("hello", echo);

var counter = document.getElementById('counter');

function echo(arg) {
  counter.innerHTML = arg.data;
}

socket.on("topic_list", list_topic);

var topics_ul = document.getElementById('topics_ul');

function list_topic(topic_list) {
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