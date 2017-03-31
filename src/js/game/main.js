$(document).ready(function () {
  
  /*Import Class with gulp-include */
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
  
  /* Game var create */
  var game = new Game();
  var side = 0;
  
  /* Set side empire or rebel */
  $("a.button-empire").on('click', function(e) {
    side = 1;
  });
  
  /* Stop the game when return to home */
  $("a.button-play").on('click', function(e) {
    e.preventDefault();
    game.init(side);
  });
  $("a.button-return, a.logo").on('click', function(e) {
    e.preventDefault();
    game.gameOver();
  });
  
});
