const socket = io();
// window.location.search: query string
const { name, room } = $.deparam(window.location.search);

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('Info_From_Client_To_Server', {
    name, room
  })
})
socket.on('disconnect', () => {
  console.log('Disconnected to server');
})
socket.on('From_Server_To_Client', data => {
  // const text = data.text;
  // const liTag = `<li>${text}</li>`
  // $('#messages').append(liTag);
  const template = $('#message-template').html();
  const html = Mustache.render(template, {
    from: data.from,
    text: data.text,
    createdAt: moment(data.createdAt).format('LT')
  });
  $('#messages').append(html);
})
    // socket.emit('From_Client_To_Server', {
    //   from: 'User',
    //   text: 'Hello everyone',
    //   createdAt: new Date()
    // })
socket.on("Location_From_Server_To_Client", msg => {
  // const text = msg.lat + " - " + msg.lng;
  // const aTag = `<a target="_blank" href="https://www.google.com/maps/@${msg.lat},${msg.lng}">My location</a>`
  // const liTag = `<li>${aTag}</li>`;
  // $('#messages').append(aTag);
  const template = $('#location-message-template').html();
  const html = Mustache.render(template, {
    from: msg.from,
    createdAt: moment(msg.createdAt).format('LT'),
    url: `https://www.google.com/maps/@${msg.lat},${msg.lng}`
  });
  $('#messages').append(html);
});

socket.on('User_List', msg => {
  const users = msg.users;
  const ol = $('<ol></ol>');
  users.forEach(user => {
    const li = $('<li></li>');
    li.text(user.name);
    ol.append(li)
  });
  $('#users').html(ol)
})

$('#message-form').on('submit', e => {
  e.preventDefault();
  const text = $('[name=message]').val();
  // const liTag = `<li>${text}</li>`
  // $('#messages').append(liTag);
  // $('[name=message]').val('');
  $("#messages").scrollTop($("#messages").height());
  socket.emit('From_Client_To_Server', {
    from: name,
    text,
    createdAt: new Date()
  }, (data) => {
    console.log('Success: ', data);
    $('[name=message]').val('');
  })
})
$("#send-location").on('click', e => {
  if(!navigator.geolocation) return alert('Your browser is too old');
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    socket.emit('Location_From_Client_To_Server', {
      from: name,
      lat, lng,
      createdAt: new Date()
    })
  }, () => alert('Unable to fetch location'))
})