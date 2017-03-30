$(document).ready(function () {
  //=require controller.js
  //=require background.js
  //=require game.js
  //=require player.js
  //=require obstacle.js
  //=require speeder.js
  //=require boss.js
  //=require bullet.js
  //=require hud.js
  //=require audio.js
  //=require util.js
  var game = new Game();
  var side = 0;
  
  $("a.button-empire").on('click', function(e) {
    side = 1;
  });
  
  $("a.button-play").on('click', function(e) {
    e.preventDefault();
    game.init(side);
  });
  $("a.button-return").on('click', function(e) {
    e.preventDefault();
    game.gameOver();
  });
});
