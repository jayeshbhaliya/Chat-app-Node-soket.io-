var socket = io();

socket.on("connect", () => {
  var params = $.deparam();
  console.log("Server connected successfully");
  // console.log(params);
  socket.emit("join", params, function(err) {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
      console.log('no error');
    }
  });

  //   socket.emit(
  //     "createMessage",
  //     {
  //       from: "jb",
  //       text: "hey test",
  //     },
  //     function (message) {
  //       console.log(message);
  //     }
  //   );
});

socket.on("disconnect", () => {
  console.log("Server connected successfully");
});

socket.on("updateUserList", function(users){
  var ol = jQuery('ol');
  users.forEach(user => {
    ol.append('li').text(user);
  });
})

socket.on("newMessage", function (message) {
  var formatedDate = moment(message.createdAt).format('h:mm a');
  var li = jQuery("<li>");
  li.text(`${message.from} ${formatedDate} : ${message.text}`);

  jQuery("#messages").append(li);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("newLocationMessage", function (message) {
  var formatedDate = moment(message.createdAt).format('h:mm a');
  var li = jQuery("<li>");
  var a = jQuery('<a target="_blank" >location</a>');
  a.attr("href", message.url);
  li.text(`${message.from} ${formatedDate} : `);
  li.append(a);
  jQuery("#messages").append(li);
  // window.scrollTo(0, document.body.scrollHeight);
  window.scrollTo(0, jQuery("#messages").scrollHeight);
});

// socket.emit(
//   "createMessage",
//   {
//     from: "ravi",
//     text: "hey jb",
//   },
//   function (message) {
//     console.log(message);
//   }
// );

jQuery("#form").on("submit", function (e) {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: `User`,
      text: $('[name="message"]').val(),
    },
    function (message) {}
  );
});

var locationButton = jQuery("#locationButton");
locationButton.on("click", function () {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position.coords);
      var coords = position.coords;
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function (error) {
      alert("Unable to fetch location");
    }
  );
}); 

 
