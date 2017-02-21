$(document).ready(function(){
  var username = window.location.search.substr(10);

  var app = {

    xssEscape: text => {
      return text.replace(/&|<|>|"|'|\/|&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2f;/g, '');
    },

    init: function(){
      this.fetch();
    },


    fetch: function(){
      $.get('http://parse.hrr.hackreactor.com/chatterbox/classes/messages', function(data, status){
        console.log(data.results.slice(data.results.length - 1));
        data.results.forEach(function(message){
          $('#chats').append(`<p>${message.username} ${message.roomname} ${message.text}`);
        });
        console.log(status);
        console.log(data);
      });

    },

    update: function(){

    },

    postMessage: function(username, roomname, text){
      $.post('http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
        {
          username: username,
          roomname: roomname,
          text: text
        },
        function(data, status){
          console.log(data, status);
        });
    },

  };

  app.init();

  $('#message').on('click', function(e){
    e.preventDefault();
    console.log('You clicked the right button');
    var text = app.xssEscape($('input').val());
    app.postMessage(username, 'lobby', text);
    app.fetch();
  });
});