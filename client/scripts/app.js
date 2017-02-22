


$(document).ready(function() {
  var username = window.location.search.substr(10);
  var roomname = 'lobby' || $('dropdown').val();
  window.rooms = [];


  var app = {

    server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',

    // username: 'anonymous',
    currentRoom: 'lobby',
    messages: [],
    lastMessageId: 0,
    friends: {},

    xssEscape: text => {
      if (text === undefined) {
        return '';
      }
      return text.replace(/&|<|>|"|'|\/|&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2f;/g, '');
    },

    init: function() {
      app.fetch();

// solution vid

    // app.$message = $('#message');
    // app.$chats = $('#chats');
    // app.$roomSelect = $('#roomSelect');
    // app.$send = $('#send');

    },

    createRoom: function() {

    },

    updateRoomList: function() {

      window.rooms.forEach(function(room) {

        $('.dropdown-content').append(`<a href="#">${room}</a>`);

      });

    },

    changeRoom: function(room) {

      $('#current-room').empty();
      this.currentRoom = room;
      $('#current-room').html(`<h4>${room}</h4>`);

    },

    fetch: function() {

      $.get('http://parse.hrr.hackreactor.com/chatterbox/classes/messages?order=-createdAt', function(data, status) {
        app.messages = data.results;
        //console.log("Messages:", app.messages);
        data.results.forEach(function(message) {

          if (message.roomname !== undefined && window.rooms.indexOf(message.roomname) === -1) {
            window.rooms.push(app.xssEscape(message.roomname));
          }
          // $('#chats').append('<p>' + app.xssEscape(message.username) + ' ' + app.xssEscape(message.roomname) + ' ' + app.xssEscape(message.text));
        });

      }).done(app.updateRoomList);

    },

    update: function() {
      $('#chats').empty();
      app.messages.filter(function(message) {
        return message.roomname === app.currentRoom;
      }).forEach(function(message) {

        if (!message.roomname) {
          message.roomname = 'lobby';
        }
        var $chat = $('<div class="chat"/>');
        var $username = $('<span class="username"/>');
        $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);



        // $('#chats').append('<div class="username">' + app.xssEscape(message.username) + ' ' + app.xssEscape(message.roomname) + ' ' + app.xssEscape(message.text))
        // .attr('data-username', app.xssEscape(message.username))

        if (app.friends[message.username] === true) {
          $username.addClass('friend');
        }
        var $message = $('<br><span/>');
        $message.text(message.text).appendTo($chat);
        $('#chats').append($chat);
      });

      this.changeRoom(app.currentRoom);

    },

    send: function(message) {

      message = JSON.stringify(message);
      $.ajax({
        type: 'POST',
        url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
        contentType: 'application/json',
        data: message,
        success: 'success'
      }).done(app.update);

    },

  };

  app.init();

  $('#message').on('click', function(e) {
    e.preventDefault();
    var text = app.xssEscape($('input').val());

    var message = {
      username: app.xssEscape(username),
      text: text,
      roomname: app.currentRoom
    };
    app.send(message);

    $('input').val('');
    app.fetch();
  });

  $('.new-room').on('click', function(e) {
    e.preventDefault();
    var newRoom = prompt('Enter room name');
    app.currentRoom = app.xssEscape(newRoom);
    $('.dropdown-content').append('<a href="#">').text(newRoom);
  });

  $('.dropdown-content').on('click', 'a', function(e) {
    e.preventDefault();
    var room = $(this).text();
    app.currentRoom = room;
    app.update();
    app.fetch();
  });

  $('#chats').on('click', '.username', function(e) {
    var username = $(e.target).data('username');
    if (username !== undefined) {
      app.friends[username] = !app.friends[username];
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

      var $usernames = $(selector).toggleClass('friend');
    }
  });
});