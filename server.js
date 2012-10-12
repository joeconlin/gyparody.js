#!/usr/bin/node

var INIT = 0; // waiting for alex to connect
var PLAYER_JOIN = 1; // waiting for contestants
var DISP_CATA_R1 = 2; 
var GRID_SELECT_WAIT = 3; //waiting for a player to pick a square
var BUZZER_WAIT = 4; //waiting for a player to buzz in before time expires
var ALEX_CONFIRM = 5; //waiting for alex to confirm a correct solution or not
var SHOW_SOLUTION = 6; //waiting for a player to buzz in before time expires

var DISP_DOUBLE_J = 7;
var WAIT_FOR_WAGER = 8;
var ALEX_CONFIRM_DOUBLE_J = 9;
var DISP_CATA_R2 = 10;
var WAIT_FOR_FINAL_BID = 11;
var WAIT_FOR_FINAL_RESP = 12;


var system-state = INIT;



var sys = require('util')
var io = require('socket.io').listen(8090);
// note, io.listen(<port>) will create a http server for you

var Player1 = {};
var Player2 = {};
var Player3 = {};
var Alex = {};

var player1_data = {'name':'Player 1','score':0};
var player2_data = {'name':'Player 2','score':0};
var player3_data = {'name':'Player 3','score':0};

var currentstate = 'playerinit';

var activePlayer = 0;

//for debugging
function puts(error, stdout, stderr) { sys.puts(stdout) }


io.sockets.on('connection', function (socket) {
  if(system-state == INIT){
    Alex = socket;
    system-state = PLAYER_JOIN; 
  } else if (system-state == PLAYER_JOIN){
    if (Player1 == {}){
      Player1 = socket;
    } else if (Player2 == {}){
      Player2 = socket;
    } else if (Player3 == {}){
      Player3 = socket;
      system-state =  DISP_CATA_R1;
      //TODO send round one categories etc
    }
  }

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

