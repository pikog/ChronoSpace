$(document).ready(function () {
  //=require controller.js
  //=require background.js

  var background = new Background();

  function ticks() {
    setInterval(function () {
        background.scroll(5);
      },
      10);
  }

  function init() {
    onKey();
    ticks();
  }
  
  init();

});
