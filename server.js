#!/usr/bin/node

var INIT = 0; // waiting for alex to connect
var PLAYER_JOIN = 1; // waiting for contestants
var WAIT_FOR_NAMES = 2;
var WAIT_FOR_START = 3; // wait for alex to start the game
var DISP_CATA = 4; 
var GRID_SELECT_WAIT = 5; //waiting for a player to pick a square
var BUZZER_WAIT = 6; //waiting for a player to buzz in before time expires
var ALEX_CONFIRM = 7; //waiting for alex to confirm a correct solution or not
var SHOW_SOLUTION = 8; //waiting for a player to buzz in before time expires

var DISP_DOUBLE_J = 9;
var WAIT_FOR_WAGER = 10;
var ALEX_CONFIRM_DOUBLE_J = 11;
var WAIT_FOR_FINAL_BID = 13;
var WAIT_FOR_FINAL_RESP = 14;


var system-state = INIT;
var round = 0;
var current-player = 0;


var sys = require('util')
var io = require('socket.io').listen(8090);
// note, io.listen(<port>) will create a http server for you

var Player1 = {};
var Player2 = {};
var Player3 = {};
var Alex = {};

var player1_name = null;
var player1_score = 0;
var player2_name = null;
var player2_score = 0;
var player3_name = null;
var player3_score = 0;

var currentstate = 'playerinit';

var activePlayer = 0;

//for debugging
function puts(error, stdout, stderr) { sys.puts(stdout) }


io.sockets.on('connection', function (socket) {
  if(system-state == INIT){
    Alex = socket;
    system-state = PLAYER_JOIN; 
    //TODO: need something to connect the display too
  } else if (system-state == PLAYER_JOIN){
    if (Player1 == {}){
      Player1 = socket;
      Player1.emit('entername', {});
    } else if (Player2 == {}){
      Player2 = socket;
      Player2.emit('entername', {});
    } else if (Player3 == {}){
      Player3 = socket;
      Player3.emit('entername', {});
      system-state = WAIT_FOR_NAMES;
    } else{
        //TODO: tell everyone else the game is full
    }
  }

  // handle players setting their names
  Player1.on('setname', function (data) {
    if (!player1_name){
      player1_name = data;
       //TODO: emit player name set to the display
      if (player2_name && player3_name){
        system-state = WAIT_FOR_START;
        player1.emit('message', 'waiting for game to start');
        player2.emit('message', 'waiting for game to start');
        player3.emit('message', 'waiting for game to start');
      } else {
        player1.emit('message', 'waiting for other players');
      }
    }
  });
  Player2.on('setname', function (data) {
    if (!player2_name){
      player2_name = data;
       //TODO: emit player name set to the display
      if (player1_name && player3_name){
        system-state = WAIT_FOR_START;
        player1.emit('message', 'waiting for game to start');
        player2.emit('message', 'waiting for game to start');
        player3.emit('message', 'waiting for game to start');
      } else {
        player2.emit('message', 'waiting for other players');
      }
    }
  });
  Player3.on('setname', function (data) {
    if (!player3_name){
      player3_name = data;
       //TODO: emit player name set to the display
      if (player1_name && player2_name){
        system-state = WAIT_FOR_START;
        player1.emit('message', 'waiting for game to start');
        player2.emit('message', 'waiting for game to start');
        player3.emit('message', 'waiting for game to start');
      } else {
        player3.emit('message', 'waiting for other players');
      }
    }
  });


  Alex.on('startgame', function(data){
    if(system-state = WAIT_FOR_START){
        //TODO
      //display.emit('show_catagories', catagories);
      system-state = DISP_CATA; 
      round = 1;

    }
  }

  //display.on('display_done', function(data){
  // //TODO
  //   system-state = GRID_SELECT_WAIT;
  //   current-player = 1;
  //   // TODO: round two should have the player in the lead
  // }


  Player1.on('buzz', function (data) {
    if(system-state == BUZZER_WAIT){
      system-state = ALEX_CONFIRM;
      activePlayer = 1;
    }
  });
  Player2.on('buzz', function (data) {
    if(system-state == BUZZER_WAIT){
      system-state = ALEX_CONFIRM;
      activePlayer = 2;
    }
  });
  Player3.on('buzz', function (data) {
    if(system-state == BUZZER_WAIT){
      system-state = ALEX_CONFIRM;
      activePlayer = 3;
    }
  });





  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});

