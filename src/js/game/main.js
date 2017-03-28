$(document).ready(function () {
  //=require controller.js
  //=require background.js
  //=require game.js
  //=require player.js
  //=require obstacle.js
  //=require util.js
  var game = new Game();
  game.init();
  new Obstacle().init();
});
